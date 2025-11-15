import React from 'react';

const IconLoader = () => (
  <svg id="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <title>Loader Logo</title>
    <g>
      <path
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M 50, 5
                  L 11, 27
                  L 11, 72
                  L 50, 95
                  L 89, 73
                  L 89, 28 z"
      />
      {/* Brain Icon - Lucide Style */}
      <g id="brain" transform="translate(35, 35)">
        <path
          d="M12 4.5C9.5 4.5 7.5 6.5 7.5 9c0 .5.1 1 .3 1.5C6.3 11 5.5 12.4 5.5 14c0 1.1.3 2.1.9 3-.6.9-.9 1.9-.9 3 0 2.5 2 4.5 4.5 4.5.5 0 1-.1 1.5-.2.5 1.5 1.9 2.7 3.5 2.7s3-.8 3.5-2.2c.5.1 1 .2 1.5.2 2.5 0 4.5-2 4.5-4.5 0-1.1-.3-2.1-.9-3 .6-.9.9-1.9.9-3 0-1.6-.8-3-2.3-3.5.2-.5.3-1 .3-1.5 0-2.5-2-4.5-4.5-4.5-.8 0-1.5.2-2.1.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <path
          d="M9.5 13c0 1.4 1.1 2.5 2.5 2.5M18.5 13c0 1.4-1.1 2.5-2.5 2.5M12 18v3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
    </g>
  </svg>
);

export default IconLoader;
