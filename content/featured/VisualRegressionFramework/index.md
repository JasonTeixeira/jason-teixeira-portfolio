---
date: '1'
title: 'Visual Regression Testing Framework'
cover: './demo.png'
github: 'https://github.com/JasonTeixeira/Visual-Regression-Framework'
external: ''
tech:
  - Python
  - Playwright
  - Pytest
  - OpenCV
  - Pillow
  - Docker
---

Automated visual testing using Playwright for screenshot capture across Chrome, Firefox, and Safari. Uses OpenCV for pixel-diff comparison with baseline images. Handles responsive layouts at different viewport sizes and dark mode variants. Built as an alternative to commercial tools. Main challenge was handling rendering differences between browsers and making the comparison algorithm fast enough to run in CI pipelines without timing out.
