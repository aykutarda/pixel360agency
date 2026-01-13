from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os
from motor.motor_asyncio import AsyncIOMotorClient
from models import AdminUserCreate, AdminUser, Token

router = APIRouter()
security = HTTPBearer()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "pixel360-super-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

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
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
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
    return AdminUser(**user)

@router.post("/register", response_model=Token)
async def register(user: AdminUserCreate):
    """Register a new admin user"""
    # Check if user exists
    existing = await db.admin_users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    hashed_password = get_password_hash(user.password)
    admin_user = AdminUser(
        email=user.email,
        name=user.name,
        hashed_password=hashed_password
    )
    await db.admin_users.insert_one(admin_user.dict())
    
    # Generate token
    access_token = create_access_token(data={"sub": user.email})
    return Token(access_token=access_token)

@router.post("/login", response_model=Token)
async def login(email: str, password: str):
    """Login and get access token"""
    user = await db.admin_users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    if not verify_password(password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    if not user.get("is_active", True):
        raise HTTPException(status_code=401, detail="User is inactive")
    
    access_token = create_access_token(data={"sub": user["email"]})
    return Token(access_token=access_token)

@router.get("/me")
async def get_me(current_user: AdminUser = Depends(get_current_user)):
    """Get current user info"""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name
    }

@router.post("/init")
async def init_admin():
    """Initialize default admin user if none exists"""
    count = await db.admin_users.count_documents({})
    if count > 0:
        return {"message": "Admin user already exists"}
    
    # Create default admin
    hashed_password = get_password_hash("admin123")  # Change this!
    admin_user = AdminUser(
        email="admin@pixel360.com.tr",
        name="Admin",
        hashed_password=hashed_password
    )
    await db.admin_users.insert_one(admin_user.dict())
    
    return {
        "message": "Default admin created",
        "email": "admin@pixel360.com.tr",
        "password": "admin123",
        "warning": "Please change the password immediately!"
    }
