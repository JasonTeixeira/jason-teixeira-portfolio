import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig, email } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledContactSection = styled.section`
  max-width: 600px;
  margin: 0 auto 100px;
  text-align: center;

  @media (max-width: 768px) {
    margin: 0 auto 50px;
  }

  .overline {
    display: block;
    margin-bottom: 20px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-md);
    font-weight: 400;

    &:before {
      bottom: 0;
      font-size: var(--fz-sm);
    }

    &:after {
      display: none;
    }
  }

  .title {
    font-size: clamp(40px, 5vw, 60px);
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
    transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
    position: relative;
    cursor: pointer;
    display: inline-block;

    &:hover {
      box-shadow: 0 0 20px rgba(192, 192, 192, 0.3);
      transform: translateY(-2px);

      .contact-card {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
    }

    .contact-card {
      position: absolute;
      top: calc(100% + 15px);
      left: 50%;
      transform: translateX(-50%) translateY(-10px);
      background: var(--light-navy);
      border: 2px solid var(--green);
      border-radius: var(--border-radius);
      padding: 20px;
      min-width: 280px;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      z-index: 100;
      box-shadow: 0 10px 30px -15px var(--navy-shadow);

      &::before {
        content: '';
        position: absolute;
        top: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 8px solid var(--green);
      }

      .contact-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 0;
        color: var(--lightest-slate);
        font-family: var(--font-mono);
        font-size: var(--fz-sm);
        text-align: left;

        &:not(:last-child) {
          border-bottom: 1px solid var(--lightest-navy);
        }

        svg {
          width: 18px;
          height: 18px;
          color: var(--green);
          flex-shrink: 0;
        }

        a {
          color: var(--lightest-slate);
          text-decoration: none;
          transition: color 0.2s ease;

          &:hover {
            color: var(--green);
          }
        }
      }
    }
  }
`;

const Contact = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  return (
    <StyledContactSection id="contact" ref={revealContainer}>
      <h2 className="numbered-heading overline">What’s Next?</h2>

      <h2 className="title">Get In Touch</h2>

      <p>
        Although I’m not currently looking for any new opportunities, my inbox is always open.
        Whether you have a question or just want to say hi, I’ll try my best to get back to you!
      </p>

      <div className="email-link">
        Say Hello
        <div className="contact-card">
          <div className="contact-item">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <a href="mailto:sage@sageideas.org">sage@sageideas.org</a>
          </div>
          <div className="contact-item">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <a href="tel:+19089376568">(908) 937-6568</a>
          </div>
        </div>
      </div>
    </StyledContactSection>
  );
};

export default Contact;
