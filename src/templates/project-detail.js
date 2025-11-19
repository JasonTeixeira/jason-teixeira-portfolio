import React from 'react';
import { graphql } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { Layout } from '@components';
import { Icon } from '@components/icons';

const StyledProjectPage = styled.main`
  max-width: 1000px;
  margin: 0 auto;

  .project-header {
    margin-bottom: 50px;
    padding: 100px 0 50px;

    @media (max-width: 768px) {
      padding: 50px 0 30px;
    }
  }

  .back-link {
    ${({ theme }) => theme.mixins.link};
    margin-bottom: 30px;
    display: inline-flex;
    align-items: center;
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    color: var(--green);

    svg {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
  }

  .project-title {
    font-size: clamp(40px, 8vw, 60px);
    margin-bottom: 20px;
    color: var(--lightest-slate);
  }

  .project-subtitle {
    font-size: var(--fz-xl);
    color: var(--slate);
    margin-bottom: 30px;
  }

  .project-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 30px;
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    color: var(--light-slate);
  }

  .project-links {
    display: flex;
    gap: 15px;
    margin-bottom: 40px;

    a {
      ${({ theme }) => theme.mixins.smallButton};
    }
  }

  .hero-image {
    margin-bottom: 60px;
    border-radius: var(--border-radius);
    overflow: hidden;
    box-shadow: 0 20px 40px -15px var(--navy-shadow);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin: 60px 0;

    .stat-card {
      background: var(--light-navy);
      border: 1px solid var(--lightest-navy);
      border-radius: var(--border-radius);
      padding: 30px;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

      &:hover {
        transform: translateY(-5px);
        border-color: var(--green);
        box-shadow: 0 10px 30px -15px var(--navy-shadow);
      }

      .stat-value {
        font-size: clamp(32px, 5vw, 48px);
        font-weight: 600;
        color: var(--green);
        margin-bottom: 10px;
      }

      .stat-label {
        font-family: var(--font-mono);
        font-size: var(--fz-sm);
        color: var(--slate);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }
  }

  .content-section {
    margin: 80px 0;

    h2 {
      font-size: clamp(26px, 5vw, 32px);
      color: var(--lightest-slate);
      margin-bottom: 30px;
      display: flex;
      align-items: center;

      &:before {
        content: '▹';
        color: var(--green);
        margin-right: 15px;
        font-size: 1.2em;
      }
    }

    h3 {
      font-size: clamp(20px, 4vw, 24px);
      color: var(--lightest-slate);
      margin: 40px 0 20px;
    }

    p {
      margin-bottom: 20px;
      line-height: 1.6;
      color: var(--slate);
    }

    ul, ol {
      margin: 20px 0;
      padding-left: 20px;

      li {
        margin-bottom: 15px;
        line-height: 1.6;
        color: var(--slate);
        padding-left: 10px;

        &::marker {
          color: var(--green);
        }
      }
    }

    code {
      background: var(--light-navy);
      color: var(--lightest-slate);
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: var(--font-mono);
      font-size: 0.9em;
    }

    pre {
      background: var(--light-navy);
      border: 1px solid var(--lightest-navy);
      border-radius: var(--border-radius);
      padding: 20px;
      margin: 30px 0;
      overflow-x: auto;

      code {
        background: none;
        padding: 0;
      }
    }

    .mermaid {
      background: var(--light-navy);
      border: 1px solid var(--lightest-navy);
      border-radius: var(--border-radius);
      padding: 30px;
      margin: 40px 0;
      text-align: center;
    }
  }

  .tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 30px 0;

    .tech-tag {
      background: var(--lightest-navy);
      color: var(--green);
      padding: 8px 16px;
      border-radius: var(--border-radius);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      border: 1px solid var(--lightest-navy);
      transition: all 0.2s ease;

      &:hover {
        border-color: var(--green);
        transform: translateY(-2px);
      }
    }
  }

  .image-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin: 40px 0;

    .gallery-item {
      border-radius: var(--border-radius);
      overflow: hidden;
      border: 1px solid var(--lightest-navy);
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

      &:hover {
        transform: translateY(-5px);
        border-color: var(--green);
        box-shadow: 0 10px 30px -15px var(--navy-shadow);
      }
    }
  }

  .callout {
    background: var(--light-navy);
    border-left: 4px solid var(--green);
    padding: 20px 30px;
    margin: 30px 0;
    border-radius: var(--border-radius);

    &.warning {
      border-left-color: var(--warning);
    }

    &.info {
      border-left-color: var(--blue);
    }

    p:last-child {
      margin-bottom: 0;
    }
  }
`;

const ProjectDetailTemplate = ({ data, location }) => {
  // Defensive null check to prevent crashes
  if (!data?.markdownRemark) {
    return (
      <Layout location={location}>
        <StyledProjectPage>
          <div className="project-header">
            <a href="/#projects" className="back-link">
              <Icon name="External" />
              Back to Projects
            </a>
            <h1 className="project-title">Project Not Found</h1>
            <p className="project-subtitle">
              The project you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </StyledProjectPage>
      </Layout>
    );
  }

  const { frontmatter, html } = data.markdownRemark;
  const heroImage = getImage(frontmatter?.hero);

  return (
    <Layout location={location}>
      <StyledProjectPage>
        <div className="project-header">
          <a href="/#projects" className="back-link">
            <Icon name="External" />
            Back to Projects
          </a>

          <h1 className="project-title">{frontmatter.title}</h1>
          <p className="project-subtitle">{frontmatter.subtitle}</p>

          <div className="project-meta">
            {frontmatter.status && <span>Status: {frontmatter.status}</span>}
            {frontmatter.date && <span>Built: {frontmatter.date}</span>}
            {frontmatter.timeline && <span>Timeline: {frontmatter.timeline}</span>}
          </div>

          <div className="project-links">
            {frontmatter.github && (
              <a href={frontmatter.github} target="_blank" rel="noopener noreferrer">
                <Icon name="GitHub" />
                View Code
              </a>
            )}
            {frontmatter.demo && (
              <a href={frontmatter.demo} target="_blank" rel="noopener noreferrer">
                <Icon name="External" />
                Live Demo
              </a>
            )}
          </div>

          {frontmatter.tech && (
            <div className="tech-stack">
              {frontmatter.tech.map((tech, i) => (
                <span key={i} className="tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {heroImage && (
          <div className="hero-image">
            <GatsbyImage image={heroImage} alt={frontmatter.title} />
          </div>
        )}

        {frontmatter.metrics && (
          <div className="stats-grid">
            {Object.entries(frontmatter.metrics).map(([key, value]) => (
              <div key={key} className="stat-card">
                <div className="stat-value">{value}</div>
                <div className="stat-label">{key}</div>
              </div>
            ))}
          </div>
        )}

        <div className="content-section" dangerouslySetInnerHTML={{ __html: html }} />
      </StyledProjectPage>
    </Layout>
  );
};

export default ProjectDetailTemplate;

export const Head = ({ data }) => {
  // Defensive null check for Head component
  if (!data?.markdownRemark?.frontmatter) {
    return (
      <>
        <title>Project Not Found | Jason Teixeira</title>
        <meta name="description" content="The project you're looking for doesn't exist." />
      </>
    );
  }

  const { frontmatter } = data.markdownRemark;
  return (
    <>
      <title>{`${frontmatter.title} | Jason Teixeira`}</title>
      <meta name="description" content={frontmatter.subtitle} />
    </>
  );
};

export const query = graphql`
  query ProjectDetailQuery($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        subtitle
        date
        status
        timeline
        github
        demo
        tech
        metrics {
          loc
          sharpe
          accuracy
          latency
          clouds
          ai
          features
          stack
          portfolios
          positions
          methods
          optimization
        }
        hero {
          childImageSharp {
            gatsbyImageData(width: 1200, placeholder: BLURRED, formats: [AUTO, WEBP, AVIF])
          }
        }
      }
    }
  }
`;
