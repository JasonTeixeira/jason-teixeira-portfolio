import { css } from 'styled-components';

const variables = css`
:root {
  /* Sophisticated Dark Grey/Black Theme */
  --dark-navy: #0a0a0a;
  --navy: #121212;
  --light-navy: #1a1a1a;
  --lightest-navy: #242424;
  --navy-shadow: rgba(10, 10, 10, 0.7);
  --dark-slate: #404040;
  --slate: #6b6b6b;
  --light-slate: #9ca3af;
  --lightest-slate: #d1d5db;
  --white: #f3f4f6;
  
  /* Primary: Silver/Platinum (Professional, Tech) */
  --green: #c0c0c0;
  --green-tint: rgba(192, 192, 192, 0.1);
  
  /* Secondary: Light Grey (Subtle Emphasis) */
  --purple: #9ca3af;
  --purple-tint: rgba(156, 163, 175, 0.1);
  
  /* Accent Colors - Muted Professional Palette */
  --pink: #d1d5db;
  --blue: #9ca3af;
  --orange: #a3a3a3;
  --success: #86efac;
  --warning: #fcd34d;
  --error: #fca5a5;

    --font-sans: 'Calibre', 'Inter', 'San Francisco', 'SF Pro Text', -apple-system, system-ui,
      sans-serif;
    --font-mono: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;

    --fz-xxs: 12px;
    --fz-xs: 13px;
    --fz-sm: 14px;
    --fz-md: 16px;
    --fz-lg: 18px;
    --fz-xl: 20px;
    --fz-xxl: 22px;
    --fz-heading: 32px;

    --border-radius: 4px;
    --nav-height: 100px;
    --nav-scroll-height: 70px;

    --tab-height: 42px;
    --tab-width: 120px;

    --easing: cubic-bezier(0.645, 0.045, 0.355, 1);
    --transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);

    --hamburger-width: 30px;

    --ham-before: top 0.1s ease-in 0.25s, opacity 0.1s ease-in;
    --ham-before-active: top 0.1s ease-out, opacity 0.1s ease-out 0.12s;
    --ham-after: bottom 0.1s ease-in 0.25s, transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19);
    --ham-after-active: bottom 0.1s ease-out,
      transform 0.22s cubic-bezier(0.215, 0.61, 0.355, 1) 0.12s;
  }
`;

export default variables;
