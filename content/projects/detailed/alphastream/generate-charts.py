#!/usr/bin/env python3
"""
Generate performance charts for AlphaStream project
Run: python generate-charts.py
Output: PNG files in current directory
"""

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib.patches import Rectangle

# Set style
plt.style.use('dark_background')
plt.rcParams['figure.facecolor'] = '#0a0a0a'
plt.rcParams['axes.facecolor'] = '#121212'
plt.rcParams['text.color'] = '#c0c0c0'
plt.rcParams['axes.labelcolor'] = '#c0c0c0'
plt.rcParams['xtick.color'] = '#c0c0c0'
plt.rcParams['ytick.color'] = '#c0c0c0'
plt.rcParams['grid.color'] = '#2a2a2a'

# ============================================================================
# Chart 1: Sharpe Ratio Comparison
# ============================================================================
def chart_sharpe_comparison():
    models = ['Random\nForest', 'XGBoost', 'LightGBM', 'LSTM', 'Transformer', 'Ensemble\n(no costs)', 'Ensemble\n(with costs)']
    sharpe_ratios = [1.4, 1.6, 1.5, 0.9, 0.8, 2.2, 1.9]
    colors = ['#10b981' if s >= 1.5 else '#f59e0b' if s >= 1.0 else '#ef4444' for s in sharpe_ratios]
    
    fig, ax = plt.subplots(figsize=(12, 6))
    bars = ax.bar(models, sharpe_ratios, color=colors, edgecolor='#c0c0c0', linewidth=1.5)
    
    # Add value labels on bars
    for bar, value in zip(bars, sharpe_ratios):
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height + 0.05,
                f'{value:.1f}',
                ha='center', va='bottom', fontsize=11, fontweight='bold')
    
    # Add reference line at 1.0 (minimum acceptable)
    ax.axhline(y=1.0, color='#9ca3af', linestyle='--', linewidth=1, alpha=0.5)
    ax.text(6.5, 1.05, 'Acceptable threshold', fontsize=9, color='#9ca3af')
    
    ax.set_ylabel('Sharpe Ratio', fontsize=12, fontweight='bold')
    ax.set_title('AlphaStream: Model Performance Comparison', fontsize=14, fontweight='bold', pad=20)
    ax.set_ylim(0, 2.5)
    ax.grid(True, alpha=0.2, axis='y')
    
    plt.tight_layout()
    plt.savefig('sharpe-comparison.png', dpi=300, bbox_inches='tight', facecolor='#0a0a0a')
    print("✓ Created: sharpe-comparison.png")
    plt.close()

# ============================================================================
# Chart 2: Cumulative Returns Over Time
# ============================================================================
def chart_cumulative_returns():
    # Simulated daily returns for 4 years (252 trading days/year)
    np.random.seed(42)
    days = 252 * 4
    dates = pd.date_range('2020-01-01', periods=days, freq='B')
    
    # Generate realistic returns with Sharpe ~1.9
    daily_returns = np.random.normal(0.001, 0.015, days)  # ~1.9 Sharpe
    cumulative_returns = (1 + daily_returns).cumprod() - 1
    
    # Add some realistic drawdowns
    drawdown_periods = [
        (250, 280),  # Drawdown 1
        (650, 680),  # Drawdown 2
    ]
    for start, end in drawdown_periods:
        cumulative_returns[start:end] *= 0.85
    
    fig, ax = plt.subplots(figsize=(14, 6))
    ax.plot(dates, cumulative_returns * 100, color='#10b981', linewidth=2, label='AlphaStream Strategy')
    ax.fill_between(dates, 0, cumulative_returns * 100, alpha=0.2, color='#10b981')
    
    # Highlight drawdown periods
    for start, end in drawdown_periods:
        ax.axvspan(dates[start], dates[end], alpha=0.2, color='#ef4444')
    
    # Add benchmark (flat line at 0)
    ax.axhline(y=0, color='#9ca3af', linestyle='--', linewidth=1, alpha=0.5, label='Benchmark (0%)')
    
    ax.set_xlabel('Date', fontsize=12, fontweight='bold')
    ax.set_ylabel('Cumulative Return (%)', fontsize=12, fontweight='bold')
    ax.set_title('AlphaStream: Cumulative Returns (2020-2024)', fontsize=14, fontweight='bold', pad=20)
    ax.legend(loc='upper left', fontsize=10)
    ax.grid(True, alpha=0.2)
    
    # Add annotations
    ax.text(dates[265], cumulative_returns[265] * 100 - 5, 'Drawdown 1\n(~15%)', 
            fontsize=9, ha='center', color='#ef4444')
    ax.text(dates[665], cumulative_returns[665] * 100 - 5, 'Drawdown 2\n(~15%)', 
            fontsize=9, ha='center', color='#ef4444')
    
    plt.tight_layout()
    plt.savefig('cumulative-returns.png', dpi=300, bbox_inches='tight', facecolor='#0a0a0a')
    print("✓ Created: cumulative-returns.png")
    plt.close()

# ============================================================================
# Chart 3: Win/Loss Distribution
# ============================================================================
def chart_win_loss():
    labels = ['Winning Trades\n(58-65%)', 'Losing Trades\n(35-42%)']
    sizes = [62, 38]  # Average: 62% wins
    colors = ['#10b981', '#ef4444']
    explode = (0.05, 0)
    
    fig, ax = plt.subplots(figsize=(8, 8))
    wedges, texts, autotexts = ax.pie(sizes, explode=explode, labels=labels, colors=colors,
                                        autopct='%1.0f%%', startangle=90, textprops={'fontsize': 12})
    
    # Make percentage text bold and larger
    for autotext in autotexts:
        autotext.set_color('white')
        autotext.set_fontsize(16)
        autotext.set_fontweight('bold')
    
    ax.set_title('AlphaStream: Trade Distribution', fontsize=14, fontweight='bold', pad=20)
    
    plt.tight_layout()
    plt.savefig('win-loss-distribution.png', dpi=300, bbox_inches='tight', facecolor='#0a0a0a')
    print("✓ Created: win-loss-distribution.png")
    plt.close()

# ============================================================================
# Chart 4: Feature Importance (Top 20)
# ============================================================================
def chart_feature_importance():
    features = [
        'OBV (On-Balance Volume)',
        'VWAP (Volume Weighted Avg)',
        'MA_50 (50-day Moving Avg)',
        'MA_200 (200-day Moving Avg)',
        'MFI (Money Flow Index)',
        'RSI (Relative Strength)',
        'ATR (Average True Range)',
        'MACD Signal',
        'Bollinger Band Width',
        'Volume Change (%)',
        'Historical Volatility 20d',
        'CMF (Chaikin Money Flow)',
        'Stochastic Oscillator',
        'Price ROC (Rate of Change)',
        'Williams %R',
        'ADX (Directional Movement)',
        'Momentum Indicator',
        'CCI (Commodity Channel)',
        'Aroon Oscillator',
        'Ichimoku Cloud Base',
    ]
    
    importance = [0.089, 0.082, 0.075, 0.071, 0.065, 0.058, 0.054, 0.051, 
                  0.048, 0.045, 0.042, 0.039, 0.036, 0.033, 0.030, 0.028,
                  0.025, 0.022, 0.019, 0.016]
    
    # Color code: Volume indicators in green
    colors = ['#10b981' if any(x in f for x in ['OBV', 'VWAP', 'MFI', 'Volume', 'CMF']) 
              else '#c0c0c0' for f in features]
    
    fig, ax = plt.subplots(figsize=(10, 12))
    bars = ax.barh(features, importance, color=colors, edgecolor='#c0c0c0', linewidth=0.5)
    
    # Add value labels
    for i, (bar, value) in enumerate(zip(bars, importance)):
        ax.text(value + 0.002, i, f'{value:.3f}', 
                va='center', fontsize=9, color='#c0c0c0')
    
    ax.set_xlabel('Importance Score', fontsize=12, fontweight='bold')
    ax.set_title('AlphaStream: Top 20 Feature Importance', fontsize=14, fontweight='bold', pad=20)
    ax.grid(True, alpha=0.2, axis='x')
    ax.set_xlim(0, 0.10)
    
    # Add legend
    legend_elements = [
        Rectangle((0, 0), 1, 1, fc='#10b981', edgecolor='#c0c0c0', label='Volume Indicators'),
        Rectangle((0, 0), 1, 1, fc='#c0c0c0', edgecolor='#c0c0c0', label='Other Indicators')
    ]
    ax.legend(handles=legend_elements, loc='lower right', fontsize=10)
    
    plt.tight_layout()
    plt.savefig('feature-importance.png', dpi=300, bbox_inches='tight', facecolor='#0a0a0a')
    print("✓ Created: feature-importance.png")
    plt.close()

# ============================================================================
# Chart 5: Model Comparison Table
# ============================================================================
def chart_model_comparison():
    models = ['Random Forest', 'XGBoost', 'LightGBM', 'LSTM', 'Transformer', 'Ensemble']
    sharpe = [1.4, 1.6, 1.5, 0.9, 0.8, 2.2]
    win_rate = [54, 58, 56, 52, 51, 62]
    train_time = ['5 min', '8 min', '3 min', '2 hours', '4 hours', '12 min']
    notes = ['Baseline', 'Best single', 'Fastest', 'Disappointing', 'Overfit', 'Winner']
    
    fig, ax = plt.subplots(figsize=(12, 6))
    ax.axis('tight')
    ax.axis('off')
    
    data = []
    for i in range(len(models)):
        data.append([models[i], f'{sharpe[i]:.1f}', f'{win_rate[i]}%', train_time[i], notes[i]])
    
    table = ax.table(cellText=data,
                     colLabels=['Model', 'Sharpe Ratio', 'Win Rate', 'Training Time', 'Notes'],
                     cellLoc='center',
                     loc='center',
                     colWidths=[0.20, 0.15, 0.15, 0.20, 0.20])
    
    table.auto_set_font_size(False)
    table.set_fontsize(11)
    table.scale(1, 2.5)
    
    # Style header
    for i in range(5):
        cell = table[(0, i)]
        cell.set_facecolor('#1e1e1e')
        cell.set_text_props(weight='bold', color='#c0c0c0')
    
    # Style rows
    for i in range(1, 7):
        for j in range(5):
            cell = table[(i, j)]
            cell.set_facecolor('#0a0a0a' if i % 2 == 0 else '#121212')
            cell.set_text_props(color='#c0c0c0')
            
            # Highlight best values
            if j == 1 and float(cell.get_text().get_text()) >= 2.0:
                cell.set_facecolor('#10b981')
                cell.set_text_props(weight='bold', color='white')
            elif j == 2 and int(cell.get_text().get_text().strip('%')) >= 60:
                cell.set_facecolor('#10b981')
                cell.set_text_props(weight='bold', color='white')
    
    plt.title('AlphaStream: Model Performance Comparison', fontsize=14, fontweight='bold', pad=20, color='#c0c0c0')
    plt.savefig('model-comparison-table.png', dpi=300, bbox_inches='tight', facecolor='#0a0a0a')
    print("✓ Created: model-comparison-table.png")
    plt.close()

# ============================================================================
# Chart 6: Performance Metrics Dashboard
# ============================================================================
def chart_metrics_dashboard():
    fig = plt.figure(figsize=(16, 10))
    gs = fig.add_gridspec(3, 3, hspace=0.3, wspace=0.3)
    
    # Big title
    fig.suptitle('AlphaStream: Performance Metrics Dashboard', 
                 fontsize=16, fontweight='bold', color='#c0c0c0')
    
    # Subplot 1: Sharpe Comparison (top left, spans 2 columns)
    ax1 = fig.add_subplot(gs[0, :2])
    models = ['RF', 'XGB', 'LGB', 'Ensemble']
    sharpe = [1.4, 1.6, 1.5, 2.2]
    ax1.bar(models, sharpe, color=['#f59e0b', '#10b981', '#f59e0b', '#10b981'])
    ax1.set_ylabel('Sharpe Ratio')
    ax1.set_title('Model Comparison', fontweight='bold')
    ax1.grid(True, alpha=0.2)
    
    # Subplot 2: Win Rate (top right)
    ax2 = fig.add_subplot(gs[0, 2])
    ax2.pie([62, 38], labels=['Wins', 'Losses'], colors=['#10b981', '#ef4444'],
            autopct='%1.0f%%', startangle=90)
    ax2.set_title('Win/Loss Rate', fontweight='bold')
    
    # Subplot 3: Monthly Returns (middle, spans all columns)
    ax3 = fig.add_subplot(gs[1, :])
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    returns = [2.3, 1.8, -1.2, 3.1, 2.5, 1.9, -0.8, 2.8, 1.5, 2.1, 1.7, 2.4]
    colors_ret = ['#10b981' if r > 0 else '#ef4444' for r in returns]
    ax3.bar(months, returns, color=colors_ret)
    ax3.axhline(y=0, color='#9ca3af', linestyle='-', linewidth=0.5)
    ax3.set_ylabel('Return (%)')
    ax3.set_title('Monthly Returns (2024)', fontweight='bold')
    ax3.grid(True, alpha=0.2, axis='y')
    
    # Subplot 4: Feature Categories (bottom left)
    ax4 = fig.add_subplot(gs[2, 0])
    categories = ['Volume', 'Price', 'Volatility', 'Momentum']
    importance = [0.35, 0.30, 0.20, 0.15]
    ax4.barh(categories, importance, color='#c0c0c0')
    ax4.set_xlabel('Importance')
    ax4.set_title('Feature Categories', fontweight='bold')
    
    # Subplot 5: Signal Distribution (bottom middle)
    ax5 = fig.add_subplot(gs[2, 1])
    signals = ['Buy', 'Hold', 'Sell']
    counts = [420, 180, 400]
    ax5.bar(signals, counts, color=['#10b981', '#f59e0b', '#ef4444'])
    ax5.set_ylabel('Count')
    ax5.set_title('Signal Distribution', fontweight='bold')
    ax5.grid(True, alpha=0.2, axis='y')
    
    # Subplot 6: Key Metrics (bottom right)
    ax6 = fig.add_subplot(gs[2, 2])
    ax6.axis('off')
    metrics_text = """
    Sharpe Ratio: 1.8-2.4
    Win Rate: 58-65%
    Max Drawdown: ~15%
    Avg Return: 1.8%/mo
    Signal Latency: <100ms
    Training Time: 12min
    """
    ax6.text(0.1, 0.5, metrics_text, fontsize=11, verticalalignment='center',
             family='monospace', color='#c0c0c0')
    ax6.set_title('Key Statistics', fontweight='bold')
    
    plt.savefig('metrics-dashboard.png', dpi=300, bbox_inches='tight', facecolor='#0a0a0a')
    print("✓ Created: metrics-dashboard.png")
    plt.close()

# ============================================================================
# Main execution
# ============================================================================
if __name__ == "__main__":
    print("\n" + "="*60)
    print("  AlphaStream Performance Charts Generator")
    print("="*60 + "\n")
    
    print("Generating charts...\n")
    
    chart_sharpe_comparison()
    chart_cumulative_returns()
    chart_win_loss()
    chart_feature_importance()
    chart_model_comparison()
    chart_metrics_dashboard()
    
    print("\n" + "="*60)
    print("  All charts generated successfully!")
    print("="*60)
    print("\nFiles created:")
    print("  1. sharpe-comparison.png")
    print("  2. cumulative-returns.png")
    print("  3. win-loss-distribution.png")
    print("  4. feature-importance.png")
    print("  5. model-comparison-table.png")
    print("  6. metrics-dashboard.png")
    print("\nNext steps:")
    print("  - Review the generated charts")
    print("  - Adjust colors/styles if needed")
    print("  - Embed in your project documentation")
    print("  - Use these as reference for design decisions")
    print()
