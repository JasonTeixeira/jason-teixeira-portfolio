---
title: 'I Built a Trading Algorithm. It Actually Works. Kind Of.'
description: 'Six months building an ML trading system taught me that backtests lie, transaction costs hurt, and XGBoost beats transformers every time'
date: '2024-11-15'
draft: false
slug: /pensieve/alphastream-ml-trading
featuredImage: './cover.jpg'
category: 'Machine Learning'
tags:
  - Python
  - TensorFlow
  - XGBoost
  - Machine Learning
  - Trading
  - FastAPI
---

So here's the deal: I spent six months building AlphaStream, a machine learning trading system that I was convinced would print money. The results? A 1.8-2.4 Sharpe ratio in backtesting. Which sounds impressive until you realize that's AFTER I added all the fees, slippage, and real-world costs that academic papers conveniently forget to mention.

Let me tell you what actually happened.

[View Project on GitHub](https://github.com/JasonTeixeira/AlphaStream) | [Full Project Details](/projects/alphastream)

## Why I Even Started This

I got tired of reading papers claiming 70% accuracy in price prediction. Every single one had perfect backtests and incredible Sharpe ratios. But then you look at the methodology section and notice they're using tomorrow's close price to predict today's direction. Or they're training on the full dataset before splitting. Or they just... don't mention transaction costs at all.

I wanted to build the whole thing myself—data pipeline, feature engineering, model training, backtesting, deployment—and see if any edge actually survives contact with reality.

Spoiler: Some does. But way less than you'd think.

## The Initial Plan (That Changed Completely)

My original idea was simple: throw 200 technical indicators at a Random Forest, backtest it, and call it done. Two weeks, tops.

Six months later, I had 6,000+ lines of Python code, five different ML models, an automated drift detection system, and a FastAPI server streaming real-time signals via WebSocket.

Funny how projects grow when you actually start building them.

## What I Built

AlphaStream ended up being way more complex than I planned:

**Data layer:** Pulling OHLCV data from multiple sources, validating it (you'd be shocked how many gaps and errors exist in "clean" financial data), and caching everything in Redis because hitting APIs for 200+ indicators on every request is a great way to wait forever.

**Feature engineering:** 200+ technical indicators. Moving averages, RSI, MACD, Bollinger Bands, volume indicators, volatility measures—basically everything I could find in TA-Lib plus some custom ones I built. Did I need all 200? Probably not. But feature selection is a problem for Future Me.

**ML pipeline:** Random Forest (baseline), XGBoost (spoiler: this won), LightGBM (fast but not better), LSTM (data-hungry and disappointing), and Transformers (even more data-hungry and even more disappointing). Then ensemble them all together because apparently I hate having free time.

**Backtesting engine:** Walk-forward validation with transaction costs, slippage, and execution delays. This is where most projects fall apart because reality is painful.

**Production server:** FastAPI with REST endpoints and WebSocket streaming. Redis caching made feature lookups 10x faster. Monitoring and alerting so I know when the model starts failing.

## The Part Where My Initial Backtest Was a Lie

Initial results: 3.5 Sharpe ratio. 70% win rate. I'm thinking "holy shit, I'm a genius."

Then I add 0.1% transaction costs.

Then 0.05% slippage.

Then execution delays (because you don't get filled at exactly the close price in real life).

New Sharpe: 1.8.

This is the part where most academic papers would just... not mention the costs. But I'm telling you: HALF MY EDGE DISAPPEARED from fees and slippage alone. The other half probably disappeared from things I haven't even thought of yet.

Still profitable? Yes. Still humbling? Very.

## What Actually Worked (And What Didn't)

### XGBoost Beat Everything

I spent weeks implementing LSTM and Transformer models because that's what all the cool kids on Reddit use. Spent hours tuning hyperparameters. Threw more compute at them.

Turns out gradient boosting (specifically XGBoost) beat them every single time. And it trains in minutes instead of hours.

Results:
- XGBoost alone: 1.6 Sharpe
- Simple ensemble (RF + XGBoost + LightGBM voting): 2.2 Sharpe  
- Adding LSTM/Transformers to the ensemble: No improvement. Sometimes worse.

The boring solution won. Again.

### Volume Indicators Matter More Than I Expected

Everyone focuses on price-based indicators. RSI, MACD, moving averages. But after looking at feature importance, volume indicators consistently ranked in the top 10. OBV, VWAP, and MFI were surprisingly predictive.

Also, longer-term moving averages (50-200 day) mattered way more than short-term patterns. Anything under 5 days was basically noise.

### Model Drift Is Real and Expensive

October 2023. I wake up to Slack notifications—the model's down 8% for the week. No errors in the logs. Everything's running fine. The model is just... wrong now.

That's when I learned about model drift the hard way. Models trained on 2022 data completely fell apart in 2023. Markets changed. My model didn't.

Now I retrain monthly. It's annoying. It's necessary. I built an automated system because manually retraining every month is soul-crushing.

Drift detection is like having a smoke alarm—you don't appreciate it until your house is on fire.

## Technical Challenges That Consumed My Life

### Fighting Lookahead Bias

It's SO EASY to accidentally leak future data into your training set. I caught myself doing this at least five times:

1. Calculating indicators on the full dataset before splitting train/test
2. Using today's close to predict today's direction (you don't know the close until the day is over)
3. Forward-filling missing data without being time-aware
4. Accidentally including tomorrow's open in today's features

The solution: paranoid data validation and walk-forward backtesting. Test every feature. Check every calculation. Trust nothing.

### Optimizing NumPy When You're Not a NumPy Expert

Feature calculation was the bottleneck. Initial implementation: 2-3 seconds per symbol. That's way too slow when you're analyzing hundreds of stocks.

I spent two weeks trying to parallelize this in pure Python. Thread pools, multiprocessing, all of it. Still slow.

Then my coworker suggested vectorizing it with NumPy. One afternoon later: 200-300ms per symbol. Adding Redis caching got it under 100ms.

Sometimes the solution is embarrassingly simple and you just didn't know it existed.

### When Transaction Costs Destroy Your Entire Strategy

Here's something nobody tells you: transaction costs aren't just a minor adjustment. They fundamentally change which strategies work.

A strategy that trades daily and has a 1% edge per trade loses to a strategy that trades weekly with a 0.5% edge because you're not paying fees four times as often.

After I added costs, I had to completely rethink my entry/exit logic. Some strategies that looked amazing became unprofitable. Others I had dismissed suddenly made sense.

## The Real Results (Honest Assessment)

Let's talk numbers. After 4 years of walk-forward backtesting (2020-2024):

- **Sharpe Ratio:** 1.8-2.4 (assuming perfect execution, which never happens)
- **Win Rate:** 58-65% (barely better than a coin flip)
- **Max Drawdown:** ~15% (happened twice, both times stressful)
- **Signal Latency:** <100ms (fast enough for daily signals)
- **Profit Factor:** 1.8 after transaction costs

Is this good? Depends who you ask. Compared to academic papers? Terrible. Compared to reality? Pretty decent.

## What Doesn't Make It Into the Backtest

Here's what I know will break in production that I haven't solved yet:

**Execution risk:** I'm assuming I can buy/sell at exact prices. Real markets have slippage, especially for larger sizes.

**Data quality:** Free data has gaps. Sometimes exchanges go down. APIs return errors. Production needs paid, reliable data.

**Regime changes:** The market that worked in 2023 might be completely different in 2024. Models degrade. Fast.

**Overfitting:** With 200+ features, I'm probably overfit to some degree. I just don't know how much yet.

**Black swan events:** The backtest doesn't include March 2020. Or any flash crashes. Those are... not fun.

## What I'd Do Differently

If I were starting over (which I probably will eventually):

**Try reinforcement learning.** Instead of predicting binary up/down, train an RL agent to maximize Sharpe ratio directly. Q-learning or PPO could optimize position sizing and entry/exit timing simultaneously.

**Alternative data.** Incorporate sentiment analysis (Twitter, news), options flow, or dark pool data. Expensive, but might provide edge that pure price data doesn't.

**Multi-timeframe.** Combine daily signals with hourly or 15-minute data for better entry timing. Right now I'm only using daily bars.

**Start simpler.** I overcomplicated everything. 200 features is probably 150 too many. Next time: start with 10 good features, prove it works, then add more.

## What I Actually Learned

Look, I didn't build the next Renaissance Technologies. But I did learn a bunch of stuff that academics don't tell you:

**Ensemble methods beat individual models.** Combining predictions from RF + XGBoost + LightGBM consistently outperformed any single model. The improvement wasn't huge, but it was consistent.

**Transaction costs can cut your Sharpe in half.** Maybe more. Anyone not including costs in their backtest is lying to you (or themselves).

**Feature engineering matters more than model selection.** Good features with Random Forest beat bad features with a Transformer. Every time.

**Backtesting is deceptively hard.** Avoiding lookahead bias requires constant vigilance. It's so easy to mess up.

**Model drift is inevitable.** Markets change. Your model won't. Plan for retraining from day one.

**The boring solution often works best.** XGBoost + simple ensemble beat fancy architectures. Vectorized NumPy beat complex parallelization. Sometimes you don't need to be clever.

## The Bottom Line

Does ML work for trading? Yes. Kind of. If you're careful about costs, realistic about execution, paranoid about data leakage, and humble about your Sharpe ratio.

After six months and 6,000+ lines of code, I have a system that generates profitable signals in backtesting. The Sharpe is 1.8-2.4, not the 3.0+ you see in papers. The win rate is 58-65%, not 70%. And I have zero idea if this actually works in production because I haven't deployed it with real money yet.

But you know what? I learned more building this than I did reading 50 papers. And I can confidently say I understand algorithmic trading now—both the theory AND the reality.

Worth it? Absolutely.

Would I do it again? Ask me after I actually deploy this thing.

## Related Projects

Want to see more technical deep dives?
- [NexQuantSite: Building a 590K LOC Trading Platform](/pensieve/nexquantsite-590k-loc)
- [RiskRadar: Portfolio Risk Analytics](/projects/riskradar)

Questions? Spot a bug in my logic? [Open an issue on GitHub](https://github.com/JasonTeixeira/AlphaStream) or check out the [full technical docs](/projects/alphastream).
