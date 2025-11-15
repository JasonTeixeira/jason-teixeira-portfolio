# Images Needed for Portfolio Website

This document lists all the images you need to provide to complete the portfolio website.

---

## 📸 PRIORITY 1: Profile Photo

**Location:** `src/images/me.jpg`

**Requirements:**
- Professional headshot
- Minimum size: 500x500px (square is best)
- Format: JPG or PNG
- Clear, well-lit photo
- Professional attire (business casual or formal)
- Plain or professional background

**Usage:** Displays in the "About Me" section of the homepage

**What to do:**
```bash
# Place your photo here:
cp /path/to/your/photo.jpg /Users/Sage/Desktop/sage-portfolio/src/images/me.jpg
```

---

## 🎯 PRIORITY 2: Featured Project Screenshots

You need **3-5 screenshots per featured project** to showcase your work effectively.

### 1. E-Commerce Test Suite

**Location:** `content/featured/ECommerce/`

**Screenshots needed:**
1. **Allure report dashboard** showing test execution overview
   - File name: `allure-dashboard.png`
   - Shows: Total tests, pass/fail rates, execution timeline

2. **CI/CD pipeline running** in GitHub Actions
   - File name: `ci-pipeline.png`
   - Shows: All 14 jobs running in parallel

3. **Test execution output** in terminal
   - File name: `test-execution.png`
   - Shows: pytest output with test names and results

4. **Code example** from Page Object Model
   - File name: `page-object-code.png`
   - Shows: Clean code structure (optional)

5. **Coverage report** HTML page
   - File name: `coverage-report.png`
   - Shows: 85%+ code coverage (optional)

**What to do:**
```bash
# Take screenshots and place them here:
/Users/Sage/Desktop/sage-portfolio/content/featured/ECommerce/
# Then update index.md to reference them
```

---

### 2. API Test Automation Framework

**Location:** `content/featured/APITesting/`

**Screenshots needed:**
1. **Test execution with parallel workers**
   - File name: `parallel-execution.png`
   - Shows: pytest running with multiple workers

2. **Client layer code** showing retry logic
   - File name: `client-code.png`
   - Shows: Your BaseClient implementation

3. **Allure report** with request/response details
   - File name: `allure-api-tests.png`
   - Shows: API test results with payload inspection

4. **CI/CD pipeline matrix**
   - File name: `ci-matrix.png`
   - Shows: 9 jobs running (smoke, users, resources, etc.)

**What to do:**
```bash
/Users/Sage/Desktop/sage-portfolio/content/featured/APITesting/
```

---

### 3. RiskRadar

**Location:** `content/featured/RiskRadar/`

**Screenshots needed:**
1. **Dashboard UI** showing portfolio overview
   - File name: `dashboard.png`
   - Shows: Portfolio cards, charts, summary metrics

2. **VaR calculation results** page
   - File name: `var-results.png`
   - Shows: Historical VaR, Parametric VaR, Monte Carlo results

3. **Portfolio risk metrics** chart
   - File name: `risk-metrics.png`
   - Shows: Sharpe ratio, max drawdown, volatility charts

4. **Correlation heatmap**
   - File name: `correlation-heatmap.png`
   - Shows: Asset correlation matrix visualization

**What to do:**
```bash
/Users/Sage/Desktop/sage-portfolio/content/featured/RiskRadar/
```

---

### 4. AlphaStream

**Location:** `content/featured/AlphaStream/`

**Screenshots needed:**
1. **Backtest equity curve** chart
   - File name: `equity-curve.png`
   - Shows: Portfolio value over time with drawdowns

2. **Performance metrics dashboard**
   - File name: `performance-metrics.png`
   - Shows: Sharpe ratio (1.8-2.4), win rate, profit factor

3. **Feature engineering code**
   - File name: `features-code.png`
   - Shows: Technical indicator calculations

4. **Model training output**
   - File name: `training-output.png`
   - Shows: Ensemble model training logs

5. **API documentation** (FastAPI Swagger UI)
   - File name: `api-docs.png`
   - Shows: REST endpoints and WebSocket connections

**What to do:**
```bash
/Users/Sage/Desktop/sage-portfolio/content/featured/AlphaStream/
```

---

## 🔧 PRIORITY 3: Social Media / Open Graph Images

**Location:** `static/`

**Current files:** `og.png`, `og@2x.png` (need updating)

**Requirements:**
- Dimensions: 1200x630px (standard Open Graph size)
- Format: PNG
- Content: Your name + title + professional branding
- These show up when you share your portfolio link on LinkedIn, Twitter, etc.

**Recommendation:**
Create a branded card with:
- Your name: "Jason Teixeira"
- Title: "Senior Quantitative Engineer"
- Tagline: "I build systems that don't break at 2 AM"
- Background: Professional color scheme (navy/green to match site)

**Tools to create:**
- Canva (easiest)
- Figma
- Photoshop

**What to do:**
```bash
# Replace these files:
/Users/Sage/Desktop/sage-portfolio/static/og.png       # 1200x630px
/Users/Sage/Desktop/sage-portfolio/static/og@2x.png    # 2400x1260px (2x resolution)
```

---

## 📄 OPTIONAL: Resume PDF

**Location:** `static/resume.pdf`

**Current status:** Has old resume from template

**What to do:**
```bash
# Replace with your current resume:
cp /path/to/your/resume.pdf /Users/Sage/Desktop/sage-portfolio/static/resume.pdf
```

Your resume is already in the repo at `/Users/Sage/Desktop/Jason Texiera Resumes_Com.pdf`

I can copy it for you:
```bash
cp "/Users/Sage/Desktop/Jason Texiera Resumes_Com.pdf" /Users/Sage/Desktop/sage-portfolio/static/resume.pdf
```

---

## 🎨 OPTIONAL: Favicons

**Location:** `static/` (need to add)

**Current status:** Template favicons need replacing

**Requirements:**
- favicon.ico (16x16, 32x32, 48x48 multi-size ICO file)
- apple-touch-icon.png (180x180px)
- favicon-32x32.png
- favicon-16x16.png

**Tools to generate:**
- https://realfavicongenerator.net/ (easiest - upload one image, get all sizes)
- https://favicon.io/

**Source image:** Use your logo or initials "JT" on navy/green background

---

## 📋 CHECKLIST

### Must Have (Website Won't Look Professional Without These):
- [ ] Profile photo (`src/images/me.jpg`)
- [ ] E-Commerce Test Suite screenshots (3-5 images)
- [ ] API Test Automation screenshots (3-4 images)
- [ ] RiskRadar screenshots (3-4 images)
- [ ] AlphaStream screenshots (3-5 images)

### Should Have (Makes It Look Production-Ready):
- [ ] Open Graph images (`static/og.png`, `static/og@2x.png`)
- [ ] Updated resume PDF (`static/resume.pdf`)

### Nice to Have (Polish):
- [ ] Favicons (all sizes)
- [ ] Additional project screenshots for non-featured projects

---

## 🚀 AFTER YOU ADD IMAGES

1. **Test locally:**
   ```bash
   cd /Users/Sage/Desktop/sage-portfolio
   npm start
   # Visit http://localhost:8000
   ```

2. **Verify images load:**
   - Check featured projects section
   - Check About Me section with your photo
   - Test social sharing preview (use https://metatags.io/)

3. **Optimize images:**
   ```bash
   # Install imagemagick if needed
   brew install imagemagick
   
   # Optimize all PNGs (reduces file size)
   find content/featured -name "*.png" -exec convert {} -quality 85 {} \;
   ```

---

## 💡 TIPS

**Taking Screenshots:**
- Use full browser window (not small viewport)
- Hide personal/sensitive data
- Use dark mode if your projects have it (looks more professional)
- Capture at 2x resolution (Retina) then downscale for better quality
- macOS: `Cmd+Shift+4` then `Space` to capture window
- Add subtle drop shadows in post (makes screenshots pop)

**Project Screenshots Best Practices:**
1. Show the best parts (dashboards, reports, visualizations)
2. Include some code if it's clean and impressive
3. Annotate if needed (arrows, highlights) but keep it minimal
4. Consistent styling across all screenshots (same browser, same size)

**Profile Photo:**
- Look at the camera
- Natural smile or confident expression
- Business casual minimum (hoodie is fine if it's a nice one)
- Good lighting (natural light from window is best)
- Solid background or professional office setting

---

## ❓ QUESTIONS?

If you need help with:
- Image sizes/formats
- Where to place files
- How to update the markdown to use new images
- Optimization

Just let me know and I'll help!

---

**Last Updated:** November 2024  
**Website Status:** 95% complete, waiting for images
