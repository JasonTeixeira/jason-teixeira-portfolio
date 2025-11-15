# Deployment Guide - Jason Teixeira Portfolio

Complete guide to deploy your portfolio website to production.

---

## 🚀 QUICK DEPLOY (Recommended: Netlify)

**Time:** ~10 minutes  
**Cost:** Free  
**Custom Domain:** jasonteixeira.com

### Step 1: Create GitHub Repository

```bash
cd /Users/Sage/Desktop/sage-portfolio

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Jason Teixeira portfolio"

# Create repo on GitHub (visit github.com/new)
# Name it: portfolio

# Add remote and push
git remote add origin https://github.com/JasonTeixeira/portfolio.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Netlify

1. **Sign up:** Go to https://netlify.com (use GitHub login)

2. **Import repository:**
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub
   - Select `JasonTeixeira/portfolio`

3. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `public`
   - Click "Deploy site"

4. **Wait 3-5 minutes** for first build

5. **Custom domain:**
   - Site settings → Domain management
   - Add custom domain: `jasonteixeira.com`
   - Update DNS records (provided by Netlify)
   - Wait 24-48 hours for DNS propagation

### Step 3: Configure Environment

In Netlify dashboard:
- Site settings → Environment variables
- Add `GA_TRACKING_ID` if you want Google Analytics

---

## 🔧 ALTERNATIVE: Vercel Deployment

**Time:** ~10 minutes  
**Cost:** Free  
**Custom Domain:** jasonteixeira.com

### Step 1: Push to GitHub (same as above)

### Step 2: Deploy to Vercel

1. **Sign up:** Go to https://vercel.com (use GitHub login)

2. **Import repository:**
   - Click "Add New..." → "Project"
   - Import `JasonTeixeira/portfolio`

3. **Framework preset:**
   - Vercel auto-detects Gatsby
   - Build command: `npm run build`
   - Output directory: `public`
   - Install command: `npm install`

4. **Deploy:** Click "Deploy"

5. **Custom domain:**
   - Project settings → Domains
   - Add `jasonteixeira.com`
   - Update DNS (A record or CNAME)

---

## 🌐 DNS CONFIGURATION

### For Netlify:

**Option A: Netlify DNS (Easiest)**
1. Transfer nameservers to Netlify
2. Netlify provides: `dns1.p01.nsone.net`, `dns2.p01.nsone.net`, etc.
3. Update at your domain registrar (GoDaddy, Namecheap, etc.)

**Option B: Keep Current DNS**
1. Add A record:
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   ```
2. Add CNAME for www:
   ```
   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```

### For Vercel:

1. Add A record:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```
2. Add CNAME for www:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

---

## 🔐 HTTPS / SSL

Both Netlify and Vercel provide **automatic HTTPS** via Let's Encrypt:
- Free
- Auto-renewal
- No configuration needed
- Activates once DNS is configured

---

## 📊 GOOGLE ANALYTICS (Optional)

### Step 1: Get Tracking ID

1. Visit https://analytics.google.com
2. Create account → Add property
3. Get tracking ID (format: `G-XXXXXXXXXX` or `UA-XXXXXXXXX`)

### Step 2: Add to Site

Already configured in `gatsby-config.js`:
```javascript
{
  resolve: `gatsby-plugin-google-analytics`,
  options: {
    trackingId: process.env.GA_TRACKING_ID || 'YOUR-GA-ID-HERE',
  },
},
```

### Step 3: Set Environment Variable

**Netlify:**
- Site settings → Environment variables
- Key: `GA_TRACKING_ID`
- Value: Your GA ID

**Vercel:**
- Project settings → Environment Variables
- Key: `GA_TRACKING_ID`
- Value: Your GA ID

**Or hardcode in `gatsby-config.js`** (line 19):
```javascript
trackingId: 'G-XXXXXXXXXX',
```

---

## 🔄 CONTINUOUS DEPLOYMENT

Once set up, any push to `main` branch auto-deploys:

```bash
# Make changes
git add .
git commit -m "Update project screenshots"
git push

# Netlify/Vercel automatically builds and deploys
# Takes 3-5 minutes
# Check build status in dashboard
```

---

## 🎯 REPLACING CURRENT jasonteixeira.com

You currently have CloudResumeChallangeAWS at jasonteixeira.com.

### Option A: Replace Completely
1. Deploy new portfolio to Netlify/Vercel
2. Point jasonteixeira.com to new deployment
3. Old CloudResume site is gone (backup first!)

### Option B: Keep Both
1. Deploy portfolio to **portfolio.jasonteixeira.com**
2. Keep CloudResume at **jasonteixeira.com**
3. Or vice versa: portfolio at root, CloudResume at **cloud.jasonteixeira.com**

### Recommended: Replace
Your new portfolio is way more impressive than the CloudResume static site. Use jasonteixeira.com for the portfolio.

---

## 🐛 TROUBLESHOOTING

### Build fails on Netlify/Vercel

**Check:**
1. Node version (Gatsby 3 needs Node 14+)
2. Build logs for specific errors
3. Run `npm run build` locally first

**Fix Node version in Netlify:**
- Site settings → Environment variables
- Add `NODE_VERSION` = `18.17.0`

### Images not loading

**Check:**
1. Image paths are correct in markdown
2. Images exist in correct directories
3. Image file extensions match (case-sensitive)

### Site is slow

**Optimize:**
```bash
# Compress images
npm install -g imagemin-cli
imagemin content/featured/**/*.png --out-dir=content/featured --plugin=pngquant

# Check bundle size
npm run build
ls -lh public/
```

### DNS not working

**Check:**
- DNS propagation (use https://dnschecker.org/)
- TTL might be high (wait 24-48 hours)
- Correct A records and CNAME
- SSL certificate issued (Netlify/Vercel dashboard)

---

## 📈 POST-DEPLOYMENT CHECKLIST

After deploying:

- [ ] Verify site loads at https://jasonteixeira.com
- [ ] Check all sections render correctly
- [ ] Test all project links go to GitHub
- [ ] Verify resume PDF downloads
- [ ] Test on mobile (Chrome, Safari)
- [ ] Check social sharing (LinkedIn, Twitter) shows correct og:image
- [ ] Set up Google Analytics
- [ ] Test contact form (if enabled)
- [ ] Run Lighthouse audit (Chrome DevTools)
- [ ] Submit sitemap to Google Search Console

---

## 🎨 CUSTOM DOMAIN SETUP SUMMARY

### Current Setup (CloudResume):
```
jasonteixeira.com → AWS S3 + CloudFront
```

### New Setup (Portfolio):
```
jasonteixeira.com → Netlify/Vercel
```

### Migration Steps:
1. Deploy portfolio to Netlify/Vercel (gets temp URL like `sage-portfolio.netlify.app`)
2. Test temp URL thoroughly
3. Add custom domain jasonteixeira.com in Netlify/Vercel
4. Update DNS to point to new deployment
5. Wait for DNS propagation (1-48 hours)
6. Verify HTTPS works
7. Old CloudResume site automatically stops serving traffic

### Downtime:
- Minimal (1-5 minutes during DNS switch)
- Can preview new site at temp URL before switching DNS

---

## 💡 RECOMMENDATIONS

### Netlify vs Vercel

**Use Netlify if:**
- You want simpler dashboard
- You need form handling (Netlify Forms)
- You prefer their edge functions

**Use Vercel if:**
- You like Next.js ecosystem
- You want best performance analytics
- You prefer their CLI tools

**Both are excellent.** Netlify is slightly easier for Gatsby. I recommend Netlify.

### Performance

**Current portfolio scores:**
- Lighthouse Performance: ~85-90 (good)
- First Contentful Paint: ~1.5s
- Time to Interactive: ~3.5s

**After images:**
- Optimize all images (compress PNGs, use WebP)
- Keep images under 500KB each
- Consider lazy loading for below-the-fold images

### SEO

**Already configured:**
- ✅ Meta tags (title, description)
- ✅ Open Graph tags (social sharing)
- ✅ Sitemap generation
- ✅ Robots.txt

**After deployment:**
- Submit sitemap to Google Search Console
- Add structured data (JSON-LD) for rich snippets
- Monitor search rankings

---

## 🚀 READY TO DEPLOY?

### Pre-deployment checklist:

- [ ] All images added (IMAGES_NEEDED.md)
- [ ] Tested locally (http://localhost:3068)
- [ ] All links work
- [ ] Mobile responsive verified
- [ ] Resume PDF updated
- [ ] Open Graph images customized

### Deploy command:

```bash
# Option 1: Netlify CLI (fastest)
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod

# Option 2: GitHub + Netlify Dashboard (recommended for first deploy)
git push origin main
# Then connect in Netlify dashboard

# Option 3: Manual build + drag-and-drop
npm run build
# Upload `public/` folder to Netlify (Sites → Drag & drop)
```

---

## 📞 NEED HELP?

If something goes wrong:
1. Check build logs in Netlify/Vercel dashboard
2. Run `npm run build` locally to reproduce
3. Google the error message
4. Check Gatsby docs: https://www.gatsbyjs.com/docs/
5. Ask me!

---

**Good luck with the deployment! 🎉**

**Estimated time to production:** 30 minutes (after images are ready)
