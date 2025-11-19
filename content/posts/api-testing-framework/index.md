---
title: 'When Your API Tests Fail at 3AM (And It's Not Your Fault)'
description: 'I built 125 API tests. They worked perfectly... until they didn't. Random failures at 3AM. This is the story of hunting down flaky tests and building retry logic that actually works.'
date: '2024-10-25'
draft: false
slug: /pensieve/api-testing-retry-logic
featuredImage: './cover.jpg'
category: 'Test Automation'
tags:
  - Python
  - Pytest
  - API Testing
  - Pydantic
  - CI/CD
---

3:17 AM. My phone buzzes. Slack notification.

"❌ CI Pipeline Failed - Production Deploy Blocked"

I grab my phone. Check the failed test. It's `test_get_user_profile`. This test has passed 200 times in a row. What could possibly be wrong?

I run it locally. Passes immediately.

I trigger the CI pipeline again. It fails. Same test. Different error this time.

That's when I realized: **my tests weren't testing my code. They were testing the internet.**

Welcome to the world of flaky API tests, where a single network hiccup at 3AM can block your entire deployment.

[View Project on GitHub](https://github.com/JasonTeixeira/API-Test-Automation-Wireframe) | [Full Project Details](/projects/api-testing)

## How I Got Here (The Naive Beginning)

Six months ago, I started building an API test suite for a REST API. The requirements seemed straightforward:

- Test all 20+ endpoints
- Validate request/response schemas
- Check error handling
- Run in CI/CD

"Should take a few weeks," I thought.

Three months later, I had 125 tests. They were comprehensive. They were well-organized. And they were **completely unreliable**.

On any given day, 5-10 tests would fail randomly. Sometimes the same tests passed when I re-ran them. Sometimes they didn't.

My team stopped trusting the test results. "Oh, it's just a flaky test" became the default response to any failure.

That's when I knew I had to fix this. For real.

## The Problem: APIs Aren't Like Unit Tests

Unit tests are deterministic. Same input = same output. Every time.

API tests? Not so much.

### What Can Go Wrong (A Non-Exhaustive List)

1. **Network Hiccups** - Request times out, even though the API is fine
2. **Rate Limiting** - Hit 429 errors because CI runs tests too fast
3. **Server Load** - The API is slow under load, returns 503
4. **Database Locks** - Concurrent requests cause temporary failures
5. **Third-Party Services** - External dependencies have their own issues
6. **DNS Resolution** - Sometimes DNS just... doesn't work
7. **SSL Certificate** - Expires or has issues
8. **Load Balancer** - Routes request to unhealthy instance

And the worst part? **None of these are bugs in your code.**

But they make your tests fail anyway.

## My First Attempt: Just Retry Everything

"Okay," I thought. "I'll just wrap every test in a retry decorator."

```python
@pytest.mark.flaky(reruns=3)
def test_get_user():
    response = requests.get('/api/users/1')
    assert response.status_code == 200
```

This helped. Kind of. Failed tests would retry and sometimes pass.

But I had new problems:

1. **Tests took forever** - Every failure meant 3 retries
2. **Real bugs got masked** - Actual API bugs passed after retry
3. **No intelligence** - Retried on 404s (which should fail immediately)
4. **Resource waste** - Hammering the API with retries

I needed something smarter.

## Building Intelligent Retry Logic

Here's what I learned: **not all failures should be retried**.

### Failures That Should Retry

- **429 Rate Limit** - The API is telling you to slow down
- **5xx Server Errors** - Temporary server issues
- **Network Timeouts** - Connection problems
- **503 Service Unavailable** - Server is temporarily overloaded

### Failures That Should NOT Retry

- **400 Bad Request** - Your request is malformed
- **401/403 Unauthorized** - Authentication issues
- **404 Not Found** - Resource doesn't exist
- **422 Validation Error** - Invalid data

Retrying these is pointless. They'll fail the same way every time.

### The Implementation

I built a client with smart retry logic:

```python
class APIClient:
    def __init__(self, base_url, max_retries=3):
        self.base_url = base_url
        self.max_retries = max_retries
        self.session = requests.Session()  # Connection pooling
    
    def _should_retry(self, status_code):
        """Only retry on transient failures"""
        return status_code in [429, 500, 502, 503, 504]
    
    def _make_request_with_retry(self, method, endpoint, **kwargs):
        for attempt in range(self.max_retries):
            try:
                response = self.session.request(
                    method, 
                    f"{self.base_url}{endpoint}", 
                    **kwargs
                )
                
                # If it's a retriable error, wait and try again
                if self._should_retry(response.status_code):
                    if attempt < self.max_retries - 1:
                        wait_time = 2 ** attempt  # Exponential backoff: 1s, 2s, 4s
                        logger.warning(f"Retry {attempt + 1}/{self.max_retries} after {wait_time}s")
                        time.sleep(wait_time)
                        continue
                
                # Success or non-retriable error
                return response
                
            except (requests.Timeout, requests.ConnectionError) as e:
                # Network issues - retry
                if attempt < self.max_retries - 1:
                    wait_time = 2 ** attempt
                    logger.warning(f"Network error, retry {attempt + 1} after {wait_time}s: {e}")
                    time.sleep(wait_time)
                    continue
                raise
        
        return response
    
    def get(self, endpoint, **kwargs):
        return self._make_request_with_retry('GET', endpoint, **kwargs)
    
    def post(self, endpoint, **kwargs):
        return self._make_request_with_retry('POST', endpoint, **kwargs)
```

**Why this works:**

1. **Smart retry** - Only retries transient failures
2. **Exponential backoff** - 1s → 2s → 4s (avoids hammering the API)
3. **Network resilience** - Handles timeouts and connection errors
4. **Session pooling** - Reuses TCP connections (faster)

### The Results

**Before:**
- 10-15% flaky test rate
- Tests fail randomly in CI
- Team ignores test failures

**After:**
- <1% flaky test rate
- Tests only fail on real issues
- Team trusts the test results again

Worth it.

## The Schema Validation Problem

Once I fixed the flaky tests, I discovered a new problem: **schema drift**.

The API would change. A field gets renamed. A type changes from int to string. My tests would pass because I wasn't validating the response structure properly.

### Manual Validation Was a Nightmare

```python
def test_get_user():
    response = api_client.get('/users/1')
    data = response.json()
    
    # Manual validation - tedious and error-prone
    assert 'id' in data
    assert 'name' in data
    assert 'email' in data
    assert isinstance(data['id'], int)
    assert isinstance(data['name'], str)
    assert '@' in data['email']
    # ... 20 more lines of this
```

This was:
- **Tedious** - Lots of boilerplate
- **Incomplete** - Easy to miss fields
- **Not type-safe** - No IDE autocomplete
- **Hard to maintain** - Changes require updating every test

### Enter Pydantic

I rewrote my validation using [Pydantic](https://pydantic-docs.helpmanual.io/) models:

```python
from pydantic import BaseModel, EmailStr, Field

class User(BaseModel):
    id: int
    name: str
    email: EmailStr  # Validates email format automatically
    age: int = Field(ge=0, le=150)  # Age must be 0-150
    is_active: bool = True
    created_at: datetime

# Now the test is simple
def test_get_user():
    response = api_client.get('/users/1')
    user = User(**response.json())  # Validates entire schema
    
    assert user.name == "Test User"
    assert user.is_active is True
```

**What Pydantic gives you:**

1. **Automatic validation** - Fails if schema doesn't match
2. **Type safety** - IDE knows what fields exist
3. **Better errors** - "field 'email' is not a valid email address"
4. **Self-documentation** - Models describe the API
5. **Schema versioning** - Easy to maintain multiple API versions

### The Moment Pydantic Saved Me

Two weeks after adding Pydantic validation, a test started failing:

```
pydantic.error_wrappers.ValidationError: 
  field 'user_id' not found in response
```

I checked the API. The backend team had renamed `user_id` to `id` without telling anyone.

Without Pydantic, this would have passed. The test would check other fields, not notice the missing one, and ship broken code to production.

**Pydantic caught it immediately.**

## Session Pooling: The Accidental Performance Win

I didn't plan to optimize performance. I stumbled into it.

I was running the test suite locally and noticed something weird: tests took 12-15 seconds. But the actual API calls only took ~100ms each. Where was all the time going?

### The Problem: TCP Handshakes

Every HTTP request goes through a TCP handshake:
1. Client sends SYN
2. Server sends SYN-ACK
3. Client sends ACK
4. Now you can send data

This takes 20-50ms. For a 100ms API call, that's **50% overhead**.

And I was doing this **for every single request** across 125 tests.

### The Solution: requests.Session()

```python
# Before: New connection every time
for i in range(125):
    requests.get(f'/api/test/{i}')
# Time: 12-15 seconds

# After: Reuse connections
session = requests.Session()
for i in range(125):
    session.get(f'/api/test/{i}')
# Time: 4-5 seconds
```

**Result: 3x faster** by reusing TCP connections.

I integrated this into my APIClient class. Every test now automatically uses session pooling.

## The CI/CD Pipeline That Actually Works

With reliable tests and fast execution, I built a CI/CD pipeline that doesn't suck:

```yaml
# .github/workflows/test.yml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - name: Run linters
        run: |
          flake8 tests/
          black --check tests/
          mypy tests/
  
  test-matrix:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: [3.9, '3.10', 3.11]
    steps:
      - name: Run tests
        run: pytest tests/ -v --tb=short
  
  integration:
    runs-on: ubuntu-latest
    steps:
      - name: Run integration tests
        run: pytest tests/integration/ -v
  
  coverage:
    runs-on: ubuntu-latest
    steps:
      - name: Check coverage
        run: |
          pytest --cov=tests --cov-fail-under=80
          coverage report
  
  security:
    runs-on: ubuntu-latest
    steps:
      - name: Security scan
        run: |
          pip-audit
          bandit -r tests/
```

**Pipeline features:**
- ✅ Runs in parallel (all jobs at once)
- ✅ Tests on Python 3.9, 3.10, 3.11
- ✅ Enforces 80% code coverage
- ✅ Security scanning
- ✅ Completes in <5 minutes

**Before this pipeline:** Tests took 20+ minutes, failed randomly
**After this pipeline:** Tests take <5 minutes, only fail on real issues

## Logging Without Leaking Secrets

Here's a problem I didn't anticipate: **logging requests in CI exposes API keys**.

```python
# This logs the Authorization header
logger.info(f"POST /api/users with headers: {headers}")

# CI logs now contain:
# POST /api/users with headers: {'Authorization': 'Bearer sk_live_123abc...'}
```

Oops. Now your API keys are in CI logs visible to your whole team.

### Token Sanitization

I built a sanitizer:

```python
def _sanitize_auth(self, data):
    """Replace sensitive tokens with [REDACTED]"""
    if isinstance(data, dict):
        sanitized = {}
        for key, value in data.items():
            if key.lower() in ['authorization', 'token', 'api_key', 'password']:
                sanitized[key] = '[REDACTED]'
            else:
                sanitized[key] = value
        return sanitized
    return data

def _log_request(self, method, url, headers, body):
    safe_headers = self._sanitize_auth(headers)
    safe_body = self._sanitize_auth(body) if body else None
    
    logger.info(f"{method} {url}")
    logger.info(f"Headers: {safe_headers}")
    if safe_body:
        logger.info(f"Body: {safe_body}")
```

Now CI logs show:
```
POST /api/users
Headers: {'Authorization': '[REDACTED]', 'Content-Type': 'application/json'}
Body: {'name': 'Test', 'password': '[REDACTED]'}
```

**Full debugging visibility. Zero secret leakage.**

## The Architecture That Emerged

After all these improvements, I ended up with a clean three-layer architecture:

### Layer 1: Test Layer (Business Logic)

```python
# tests/test_users.py
def test_create_user_success(api_client):
    user_data = {
        "name": "Test User",
        "email": "test@example.com",
        "age": 25
    }
    
    response = api_client.post('/users', json=user_data)
    
    assert response.status_code == 201
    user = User(**response.json())
    assert user.name == "Test User"
    assert user.email == "test@example.com"
```

### Layer 2: Client Layer (Infrastructure)

```python
# clients/api_client.py
class APIClient:
    # Retry logic
    # Session pooling
    # Request/response logging
    # Error handling
```

### Layer 3: Model Layer (Validation)

```python
# models/user.py
class User(BaseModel):
    id: int
    name: str
    email: EmailStr
    age: int
```

**Benefits:**
- **Separation of concerns** - Each layer has one job
- **Easy to maintain** - Changes localized to one layer
- **Reusable** - Client can be used across test files
- **Type-safe** - Models enforce contracts

## What I Learned

### 1. Retry Logic Should Be Smart, Not Blind

Don't retry everything. Only retry transient failures. Use exponential backoff.

### 2. Type Safety Catches More Bugs

Pydantic validation caught schema changes that manual assertions missed. Type safety isn't just for compile-time languages.

### 3. Performance Matters in Tests

Session pooling gave me 3x speedup. Fast tests = fast feedback = more testing.

### 4. Flaky Tests Destroy Trust

If your team stops trusting test results, you've already lost. Fix flaky tests immediately.

### 5. Security in Testing is Often Overlooked

Don't log secrets. Sanitize before logging. Your CI logs are probably more public than you think.

## The Bottom Line

**Problem:** API tests failing randomly at 3AM
**Root Cause:** Network issues, rate limits, server errors
**Solution:** Intelligent retry logic + Pydantic validation + session pooling
**Result:** <1% flaky test rate, 3x faster execution, team trusts tests again

Building this framework took three months. But now I have 125 tests that:
- ✅ Only fail on real bugs
- ✅ Run in 4-5 seconds locally
- ✅ Complete CI pipeline in <5 minutes
- ✅ Catch schema drift immediately
- ✅ Never leak secrets in logs

Was it worth three months? Absolutely. Because now when my phone buzzes at 3AM, I know it's a **real problem**, not a flaky test.

## Related Projects

More testing war stories:
- [E-Commerce Test Suite: 45 Minutes to 8 Minutes](/pensieve/playwright-pytest-parallel)
- [NexQuantSite: Testing a 590K LOC Platform](/pensieve/nexquantsite-590k-loc)
- [AlphaStream: Backtesting That Doesn't Lie](/pensieve/alphastream-ml-trading)

Want to see the code? [Check out the GitHub repository](https://github.com/JasonTeixeira/API-Test-Automation-Wireframe) or [view full project details](/projects/api-testing).
