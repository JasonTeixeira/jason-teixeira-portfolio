---
title: 'Building This Portfolio: From "Hello World" to Production in 3 Months'
description: 'The honest story of building this portfolio site. Spoiler: Gatsby crashed my laptop, Netlify Functions confused me, and I learned why performance budgets exist the hard way.'
date: '2024-10-18'
draft: false
slug: /pensieve/portfolio-tech-stack
featuredImage: './cover.jpg'
category: 'Cloud Engineering'
tags:
  - Gatsby
  - React
  - Netlify
  - CI/CD
  - Cloud Infrastructure
  - Meta
---

"I'll build a simple portfolio site. Should take a weekend."

Three months later, I had a Gatsby site with 200+ React components, a custom blog system I named "Pensieve" (Harry Potter reference), serverless functions, a CI/CD pipeline, and a Lighthouse score I'm unreasonably proud of.

This is the story of building the site you're reading right now. The actual story—with all the mistakes, confusion, and "why isn't this working?" moments included.

[View Source Code](https://github.com/JasonTeixeira/jason-teixeira-portfolio)

## How It Started: The Weekend Project

The plan was simple:
- Use a template
- Add my projects
- Deploy to Netlify
- Done by Sunday

Friday night, I found a clean Gatsby template. Cloned it. Ran `gatsby develop`.

My laptop fans started spinning like a jet engine.

The build took 4 minutes.

The browser finally opened. Loaded a blank white page. Console: 47 errors.

"This is fine," I thought. "I'll just fix a few things."

Three months later, I had rewritten almost the entire codebase.

## Why Gatsby (And Why I Almost Quit)

I chose Gatsby because everyone said "Gatsby is great for portfolios!" 

They were right. Eventually. But first, I had to understand Gatsby.

### The GraphQL Confusion

Gatsby uses GraphQL for everything. Want to query your blog posts? GraphQL. Want to get an image? GraphQL. Want to know what day it is? Probably GraphQL.

Coming from REST APIs, this was... different.

```graphql
query {
  allMarkdownRemark {
    edges {
      node {
        frontmatter {
          title
          date
        }
      }
    }
  }
}
```

"Why are there edges and nodes? This isn't a graph theory course."

Two weeks of GraphQL later, I understood it. And honestly? It's actually pretty great once you get past the learning curve.

### The Build Time Problem

Initial build time: 4 minutes.

For a portfolio site. With 10 pages.

I did some investigating. Turns out, I was importing EVERY image at full resolution. The build process was optimizing 50+ high-res images on every build.

After implementing gatsby-plugin-image properly:
- Build time: 45 seconds
- Images: automatically optimized to WebP
- Performance: Lighthouse score went from 72 to 94

Sometimes the solution is just reading the documentation more carefully.

## Building "Pensieve": The Blog That Grew Arms and Legs

I wanted a simple blog. Write markdown files. They appear on the site. Done.

What I ended up building:
- Full-text search (almost, then realized I need Algolia)
- Tag filtering
- Reading time calculation
- Syntax highlighting for 20+ languages
- Table of contents generation
- Related posts algorithm
- RSS feed (still on the todo list)

How did this happen? Feature creep, mostly.

### The Reading Time Calculator That Wasn't

I wanted to show estimated reading time. Found a library. Installed it. It said every post takes "1 min" to read.

Even my 3,000-word posts. "1 min."

I looked at the source code. It was dividing word count by... wait, is that dividing by the number of words? That doesn't make sense.

Turns out I was using it wrong. But by then, I'd already written my own:

```javascript
export const readingTime = (text) => {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes;
};
```

Eight lines. Works perfectly. Sometimes reinventing the wheel is faster than debugging the wheel you found on npm.

### Syntax Highlighting: A Journey

I tried four different syntax highlighting libraries:

1. **highlight.js** - Worked, but bundle size was huge (120KB)
2. **Prism.js** - Better, but themes looked dated
3. **Shiki** - Beautiful, but build times doubled
4. **gatsby-remark-prismjs** - Finally, the Goldilocks solution

The lesson? Sometimes the best library is the one that integrates with your framework, not the one with the most stars on GitHub.

## Netlify Functions: Serverless Backend for the Confused

I needed backend functionality:
- Contact form (send emails)
- Visitor counter (track pageviews)
- Maybe more later?

"I'll use Netlify Functions!" I declared confidently.

Then I tried to write my first function and realized I had no idea how serverless functions work.

### The Contact Form That Didn't Send Emails

My first attempt:

```javascript
// netlify/functions/contact-form.js
exports.handler = async (event) => {
  const { name, email, message } = JSON.parse(event.body);
  
  // Send email somehow?
  console.log('Email:', name, email, message);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
};
```

It logged to the console. Which I couldn't see. Because serverless functions don't have a console you can access.

Great.

### Actually Sending Emails (Take 2)

I integrated with SendGrid. Got an API key. Wrote the code:

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event) => {
  const { name, email, message } = JSON.parse(event.body);
  
  try {
    await sgMail.send({
      to: 'me@example.com',
      from: 'portfolio@example.com',
      subject: `Contact from ${name}`,
      text: message,
      html: `<p>${message}</p><p>From: ${email}</p>`
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email' })
    };
  }
};
```

Deployed it. Tested it. Got a 500 error.

Checked Netlify logs. "SendGrid API key is invalid."

I had forgotten to add the environment variable in Netlify's dashboard.

**Pro tip:** Serverless functions can't read your `.env` file. You need to set environment variables in your hosting provider's settings.

### The Visitor Counter Nobody Asked For

I wanted to track how many people visit my site. But I didn't want to use Google Analytics because... privacy? Honestly, I just wanted to build it myself.

Built a Netlify Function that increments a counter in a database:

```javascript
exports.handler = async () => {
  const count = await db.increment('visitor_count');
  return {
    statusCode: 200,
    body: JSON.stringify({ count })
  };
};
```

Deployed it. Tested it.

The counter went from 1 to 2 to 3...

Then I refreshed the page and it jumped to 47.

Turns out, the browser was sending the request multiple times (prefetch, cache validation, etc.), and I was counting every request.

Added rate limiting and request deduplication:

```javascript
const recentIPs = new Map();

exports.handler = async (event) => {
  const ip = event.headers['x-forwarded-for'];
  const now = Date.now();
  
  // Only count once per IP per hour
  if (recentIPs.has(ip)) {
    const lastVisit = recentIPs.get(ip);
    if (now - lastVisit < 3600000) {  // 1 hour
      return {
        statusCode: 200,
        body: JSON.stringify({ counted: false })
      };
    }
  }
  
  recentIPs.set(ip, now);
  const count = await db.increment('visitor_count');
  
  return {
    statusCode: 200,
    body: JSON.stringify({ count, counted: true })
  };
};
```

Now it works. Mostly. Good enough.

## The Performance Optimization Rabbit Hole

I deployed the site. Ran Lighthouse. Score: 68.

For a static site. Built with performance in mind. 68.

This was unacceptable.

### Problem 1: Images Were Massive

I was serving raw PNG files. Some were 2-3MB.

Added gatsby-plugin-image with proper configuration:

```javascript
{
  resolve: 'gatsby-plugin-image',
  options: {
    formats: ['auto', 'webp', 'avif'],
    quality: 80,
    placeholder: 'blurred'
  }
}
```

Result: Images went from 2MB to 100-200KB. Lighthouse score: 68 → 82.

### Problem 2: JavaScript Bundle Was Huge

Initial bundle: 450KB.

I was importing entire libraries when I only needed one function. Classic mistake.

Found the culprit: Lodash. I was importing the entire library for `_.debounce`.

```javascript
// Before (imports entire Lodash - 70KB)
import _ from 'lodash';
const debouncedFunc = _.debounce(fn, 300);

// After (imports only debounce - 2KB)
import debounce from 'lodash/debounce';
const debouncedFunc = debounce(fn, 300);
```

Result: Bundle size: 450KB → 280KB. Lighthouse score: 82 → 89.

### Problem 3: Fonts Were Blocking Render

I was loading custom fonts synchronously. The browser waited for fonts to download before showing any text.

Added `font-display: swap`:

```css
@font-face {
  font-family: 'Calibre';
  src: url('/fonts/Calibre-Regular.woff2') format('woff2');
  font-display: swap;  /* Show fallback immediately */
}
```

Result: First Contentful Paint: 2.1s → 0.9s. Lighthouse score: 89 → 94.

**Final score: 94.** Good enough for me.

## The CI/CD Pipeline That Actually Works

I wanted automatic deployments. Push to main → site updates. Simple.

Set up GitHub Actions:

```yaml
name: Deploy to Netlify
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

First deploy: Failed. "Node out of memory."

Gatsby builds can be memory-intensive. Added environment variable:

```yaml
- name: Build
  run: NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

Second deploy: Worked!

Now every git push triggers a build and deploy. Takes 3-4 minutes. Completely automatic.

## Things I Learned the Hard Way

### 1. Performance Budgets Are Non-Negotiable

Before I set a bundle size limit, I kept adding dependencies without thinking.

After setting a limit (300KB gzipped), I started being more careful about imports.

**Lesson:** Constraints breed creativity. Without a performance budget, performance doesn't happen.

### 2. Serverless Functions Have Cold Starts

The first request to a Netlify Function after it's been idle takes 1-2 seconds.

Subsequent requests: <100ms.

This is fine for contact forms. Not fine for anything requiring fast responses.

**Lesson:** Serverless is great for occasional tasks, not for high-frequency operations.

### 3. Static Site Generators Aren't Always Fast

Gatsby can be slow to build if you're not careful. My build went from 4 minutes to 45 seconds by:
- Using gatsby-plugin-image correctly
- Removing unused plugins
- Optimizing GraphQL queries
- Not importing everything at once

**Lesson:** Every tool has gotchas. Read the performance best practices.

### 4. Over-Engineering is Tempting

I almost built:
- A custom CMS
- A comment system
- Real-time analytics
- A newsletter integration
- Dark mode persistence across devices (via cloud sync)

I stopped myself because none of these were necessary for a portfolio site.

**Lesson:** Just because you can build it doesn't mean you should.

### 5. Deploy Previews Are Game-Changing

Netlify creates a deploy preview for every pull request. This means I can test changes on a real URL before merging.

This has saved me from shipping bugs multiple times.

**Lesson:** Preview environments aren't optional. They're essential.

## The Actual Tech Stack

After three months, here's what I'm using:

**Frontend:**
- Gatsby (Static Site Generator)
- React (UI)
- Styled Components (CSS-in-JS)
- GraphQL (Data queries)

**Backend:**
- Netlify Functions (Serverless)
- SendGrid (Emails)
- Database (Visitor counter - considering removing it)

**Infrastructure:**
- Netlify (Hosting + CDN)
- GitHub Actions (CI/CD)
- Dependabot (Security updates)

**Cost:** $12/year (just the domain)
- Everything else is on free tiers

## What I'd Do Differently

If I were starting over:

**1. Start with a simpler stack** - I didn't need Gatsby. Next.js or even plain React would've been fine.

**2. Don't build everything yourself** - I spent weeks building features I could've imported from libraries.

**3. Performance budgets from day one** - Setting limits early prevents problems later.

**4. Write documentation as you go** - I have no idea how some parts of my codebase work anymore.

**5. Test on slow networks** - My site loads instantly on my MacBook. On 3G? Not so much.

## The Bottom Line

**Planned:** Weekend project  
**Reality:** 3 months, 200+ components, custom build pipeline  
**Lighthouse Score:** 94 (started at 68)  
**Bundle Size:** 280KB (started at 450KB)  
**Build Time:** 45 seconds (started at 4 minutes)  
**Cost:** $12/year  
**Was it worth it?** Absolutely.

I learned more building this portfolio than I did on any tutorial. Not because portfolios are complex, but because I actually shipped something and dealt with real problems.

The site isn't perfect. There are bugs I know about and bugs I haven't found yet. But it works, it's fast, and it's mine.

And honestly? That's good enough.

## Future Improvements (Maybe)

- [ ] Add Algolia search for blog posts
- [ ] Implement dark mode persistence (properly)
- [ ] Add RSS feed
- [ ] Make it a PWA
- [ ] Better mobile performance
- [ ] Blog post series/collections
- [ ] Remove the visitor counter (it's kind of pointless)

## Related Posts

More building in public:
- [NexQuantSite: 590K LOC Full-Stack App](/pensieve/nexquantsite-590k-loc)
- [AlphaStream: ML Trading Platform](/pensieve/alphastream-ml-trading)
- [API Testing Framework: 125 Tests That Don't Fail](/pensieve/api-testing-retry-logic)

Want to build something similar? [Check out the source code](https://github.com/JasonTeixeira/jason-teixeira-portfolio) or [read the setup guide](https://github.com/JasonTeixeira/jason-teixeira-portfolio/blob/main/SETUP.md).

Have suggestions? [Open an issue on GitHub](https://github.com/JasonTeixeira/jason-teixeira-portfolio/issues) or [get in touch](/contact).
