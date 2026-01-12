// Mock data for Pixefolio website

export const siteData = {
  logo: "PIXEFOLIO.",
  copyright: "© MARK DAVIS",
  status: "UK - AVAILABLE FOR WORK",
  portfolio: "PORTFOLIO 2020/24"
};

export const heroData = {
  title: ["DIGITAL", "DESIGNER"],
  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face"
};

export const aboutData = {
  greeting: "HI, I'M",
  name: "MARK",
  description: "...A DIGITAL DESIGNER WITH A PASSION FOR CREATING VISUALLY COMPELLING AND USER-FRIENDLY DIGITAL EXPERIENCES.",
  specialty: "I SPECIALIZE IN WEB DESIGN, UI/UX DESIGN, AND BRANDING.",
  cta: "ABOUT ME"
};

export const worksData = {
  title: ["SELECTED", "WORK"],
  count: "(04)",
  projects: [
    {
      id: 1,
      name: "FOWARD",
      image: "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=600&h=500&fit=crop&crop=face",
      link: "/work/foward"
    },
    {
      id: 2,
      name: "PULSE",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=500&fit=crop&crop=face",
      link: "/work/pulse"
    },
    {
      id: 3,
      name: "VIVID",
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=500&fit=crop&crop=face",
      link: "/work/vivid"
    },
    {
      id: 4,
      name: "BEYOND",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=500&fit=crop",
      link: "/work/beyond"
    }
  ]
};

export const servicesData = {
  title: ["WHAT I", "DO"],
  services: [
    {
      id: "01",
      name: ".BRANDING",
      description: "DEVELOPING A MEMORABLE BRAND IDENTITY THROUGH LOGO DESIGN, COLORS, TYPOGRAPHY AND BRAND GUIDELINES TO ENSURE CONSISTENT REPRESENTATION ACROSS ALL PLATFORMS."
    },
    {
      id: "02",
      name: ".DESIGN",
      description: "CRAFTING VISUALLY COMPELLING AND USER-CENTRIC DIGITAL EXPERIENCES, INCLUDING WEB AND MOBILE APP DESIGNS, THAT ALIGN WITH CLIENT GOALS AND ENHANCE USER ENGAGEMENT."
    },
    {
      id: "03",
      name: ".STRATEGY",
      description: "CREATING COMPREHENSIVE STRATEGIES THAT ALIGN WITH BUSINESS OBJECTIVES, INCORPORATING USER RESEARCH, COMPETITOR ANALYSIS AND MARKET TRENDS TO ACHIEVE SUCCESSFUL RESULTS."
    }
  ]
};

export const contactData = {
  title: ["LET'S", "CONNECT"],
  email: "Hello@pixefolio.com"
};

export const navLinks = [
  { name: "HOME", path: "/" },
  { name: "ABOUT", path: "/about" },
  { name: "WORK", path: "/work" },
  { name: "CONTACT", path: "/contact" }
];
