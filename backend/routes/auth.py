from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel
import os
import secrets
from motor.motor_asyncio import AsyncIOMotorClient
from models import AdminUserCreate, AdminUser, AdminPasswordChange, Token, LoginAttempt

router = APIRouter()
security = HTTPBearer()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", secrets.token_urlsafe(32))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

# Rate limiting settings
MAX_FAILED_ATTEMPTS = 5
LOCKOUT_DURATION_MINUTES = 10

# Database
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'pixel360')]

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = await db.admin_users.find_one({"email": email})
    if user is None:
        raise credentials_exception
    if not user.get("is_active", True):
        raise credentials_exception
    return AdminUser(**user)

async def check_account_lockout(email: str) -> bool:
    """Check if account is locked due to failed attempts"""
    user = await db.admin_users.find_one({"email": email})
    if not user:
        return False
    
    locked_until = user.get("locked_until")
    if locked_until:
        if datetime.now(timezone.utc) < locked_until.replace(tzinfo=timezone.utc):
            return True
        else:
            # Lockout expired, reset
            await db.admin_users.update_one(
                {"email": email},
                {"$set": {"failed_login_attempts": 0, "locked_until": None}}
            )
    return False

async def record_failed_attempt(email: str, ip_address: str = None):
    """Record failed login attempt and potentially lock account"""
    user = await db.admin_users.find_one({"email": email})
    if not user:
        return
    
    new_attempts = user.get("failed_login_attempts", 0) + 1
    
    update_data = {"failed_login_attempts": new_attempts}
    
    if new_attempts >= MAX_FAILED_ATTEMPTS:
        lockout_time = datetime.now(timezone.utc) + timedelta(minutes=LOCKOUT_DURATION_MINUTES)
        update_data["locked_until"] = lockout_time
    
    await db.admin_users.update_one(
        {"email": email},
        {"$set": update_data}
    )
    
    # Log the attempt
    attempt = LoginAttempt(
        email=email,
        ip_address=ip_address,
        success=False
    )
    await db.login_attempts.insert_one(attempt.dict())

async def record_successful_login(email: str, ip_address: str = None):
    """Reset failed attempts on successful login"""
    await db.admin_users.update_one(
        {"email": email},
        {"$set": {
            "failed_login_attempts": 0,
            "locked_until": None,
            "last_login": datetime.now(timezone.utc)
        }}
    )
    
    # Log the attempt
    attempt = LoginAttempt(
        email=email,
        ip_address=ip_address,
        success=True
    )
    await db.login_attempts.insert_one(attempt.dict())


# ============================================
# ROUTES
# ============================================

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login", response_model=Token)
async def login(login_data: LoginRequest, request: Request):
    """Login and get access token with rate limiting"""
    email = login_data.email
    password = login_data.password
    ip_address = request.client.host if request.client else None
    
    # Check lockout
    if await check_account_lockout(email):
        raise HTTPException(
            status_code=429,
            detail=f"Account locked due to too many failed attempts. Try again in {LOCKOUT_DURATION_MINUTES} minutes."
        )
    
    user = await db.admin_users.find_one({"email": email})
    if not user:
        await record_failed_attempt(email, ip_address)
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    if not verify_password(password, user["hashed_password"]):
        await record_failed_attempt(email, ip_address)
        remaining = MAX_FAILED_ATTEMPTS - user.get("failed_login_attempts", 0) - 1
        if remaining > 0:
            raise HTTPException(
                status_code=401, 
                detail=f"Incorrect email or password. {remaining} attempts remaining."
            )
        else:
            raise HTTPException(
                status_code=401,
                detail="Incorrect email or password"
            )
    
    if not user.get("is_active", True):
        raise HTTPException(status_code=401, detail="User is inactive")
    
    # Successful login
    await record_successful_login(email, ip_address)
    
    access_token = create_access_token(data={"sub": user["email"]})
    
    return Token(
        access_token=access_token,
        must_change_password=user.get("must_change_password", False)
    )

@router.post("/change-password")
async def change_password(
    password_data: AdminPasswordChange,
    current_user: AdminUser = Depends(get_current_user)
):
    """Change password (required on first login)"""
    user = await db.admin_users.find_one({"email": current_user.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not verify_password(password_data.current_password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    # Validate new password
    if len(password_data.new_password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    
    if password_data.new_password == password_data.current_password:
        raise HTTPException(status_code=400, detail="New password must be different from current")
    
    new_hash = get_password_hash(password_data.new_password)
    
    await db.admin_users.update_one(
        {"email": current_user.email},
        {"$set": {
            "hashed_password": new_hash,
            "must_change_password": False
        }}
    )
    
    return {"message": "Password changed successfully"}

@router.get("/me")
async def get_me(current_user: AdminUser = Depends(get_current_user)):
    """Get current user info"""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "must_change_password": current_user.must_change_password
    }

@router.post("/bootstrap")
async def bootstrap_admin():
    """
    Bootstrap admin user from environment variables.
    Only works if no admin users exist.
    
    Required env vars:
    - BOOTSTRAP_ADMIN_EMAIL
    - BOOTSTRAP_ADMIN_PASSWORD
    """
    count = await db.admin_users.count_documents({})
    if count > 0:
        raise HTTPException(status_code=400, detail="Admin user already exists. Bootstrap not allowed.")
    
    email = os.environ.get("BOOTSTRAP_ADMIN_EMAIL")
    password = os.environ.get("BOOTSTRAP_ADMIN_PASSWORD")
    
    if not email or not password:
        raise HTTPException(
            status_code=400, 
            detail="BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD environment variables required"
        )
    
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Bootstrap password must be at least 8 characters")
    
    hashed_password = get_password_hash(password)
    admin_user = AdminUser(
        email=email,
        name="Admin",
        hashed_password=hashed_password,
        must_change_password=True  # Force password change on first login
    )
    await db.admin_users.insert_one(admin_user.dict())
    
    return {
        "message": "Bootstrap admin created successfully",
        "email": email,
        "note": "Password change required on first login"
    }

@router.post("/logout")
async def logout(current_user: AdminUser = Depends(get_current_user)):
    """Logout - client should discard token"""
    return {"message": "Logged out successfully"}
