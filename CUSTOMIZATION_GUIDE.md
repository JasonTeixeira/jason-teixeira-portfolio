# Jason Teixeira (Sage) - Portfolio Website

**Professional portfolio website** based on Brittany Chiang's v4 template, customized for test automation engineering and backend development showcase.

**Live Site:** Will be deployed to jasonteixeira.com

---

## ✅ WHAT'S BEEN CUSTOMIZED

### **1. Site Configuration** (`gatsby-config.js`)
- ✅ Site title: "Jason Teixeira (Sage)"
- ✅ Site description: "Senior Test Automation Engineer..."
- ✅ Site URL: https://jasonteixeira.com
- ⚠️ Google Analytics: Placeholder added (need your tracking ID)

### **2. Personal Info** (`src/config.js`)
- ✅ Email: sage@sageideas.org
- ✅ Social media: GitHub, LinkedIn (removed Instagram, Twitter, Codepen)
- ✅ GitHub: https://github.com/JasonTeixeira
- ✅ LinkedIn: https://www.linkedin.com/in/jason-teixeira

---

## 🚧 WHAT NEEDS TO BE CUSTOMIZED

### **Hero Section** (`src/components/sections/hero.js`)
**Current:** "Hi, my name is Brittany..."
**Change to:**
```
Hi, my name is Jason.

I build systems that don't break at 2 AM.

I'm a Senior Test Automation Engineer specializing in building reliable, scalable test frameworks and backend systems. Currently focused on Python, Playwright, and FastAPI.
```

### **About Section** (`src/components/sections/about.js`)
**Current:** Brittany's story
**Change to:** Your story (sysadmin → Python → test automation)

**Your story:**
```markdown
I started as a sysadmin tired of manual deployments. Learned Python to automate myself out of repetitive work. Fell into test automation when I realized flaky tests cost more than building frameworks properly. Now I build frameworks that teams actually want to use.

I've spent the last 8+ years shipping code people actually use—test automation frameworks, backend services, CI/CD pipelines. My approach: automate everything, document like your future self will curse your past self, and always assume the network is lying.
```

**Skills to list:**
- Python
- Playwright
- Pytest
- FastAPI
- C# (.NET)
- TypeScript
- Docker
- Kubernetes
- AWS
- PostgreSQL
- Redis
- CI/CD (GitHub Actions, Jenkins)

### **Work Experience** (`content/jobs/`)
**TODO:** Create markdown files for your work history

Example structure:
```markdown
---
date: '2023-01-01'
title: 'Senior Test Automation Engineer'
company: 'Your Company'
location: 'Remote'
range: 'January 2023 - Present'
url: 'https://company.com'
---

- Built test automation framework with 278+ tests covering UI, API, visual regression
- Reduced test suite runtime from 45min to 8min via parallelization
- Implemented CI/CD pipeline with 14 parallel jobs
```

### **Featured Projects** (`content/featured/`)
**TODO:** Create 3-4 markdown files for your best projects

**Recommended featured projects:**
1. **E-Commerce-Test-Suite** (278+ tests, your strongest)
2. **API-Test-Automation-Wireframe** (125+ tests)
3. **RiskRadar** (Next.js + FastAPI)
4. **AlphaStream** (ML trading signals)

Example structure (see `content/featured/HalcyonTheme/index.md` for template)

### **Other Projects** (`content/projects/`)
**TODO:** Create markdown files for other notable projects

Add these:
- Web-Automation-Test-Framework
- Cloudmind
- NexQuantSite
- QuantumTrader
- CloudResumeChallangeAWS
- Eidocrypt
- NexusEncryption

### **Profile Photo**
**TODO:** Add your professional headshot
- Save as `src/images/me.jpg` (or update path in About section)

---

## 🛠️ SETUP & INSTALLATION

### **Prerequisites**
- Node.js 14+ (check with `node -v`)
- Yarn or npm
- Git

### **Installation**

1. **Install dependencies**
```bash
cd "/Users/Sage/Desktop/Sage Personal Website"
yarn install
# or: npm install
```

2. **Start development server**
```bash
yarn start
# or: npm start
```

Site will be at: http://localhost:8000

3. **Build for production**
```bash
yarn build
# or: npm run build
```

---

## 📁 PROJECT STRUCTURE

```
Sage Personal Website/
├── content/
│   ├── featured/       # Top 3-4 projects (with images)
│   ├── projects/       # Other notable projects
│   ├── jobs/           # Work experience
│   └── posts/          # Blog posts (optional)
├── src/
│   ├── components/
│   │   └── sections/   # Hero, About, Jobs, Projects, Contact
│   ├── config.js       # Personal info, social links
│   └── images/         # Profile photo, logos
├── static/             # Favicons, og images
├── gatsby-config.js    # Site metadata
└── package.json
```

---

## 🎨 CUSTOMIZATION CHECKLIST

### **Phase 1: Content** (2-3 hours)
- [ ] Update Hero section with your intro
- [ ] Update About section with your story
- [ ] Add your skills to About section
- [ ] Create work experience markdown files
- [ ] Add professional headshot

### **Phase 2: Projects** (3-4 hours)
- [ ] Create 3-4 featured project pages
- [ ] Add project screenshots (3-5 per project)
- [ ] Create other notable project pages
- [ ] Write project descriptions (can pull from GitHub READMEs)

### **Phase 3: Polish** (1-2 hours)
- [ ] Test all links work
- [ ] Check responsive design on mobile
- [ ] Optimize images
- [ ] Update favicon
- [ ] Add Google Analytics tracking ID

### **Phase 4: Deploy** (30 min - 1 hour)
- [ ] Create new GitHub repo for website
- [ ] Push code to GitHub
- [ ] Deploy to Netlify (or Vercel)
- [ ] Configure custom domain (jasonteixeira.com)
- [ ] Update DNS records
- [ ] Test live site

---

## 🚀 DEPLOYMENT OPTIONS

### **Option A: Netlify** (Recommended - Easiest)
1. Create account at netlify.com
2. "New site from Git" → Connect GitHub repo
3. Build settings: 
   - Build command: `yarn build`
   - Publish directory: `public`
4. Add custom domain: jasonteixeira.com
5. Configure DNS (Netlify provides nameservers or CNAME)

### **Option B: Vercel**
1. Create account at vercel.com
2. Import Git repository
3. Framework: Gatsby
4. Add custom domain

### **Option C: AWS Amplify**
1. AWS Console → Amplify
2. Connect repository
3. Build settings: Gatsby
4. Add custom domain

---

## 📸 IMAGES NEEDED

### **Priority 1: Profile Photo**
- Size: 500x500px minimum
- Format: JPG or PNG
- Location: `src/images/me.jpg`

### **Priority 2: Project Screenshots**
For each featured project, take 3-5 screenshots:
- Dashboard/main UI
- Key features
- Test reports (for test frameworks)

**E-Commerce-Test-Suite:**
- Allure report dashboard
- CI pipeline running (14 jobs)
- Test failure screenshot

**API-Test-Automation:**
- Test execution output
- Client abstraction code

**RiskRadar:**
- Dashboard UI
- VaR calculation results

**AlphaStream:**
- Backtest equity curve
- Performance metrics

Save as: `content/featured/[project-name]/[screenshot].png`

---

## 🎯 QUICK WINS (Do These First)

1. **Hero section** (10 min)
   - Update intro text
   - Change name and tagline

2. **About section** (20 min)
   - Write your story
   - List your skills

3. **Contact section** (5 min)
   - Already done (uses email from config.js)

4. **Create 1 featured project** (30 min)
   - E-Commerce-Test-Suite (your strongest)
   - Copy from `content/featured/HalcyonTheme/index.md`
   - Update with your project info

---

## 🐛 TROUBLESHOOTING

### "Module not found" errors
```bash
rm -rf node_modules yarn.lock
yarn install
```

### Port 8000 already in use
```bash
lsof -ti:8000 | xargs kill -9
yarn start
```

### Images not loading
- Check file paths are correct
- Images must be in `src/images/` or `content/featured/[project]/`
- Use relative paths in markdown: `./screenshot.png`

---

## 📚 HELPFUL RESOURCES

- **Gatsby docs:** https://www.gatsbyjs.org/docs/
- **Original template:** https://github.com/bchiang7/v4
- **Markdown guide:** https://www.markdownguide.org/
- **Image optimization:** https://squoosh.app/

---

## ✅ ATTRIBUTION

This site is based on Brittany Chiang's v4 portfolio template.
Original: https://brittanychiang.com
Credit: https://github.com/bchiang7/v4

Thank you Brittany for the excellent template!

---

## 🎯 NEXT STEPS

1. **Start development server:** `yarn start`
2. **Update Hero section:** `src/components/sections/hero.js`
3. **Update About section:** `src/components/sections/about.js`
4. **Create featured project:** Copy template from `content/featured/HalcyonTheme/`
5. **Test locally:** http://localhost:8000
6. **Deploy when ready**

**Need help?** Check the original template docs or Gatsby documentation.

---

**Last Updated:** November 2024  
**Status:** Initial setup complete, content customization in progress
