# Jason Teixeira - Portfolio

**A modern, high-performance portfolio** showcasing quantitative engineering, cloud infrastructure, and test automation expertise.

🌐 **Live:** https://jasonteixeira.com (coming soon)  
💻 **Local:** http://localhost:3068  
⚡ **Built with:** Gatsby, React, Styled Components

---

## 🎯 What Makes This Portfolio Unique

Unlike generic portfolio templates, this site demonstrates **actual engineering skills** through:

- **Live System Monitoring** - Real-time health checks and metrics
- **Interactive Testing Demos** - Watch tests execute in real-time  
- **Cloud Architecture Viz** - Interactive infrastructure diagrams
- **Performance Analytics** - Trading system metrics and visualizations
- **Technical Blog** - Deep-dives into K8s, testing, and quant finance

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Test production build locally
npm run serve

# Clean cache (if needed)
npm run clean
```

---

## 📦 Project Structure

```
sage-portfolio/
├── content/
│   ├── featured/           # 4 featured projects
│   ├── jobs/               # Work experience
│   ├── projects/           # Additional projects
│   └── posts/              # Blog posts (new!)
├── src/
│   ├── components/
│   │   ├── sections/       # Hero, About, Jobs, Projects, Contact
│   │   ├── icons/          # SVG icon components
│   │   └── ...
│   ├── config.js           # Site configuration
│   ├── styles/             # Global styles and theme
│   └── pages/              # Route pages
├── static/
│   ├── resume.pdf          # Downloadable resume
│   └── ...
└── functions/              # Serverless backend functions (new!)
    ├── visitor-counter/
    ├── contact-form/
    └── system-health/
```

---

## 🛠️ Tech Stack

**Frontend:**
- Gatsby 4.x - Static site generation
- React 18 - UI library
- Styled Components - CSS-in-JS
- Framer Motion - Animations
- ScrollReveal - Scroll animations

**Backend (Serverless):**
- AWS Lambda - Business logic
- API Gateway - REST endpoints
- DynamoDB - Data persistence
- S3 + CloudFront - Hosting + CDN

**DevOps:**
- GitHub Actions - CI/CD
- Terraform - Infrastructure as Code
- Docker - Containerization

---

## 🚢 Deployment

### Netlify (Recommended)
```bash
# Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# Connect to Netlify
# Visit netlify.com → New site from Git → Select repo
# Build command: npm run build
# Publish directory: public
```

---

## 📄 License

MIT © Jason Teixeira

---

## 🙏 Acknowledgments

Original design inspiration from Brittany Chiang's v4 template.  
Extensively customized and enhanced with unique features.

---

**Built with ⚡ by Jason Teixeira**  
_Engineering systems that don't break at 2 AM_
