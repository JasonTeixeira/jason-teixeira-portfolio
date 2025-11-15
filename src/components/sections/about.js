import React, { useEffect, useRef } from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledAboutSection = styled.section`
  max-width: 900px;

  .inner {
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-gap: 80px;

    @media (max-width: 768px) {
      display: block;
    }
  }
`;
const StyledText = styled.div`
  ul.skills-list {
    display: grid;
    grid-template-columns: repeat(3, minmax(140px, 200px));
    grid-gap: 15px 20px;
    padding: 0;
    margin: 20px 0 0 0;
    overflow: hidden;
    list-style: none;

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, minmax(140px, 200px));
    }

    li {
      position: relative;
      margin-bottom: 0;
      padding-left: 20px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: all 0.2s ease;

      &:hover {
        color: var(--green);
        transform: translateX(2px);
      }

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--green);
        font-size: var(--fz-sm);
        line-height: 12px;
        transition: all 0.2s ease;
      }

      &:hover:before {
        color: var(--white);
      }
    }
  }
`;
const StyledPic = styled.div`
  position: relative;
  max-width: 300px;

  @media (max-width: 768px) {
    margin: 50px auto 0;
    width: 70%;
  }

  .wrapper {
    ${({ theme }) => theme.mixins.boxShadow};
    display: block;
    position: relative;
    width: 100%;
    border-radius: var(--border-radius);
    background-color: var(--green);

    &:hover,
    &:focus {
      outline: 0;
      transform: translate(-4px, -4px);

      &:after {
        transform: translate(8px, 8px);
      }

      .img {
        filter: none;
        mix-blend-mode: normal;
      }
    }

    .img {
      position: relative;
      border-radius: var(--border-radius);
      mix-blend-mode: multiply;
      filter: grayscale(100%) contrast(1);
      transition: var(--transition);
    }

    &:before,
    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius);
      transition: var(--transition);
    }

    &:before {
      top: 0;
      left: 0;
      background-color: var(--navy);
      mix-blend-mode: screen;
    }

    &:after {
      border: 2px solid var(--green);
      top: 14px;
      left: 14px;
      z-index: -1;
    }
  }
`;

const About = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const skills = [
    'Python',
    'TypeScript',
    'JavaScript',
    'SQL',
    'Bash',
    'AWS',
    'Google Cloud',
    'Azure',
    'Terraform',
    'Kubernetes',
    'Docker',
    'Helm',
    'FastAPI',
    'Flask',
    'Django',
    'REST APIs',
    'GraphQL',
    'Microservices',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'DynamoDB',
    'TensorFlow',
    'PyTorch',
    'Kafka',
    'NumPy',
    'Pandas',
    'pytest',
    'Playwright',
    'Selenium',
    'GitHub Actions',
    'GitLab CI',
    'Prometheus',
    'Grafana',
    'Git',
    'React',
    'Next.js',
    'Gatsby',
    'Node.js',
    'WebSocket',
  ];

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">About Me</h2>

      <div className="inner">
        <StyledText>
          <div>
            <p>
              I started as a systems specialist at Home Depot, tired of manual deployments and
              repetitive work. Learned Python to automate myself out of boring tasks—turns out
              scripting your way out of tickets is way more fun than answering them.
            </p>

            <p>
              That led me into cloud infrastructure and test automation, where I realized flaky tests
              cost more than building frameworks properly. I built testing frameworks that teams
              actually wanted to use, reduced deployment times from hours to minutes, and eventually
              got pulled into the world of quantitative finance.
            </p>

            <p>
              Fast-forward to today, and I've built{' '}
              <a href="https://github.com/JasonTeixeira">algorithmic trading systems</a> processing
              $10M+ daily volume, deployed Kubernetes-orchestrated infrastructure with auto-scaling,
              and architected ML-driven alpha generation platforms. Currently at{' '}
              <a href="https://github.com/JasonTeixeira/AlphaStream">HighStrike</a>, focused on
              high-performance trading systems and distributed computing.
            </p>

            <p>Here are the technologies I work with:</p>
          </div>

          <ul className="skills-list">
            {skills && skills.map((skill, i) => <li key={i}>{skill}</li>)}
          </ul>
        </StyledText>

        <StyledPic>
          <div className="wrapper">
            <StaticImage
              className="img"
              src="../../images/me.jpg"
              width={500}
              quality={95}
              formats={['AUTO', 'WEBP', 'AVIF']}
              alt="Headshot"
            />
          </div>
        </StyledPic>
      </div>
    </StyledAboutSection>
  );
};

export default About;
