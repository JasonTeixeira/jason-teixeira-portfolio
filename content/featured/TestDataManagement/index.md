---
date: '0'
title: 'Test Data Management Framework'
cover: './demo.png'
github: 'https://github.com/JasonTeixeira/Test-Data-Management-Framework'
external: ''
tech:
  - Python
  - SQLAlchemy
  - Faker
  - PostgreSQL
  - MongoDB
  - Pandas
---

Framework for generating and managing test data in integration tests. Takes your database schema and generates realistic data using Faker, handles relationships between tables, and provides automatic cleanup via transaction rollback or cascade deletion. Supports PostgreSQL, MySQL, and MongoDB with connection pooling. The main problem this solves is the time spent manually creating test data - instead, you define what data you need and it generates it on the fly with proper cleanup.
