---
date: '2'
title: 'API Test Automation Framework'
cover: './demo.png'
github: 'https://github.com/JasonTeixeira/API-Test-Automation-Wireframe'
external: ''
detailPage: '/projects/api-testing'
tech:
  - Python
  - Pytest
  - Requests
  - Pydantic
  - Docker
  - CI/CD
---

Production-grade REST API testing framework with 125+ tests, featuring intelligent retry logic, Pydantic schema validation, and comprehensive CI/CD integration. Built with layered architecture—test layer, client layer (with automatic retries), and type-safe model validation.

**What makes it different:** Client abstraction handles retry on 429/5xx with exponential backoff, request/response logging with token sanitization, session pooling for speed. 9-job CI pipeline with smoke tests, parallel execution, and >80% coverage enforcement.
