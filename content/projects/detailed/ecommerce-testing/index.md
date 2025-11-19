---
slug: 'ecommerce-testing'
title: 'E-Commerce Test Automation Suite'
subtitle: 'Comprehensive Testing with 278+ Tests Across the Testing Pyramid'
date: '2024-10-01'
status: 'Production - Active Use'
timeline: '6 months development'
github: 'https://github.com/JasonTeixeira/E-Commerce-Test-Suite'
demo: ''
tech:
  - Python
  - Playwright
  - Pytest
  - Docker
  - GitHub Actions
  - Allure Reports
metrics:
  tests: '278+'
  coverage: '85%+'
  ci_jobs: '14'
  runtime: '8min (from 45min)'
  loc: '10,000+'
hero: './hero.png'
---

## Overview

Comprehensive e-commerce test automation suite with 278+ tests covering UI, API, visual regression, performance, security, and accessibility testing. Built with Playwright and Pytest, featuring a 14-job CI/CD pipeline and parallel execution that reduced runtime from 45 minutes to 8 minutes.

### Key Features

- **278+ comprehensive tests** across the entire testing pyramid
- **14-job CI/CD pipeline** with parallel execution
- **85%+ code coverage** across 10,000+ lines of test code
- **Page Object Model architecture** for maintainable UI tests
- **Parallel execution** reduced runtime by 82% (45min → 8min)
- **Allure Reports** for beautiful test reporting
- **Complete testing pyramid:** Unit, API, UI, E2E, visual, performance, security, accessibility

## Architecture

### Testing Pyramid Coverage

This suite covers all levels of the testing pyramid:

- **Unit Tests:** Individual component logic
- **API Tests:** REST endpoint validation
- **Integration Tests:** Service interactions
- **UI Tests:** User workflows with Playwright
- **E2E Tests:** Complete user journeys
- **Visual Regression:** Screenshot comparisons
- **Performance Tests:** Load time, response benchmarks
- **Security Tests:** OWASP Top 10 checks
- **Accessibility Tests:** WCAG 2.1 compliance

### Page Object Model

Clean separation between test logic and page interactions:

```
tests/
├── unit/               # Business logic tests
├── api/                # REST API tests
├── ui/                 # Playwright UI tests
│   ├── pages/          # Page Object Models
│   │   ├── home.py
│   │   ├── product.py
│   │   ├── cart.py
│   │   └── checkout.py
│   └── tests/
│       ├── test_shopping_flow.py
│       ├── test_search.py
│       └── test_checkout.py
├── e2e/                # End-to-end scenarios
├── visual/             # Visual regression tests
├── performance/        # Load time tests
├── security/           # Security scans
└── accessibility/      # A11y tests
```

## Performance Optimization

### Before vs After

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **Total Runtime** | 45 min | 8 min | 82% faster |
| **Parallel Workers** | 1 | 8 | 8x parallelization |
| **Flaky Test Rate** | 12% | <2% | 83% reduction |
| **CI Pipeline Time** | 55 min | 12 min | 78% faster |

### Key Optimizations

1. **Parallel Execution:** Run 8 tests simultaneously with `pytest-xdist`
2. **Smart Test Selection:** Only run affected tests on PRs
3. **Browser Context Reuse:** Share browser instances across tests
4. **Docker Layer Caching:** Reduce build time from 10min to 2min
5. **Artifact Caching:** Cache npm/pip dependencies

## Testing Coverage

### UI Testing (120 tests)

- Shopping cart operations
- Product search and filtering
- Checkout flow
- User authentication
- Order management
- Responsive design testing

### API Testing (85 tests)

- CRUD operations
- Authentication/authorization
- Payment processing
- Inventory management
- Order fulfillment
- Error handling

### Visual Regression (35 tests)

- Homepage layout
- Product pages
- Cart display
- Checkout flow
- Mobile responsiveness
- Cross-browser consistency

### Performance (20 tests)

- Page load times (<3s target)
- API response times (<500ms)
- Time to Interactive (TTI)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)

### Security (10 tests)

- SQL injection attempts
- XSS vulnerability scans
- CSRF protection
- Authentication bypass attempts
- Sensitive data exposure

### Accessibility (8 tests)

- WCAG 2.1 Level AA compliance
- Keyboard navigation
- Screen reader compatibility
- Color contrast ratios
- Form label associations

## CI/CD Pipeline

### 14-Job GitHub Actions Workflow

```yaml
name: E-Commerce Test Suite

jobs:
  lint: Run flake8, black, mypy
  unit-tests: Python 3.9, 3.10, 3.11
  api-tests: REST endpoint validation
  ui-tests-chrome: Playwright on Chrome
  ui-tests-firefox: Playwright on Firefox
  ui-tests-webkit: Playwright on WebKit (Safari)
  visual-regression: Screenshot comparisons
  performance-tests: Load time benchmarks
  security-scan: OWASP ZAP scanning
  accessibility-tests: axe-core checks
  e2e-tests: Full user journeys
  integration-tests: Service interactions
  coverage-report: Generate & upload to Codecov
  allure-report: Generate beautiful test reports
```

**Pipeline completes in <12 minutes with parallel execution**

## Page Object Model Example

```python
class ProductPage:
    def __init__(self, page):
        self.page = page
        self.add_to_cart_btn = page.locator('[data-testid="add-to-cart"]')
        self.quantity_input = page.locator('[data-testid="quantity"]')
        self.price_label = page.locator('[data-testid="price"]')
    
    async def add_to_cart(self, quantity=1):
        await self.quantity_input.fill(str(quantity))
        await self.add_to_cart_btn.click()
        await self.page.wait_for_selector('[data-testid="cart-success"]')
    
    async def get_price(self):
        return await self.price_label.text_content()

# Usage in tests
async def test_add_product_to_cart(page):
    product_page = ProductPage(page)
    await product_page.add_to_cart(quantity=2)
    # Clean, readable, maintainable!
```

## What Was Hard

### Reducing Flaky Tests

UI tests are inherently flaky. Solutions implemented:

- **Auto-waiting:** Playwright waits for elements automatically
- **Retry Logic:** Retry failed assertions up to 3 times
- **Smart Waits:** Wait for network idle, not arbitrary timeouts
- **Stable Selectors:** Use data-testid instead of CSS classes
- **Test Isolation:** Each test gets fresh browser context

Result: Flaky test rate dropped from 12% to <2%

### Parallel Execution Challenges

Running 278 tests in parallel caused issues:

- **Database conflicts:** Implemented test data isolation
- **Port collisions:** Dynamic port assignment for test servers
- **Resource exhaustion:** Limited to 8 parallel workers
- **Screenshot timing:** Added explicit waits for visual tests

### CI/CD Performance

Initial pipeline took 55 minutes. Optimizations:

- Parallel job execution across 14 jobs
- Docker layer caching
- npm/pip dependency caching
- Smart test selection (only affected tests)
- Browser binary caching

Result: Pipeline time reduced to <12 minutes

## Future Enhancements

- [ ] Add contract testing with Pact
- [ ] Implement chaos engineering tests
- [ ] Add load testing with k6
- [ ] Create self-healing tests (auto-fix selectors)
- [ ] Add AI-powered test generation
- [ ] Implement visual AI for better screenshot comparison

## Running the Tests

### Local Development

```bash
git clone https://github.com/JasonTeixeira/E-Commerce-Test-Suite.git
cd E-Commerce-Test-Suite

# Install dependencies
pip install -r requirements.txt
playwright install

# Run all tests
pytest tests/ -v

# Run specific test types
pytest tests/ui/ -v              # UI tests only
pytest tests/api/ -v             # API tests only
pytest tests/visual/ -v          # Visual regression

# Run with parallelization
pytest tests/ -n 8 -v            # 8 parallel workers

# Generate Allure report
pytest tests/ --alluredir=results
allure serve results
```

### Docker

```bash
docker-compose up --build
docker-compose run tests pytest tests/ -v
```

## Key Takeaways

- **Complete testing pyramid coverage** ensures quality at all levels
- **Parallel execution** is critical for fast feedback (82% faster)
- **Page Object Model** makes UI tests maintainable
- **Allure Reports** provide beautiful, actionable test results
- **CI/CD optimization** matters—fast pipelines encourage testing

---

## Documentation

- **Test Writing Guide:** [TESTING_GUIDE.md](https://github.com/JasonTeixeira/E-Commerce-Test-Suite/blob/main/TESTING_GUIDE.md)
- **CI/CD Setup:** [CI_CD.md](https://github.com/JasonTeixeira/E-Commerce-Test-Suite/blob/main/CI_CD.md)
- **Contributing:** [CONTRIBUTING.md](https://github.com/JasonTeixeira/E-Commerce-Test-Suite/blob/main/CONTRIBUTING.md)

## License

MIT - See LICENSE file for details
