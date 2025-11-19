---
title: 'Dark Mode Without the Flash (And How I Finally Fixed It)'
description: 'I shipped dark mode. Users loved it. Then they refreshed the page and got flashbanged by a white screen. Here's how I fixed the dreaded FOUC.'
date: '2024-10-04'
draft: false
slug: /pensieve/dark-mode-toggle
featuredImage: './cover.jpg'
category: 'Web Development'
tags:
  - Theming
  - Dark Mode
  - React
  - JavaScript
  - UX
---

I shipped dark mode. Users loved it. Finally, they could browse at night without burning their retinas.

Then someone refreshed the page.

For a split second, the screen flashed white—bright, blinding white—before switching back to dark mode. Every single time.

That's when I learned about FOUC. Or as I like to call it: "Flashbanging Your Users: A Developer's Guide to Making Enemies."

## The Problem: Flash of Unstyled Theme (FOUT? FOUC? FART?)

The CSS community can't decide what to call this. "Flash of Unstyled Content" (FOUC)? "Flash of Inaccurate Color Theme" (FACT)? Someone on CSS-Tricks called it "Flash of Inaccurate coloR Theme" (FART), which honestly, is the most accurate.

Whatever you call it, here's what happens:

1. User visits your site with dark mode enabled
2. HTML loads (defaults to light mode)
3. JavaScript loads and executes
4. JavaScript checks localStorage for saved theme
5. JavaScript applies dark mode
6. **But steps 2-5 happen fast enough that the user sees a flash of light mode**

The result? Your dark mode users get flashbanged every page load. Not great for UX. Really not great at 2am when someone's browsing in bed.

## What I Tried First (That Didn't Work)

### Attempt 1: Just Load Faster, Bro

My first brilliant idea: "What if I just make the JavaScript load faster?"

Moved the theme script to the top of `<body>`. Still flashed.

Inlined the JavaScript. Still flashed.

Added `async` and `defer` attributes. Made it worse somehow.

The problem wasn't speed. The problem was **timing**.

### Attempt 2: CSS Variables With Media Queries

"Okay," I thought. "What if I use `prefers-color-scheme` and let the browser handle it?"

```css
:root {
  --bg: #ffffff;
  --text: #000000;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #000000;
    --text: #ffffff;
  }
}
```

This actually worked! No flash! Perfect!

Except for one tiny problem: **users couldn't toggle it**. If their OS was set to light mode, they were stuck with light mode on my site. No toggle button could override system preferences.

I needed a solution that:
1. Respected user choice (toggle button)
2. Didn't flash on page load
3. Persisted across page reloads

### Attempt 3: Rendering Dark Mode on the Server

"I'll just detect the theme on the server side!"

This is where I learned that:
1. The server doesn't have access to localStorage
2. The server doesn't know what theme the user had selected
3. I was using a static site generator (Gatsby)

Back to the drawing board.

## The Solution: Run JavaScript BEFORE the DOM Renders

Here's the key insight that finally worked: **You need to check the theme before the browser paints anything**.

Not after the DOM loads.  
Not in a `useEffect` hook.  
Not in a React component.

**In the `<head>`, before the `<body>` even starts rendering.**

### The Setup

There are three critical pieces:

1. **CSS variables** for theming
2. **A `data-theme` attribute** on the `<html>` element
3. **A blocking script** in the `<head>` that checks localStorage

Let me break down each part.

### Part 1: CSS Variables

Define your theme colors as CSS variables:

```css
:root {
  --bg: #ffffff;
  --text: #000000;
  --primary: #0070f3;
}

[data-theme='dark'] {
  --bg: #000000;
  --text: #ffffff;
  --primary: #3291ff;
}

body {
  background-color: var(--bg);
  color: var(--text);
}
```

The magic happens with `[data-theme='dark']`. When we add `data-theme="dark"` to the `<html>` element, all these variables update automatically.

### Part 2: Theme Script in the `<head>`

This is the crucial part. Put this **in the `<head>`**, not at the end of `<body>`:

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Site</title>
    
    <!-- This runs BEFORE the body renders -->
    <script>
      (function() {
        // Check localStorage for saved theme
        const savedTheme = localStorage.getItem('theme');
        
        // If there's a saved theme, apply it immediately
        if (savedTheme) {
          document.documentElement.setAttribute('data-theme', savedTheme);
        } else {
          // No saved theme? Check system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const theme = prefersDark ? 'dark' : 'light';
          document.documentElement.setAttribute('data-theme', theme);
        }
      })();
    </script>
  </head>
  <body>
    <!-- Rest of your content -->
  </body>
</html>
```

**Why this works:**

1. The script runs **synchronously** (no `async` or `defer`)
2. It executes **before** the `<body>` starts rendering
3. It sets the theme **before** the browser paints anything
4. No flash. No FART.

### Part 3: The Toggle Button

Now we need a way for users to actually switch themes. This JavaScript can run **after** the page loads since it's not timing-critical:

```javascript
// This can be in your regular JavaScript bundle
const themeToggleBtn = document.querySelector('.js-theme-toggle');

themeToggleBtn.addEventListener('click', () => {
  // Get current theme
  const currentTheme = document.documentElement.dataset.theme;
  
  // Toggle to opposite theme
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  // Update the DOM
  document.documentElement.setAttribute('data-theme', newTheme);
  
  // Save to localStorage
  localStorage.setItem('theme', newTheme);
  
  // Update button accessibility
  const label = `Activate ${currentTheme} mode`;
  themeToggleBtn.setAttribute('aria-label', label);
  themeToggleBtn.setAttribute('title', label);
});
```

## Why `<html>` Instead of `<body>`?

You might be wondering: "Why put `data-theme` on `<html>` instead of `<body>`?"

Great question. Because the script runs in the `<head>`, the `<body>` element **doesn't exist yet**. We can't set attributes on an element that hasn't been parsed.

The `<html>` element, however, exists as soon as the parser starts. So we can safely set `data-theme` on it before anything renders.

## Respecting System Preferences

The solution above checks localStorage first, but falls back to system preferences if no theme is saved:

```javascript
const savedTheme = localStorage.getItem('theme');

if (savedTheme) {
  // User has explicitly chosen a theme
  document.documentElement.setAttribute('data-theme', savedTheme);
} else {
  // No saved preference, check system
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = prefersDark ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
}
```

This respects the user's choice hierarchy:
1. **Explicit choice on your site** (localStorage) - highest priority
2. **System preference** (prefers-color-scheme) - fallback
3. **Default light mode** - final fallback

## The React/Gatsby Version

If you're using React or Gatsby (like I am for this portfolio), the approach is slightly different.

In Gatsby, you use `gatsby-ssr.js` to inject the script:

```javascript
// gatsby-ssr.js
export const onRenderBody = ({ setPreBodyComponents }) => {
  const themeScript = `
    (function() {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      }
    })();
  `;
  
  setPreBodyComponents([
    <script
      key="theme-script"
      dangerouslySetInnerHTML={{ __html: themeScript }}
    />
  ]);
};
```

For Next.js, you'd use `_document.js`:

```javascript
// pages/_document.js
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  const savedTheme = localStorage.getItem('theme');
                  if (savedTheme) {
                    document.documentElement.setAttribute('data-theme', savedTheme);
                  }
                })();
              `
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
```

## Common Pitfalls (And How I Hit All of Them)

### Pitfall 1: Using `useEffect` for Theme Loading

```javascript
// Don't do this!
useEffect(() => {
  const savedTheme = localStorage.getItem('theme');
  setTheme(savedTheme);
}, []);
```

**Why it doesn't work:** `useEffect` runs **after** the component mounts and renders. That means the page has already painted in the default theme.

### Pitfall 2: Async Scripts

```html
<!-- Don't do this! -->
<script async src="theme.js"></script>
```

Async scripts don't block rendering. That's usually good. But for theme scripts, you **want** to block rendering until the theme is set.

### Pitfall 3: Forgetting SSR

If you're using server-side rendering, remember: localStorage doesn't exist on the server. Always wrap localStorage access in a check:

```javascript
if (typeof window !== 'undefined') {
  const theme = localStorage.getItem('theme');
}
```

### Pitfall 4: Not Handling System Theme Changes

Users can change their system theme while your site is open. You should listen for changes:

```javascript
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', (e) => {
    // Only update if user hasn't set an explicit preference
    if (!localStorage.getItem('theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  });
```

## What I Learned

### 1. Blocking Scripts Aren't Always Bad

Modern web dev teaches us to avoid blocking scripts. But sometimes, you **need** things to happen before the page renders. Dark mode is one of those times.

### 2. The `<html>` Element is Your Friend

I always put classes and attributes on `<body>`. Turns out `<html>` is more useful for global state like themes because it exists earlier in the parsing process.

### 3. UX Matters More Than Perfection

Could I have built a more "proper" solution with a backend API to set a cookie? Sure. But that's overkill when 10 lines of JavaScript solve the problem perfectly.

### 4. FOUC Has Many Names

Flash of Unstyled Content. Flash of Inaccurate Color Theme. Flash of Default Theme. The community can't agree on terminology, but we all agree it sucks.

## The Result

After implementing this solution:
- ✅ No flash on page load
- ✅ Theme persists across navigation
- ✅ Respects system preferences as a fallback
- ✅ User choice takes priority
- ✅ Works with SSR/SSG
- ✅ Zero external dependencies

No more flashbanging users at 2am. Mission accomplished.

## Resources

If you want to dive deeper:

- [CSS-Tricks: Complete Guide to Dark Mode](https://css-tricks.com/a-complete-guide-to-dark-mode-on-the-web/)
- [Josh Comeau: The Quest for the Perfect Dark Mode](https://www.joshwcomeau.com/react/dark-mode/)
- [web.dev: prefers-color-scheme](https://web.dev/prefers-color-scheme/)
- [Max Böck: Color Theme Switcher](https://mxb.dev/blog/color-theme-switcher/)

## Related Posts

Building more features for this portfolio:
- [Portfolio Infrastructure: Tech Stack Deep Dive](/pensieve/portfolio-tech-stack)
- [NexQuantSite: Dark Mode in a 590K LOC App](/pensieve/nexquantsite-590k-loc)

Have a better solution? Found a bug in my approach? [Let me know on GitHub](https://github.com/JasonTeixeira/jason-teixeira-portfolio) or [get in touch](/contact).
