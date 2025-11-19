# AlphaStream - Architecture Diagrams (Mermaid Code)

## Diagram 1: System Architecture Overview

```mermaid
graph TB
    subgraph "Data Sources Layer"
        API[Market Data API]
        DB[(Historical Database)]
        CSV[CSV Files]
        FEED[Real-time Feed]
    end
    
    subgraph "Feature Engineering Layer"
        TECH[Technical Indicators<br/>200+ Features]
        VOL[Volume Metrics<br/>OBV, VWAP, MFI]
        PRICE[Price Patterns<br/>MA, RSI, MACD]
        STAT[Statistical Features]
    end
    
    subgraph "ML Pipeline Layer"
        XGB[XGBoost<br/>Primary Model]
        RF[Random Forest<br/>Baseline]
        LGB[LightGBM<br/>Fast Training]
        ENSEMBLE[Ensemble Voting<br/>Weighted Average]
        DRIFT[Drift Detection<br/>Auto-retrain]
    end
    
    subgraph "Backtesting Layer"
        WALK[Walk-forward Validation]
        COSTS[Transaction Costs<br/>0.1% per trade]
        SLIP[Slippage Modeling<br/>0.05% average]
        PERF[Performance Metrics<br/>Sharpe: 1.8-2.4]
    end
    
    subgraph "Production Layer"
        FAST[FastAPI Server<br/>REST + WebSocket]
        REDIS[(Redis Cache<br/>10x faster)]
        DOCKER[Docker Container]
        MONITOR[Monitoring<br/>Prometheus + Grafana]
    end
    
    API --> TECH
    DB --> TECH
    CSV --> TECH
    FEED --> TECH
    
    TECH --> XGB
    VOL --> RF
    PRICE --> LGB
    STAT --> XGB
    
    XGB --> ENSEMBLE
    RF --> ENSEMBLE
    LGB --> ENSEMBLE
    
    ENSEMBLE --> WALK
    WALK --> COSTS
    COSTS --> SLIP
    SLIP --> PERF
    
    ENSEMBLE --> FAST
    FAST --> REDIS
    FAST --> DOCKER
    DOCKER --> MONITOR
    
    DRIFT -.monitors.-> ENSEMBLE
    
    style API fill:#3b82f6
    style DB fill:#3b82f6
    style CSV fill:#3b82f6
    style FEED fill:#3b82f6
    
    style TECH fill:#10b981
    style VOL fill:#10b981
    style PRICE fill:#10b981
    style STAT fill:#10b981
    
    style XGB fill:#f59e0b
    style RF fill:#f59e0b
    style LGB fill:#f59e0b
    style ENSEMBLE fill:#f59e0b
    style DRIFT fill:#f59e0b
    
    style FAST fill:#ef4444
    style REDIS fill:#ef4444
    style DOCKER fill:#ef4444
    style MONITOR fill:#ef4444
```

**To use:** Copy this Mermaid code into:
- Markdown file (renders automatically on GitHub)
- Mermaid Live Editor: https://mermaid.live/
- Export as SVG or PNG from Mermaid Live

---

## Diagram 2: ML Pipeline Data Flow

```mermaid
flowchart TD
    START[Raw Market Data<br/>OHLCV + Volume] --> VALIDATE[Data Validation & Cleaning<br/>Handle gaps, splits, errors]
    
    VALIDATE --> FEATURE[Feature Engineering<br/>200+ Technical Indicators]
    
    FEATURE --> T1[Technical Indicators<br/>MA, RSI, MACD, Bollinger]
    FEATURE --> T2[Volume Metrics<br/>OBV, VWAP, MFI, CMF]
    FEATURE --> T3[Price Patterns<br/>Candlestick, Support/Resistance]
    FEATURE --> T4[Statistical Features<br/>Volatility, Correlation]
    
    T1 --> SELECT[Feature Selection<br/>Remove low-importance]
    T2 --> SELECT
    T3 --> SELECT
    T4 --> SELECT
    
    SELECT --> TRAIN[Model Training<br/>Walk-forward Validation]
    
    TRAIN --> M1[XGBoost<br/>Best single model]
    TRAIN --> M2[Random Forest<br/>Interpretable baseline]
    TRAIN --> M3[LightGBM<br/>Fast for large data]
    
    M1 --> ENS[Ensemble Voting<br/>Weighted: 0.5, 0.3, 0.2]
    M2 --> ENS
    M3 --> ENS
    
    ENS --> SIGNAL[Signal Generation]
    
    SIGNAL --> BUY[📈 Buy Signal<br/>confidence > 0.6]
    SIGNAL --> SELL[📉 Sell Signal<br/>confidence > 0.6]
    SIGNAL --> HOLD[⏸ Hold Signal<br/>confidence < 0.6]
    
    BUY --> BACKTEST[Backtesting with Costs]
    SELL --> BACKTEST
    HOLD --> BACKTEST
    
    BACKTEST --> COST1[Transaction Costs<br/>0.1% per trade]
    BACKTEST --> COST2[Slippage<br/>0.05% average]
    BACKTEST --> COST3[Execution Delays<br/>~100ms]
    
    COST1 --> METRICS[Performance Metrics]
    COST2 --> METRICS
    COST3 --> METRICS
    
    METRICS --> SHARP[📊 Sharpe Ratio: 1.8-2.4]
    METRICS --> WIN[✅ Win Rate: 58-65%]
    METRICS --> DRAW[📉 Max Drawdown: ~15%]
    
    style START fill:#3b82f6
    style VALIDATE fill:#3b82f6
    style FEATURE fill:#10b981
    style T1 fill:#10b981
    style T2 fill:#10b981
    style T3 fill:#10b981
    style T4 fill:#10b981
    style M1 fill:#f59e0b
    style M2 fill:#f59e0b
    style M3 fill:#f59e0b
    style ENS fill:#f59e0b
    style METRICS fill:#8b5cf6
    style SHARP fill:#10b981
    style WIN fill:#10b981
    style DRAW fill:#ef4444
```

---

## Diagram 3: Deployment Architecture

```mermaid
graph TB
    subgraph "Load Balancing"
        LB[Load Balancer<br/>nginx]
    end
    
    subgraph "Application Layer"
        API1[FastAPI Server 1<br/>Docker Container]
        API2[FastAPI Server 2<br/>Docker Container]
        API3[FastAPI Server 3<br/>Docker Container]
    end
    
    subgraph "ML Models"
        XGB[XGBoost Model<br/>.pkl file]
        RF[Random Forest<br/>.pkl file]
        LGB[LightGBM<br/>.pkl file]
    end
    
    subgraph "Caching Layer"
        REDIS[(Redis Cache<br/>Features + Predictions)]
    end
    
    subgraph "WebSocket Layer"
        WS[WebSocket Manager<br/>Real-time Signals]
        CONN1[Connected Client 1]
        CONN2[Connected Client 2]
        CONN3[Connected Client N]
    end
    
    subgraph "Data Layer"
        PG[(PostgreSQL<br/>Historical Data<br/>Backtest Results)]
    end
    
    subgraph "Monitoring Layer"
        PROM[Prometheus<br/>Metrics Collection]
        GRAF[Grafana<br/>Dashboards]
        ALERT[Alert Manager<br/>Slack Notifications]
    end
    
    LB --> API1
    LB --> API2
    LB --> API3
    
    API1 --> REDIS
    API2 --> REDIS
    API3 --> REDIS
    
    API1 --> XGB
    API1 --> RF
    API1 --> LGB
    
    API1 --> WS
    WS --> CONN1
    WS --> CONN2
    WS --> CONN3
    
    API1 --> PG
    API2 --> PG
    API3 --> PG
    
    API1 --> PROM
    API2 --> PROM
    API3 --> PROM
    
    PROM --> GRAF
    PROM --> ALERT
    
    style LB fill:#3b82f6
    style API1 fill:#10b981
    style API2 fill:#10b981
    style API3 fill:#10b981
    style REDIS fill:#ef4444
    style PG fill:#8b5cf6
    style PROM fill:#f59e0b
    style GRAF fill:#f59e0b
    style ALERT fill:#f59e0b
```

---

## How to Use These Diagrams

### Option 1: Render in Markdown (Easiest)
1. Copy the Mermaid code blocks
2. Paste into your markdown files
3. GitHub, GitLab, and many markdown renderers support Mermaid natively

### Option 2: Export as Images
1. Go to https://mermaid.live/
2. Paste the Mermaid code
3. Click "Export" → Download PNG or SVG
4. Save to your project folder

### Option 3: Use in Documentation Tools
- Docusaurus: Supports Mermaid natively
- Gatsby: Use `gatsby-remark-mermaid`
- MkDocs: Use `mkdocs-mermaid2-plugin`

### Styling Tips
- The color scheme matches your portfolio (blue → green → orange → red)
- Keep background transparent when exporting
- Export at 2x resolution for crisp display
- Use SVG format for best quality (scalable)

---

## Alternative: ASCII Art Version

If you prefer simple ASCII diagrams for documentation:

```
┌─────────────────────────────────────────────────────────┐
│                  AlphaStream Architecture                │
└─────────────────────────────────────────────────────────┘

 ┌──────────────┐
 │ Data Sources │ → Market API, Historical DB, CSV, Real-time
 └──────┬───────┘
        │
        ▼
 ┌──────────────────┐
 │ Feature Engineer │ → 200+ Technical Indicators
 └──────┬───────────┘
        │
        ▼
 ┌────────────────────┐
 │   ML Pipeline      │ → XGBoost, RF, LightGBM → Ensemble
 └──────┬─────────────┘
        │
        ▼
 ┌────────────────────┐
 │   Backtesting      │ → Walk-forward + Costs → Sharpe: 1.8-2.4
 └──────┬─────────────┘
        │
        ▼
 ┌────────────────────┐
 │   Production       │ → FastAPI + WebSocket + Redis + Docker
 └────────────────────┘
```

This ASCII version works great for README files and documentation!
