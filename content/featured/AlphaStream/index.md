---
date: '4'
title: 'AlphaStream'
cover: './demo.png'
github: 'https://github.com/JasonTeixeira/AlphaStream'
external: ''
tech:
  - Python
  - TensorFlow
  - XGBoost
  - FastAPI
  - Redis
  - Docker
---

ML-driven trading signal platform with 200+ technical indicators, ensemble methods (Random Forest + XGBoost + LightGBM), and walk-forward backtesting. Achieved 1.8-2.4 Sharpe ratio in backtesting with 58-65% directional accuracy after transaction costs. FastAPI server with WebSocket streaming, Redis caching, and automated drift detection.

**The hard parts:** Fighting lookahead bias in feature engineering, handling transaction costs that killed theoretical edge, implementing model drift monitoring (models degrade fast in changing markets), optimizing NumPy calculations for <100ms signal latency. 6,000+ lines of production Python code.
