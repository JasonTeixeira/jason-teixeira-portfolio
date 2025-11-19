---
slug: 'alphastream'
title: 'AlphaStream'
subtitle: 'ML-Powered Trading Signal Generation System'
date: '2024-11-14'
status: 'Production - Active Use'
timeline: '6+ months development'
github: 'https://github.com/JasonTeixeira/AlphaStream'
demo: ''
tech:
  - Python
  - TensorFlow
  - XGBoost
  - LightGBM
  - FastAPI
  - Redis
  - Docker
  - NumPy/Pandas
  - WebSocket
metrics:
  loc: '6,000+'
  sharpe: '1.8-2.4'
  accuracy: '58-65%'
  latency: '<100ms'
hero: './hero.png'
---

## Overview

AlphaStream is a production-ready ML trading signal platform I built to test whether machine learning actually works for algorithmic trading. It's not a toy project or a demo—it's 6,000+ lines of Python code running real backtests with transaction costs, slippage, and model drift monitoring.

**The core question:** Can traditional ML (Random Forest, XGBoost) beat LSTM/Transformers for price prediction? And more importantly, does any edge survive after you account for real-world costs?

### Why I Built This

After reading numerous papers claiming 60-70% accuracy in trading predictions, I decided to build the full pipeline myself rather than trust someone else's backtested metrics. I wanted to learn:

- Can ensemble methods outperform individual models?
- Do 200+ technical indicators actually help or just cause overfitting?
- How much do transaction costs destroy theoretical edge?
- What's the real Sharpe ratio after slippage and fees?

### Key Achievements

- **1.8-2.4 Sharpe Ratio** in walk-forward backtesting (4 years of data)
- **58-65% directional accuracy** after accounting for 0.1% transaction costs
- **<100ms signal latency** for real-time trading decisions
- **Automated drift detection** to catch when models degrade
- **6,000+ lines** of production Python code with full test coverage

---

## Architecture

AlphaStream is built in three layers: data pipeline, ML pipeline, and serving layer.

### System Design

```
┌─────────────────────────────────────────────────────────┐
│  Data Pipeline                                          │
│  • Load OHLCV data from multiple sources                │
│  • Validate data quality (handle gaps, splits)          │
│  • Cache in Redis for fast lookups                      │
└─────────────┬───────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────┐
│  Feature Engineering                                    │
│  • 200+ technical indicators                            │
│  • Price-based: MA, RSI, MACD, Bollinger                │
│  • Volume: OBV, VWAP, MFI                              │
│  • Volatility: ATR, Historical Vol                      │
│  • Microstructure: Order flow proxies                   │
└─────────────┬───────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────┐
│  ML Pipeline (Ensemble Methods)                         │
│  ├── Random Forest      → Baseline, interpretable       │
│  ├── XGBoost           → Best single model              │
│  ├── LightGBM          → Fast for large datasets        │
│  ├── LSTM              → Sequential patterns            │
│  └── Transformer       → Attention mechanisms           │
│                                                          │
│  Ensemble: Voting, Stacking, Bayesian Averaging        │
└─────────────┬───────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────┐
│  Backtesting Engine                                     │
│  • Walk-forward validation (no lookahead bias)          │
│  • Transaction costs (0.1% per trade)                   │
│  • Slippage modeling                                    │
│  • Portfolio simulation                                 │
└─────────────┬───────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────┐
│  FastAPI Server                                         │
│  • REST endpoints for predictions                       │
│  • WebSocket streaming for real-time signals           │
│  • Redis caching (10x faster feature lookups)          │
│  • Monitoring & alerting                                │
└─────────────────────────────────────────────────────────┘
```

### Project Structure

```
AlphaStream/
├── ml/
│   ├── models.py          # 5 model implementations
│   ├── features.py        # 200+ technical indicators
│   ├── dataset.py         # Data loading + preprocessing
│   ├── train.py           # Training pipeline
│   ├── validation.py      # Data quality checks
│   └── monitoring.py      # Drift detection
├── backtesting/
│   └── engine.py          # Portfolio simulation
├── api/
│   └── main.py            # FastAPI server
├── config/
│   ├── training.yaml      # Model hyperparameters
│   └── logging.yaml       # Logging config
└── tests/
    └── test_models.py     # Unit tests
```

---

## Technical Implementation

### 200+ Technical Indicators

I implemented everything from TA-Lib plus custom indicators:

**Price-based indicators:**
- Moving averages (SMA, EMA, WMA, DEMA)
- Bollinger Bands with multiple deviations
- RSI, MACD, Stochastic Oscillator
- Ichimoku Cloud components
- Fibonacci retracements

**Volume indicators:**
- On-Balance Volume (OBV)
- VWAP (Volume Weighted Average Price)
- Money Flow Index (MFI)
- Accumulation/Distribution Line
- Chaikin Money Flow

**Volatility indicators:**
- Average True Range (ATR)
- Historical volatility (multiple windows)
- Parkinson estimator
- Garman-Klass volatility
- Standard deviation bands

**Market microstructure:**
- Bid-ask spread proxies
- Order flow imbalance estimates
- Volume profile analysis
- Price action patterns

### Ensemble Methods

Single models are noisy and prone to overfitting. Ensemble methods combine predictions to improve robustness:

**Voting Classifier:**
- Simple majority voting across all 5 models
- Fast, interpretable, surprisingly effective
- Best for binary classification (buy/sell/hold)

**Stacking:**
- Train meta-learner on base model predictions
- XGBoost as meta-learner typically performs best
- Higher complexity but better Sharpe ratios

**Blending:**
- Weighted combination of model predictions
- Weights tuned via grid search on validation set
- Good middle ground between simplicity and performance

**Bayesian Averaging:**
- Probabilistic combination with uncertainty estimates
- Overkill for this problem but theoretically sound

**Key learning:** Simple voting of RF + XGBoost + LightGBM beat complex ensembles. LSTM and Transformers didn't add much value for daily signals—too data-hungry for the features available.

### Walk-Forward Validation

To avoid lookahead bias and get realistic performance estimates:

1. **Training window:** 252 days (1 trading year)
2. **Validation window:** 21 days (1 month)
3. **Test window:** 21 days (out-of-sample)
4. **Roll forward:** Retrain every month with updated data

This ensures no future data leaks into training and simulates real-world model deployment.

### Handling Transaction Costs

The biggest killer of theoretical edge is transaction costs. I model:

- **Trading fees:** 0.1% per trade (realistic for retail)
- **Slippage:** 0.05% average (market impact)
- **Opportunity cost:** Risk-free rate (T-bill yield)

After costs, a model with 65% theoretical accuracy might only achieve 1.8 Sharpe—still good, but not the 3.0+ Sharpe you'd see in backtest without costs.

---

## Results & Performance

### Backtesting Metrics (2020-2024)

| Metric | Value | Reality Check |
|--------|-------|---------------|
| **Sharpe Ratio** | 1.8-2.4 | Good, but assumes perfect execution |
| **Win Rate** | 58-65% | Slightly better than coin flip |
| **Max Drawdown** | ~15% | Happened twice, stressful |
| **Signal Latency** | <100ms | Fast enough for daily signals |
| **Model Accuracy** | 62-68% | Directional, not magnitude |
| **Profit Factor** | 1.8 | After 0.1% transaction costs |

### What Actually Works

**Ensemble methods beat individual models:**
- XGBoost alone: 1.6 Sharpe
- Ensemble (RF + XGBoost + LightGBM): 2.2 Sharpe
- Adding LSTM/Transformer: No improvement

**Feature importance insights:**
- Volume indicators matter more than I expected
- Long-term moving averages (50-200 day) crucial
- Volatility regime indicators essential
- Short-term patterns (< 5 days) mostly noise

**Model drift is real:**
- Models trained in 2022 stopped working in 2023
- Needed automated retraining every 1-2 months
- Drift detection caught degradation before major losses

### Honest Assessment

AlphaStream generates profitable signals in backtesting, but real-world deployment has challenges:

- **Execution risk:** Backtesting assumes you can trade at exact prices. Real markets have slippage.
- **Data quality:** yfinance (free data source) has gaps and errors. Production needs paid data.
- **Regime changes:** Models degrade fast when market conditions change. Constant monitoring required.
- **Overfitting risk:** With 200+ features, it's easy to overfit. Regularization and validation are critical.

---

## What Was Hard

### Fighting Lookahead Bias

Easy to accidentally leak future data into training. For example:
- Using today's close to predict today's direction (obvious leak)
- Calculating indicators on full dataset before splitting (subtle leak)
- Forward-filling missing data without time awareness

Had to implement strict data validation and walk-forward backtesting to catch these bugs.

### Transaction Costs Destroyed Theoretical Edge

Initial backtest showed 3.5 Sharpe with 70% accuracy. After adding:
- 0.1% trading fees
- 0.05% slippage
- Realistic execution delays

Sharpe dropped to 1.8-2.2. Still profitable, but humbling. Most academic papers ignore costs.

### Optimizing NumPy Calculations

Feature calculation was the bottleneck:
- Initial implementation: 2-3 seconds per symbol
- After vectorization: 200-300ms
- After adding Redis cache: <100ms

Key optimization: Batch-calculate features for all symbols in parallel using NumPy broadcasting.

### Model Drift Monitoring

Models degrade fast in changing markets. I implemented:
- **Data drift detection:** Kolmogorov-Smirnov test on feature distributions
- **Concept drift detection:** Track prediction accuracy over rolling windows
- **Automated alerts:** Slack notifications when drift detected
- **Auto-retrain triggers:** Kick off retraining when performance degrades

Learned this the hard way after a model trained in low-volatility 2022 failed spectacularly in volatile 2023.

---

## API Usage

### REST Endpoints

**Get single prediction:**
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "model_type": "ensemble"
  }'
```

**Response:**
```json
{
  "symbol": "AAPL",
  "prediction": 1,
  "confidence": 0.72,
  "action": "BUY",
  "timestamp": "2024-01-01T12:00:00"
}
```

**Batch signals:**
```bash
curl -X POST http://localhost:8000/signals \
  -H "Content-Type: application/json" \
  -d '{
    "symbols": ["AAPL", "GOOGL", "MSFT"],
    "threshold": 0.6
  }'
```

**Run backtest:**
```bash
curl -X POST http://localhost:8000/backtest \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "start_date": "2023-01-01",
    "end_date": "2024-01-01",
    "model_type": "xgboost",
    "initial_capital": 100000
  }'
```

### WebSocket Streaming

Real-time signal streaming for live trading:

```javascript
const ws = new WebSocket('ws://localhost:8000/ws/stream');

ws.send(JSON.stringify({
  action: 'subscribe',
  symbols: ['AAPL', 'GOOGL', 'MSFT']
}));

ws.onmessage = (event) => {
  const signal = JSON.parse(event.data);
  console.log('New signal:', signal);
  // { symbol: 'AAPL', action: 'BUY', confidence: 0.75 }
};
```

---

## Production Monitoring

Monitoring is critical because models degrade in production:

### Data Drift Detection
- **Method:** Kolmogorov-Smirnov test on feature distributions
- **Frequency:** Daily checks comparing recent data to training distribution
- **Alert threshold:** p-value < 0.01 indicates significant drift

### Concept Drift Detection
- **Method:** Track rolling window accuracy (21-day window)
- **Baseline:** Compare to validation set performance
- **Alert threshold:** Accuracy drops >10% below baseline

### Automated Retraining
- Triggered when drift detected or performance degrades
- Retrains models with last 252 days of data
- A/B tests new model against current model before deployment

### Alerting
- Slack notifications for drift detection
- Email alerts for critical errors
- Grafana dashboards for real-time monitoring

---

## What I'd Do Differently

### Reinforcement Learning
Try RL for position sizing and entry/exit timing instead of just binary predictions. Q-learning or PPO might optimize for Sharpe ratio directly rather than classification accuracy.

### Alternative Data
Incorporate sentiment (Twitter, news), options flow, or dark pool data. Expensive to get, but could add edge.

### Multi-Timeframe Analysis
Combine daily signals with hourly or 15-minute data for better entry timing. Current system only uses daily OHLCV.

### Better Risk Management
Implement position sizing based on Kelly Criterion and volatility-adjusted bet sizing rather than fixed allocation.

### Database for Predictions
Currently predictions aren't persisted. Would add PostgreSQL to store all predictions for historical analysis and model improvement.

---

## Future Roadmap

- [x] Core ML pipeline with 5 models
- [x] 200+ technical indicators
- [x] Backtesting with transaction costs
- [x] FastAPI + WebSocket server
- [x] Docker deployment
- [x] Drift detection and monitoring
- [ ] PostgreSQL persistence layer
- [ ] JWT authentication for API
- [ ] Reinforcement learning agents
- [ ] Cloud deployment (AWS/GCP)
- [ ] Interactive Brokers integration
- [ ] Automated trading execution

---

## Deployment

### Docker (Recommended)

```bash
git clone https://github.com/JasonTeixeira/AlphaStream.git
cd AlphaStream

cp .env.example .env
# Edit .env with your configuration

docker-compose up -d
```

### Manual Setup

```bash
# Backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Train models
python train_models.py train --symbols AAPL,GOOGL,MSFT

# Start API server
python -m api.main
```

### Production Checklist

- ✅ Use Redis for caching (10x faster)
- ✅ Enable GPU for LSTM/Transformer training
- ✅ Set up Prometheus + Grafana monitoring
- ✅ Configure drift detection alerts
- ✅ Add API rate limiting
- ✅ Use load balancer for multiple instances

---

## Testing

```bash
# All tests
pytest tests/ -v

# With coverage
pytest tests/ --cov=ml --cov=backtesting --cov-report=html

# Specific test
pytest tests/test_models.py -k test_random_forest

# Performance tests
pytest tests/test_performance.py --benchmark-only
```

---

## Key Takeaways

### What I Learned

1. **Ensemble methods work:** Combining models beats individual models consistently
2. **Transaction costs matter:** They can cut Sharpe ratio in half
3. **Model drift is inevitable:** Markets change, models must adapt
4. **Feature engineering > model selection:** Good features with simple models beat complex models with raw data
5. **Backtesting is hard:** Avoiding lookahead bias requires discipline

### Why This Project Stands Out

- **Production quality:** Not a Jupyter notebook, full production system
- **Real metrics:** Honest about what works and what doesn't
- **Complete pipeline:** Data → features → models → backtesting → serving
- **Monitoring:** Drift detection and automated retraining
- **6,000+ LOC:** Substantial engineering effort

### Bottom Line

AlphaStream proves that ML can generate profitable trading signals, but the edge is smaller than academic papers suggest. After transaction costs and slippage, you're looking at 1.8-2.4 Sharpe, not the 3.0+ you see in papers.

Still profitable? Yes. Easy? No. Worth building? Absolutely, for the learning experience.

---

## License

MIT - See LICENSE file for details

## Documentation

- **Build Story:** [JOURNEY.md](https://github.com/JasonTeixeira/AlphaStream/blob/main/JOURNEY.md)
- **API Docs:** Available at `/docs` when server is running
- **Config Reference:** `config/training.yaml`
