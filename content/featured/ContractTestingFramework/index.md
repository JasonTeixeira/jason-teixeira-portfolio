---
date: '2'
title: 'Contract Testing Framework'
cover: './demo.png'
github: 'https://github.com/JasonTeixeira/Contract-Testing-Framework'
external: ''
tech:
  - Python
  - Pact
  - Pytest
  - FastAPI
  - Docker
  - PostgreSQL
---

Consumer-driven contract testing implementation using Pact. Lets microservices test their interactions independently without needing the full environment running. Provider verification happens separately, so services can deploy independently as long as they meet the contract. Includes contract versioning, Pact Broker integration for contract storage, and pytest fixtures for easy test setup. Addresses the common problem where services break each other in production despite all tests passing.
