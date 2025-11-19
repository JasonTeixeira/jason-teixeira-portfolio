---
title: 'Building Accessible Clickable Cards (The Right Way)'
description: 'My cards looked great. Then a keyboard user tried to navigate them. Here's how I made clickable cards that work for everyone, not just mouse users.'
date: '2024-09-27'
draft: false
slug: /pensieve/clickable-cards
featuredImage: './cover.jpg'
category: 'Web Development'
tags:
  - Accessibility
  - CSS
  - JavaScript
  - UX
  - A11y
---

My project cards looked great. Clean design, hover effects, the whole nine yards. I was pretty proud of them.

Then I watched someone try to navigate my site using only a keyboard.

They tabbed to a card. Hit Enter. Nothing happened. They tried tabbing again. The focus jumped somewhere random. They looked confused. I looked embarrassed.

That's when I learned that making a card "clickable" is way harder than I thought—if you want it to actually work for everyone.

[View CodePen Demo](https://codepen.io/bchiang7/pen/xxRBvgd?editors=1100)

## The Problem: Whole Card Clickable, But Also Child Links

Here's the UX pattern I was trying to build:

- A card that shows a project
- The **entire card** is clickable (takes you to project details)
- The card has **child links** inside it (GitHub link, live demo link)
- All links should be keyboard accessible
- The card should have hover effects

Sounds simple, right? Just wrap everything in an `<a>` tag and call it done.

Except that gives you invalid HTML (you can't nest `<a>` tags) and the child links don't work.

## What I Tried First (That Broke Everything)

### Attempt 1: JavaScript Click Handler on a Div

"I'll just make a div clickable with JavaScript!"

```html
<div class="card" onclick="window.location.href='/project'">
  <h2>Project Name</h2>
  <a href="https://github.com">GitHub</a>
  <a href="https://demo.com">Live Demo</a>
</div>
```

**Problems:**
- Not keyboard accessible (can't tab to a div)
- Not screen reader friendly (no semantic meaning)
- SEO nightmare (search engines don't know this is a link)
- The child links work, but that's the only good part

### Attempt 2: Wrapper Anchor Tag

"Okay, I'll wrap the whole thing in an `<a>` tag!"

```html
<a href="/project" class="card">
  <h2>Project Name</h2>
  <a href="https://github.com">GitHub</a> <!-- ❌ Invalid HTML -->
  <a href="https://demo.com">Live Demo</a> <!-- ❌ Invalid HTML -->
</a>
```

**Problems:**
- **Invalid HTML** - you can't nest anchor tags
- Browsers will auto-fix this and break your structure
- Child links won't work at all
- Unpredictable behavior across browsers

### Attempt 3: JavaScript Event Delegation

"What if I stop event propagation on child links?"

```javascript
card.addEventListener('click', (e) => {
  if (e.target.tagName !== 'A') {
    window.location.href = '/project';
  }
});
```

**Problems:**
- Still not keyboard accessible
- Still not screen reader friendly
- Lots of JavaScript for something that should be CSS/HTML
- What if the user clicks on text inside a child link? Breaks.

I needed a solution that:
1. ✅ Made the whole card clickable
2. ✅ Kept child links functional
3. ✅ Worked with keyboard navigation
4. ✅ Was accessible to screen readers
5. ✅ Used valid HTML
6. ✅ Required minimal JavaScript

## The Solution: Pseudo-Element Stretching

Here's the approach that actually works: use a pseudo-element (`:before` or `:after`) on the main link to cover the entire card.

### HTML Structure

```html
<div class="card">
  <h2>
    <a href="/project" class="card__link">
      Project Name
    </a>
  </h2>
  <p class="card__description">
    A cool project that does things.
  </p>
  <div class="card__links">
    <a href="https://github.com">GitHub</a>
    <a href="https://demo.com">Live Demo</a>
  </div>
</div>
```

**Key points:**
- The main link (`card__link`) is semantic (it's the heading)
- Child links are normal anchor tags
- Everything is valid HTML
- No nested anchor tags

### CSS Magic

Here's where the magic happens:

```css
.card {
  position: relative;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: background-color 0.2s;
  
  /* Make hover/focus effects work on the card */
  &:hover,
  &:focus-within {
    background-color: #f5f5f5;
  }
}

.card__link {
  /* Reset default link styles for the heading */
  text-decoration: none;
  color: inherit;
  
  /* This is the key part */
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }
  
  /* Hover/focus styles for the main link */
  &:hover,
  &:focus {
    color: #0070f3;
    text-decoration: underline;
  }
}

/* Make child links appear above the pseudo-element */
.card__links a {
  position: relative;
  z-index: 2; /* Higher than the pseudo-element */
  
  &:hover,
  &:focus {
    color: #0070f3;
  }
}
```

### How It Works

The magic is in the pseudo-element:

```css
.card__link:before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}
```

This creates an invisible layer that:
1. **Covers the entire card** (because the card has `position: relative`)
2. **Makes the whole card clickable** (clicks hit the pseudo-element, which belongs to the link)
3. **Sits behind child links** (they have `z-index: 2`, so they're on top)

When a user clicks anywhere on the card, they're actually clicking the pseudo-element, which is part of the main link. So the link activates.

When a user clicks a child link, the child link is positioned above the pseudo-element, so it receives the click instead.

### Why This Works

**For mouse users:**
- Clicking anywhere on the card navigates to the project
- Clicking child links works as expected
- Hover effects work on the entire card

**For keyboard users:**
- Tab once: focus moves to the main link (project name)
- Press Enter: navigates to project
- Tab again: focus moves to first child link (GitHub)
- Tab again: focus moves to second child link (Demo)
- Everything works as expected!

**For screen readers:**
- The semantic HTML is preserved
- The card announces as a link with the project name
- Child links announce separately
- No confusion or unexpected behavior

## The `:focus-within` Trick

Notice this CSS:

```css
.card {
  &:hover,
  &:focus-within {
    background-color: #f5f5f5;
  }
}
```

`:focus-within` is a pseudo-class that matches when **any descendant** has focus. This means:
- User hovers the card → background changes
- User tabs to the main link → background changes
- User tabs to a child link → background changes

This gives keyboard users the same visual feedback as mouse users. Super important for accessibility.

## Browser Support Gotcha

There's one small gotcha with older browsers. The pseudo-element might not stretch to cover the full card height if the card has dynamic content.

**Fix:**

```css
.card {
  position: relative;
  /* Ensure the card establishes a containing block */
  isolation: isolate;
}

.card__link:before {
  content: '';
  position: absolute;
  /* Use inset shorthand for better browser support */
  inset: 0; /* Same as top: 0; right: 0; bottom: 0; left: 0; */
  z-index: 1;
}
```

The `isolation: isolate` property creates a new stacking context, which ensures the pseudo-element stays properly contained.

## Real-World Implementation

Here's the full code I use on this portfolio site:

```css
.project-card {
  position: relative;
  padding: 2rem;
  background: var(--bg-secondary);
  border-radius: 12px;
  transition: all 0.2s ease;
  
  /* Hover/focus effects */
  &:hover,
  &:focus-within {
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
}

.project-card__title {
  margin: 0 0 1rem;
  
  a {
    color: var(--text-primary);
    text-decoration: none;
    position: static; /* Important! */
    
    /* The magic pseudo-element */
    &:before {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 1;
      border-radius: inherit;
    }
    
    &:hover,
    &:focus {
      color: var(--primary);
      
      &:after {
        content: ' →';
      }
    }
  }
}

.project-card__links {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  
  a {
    position: relative;
    z-index: 2; /* Above the pseudo-element */
    color: var(--text-secondary);
    font-size: 0.875rem;
    
    &:hover,
    &:focus {
      color: var(--primary);
    }
  }
}
```

**Additional touches:**
- Arrow appears on hover (`&:after { content: ' →'; }`)
- Card lifts slightly on hover (`transform: translateY(-4px)`)
- Box shadow adds depth
- All transitions are smooth

## Accessibility Checklist

If you implement this pattern, make sure you:

- ✅ Use semantic HTML (`<a>` for links, proper headings)
- ✅ Ensure keyboard navigation works (test with Tab key)
- ✅ Add `:focus` styles (visible focus indicators)
- ✅ Use `:focus-within` for card hover on focus
- ✅ Set proper `z-index` values (pseudo-element: 1, child links: 2)
- ✅ Test with screen readers (NVDA, JAWS, VoiceOver)
- ✅ Verify color contrast ratios (WCAG AA minimum)
- ✅ Add `aria-label` if the link text isn't descriptive enough

## When NOT to Use This Pattern

This pattern isn't always appropriate. **Don't use it when:**

1. **The card has many interactive elements** - If your card has multiple buttons, inputs, or complex interactions, this pattern becomes confusing. Keep it simple.

2. **The main action isn't obvious** - If users might not know what clicking the card does, you need a clearer call-to-action button instead.

3. **Mobile touch targets** - On mobile, accidentally tapping child links can be frustrating. Consider making the main action a prominent button instead.

4. **The card is too large** - If your card is huge, making the whole thing clickable can feel weird. Large click targets aren't always better.

## Alternative Approaches

### Option 1: Main Button + Secondary Links

```html
<div class="card">
  <h2>Project Name</h2>
  <p>Description</p>
  <a href="/project" class="btn-primary">View Project</a>
  <a href="/github" class="btn-secondary">GitHub</a>
</div>
```

**Pros:** Clear, obvious, accessible  
**Cons:** Takes more space, less elegant

### Option 2: Card Header is Clickable Only

```html
<a href="/project" class="card-header">
  <h2>Project Name</h2>
</a>
<div class="card-body">
  <p>Description</p>
  <a href="/github">GitHub</a>
</div>
```

**Pros:** Simple, no pseudo-element trickery  
**Cons:** Smaller click target

### Option 3: JavaScript with Proper ARIA

```javascript
const card = document.querySelector('.card');
card.setAttribute('role', 'link');
card.setAttribute('tabindex', '0');
card.addEventListener('click', handleClick);
card.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleClick();
  }
});
```

**Pros:** Maximum control  
**Cons:** Lots of JavaScript, easy to get wrong

## What I Learned

### 1. Accessibility Isn't Optional

I used to think "I'll add accessibility later." Then I watched someone struggle to use my site with a keyboard. Never again.

### 2. Pseudo-Elements Are Powerful

Before this, I only used `:before` and `:after` for decorative elements. Turns out they're incredibly useful for interactive patterns too.

### 3. Test With Real Assistive Tech

Reading about accessibility isn't enough. You need to actually use:
- Keyboard navigation (Tab, Enter, Space)
- Screen readers (VoiceOver, NVDA)
- Browser extensions (axe, Lighthouse)

### 4. CSS Can Replace JavaScript

My first instinct was to reach for JavaScript. But the CSS solution is simpler, more performant, and more maintainable.

## The Bottom Line

Making cards clickable is easy. Making them clickable **and accessible** requires thought.

The pseudo-element solution gives you:
- ✅ Whole card clickable
- ✅ Child links functional
- ✅ Keyboard accessible
- ✅ Screen reader friendly
- ✅ Valid HTML
- ✅ Minimal JavaScript

Is it perfect? No. But it's the best balance I've found between UX, accessibility, and implementation complexity.

## Resources

Want to learn more about accessible patterns?

- [Inclusive Components: Card Pattern](https://inclusive-components.design/cards/)
- [Adrian Roselli: Card Sorting](https://adrianroselli.com/2020/02/block-links-cards-clickable-regions-etc.html)
- [Heydon Pickering: Inclusive Design Patterns](https://www.smashingmagazine.com/inclusive-design-patterns/)
- [MDN: `:focus-within` Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-within)

## Related Posts

More patterns from building this portfolio:
- [Dark Mode Without the Flash](/pensieve/dark-mode-toggle)
- [Portfolio Infrastructure: Accessibility Features](/pensieve/portfolio-tech-stack)
- [NexQuantSite: Component Library](/pensieve/nexquantsite-590k-loc)

Found a better approach? Have questions? [Open an issue on GitHub](https://github.com/JasonTeixeira/jason-teixeira-portfolio) or [reach out](/contact).
