import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  height: 100vh;
  padding: 0;

  @media (max-height: 700px) and (min-width: 700px), (max-width: 360px) {
    height: auto;
    padding-top: var(--nav-height);
  }

  h1 {
    margin: 0 0 30px 4px;
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;
    background: linear-gradient(
      90deg,
      var(--green) 0%,
      #ffffff 25%,
      var(--green) 50%,
      #ffffff 75%,
      var(--green) 100%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 3s linear infinite;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }

    @keyframes shimmer {
      0% {
        background-position: 0% center;
      }
      100% {
        background-position: 200% center;
      }
    }
  }

  h2 {
    &.big-heading {
      background: linear-gradient(120deg, #ffffff 0%, #c0c0c0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 2px 10px rgba(192, 192, 192, 0.1);
      letter-spacing: -0.5px;
      transition: all 0.4s cubic-bezier(0.645, 0.045, 0.355, 1);
      
      &:hover {
        letter-spacing: 0px;
        transform: translateX(2px);
      }
    }
  }

  h3 {
    margin-top: 5px;
    color: var(--slate);
    line-height: 0.9;
    opacity: 0.95;

    .highlight {
      color: var(--white);
      font-weight: 600;
      position: relative;
      transition: color 0.5s ease;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--green), transparent);
        opacity: 0;
        animation: fadeInUnderline 1.5s ease forwards;
        animation-delay: 2s;
      }
    }
    
    @keyframes fadeInUnderline {
      0% {
        opacity: 0;
        transform: scaleX(0);
      }
      100% {
        opacity: 0.4;
        transform: scaleX(1);
      }
    }
  }

  p {
    margin: 20px 0 0;
    max-width: 540px;
    opacity: 0.92;
    line-height: 1.5;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
    transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
    position: relative;
    cursor: pointer;

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

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  const one = <h1>Hi, my name is</h1>;
  const two = <h2 className="big-heading">Jason Teixeira.</h2>;
  const three = (
    <h3 className="big-heading">
      I build systems that <span className="highlight">don't break</span> at 2 AM.
    </h3>
  );
  const four = (
    <>
      <p>
        I'm a Test Automation Architect specializing in building frameworks teams actually want to use.
        I focus on test automation for distributed systems where "it works on my machine" isn't good enough—E2E,
        performance, visual regression, and contract testing. Currently building high-performance testing infrastructure
        for algorithmic trading systems that process $10M+ daily volume.
      </p>
      <p style={{ marginTop: '15px', fontSize: 'var(--fz-sm)', color: 'var(--green)' }}>
        <strong>Currently seeking:</strong> Senior/Staff Test Automation Engineer or Automation Architect roles • Remote or Hybrid
      </p>
    </>
  );
  const five = (
    <div className="email-link">
      Get In Touch
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
  );

  const items = [one, two, three, four, five];

  return (
    <StyledHeroSection>
      {prefersReducedMotion ? (
        <>
          {items.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </>
      ) : (
        <TransitionGroup component={null}>
          {isMounted &&
            items.map((item, i) => (
              <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
                <div style={{ transitionDelay: `${i * 100 + 100}ms` }}>{item}</div>
              </CSSTransition>
            ))}
        </TransitionGroup>
      )}
    </StyledHeroSection>
  );
};

export default Hero;
