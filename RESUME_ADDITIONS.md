# Resume Additions - 3 New Frameworks

Add these to your "Selected Projects" section in your resume, right after NexQuantSite:

---

## Test Data Management Framework

I built this because I got tired of manually setting up test data for integration tests. It generates realistic test data from your database schema using Faker, handles foreign key relationships, and cleans everything up automatically using transaction rollback. Works with PostgreSQL, MySQL, and MongoDB. The main challenge was handling cascade deletions properly and dealing with circular dependencies between tables. Stack: Python, SQLAlchemy, Faker, pytest.

---

## Visual Regression Testing Framework

Automated screenshot comparison tool using Playwright to capture screenshots across different browsers and OpenCV for pixel-by-pixel diffs. Handles responsive layouts and dark mode. I built this after getting frustrated with commercial tools that cost $200+/month for basic features. Biggest technical challenge was handling anti-aliasing differences between browsers and making the diff algorithm fast enough for CI pipelines. Stack: Python, Playwright, OpenCV, Pillow, pytest.

---

## Contract Testing Framework

Implementation of consumer-driven contract testing using Pact for microservices. Lets you test your services independently without spinning up the entire stack. Includes provider verification, versioning, and Pact Broker integration. Built this after dealing with too many "works on my machine" issues where services would break each other in production despite passing their own tests. Stack: Python, Pact, pytest, FastAPI, Docker.

---

**Instructions:**
1. Open your current resume in Word/Google Docs
2. Find the "Selected Projects" section
3. Add these 3 new entries after "NexQuantSite"
4. Keep the conversational tone - it sounds human and real
5. Save and export as PDF
