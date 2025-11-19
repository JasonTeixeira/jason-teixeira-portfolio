---
title: 'How I Cut Test Runtime from 45 Minutes to 8 Minutes (And Kept My Sanity)'
description: 'The story of building 278 tests, watching CI pipelines fail for 45 minutes, and finally figuring out parallelization'
date: '2024-11-01'
draft: false
slug: /pensieve/playwright-pytest-parallel
featuredImage: './cover.jpg'
category: 'Test Automation'
tags:
  - Playwright
  - Pytest
  - Testing
  - CI/CD
  - Python
  - Performance
---

Picture this: You push a small fix to production. Then you wait. And wait. And wait some more.

45 minutes later, your CI pipeline finally finishes running tests. The feature you changed? A button color. The tests that ran? All 278 of them. Because that's how CI works.

This is the story of how I got that 45-minute nightmare down to 8 minutes. Spoiler: It took way longer than it should have.

[View Project on GitHub](https://github.com/JasonTeixeira/E-Commerce-Test-Suite) | [Full Project Details](/projects/ecommerce-testing)

## How It Started

"I'll write a comprehensive test suite for this e-commerce platform. Should be straightforward."

Narrator: It was not straightforward.

The requirements were simple enough:
- UI tests (shopping cart, checkout, authentication)
- API tests (all the REST endpoints)
- Visual regression (screenshot comparisons)
- Performance tests (load times)
- Security tests (OWASP Top 10)
- Accessibility tests (WCAG 2.1)

Simple, right? Just cover every possible way the app could break. No big deal.

Three months later, I had 278 tests. And they took **45 minutes** to run. Every. Single. Time.

## The 45-Minute Problem

Here's what my daily workflow looked like:

1. Write code (5 minutes)
2. Push to GitHub (10 seconds)
3. Wait for tests to run (45 minutes)
4. Tests fail because of a flaky selector
5. Fix selector (2 minutes)
6. Push again
7. Wait another 45 minutes
8. Question life choices

I was spending more time waiting for tests than writing code. Something had to change.

## Attempt 1: "Just Run Them Faster"

My first brilliant idea: "What if I just... remove the slow tests?"

Removed 50 tests. Runtime: 38 minutes. Still terrible.

Removed 50 more. Runtime: 31 minutes. Better, but now I had holes in my test coverage.

This wasn't working. I needed ALL the tests. They caught real bugs. I just needed them to run faster.

## Attempt 2: Browser Reuse

Someone on Stack Overflow mentioned reusing browser instances instead of launching a new one for every test.

"Okay, I'll try that."

```python
# Instead of this (slow):
def test_something():
    browser = playwright.chromium.launch()  # New browser every test
    # ...

# Do this (faster):
@pytest.fixture(scope="session")
def browser():
    return playwright.chromium.launch()  # One browser for all tests
```

New runtime: 35 minutes.

That's... 10 minutes saved? Better than nothing. But still nowhere near good enough.

## The Parallelization Revelation

Week 4 of this nightmare. I'm complaining to a coworker about my 35-minute test suite.

Him: "Why don't you just run them in parallel?"

Me: "You can do that?"

Him: "Yeah, pytest-xdist. Like `pytest -n 8`. Runs 8 tests at once."

Me: "..."

I had been running tests sequentially like a caveman. For THREE MONTHS.

Added `pytest-xdist` to my requirements:
```bash
pytest tests/ -n 8 -v
```

New runtime: **8 minutes**.

I wanted to crawl under my desk. All that time wasted because I didn't read the pytest documentation properly.

## But It Wasn't That Simple

Parallelization broke everything. Turns out when you run 8 tests simultaneously, they start interfering with each other.

### Problem 1: Shared State

Tests were creating users with the same email address. When running in parallel, they'd collide and fail randomly.

**Solution:** Use unique identifiers for test data.

```python
import uuid

def test_create_user():
    email = f"test_{uuid.uuid4()}@example.com"  # Unique every time
    # Now tests don't collide
```

### Problem 2: Database Locks

Multiple tests trying to write to the same database rows simultaneously = deadlocks everywhere.

**Solution:** Each worker gets its own database. More setup, but worth it.

### Problem 3: Port Conflicts

Running 8 dev servers on port 3000 doesn't work. Who knew?

**Solution:** Dynamic port allocation. Each worker gets a random available port.

Fixing these issues took another week. But once solved, the 8-minute runtime was stable.

## The Flaky Test Nightmare

With 278 tests running in parallel, I discovered a new problem: flaky tests.

About 12% of my tests would randomly fail. Not because the app was broken, but because:
- Elements weren't loaded yet
- Network requests took longer than expected
- Animations hadn't finished
- The moon was in the wrong phase (probably)

### How I Fixed Flaky Tests

**1. Stopped Using time.sleep()**

```python
# Bad (flaky):
await button.click()
time.sleep(2)  # Hope 2 seconds is enough?
assert success_message.is_visible()

# Good (reliable):
await button.click()
await page.wait_for_selector('[data-testid="success"]')  # Wait until it exists
assert success_message.is_visible()
```

**2. Used Stable Selectors**

```python
# Flaky (CSS classes change):
page.locator('.btn-primary-v2-new-final-really')

# Stable (test IDs don't change):
page.locator('[data-testid="add-to-cart"]')
```

**3. Added Retry Logic for Legitimately Flaky Tests**

Some tests interact with third-party APIs. Sometimes those APIs are slow. That's life.

```python
@pytest.mark.flaky(reruns=3, reruns_delay=2)
def test_payment_gateway():
    # Will retry up to 3 times if it fails
    # Because sometimes Stripe is just having a bad day
```

After these fixes: Flaky test rate dropped from 12% to under 2%.

## The CI/CD Pipeline

Running tests locally in 8 minutes was great. But I still had to wait for CI.

My GitHub Actions pipeline had 14 jobs:
- Linting (flake8, black, mypy)
- Unit tests (Python 3.9, 3.10, 3.11)
- API tests
- UI tests (Chrome, Firefox, Safari)
- Visual regression
- Performance tests
- Security scans
- Accessibility checks
- E2E tests
- Integration tests
- Coverage enforcement
- Allure reports

Running them sequentially: 45+ minutes.
Running them in parallel: **12 minutes**.

Close enough. I'll take it.

## What I Learned (The Hard Way)

### 1. Parallelization Isn't Free

You can't just slap `-n 8` on pytest and call it done. You need to handle:
- Shared state
- Database isolation
- Port conflicts
- File system conflicts

But once you do, the speedup is absolutely worth it.

### 2. Flaky Tests Are The Worst

They waste everyone's time. You think there's a real bug. You investigate for an hour. Turns out the test just needed to wait 100ms longer.

Fix flaky tests immediately. Your future self will thank you.

### 3. Page Object Model Saves Your Life

With 278 tests, you WILL need to change selectors at some point. If every test has the selector hardcoded, you'll spend a week updating them.

Page Object Model means you update it in one place:

```python
class ProductPage:
    ADD_TO_CART = '[data-testid="add-to-cart"]'  # Change once, affects all tests
    
    def add_to_cart(self):
        self.page.locator(self.ADD_TO_CART).click()
```

### 4. Test Pyramids Actually Matter

I started by writing E2E tests for everything. Those are slow.

The testing pyramid exists for a reason:
- **Lots of unit tests** (fast, isolated)
- **Some integration tests** (medium speed)
- **Few E2E tests** (slow but thorough)

My final breakdown:
- 30 unit tests
- 23 integration tests
- 85 API tests  
- 120 UI tests
- 20 E2E tests

The fast tests run on every commit. The slow tests run before merging to main.

## The Stats (For People Who Love Numbers)

- **Total tests:** 278
- **Test coverage:** 85%+
- **Original runtime:** 45 minutes
- **Current runtime:** 8 minutes
- **Time saved per run:** 37 minutes
- **Runs per day:** ~20
- **Time saved per day:** ~12 hours (if you count parallel runs across team)
- **Flaky test rate:** <2%
- **Lines of test code:** 10,000+

## Was It Worth It?

Three months to build this test suite. One month to make it fast. Countless hours debugging flaky tests.

Was it worth it? Yes.

Every bug caught by tests is a bug that didn't make it to production. Every confidence I have deploying on Friday afternoon comes from knowing the tests will catch issues.

Fast tests enable fast iteration. Slow tests make you avoid testing. Choose fast.

## What I'd Do Differently

If I were starting over:

**Write tests from day one.** I added tests after the fact, which meant reverse-engineering behavior. Writing tests alongside features is way easier.

**Start with parallelization.** Don't wait until you have 278 tests to think about performance.

**Use test IDs everywhere.** Retrofit them later is painful. Add them to components from the start.

**Invest in test infrastructure early.** Fixtures, factories, helpers—build them before you need them.

## The Bottom Line

45 minutes to 8 minutes. 82% faster. All because I finally read the pytest documentation and learned about parallel execution.

Sometimes the solution is embarrassingly simple. You just have to find it first.

(And read the docs. Always read the docs.)

## Related

More testing war stories:
- [API Testing Framework: Building Retry Logic](/pensieve/api-testing-retry-logic)
- [NexQuantSite: Testing a 590K LOC App](/pensieve/nexquantsite-590k-loc)

Questions? Found a bug? [Open an issue](https://github.com/JasonTeixeira/E-Commerce-Test-Suite) or check out the [full docs](/projects/ecommerce-testing).
