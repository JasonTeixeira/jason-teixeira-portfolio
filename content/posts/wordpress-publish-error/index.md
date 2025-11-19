---
title: 'The WordPress Publish Button That Wouldn't Work'
description: 'The publish button mocked me. Every click, same cryptic JSON error. Spent hours debugging Gutenberg. Turns out? It was CORS. On localhost. Because HTTPS.'
date: '2024-09-13'
draft: false
slug: /pensieve/wordpress-publish-error
featuredImage: './cover.jpg'
category: 'Web Development'
tags:
  - WordPress
  - CORS
  - Local Development
  - Debugging
  - HTTPS
---

The publish button mocked me.

I wrote a simple WordPress post. Added some content. Clicked "Publish."

Nothing happened.

Well, not nothing. A cryptic error appeared: `Publishing failed. Error message: The response is not a valid JSON response.`

Great. Super helpful. Thanks, WordPress.

What followed was two hours of debugging Gutenberg, ACF, REST API endpoints, and my own sanity. The actual problem? CORS. On localhost. Because of HTTPS.

Let me save you the two hours I'll never get back.

## The Setup: Local WordPress Development

I was working on a WordPress site using [Ups Dock](https://github.com/Upstatement/ups-dock), a Docker-based WordPress development environment. Everything was configured correctly. The site loaded fine. I could navigate the admin. Create pages. Upload media.

Everything worked except the one thing I actually needed to do: **publish a post**.

## The Error That Told Me Nothing

I clicked "Save Draft."

![Draft fail](./draft-fail.png)

Error.

I clicked "Publish."

![Publish error](./publish-error.png)

Same error: `Publishing failed. Error message: The response is not a valid JSON response.`

Okay, so it's a JSON issue. The REST API must be returning invalid JSON, right?

Wrong.

## Debugging Attempt 1: Gutenberg and Block Editor

My first thought: "Gutenberg is broken."

The block editor (Gutenberg) has had its share of issues. Maybe this is one of them.

I tried:
- Disabling all plugins
- Switching to a default WordPress theme (Twenty Twenty-Four)
- Clearing browser cache
- Clearing WordPress cache
- Restarting the Docker containers

Error persisted.

So it's not a plugin or theme issue.

## Debugging Attempt 2: Advanced Custom Fields (ACF)

I was using ACF for custom fields. Maybe that's interfering with the REST API?

Disabled ACF entirely. Tried publishing a plain post with no custom fields.

Same error.

Not ACF.

## Debugging Attempt 3: REST API Deep Dive

"Okay," I thought. "The REST API must be returning invalid JSON."

I opened the browser console. Found a bunch of errors:

![Console errors](./console-errors.png)

```
Failed to load resource: net::ERR_FAILED
POST http://project.ups.dock/wp-json/wp/v2/posts/123 net::ERR_FAILED
```

That's interesting. The request is failing before it even gets a response. So it's not invalid JSON at all—the request isn't completing.

I tried hitting the REST API directly in a new browser tab:

```
http://project.ups.dock/wp-json/wp/v2/posts
```

It worked fine. Returned valid JSON. No errors.

So why is it failing when Gutenberg tries to use it?

## Debugging Attempt 4: Network Tab Investigation

I opened Chrome DevTools and went to the Network tab. Tried publishing again.

The POST request to `/wp-json/wp/v2/posts/123` was showing as "failed" with a red X. But there was no response. No status code. Just... failure.

I compared it to other successful requests in the network tab.

Then I noticed something.

**Successful requests:** `http://project.ups.dock/wp-admin/...`  
**Failed request:** `http://project.ups.dock/wp-json/...`

Wait. All the successful requests were going to `http://`. But I was currently on... let me check the URL bar...

`https://project.ups.dock/wp-admin`

Oh.

Oh no.

## The Actual Problem: CORS + HTTPS + HTTP

Here's what was happening:

1. I was accessing the WordPress admin at **https**://project.ups.dock/wp-admin
2. Gutenberg was making AJAX requests to save the post
3. Those requests were going to **http**://project.ups.dock/wp-json
4. The browser blocked them as **mixed content** (HTTPS page making HTTP requests)
5. WordPress interpreted this as "The response is not a valid JSON response"

It was a CORS error. Specifically, a mixed content error.

But why was I on HTTPS in the first place? I was on localhost!

Turns out, Ups Dock has SSL/HTTPS enabled by default for the local environment. The site was accessible at both `http://` and `https://`. I had just happened to navigate to the HTTPS version.

WordPress was configured to use HTTP internally (the `WP_HOME` and `WP_SITEURL` constants), but my browser was on HTTPS. So when Gutenberg tried to make a request, the browser said "Nope, mixed content" and blocked it.

## The Solution (That Made Me Facepalm)

I closed the admin panel.

Navigated to: `http://project.ups.dock/wp-admin` (no 's' in 'http')

Tried publishing again.

It worked immediately.

**Two hours of debugging. The solution? Remove the 's' from the URL.**

I wanted to flip my desk.

## Why This Happens (And Why It's Confusing)

### WordPress HTTPS Detection is Weird

WordPress has functions like `is_ssl()` that try to detect if the current request is over HTTPS. But these don't always work correctly in local development environments, especially with reverse proxies or Docker.

### Browser Mixed Content Blocking

Modern browsers block mixed content by default. If you're on an HTTPS page, you can't make HTTP AJAX requests. This is a security feature.

WordPress doesn't handle this gracefully. Instead of showing "Mixed content blocked," it shows "Not a valid JSON response."

### Local Development SSL is a Mess

Local HTTPS is useful for testing, but it adds complexity:
- Self-signed certificates trigger warnings
- Mixed content errors are common
- Some features (like service workers) require HTTPS

But for basic WordPress development? HTTP is simpler.

## How to Fix This Permanently

### Option 1: Force WordPress to Use HTTPS

If you want to use HTTPS locally, configure WordPress to use it everywhere:

```php
// wp-config.php
define('WP_HOME', 'https://project.ups.dock');
define('WP_SITEURL', 'https://project.ups.dock');

// Force HTTPS in admin
define('FORCE_SSL_ADMIN', true);

// Fix SSL detection behind reverse proxies
if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && 
    $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
    $_SERVER['HTTPS'] = 'on';
}
```

This ensures all internal URLs use HTTPS, avoiding mixed content issues.

### Option 2: Redirect HTTP to HTTPS (Or Vice Versa)

Add a redirect so you can't accidentally access the wrong protocol:

```php
// Redirect HTTP to HTTPS
if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
    $redirect = 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    header('Location: ' . $redirect, true, 301);
    exit;
}
```

Or if you prefer HTTP for local dev:

```php
// Redirect HTTPS to HTTP (local dev only!)
if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
    $redirect = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    header('Location: ' . $redirect, true, 301);
    exit;
}
```

### Option 3: Use HTTP for Local Development

The simplest solution? Just disable HTTPS in your local environment.

For Ups Dock, that means commenting out the SSL configuration in `docker-compose.yml` or your nginx config.

For other setups, just don't enable HTTPS locally unless you need it.

## Other Local WordPress Gotchas

While we're on the topic of WordPress local development:

### Gotcha 1: wp-config.php Environment Variables

Your `wp-config.php` should have different settings for local vs production:

```php
// Detect environment
$env = getenv('WP_ENV') ?: 'production';

if ($env === 'development') {
    define('WP_DEBUG', true);
    define('WP_DEBUG_LOG', true);
    define('WP_DEBUG_DISPLAY', false);
    define('SCRIPT_DEBUG', true);
} else {
    define('WP_DEBUG', false);
}
```

### Gotcha 2: Database Prefix Collisions

If you run multiple WordPress sites in Docker, make sure each has a unique database:

```yaml
services:
  db:
    environment:
      MYSQL_DATABASE: site1_wordpress  # Unique per project!
```

I've accidentally had two projects share a database. Chaos ensued.

### Gotcha 3: File Upload Permissions

Docker containers often run as root, causing permission issues with uploaded files:

```dockerfile
RUN chown -R www-data:www-data /var/www/html/wp-content/uploads
```

### Gotcha 4: WP_HOME vs WP_SITEURL

These seem similar but are different:

- `WP_HOME`: The front-end URL (what users see)
- `WP_SITEURL`: The WordPress files location (where WordPress is installed)

Usually they're the same, but not always. Getting them wrong breaks everything.

### Gotcha 5: Permalink Structure Needs .htaccess or Nginx Rules

Pretty permalinks don't work out of the box. You need either:

**Apache (.htaccess):**
```apache
RewriteEngine On
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
```

**Nginx:**
```nginx
location / {
    try_files $uri $uri/ /index.php?$args;
}
```

Without this, any URL except the homepage returns 404.

## What I Learned

### 1. Error Messages Can Be Completely Wrong

"Not a valid JSON response" was technically true—there was no response at all. But it was misleading. The real issue was mixed content blocking.

### 2. HTTPS on Localhost is More Trouble Than It's Worth

Unless you're testing HTTPS-specific features (service workers, WebRTC, etc.), just use HTTP locally. Save yourself the headaches.

### 3. Check the Network Tab First

I wasted an hour debugging WordPress internals before checking the Network tab. If I'd started there, I would've seen the mixed content error immediately.

### 4. WordPress Gutenberg Error Handling Sucks

The block editor should detect CORS/mixed content errors and show a meaningful message. Instead, it shows generic JSON errors that send you down the wrong debugging path.

## Debugging Checklist for WordPress Publish Errors

If you hit this error, check these in order:

1. **Open browser console** - Look for CORS, mixed content, or network errors
2. **Check Network tab** - See if requests are actually reaching the server
3. **Verify REST API works** - Hit `/wp-json/wp/v2/posts` directly in browser
4. **Check URL protocol** - Are you on HTTP or HTTPS?
5. **Check wp-config.php** - Do `WP_HOME` and `WP_SITEURL` match your URL?
6. **Disable plugins** - Rule out plugin conflicts
7. **Check file permissions** - Ensure WordPress can write to wp-content
8. **Check PHP error logs** - There might be server-side errors

This will catch 90% of publish issues.

## The Bottom Line

**Problem:** WordPress publish button fails with "Not a valid JSON response"  
**Actual Cause:** CORS / mixed content error (HTTPS admin, HTTP REST API)  
**Solution:** Use HTTP for local WordPress admin, or configure HTTPS everywhere  
**Time Wasted:** 2 hours  
**Lesson Learned:** Check the Network tab before debugging WordPress internals

If you see this error, check your URL bar first. It might save you two hours.

## Resources

- [WordPress HTTPS Documentation](https://wordpress.org/support/article/https-for-wordpress/)
- [Debugging WordPress](https://wordpress.org/support/article/debugging-in-wordpress/)
- [MDN: Mixed Content](https://developer.mozilla.org/en-US/docs/Web/Security/Mixed_content)
- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)

## Related Posts

More debugging adventures:
- [Docker Compose Error: Three Hours, One Line](/pensieve/docker-error)
- [Dark Mode Flash: The FOUC Problem](/pensieve/dark-mode-toggle)
- [Portfolio Infrastructure: WordPress in Docker](/pensieve/portfolio-tech-stack)

Hit this error? Found another cause? [Let me know on GitHub](https://github.com/JasonTeixeira/jason-teixeira-portfolio) or [reach out](/contact).
