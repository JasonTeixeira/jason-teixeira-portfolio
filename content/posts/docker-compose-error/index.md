---
title: 'Three Hours Debugging Docker. The Fix? One Line.'
description: 'That moment when you spend three hours debugging a cryptic Docker error, only to discover the solution is changing a single version number.'
date: '2024-09-20'
draft: false
slug: '/pensieve/docker-error'
featuredImage: './cover.jpg'
category: 'DevOps'
tags:
  - Docker
  - Docker Compose
  - WordPress
  - Debugging
  - DevOps
---

Three hours. That's how long I spent debugging a Docker error that made absolutely no sense.

The error message? `ERROR: Setting workdir for exec is not supported in API < 1.35 (1.30)`

The solution? Changed one number in my `docker-compose.yml` file from `3.5` to `3.6`.

Three. Hours. One. Line.

Let me tell you about the most frustrating debugging session I've had in a while.

## The Setup: WordPress Local Development

I was working on a WordPress project using [Skela](https://github.com/Upstatement/skela-wp-theme), a theme development framework. The local dev environment used Docker Compose to spin up WordPress, MySQL, and all the dependencies.

Everything had been working fine. Then I pulled the latest updates from the repo and tried to run a simple script:

```bash
#!/bin/bash
# bin/composer
docker-compose exec -w /var/www/html/wp-content/themes/skela wordpress composer "$@"
```

This script runs Composer commands inside the WordPress container, using the `-w` flag to set the working directory.

Should be straightforward, right?

## The Error That Made No Sense

I ran `./bin/composer install` and got this:

```shell
ERROR: Setting workdir for exec is not supported in API < 1.35 (1.30)
```

My first reaction: "What?"

My second reaction: "What does API version have to do with anything?"

My third reaction: "Why is it complaining about API 1.30 when Docker Compose version 3.5 should support this?"

None of it made sense.

## Debugging Attempt 1: The Docker Version Rabbit Hole

"Okay," I thought. "Maybe my Docker is out of date."

```bash
docker --version
# Docker version 20.10.8, build 3967b7d
```

That's recent enough. Docker 20.10 definitely supports setting working directories in exec commands.

Maybe Docker Compose is out of date?

```bash
docker-compose --version
# docker-compose version 1.29.2, build 5becea4c
```

Also recent. This should work.

I spent 30 minutes reading Docker documentation, looking for what changed between API versions. Found nothing useful.

## Debugging Attempt 2: The "Maybe It's the Script" Theory

Maybe the problem isn't Docker. Maybe it's how I'm calling the command?

Tried running it manually:

```bash
docker-compose exec wordpress composer install
```

Worked fine.

Tried with the working directory:

```bash
docker-compose exec -w /var/www/html/wp-content/themes/skela wordpress composer install
```

Failed with the same error.

So it's definitely the `-w` flag. But why? I've used this flag before. It's a standard Docker Compose feature.

## Debugging Attempt 3: Reading the Docker Compose Source Code

At this point, I was getting desperate. I went to the Docker Compose GitHub repo and started reading through the source code.

Found the error message in the codebase. It's checking the API version before allowing the `workdir` option.

But I still didn't understand **why my API version was 1.30** when I was using Docker 20.10 and Compose 1.29.

Spent another 30 minutes reading about Docker API versioning. Learned more than I ever wanted to know about Docker's internal architecture.

Still no solution.

## Debugging Attempt 4: "Let Me Google This Exact Error"

Finally, I gave up on understanding *why* and started searching for others who hit this exact error.

Found a Stack Overflow post. Someone had the same issue.

The answer? "Update your docker-compose.yml version from 3.5 to 3.6."

Wait. What?

## The Solution (That Made Me Want to Scream)

I opened my `docker-compose.yml`:

```yaml
version: '3.5' # highlight-line
services:
  wordpress:
    build:
      context: .
    # ... rest of config
```

Changed it to:

```yaml
version: '3.6' # highlight-line
services:
  wordpress:
    build:
      context: .
    # ... rest of config
```

Ran the script again.

It worked.

**Three hours of debugging. One line changed. From `3.5` to `3.6`.**

I wanted to throw my laptop out the window.

## Why This Happened (The Confusing Part)

Here's what I learned after the fact:

### Docker Compose File Versions ≠ Docker API Versions

This is the confusing part. The `version: '3.5'` in your `docker-compose.yml` file is **not** the Docker API version. It's the **Compose file format version**.

These are different things:

- **Compose file format version**: Defines what features are available in your `docker-compose.yml` syntax
- **Docker Engine API version**: Defines what the Docker daemon itself supports

The error message `API < 1.35 (1.30)` is referring to the **Docker Engine API**, not the Compose file format.

### The Version Mapping is Weird

Here's the mapping between Compose file versions and Docker Engine API versions:

| Compose File Version | Minimum Docker Engine API | Docker Engine Version |
|---------------------|---------------------------|----------------------|
| 3.5 | 1.30 | 17.12.0+ |
| 3.6 | 1.36 | 18.02.0+ |
| 3.7 | 1.37 | 18.06.0+ |

Notice the jump? Compose file version `3.5` requires Docker Engine API `1.30`, but to use `workdir` in `exec` commands, you need API `1.35`.

So even though my Docker Engine was version 20.10 (which supports API 1.41), Docker Compose was **limiting itself** to API 1.30 because my compose file said `version: '3.5'`.

### Why The Error Message Sucked

The error message was:

```
ERROR: Setting workdir for exec is not supported in API < 1.35 (1.30)
```

What it should have said:

```
ERROR: Setting workdir for exec requires Docker Engine API 1.35+.
Your docker-compose.yml is version 3.5, which only supports API 1.30.
Update to version 3.6 or higher.
```

That would have saved me three hours.

## What Features Are Locked Behind Versions?

This got me curious: what other features require specific Compose file versions?

### Compose 3.5 vs 3.6

Version 3.6 added:
- `tmpfs` size option
- Better `init` support  
- **`workdir` in exec commands** (the one I needed)

### Compose 3.6 vs 3.7

Version 3.7 added:
- `init` option for services
- Better health check interval settings
- `rollback_config` for deploy

### Compose 3.7 vs 3.8

Version 3.8 added:
- Maximum replication limits
- `init` support in volumes
- Better secret handling

Most of these are minor. But the `workdir` exec support in 3.6 is pretty important if you're running scripts in containers.

## How To Avoid This Problem

### 1. Always Use the Latest Stable Compose Version

Unless you have a specific reason to use an older version, just use the latest:

```yaml
version: '3.8'  # Latest stable as of this writing
```

Future-proofs your setup and avoids weird API version issues.

### 2. Check Docker Compose Compatibility

Before using a new feature, check the [Compose file reference](https://docs.docker.com/compose/compose-file/) to see what version it requires.

### 3. Update Your Docker Engine

Make sure your Docker Engine is recent enough to support the Compose file version you're using:

```bash
docker version --format '{{.Server.APIVersion}}'
```

### 4. Use docker-compose config to Validate

Before running your services, validate the config:

```bash
docker-compose config
```

This will catch version incompatibilities before you waste hours debugging.

## Other Docker Gotchas I've Learned

While we're on the topic of Docker weirdness:

### Gotcha 1: Cached Layers That Aren't Really Cached

```dockerfile
COPY package.json .
RUN npm install
COPY . .
```

Looks good, right? `npm install` should be cached unless `package.json` changes.

Except sometimes Docker doesn't cache it. Why? File timestamps, permissions, or hidden files can invalidate the cache without changing `package.json`.

**Fix:** Use `.dockerignore` aggressively.

### Gotcha 2: docker-compose up Doesn't Rebuild

Changed your Dockerfile? Running `docker-compose up` won't rebuild the image.

You need:

```bash
docker-compose up --build
```

I forget this constantly.

### Gotcha 3: Volume Permissions on Linux

Volumes mounted on Linux often have permission issues because the container runs as a different user than your host user.

**Fix:**

```yaml
services:
  app:
    user: "${UID}:${GID}"
```

Set `UID` and `GID` in your `.env` file.

### Gotcha 4: Network Isolation Isn't Perfect

Containers in the same network can access each other even if you don't expose ports. This is by design, but it catches people off guard.

If you want true isolation, use separate networks or Docker's built-in security features.

## What I Learned

### 1. Error Messages Lie (Or At Least Mislead)

The error mentioned API version 1.30, but the actual issue was the Compose file version. Always dig deeper than the error message.

### 2. Version Numbers Are More Complex Than They Appear

Docker has at least 4 different version numbers:
- Docker Engine version (20.10.8)
- Docker API version (1.41)
- Docker Compose version (1.29.2)
- Compose file format version (3.5, 3.6, etc.)

They're all related but different. Fun!

### 3. Documentation Sometimes Sucks

Docker's documentation is generally good, but the relationship between Compose file versions and API versions is poorly explained. I had to piece it together from multiple sources.

### 4. Sometimes You Just Need to Google the Exact Error

I spent 2.5 hours trying to understand the problem. Then 5 minutes Googling the exact error gave me the answer.

Pride kept me from Googling sooner. Don't be like me.

## The Bottom Line

**Problem:** Docker Compose exec with `-w` flag failing  
**Error:** `Setting workdir for exec is not supported in API < 1.35 (1.30)`  
**Solution:** Change `version: '3.5'` to `version: '3.6'` in `docker-compose.yml`  
**Time Wasted:** 3 hours  
**Lesson Learned:** Sometimes the fix really is just changing one number

If you hit this error, you're welcome. I've already wasted the three hours so you don't have to.

## Resources

- [Docker Compose File Version Reference](https://docs.docker.com/compose/compose-file/compose-versioning/)
- [Docker Engine API Version History](https://docs.docker.com/engine/api/version-history/)
- [Compose Compatibility Matrix](https://docs.docker.com/compose/compose-file/compose-file-v3/)

## Related Posts

More debugging war stories:
- [WordPress Publishing Error: The CORS Surprise](/pensieve/wordpress-publish-error)
- [E-Commerce Test Suite: 45 Minutes to 8 Minutes](/pensieve/playwright-pytest-parallel)
- [Portfolio Infrastructure: Docker in Production](/pensieve/portfolio-tech-stack)

Have you hit this error? Found a better solution? [Let me know on GitHub](https://github.com/JasonTeixeira/jason-teixeira-portfolio) or [reach out](/contact).
