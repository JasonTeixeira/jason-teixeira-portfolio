---
title: 'Why 95% of ML Trading Systems Fail (And How to Be in the 5%)'
description: 'After building three trading systems and watching dozens fail, I've learned what separates profitable ML trading from expensive science experiments. Spoiler: It's not the model.'
date: '2024-11-19'
draft: false
slug: /pensieve/why-ml-trading-fails
featuredImage: './cover.jpg'
category: 'Machine Learning'
tags:
  - Machine Learning
  - Trading
  - Opinion
  - Quantitative Finance
  - System Design
---

I've built three algorithmic trading systems. Two failed spectacularly. One actually makes money.

I've also watched countless other teams burn millions building ML trading systems that either never made it to production, made it and lost money, or worked for three months then stopped working.

After seeing this pattern repeat, I've realized: **The model is rarely the problem.**

Let me explain what actually kills ML trading systems—and how to avoid becoming another statistic.

## The Uncomfortable Truth

Most ML trading systems don't fail because of bad models. They fail because of:
1. **Overfitting to historical data** 
2. **Ignoring transaction costs** 
3. **Data leakage** 
4. **Model drift** 
5. **Infrastructure that can't handle production** 

The actual machine learning is maybe 20% of the problem. The other 80% is engineering, risk management, and understanding market microstructure.

## Why Your Backtest is Lying

You train a model on 5 years of data. It achieves a 3.5 Sharpe ratio. You're convinced you've found the holy grail.

Then you deploy it.

Month 1: +2.3%  
Month 2: +0.8%  
Month 3: -4.1%  
Month 4: -2.7%  

**What happened?** Your model learned patterns that existed in training data but don't generalize.

## Transaction Costs Will Destroy You

My first system: 3.2 Sharpe in backtesting.

After adding transaction costs: 2.1 Sharpe  
After adding slippage: 1.4 Sharpe  
After adding execution delays: 0.9 Sharpe

From "holy grail" to "barely worth running" just by adding reality.

## What Actually Works

### 1. Start Simple
Don't start with transformers. Start with XGBoost on 10-20 features. Prove it works simply first.

### 2. Treat Backtesting Like Production
Walk-forward validation, realistic costs, stress tests on crashes.

### 3. Build Retraining From Day One
Your model will be outdated in 3 months. Plan for it.

### 4. Focus on Risk Management
Optimize for risk-adjusted returns, not maximum returns.

### 5. Run Small, Learn Fast
Bet $1K, not $100K. Learn what breaks with small money.

The model is the easy part. Everything else is the hard part.

---

**Related:** [AlphaStream Deep Dive](/pensieve/alphastream-ml-trading) | [GitHub](https://github.com/JasonTeixeira)
