# Jason Teixeira

**Test Automation Architect** | Building frameworks teams actually want to use

I build testing and automation systems for complex distributed environments—mostly focused on solving problems I've hit in my own work. Spent the last few years in quantitative trading and cloud infrastructure, where downtime costs money per second, not per hour.

🌐 **Portfolio:** [jasonteixeira.com](https://jasonteixeira.com)  
📧 **Email:** sage@sageideas.org  
💼 **LinkedIn:** [linkedin.com/in/jason-teixeira](https://linkedin.com/in/jason-teixeira)

---

## What I Do

I specialize in test automation for systems where "it works on my machine" isn't good enough. That means:

- **E2E & Integration Testing** - Frameworks that run in CI/CD without flaking
- **Performance & Load Testing** - Finding bottlenecks before production does
- **Visual Regression Testing** - Catching UI bugs computers are better at spotting than humans
- **Contract Testing** - Letting microservices deploy independently without breaking each other
- **Test Data Management** - Generating realistic data without manually setting up fixtures

My approach: automate first, document obsessively, build systems that don't wake you up at 2 AM.

---

## Featured Automation Frameworks

### [Test Data Management Framework](https://github.com/JasonTeixeira/Test-Data-Management-Framework)
Generates realistic test data from database schemas. Handles foreign key relationships and cleans up automatically via transaction rollback. Built this after spending too much time manually creating data for integration tests.

**Stack:** Python, SQLAlchemy, Faker, pytest  
**Supports:** PostgreSQL, MySQL, MongoDB

### [Visual Regression Testing Framework](https://github.com/JasonTeixeira/Visual-Regression-Framework)
Automated screenshot comparison across browsers using Playwright and OpenCV. Main challenge was handling anti-aliasing differences between browsers and making the diff algorithm fast enough for CI pipelines.

**Stack:** Python, Playwright, OpenCV, Pillow, pytest  
**Features:** Multi-browser, responsive testing, dark mode support

### [Contract Testing Framework](https://github.com/JasonTeixeira/Contract-Testing-Framework)
Consumer-driven contract testing for microservices using Pact. Lets services test independently without needing the full stack. Addresses the "all tests pass but prod breaks" problem.

**Stack:** Python, Pact, pytest, FastAPI, Docker  
**Features:** Provider verification, versioning, Pact Broker integration

### [E2E Testing Framework](https://github.com/JasonTeixeira/Qa-Automation-Project)
Page Object Model implementation with custom driver factory, screenshot helpers, and config management. Designed for teams that need tests to run reliably in CI/CD.

**Stack:** Python, Selenium, pytest  
**Features:** Multi-browser, parallel execution, detailed reporting

### [API Testing Framework](https://github.com/JasonTeixeira/API-Testing-Framework)
Complete REST API testing framework with FastAPI backend for testing. Includes authentication, request chaining, and response validation. Built to demonstrate API testing best practices.

**Stack:** Python, FastAPI, pytest, Requests  
**Features:** Token auth, database fixtures, comprehensive assertions

### [Performance Testing Framework](https://github.com/JasonTeixeira/Performance-Testing-Framework)
Load testing framework using Locust for distributed testing scenarios. Includes custom test scenarios, real-time metrics, and integration with monitoring systems.

**Stack:** Python, Locust, Grafana  
**Features:** Distributed execution, custom scenarios, metrics export

---

## Technical Background

**Primary Languages:** Python, JavaScript/TypeScript, SQL, Bash  
**Testing & Automation:** pytest, Playwright, Selenium, Locust, Pact, TestContainers  
**Cloud & Infrastructure:** AWS, GCP, Azure, Kubernetes, Docker, Terraform  
**CI/CD:** GitHub Actions, GitLab CI, Jenkins, Docker, Helm  
**Databases:** PostgreSQL, MongoDB, Redis, DynamoDB  

**Specialized In:**
- Building test frameworks from scratch
- Integrating testing into CI/CD pipelines
- Performance testing at scale
- Test data management strategies
- Microservices testing patterns

---

## Background

Started at Home Depot as a systems specialist, where I automated myself out of manual deployments and repetitive work. Learned Python not to "become a developer," but to stop answering the same tickets twice.

That led me into cloud infrastructure and test automation—building frameworks teams wanted to use, reducing deployment times from hours to minutes, and eventually landing in quantitative finance where I found my niche.

Currently at HighStrike, building high-performance distributed systems for algorithmic trading. When your systems process $10M+ daily volume, you learn to test things thoroughly.

---

## Current Focus

**Building:**
- API testing framework with automatic contract generation
- Chaos engineering tools for distributed systems
- Performance monitoring automation

**Learning:**
- Rust for high-performance testing tools
- Advanced Kubernetes testing patterns
- Property-based testing approaches

**Interested In:**
- Senior/Staff test automation roles
- Building testing infrastructure at scale
- Remote or hybrid positions
- Companies serious about test automation (not just manual QA with Selenium)

---

## Open Source

All my testing frameworks are open source. If you find them useful, feel free to use them, fork them, or contribute. I try to respond to issues within 24-48 hours.

**Looking for contributors on:**
- Visual regression framework optimization
- Contract testing documentation
- Performance testing examples

---

## Let's Connect

Always happy to talk about test automation, distributed systems, or solving interesting testing challenges.

📧 **Email:** sage@sageideas.org  
💼 **LinkedIn:** [linkedin.com/in/jason-teixeira](https://linkedin.com/in/jason-teixeira)  
🌐 **Portfolio:** [jasonteixeira.com](https://jasonteixeira.com)

**I'm currently open to:**
- Senior/Staff Test Automation Engineer roles
- Automation Architect positions
- Remote or hybrid opportunities
- Contract/consulting for testing infrastructure

---

_Building systems that don't break at 2 AM_ ⚡
