import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const StyledCounter = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--green-tint);
  border: 1px solid var(--green);
  border-radius: var(--border-radius);
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  color: var(--green);
  margin-top: 20px;

  .counter-icon {
    width: 16px;
    height: 16px;
  }

  .counter-number {
    font-weight: 600;
    color: var(--lightest-slate);
  }

  .counter-label {
    color: var(--slate);
  }

  &.loading {
    opacity: 0.6;
  }

  &.error {
    border-color: var(--error);
    color: var(--error);
    background: rgba(248, 113, 113, 0.1);
  }

  @media (max-width: 480px) {
    font-size: var(--fz-xxs);
    padding: 6px 12px;
  }
`;

const VisitorCounter = () => {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch('/.netlify/functions/visitor-counter');
        
        if (!response.ok) {
          throw new Error('Failed to fetch visitor count');
        }

        const data = await response.json();
        setCount(data.count);
        setError(false);
      } catch (err) {
        console.error('Visitor counter error:', err);
        setError(true);
        // Set a mock count for development
        setCount(Math.floor(Math.random() * 1000) + 100);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, []);

  if (loading) {
    return (
      <StyledCounter className="loading">
        <svg
          className="counter-icon"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <span>Loading visitors...</span>
      </StyledCounter>
    );
  }

  return (
    <StyledCounter className={error ? 'error' : ''}>
      <svg
        className="counter-icon"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
      <span className="counter-number">{count?.toLocaleString() || '---'}</span>
      <span className="counter-label">visitors</span>
    </StyledCounter>
  );
};

export default VisitorCounter;
