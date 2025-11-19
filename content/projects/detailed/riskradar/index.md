---
slug: 'riskradar'
title: 'RiskRadar'
subtitle: 'Portfolio Risk Analytics & Optimization Platform'
date: '2024-10-14'
status: 'Production - Daily Use'
github: 'https://github.com/JasonTeixeira/RiskRadar'
tech:
  - Next.js 14
  - FastAPI
  - PostgreSQL
  - NumPy/Pandas
  - Docker
metrics:
  portfolios: '2-3 Active'
  positions: '30-40'
  methods: 'VaR/CVaR/MC'
  optimization: 'Markowitz'
hero: './hero.png'
---

## Overview

Full-stack portfolio risk management platform calculating Value at Risk (VaR), CVaR, Sharpe ratios, and portfolio optimization using Modern Portfolio Theory. Used daily for managing 2-3 portfolios with 30-40 positions.

## Key Features

- Multiple VaR methods: Historical, Parametric, Monte Carlo
- Portfolio optimization: Mean-variance, risk parity, HRP
- Real-time calculations with Redis caching
- Multi-portfolio support
- Full-stack: Next.js + FastAPI + PostgreSQL

## What Was Hard

Monte Carlo simulations at scale, data quality from yfinance, portfolio optimization convergence, and WebSocket stability.

## Results

Used daily for real portfolio management with accurate risk metrics and optimization.
