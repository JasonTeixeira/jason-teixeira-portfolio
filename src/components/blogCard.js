import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';
import styled from 'styled-components';
import kebabCase from 'lodash/kebabCase';
import { IconBookmark } from '@components/icons';

const StyledBlogCard = styled.div`
  transition: var(--transition);
  cursor: default;
  grid-column: ${props => (props.featured ? 'span 2' : 'span 1')};
  
  @media (max-width: 768px) {
    grid-column: span 1;
  }

  @media (prefers-reduced-motion: no-preference) {
    &:hover,
    &:focus-within {
      .card__inner {
        transform: translateY(-7px);
      }
    }
  }

  a {
    position: relative;
    z-index: 1;
  }

  .card__inner {
    ${({ theme }) => theme.mixins.boxShadow};
    display: flex;
    flex-direction: ${props => (props.featured ? 'row' : 'column')};
    position: relative;
    height: 100%;
    border-radius: var(--border-radius);
    transition: var(--transition);
    background-color: var(--light-navy);
    overflow: hidden;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  .card__image {
    position: relative;
    width: ${props => (props.featured ? '50%' : '100%')};
    height: ${props => (props.featured ? 'auto' : '200px')};
    overflow: hidden;
    
    @media (max-width: 768px) {
      width: 100%;
      height: 200px;
    }

    .gatsby-image-wrapper {
      width: 100%;
      height: 100%;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .card__category {
      position: absolute;
      top: 15px;
      left: 15px;
      background: var(--green);
      color: var(--navy);
      padding: 5px 12px;
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      font-weight: 600;
      text-transform: uppercase;
      z-index: 2;
    }
  }

  .card__content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: ${props => (props.featured ? '2.5rem' : '2rem 1.75rem')};
    width: ${props => (props.featured ? '50%' : '100%')};
    
    @media (max-width: 768px) {
      width: 100%;
      padding: 2rem 1.75rem;
    }
  }

  .card__icon {
    ${({ theme }) => theme.mixins.flexBetween};
    color: var(--green);
    margin-bottom: 20px;
    margin-left: -5px;

    svg {
      width: 40px;
      height: 40px;
    }
  }

  .card__meta {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 15px;
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    color: var(--light-slate);
    text-transform: uppercase;

    span {
      display: flex;
      align-items: center;
      gap: 5px;
    }

    svg {
      width: 14px;
      height: 14px;
    }
  }

  .card__title {
    margin: 0 0 15px;
    color: var(--lightest-slate);
    font-size: ${props => (props.featured ? 'var(--fz-heading)' : 'var(--fz-xxl)')};
    line-height: 1.25;

    @media (max-width: 768px) {
      font-size: var(--fz-xxl);
    }

    a {
      position: static;

      &:before {
        content: '';
        display: block;
        position: absolute;
        z-index: 0;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }

  .card__excerpt {
    color: var(--slate);
    font-size: ${props => (props.featured ? 'var(--fz-lg)' : 'var(--fz-md)')};
    line-height: 1.5;
    margin-bottom: ${props => (props.featured ? '20px' : '0')};
    display: -webkit-box;
    -webkit-line-clamp: ${props => (props.featured ? '4' : '3')};
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card__footer {
    margin-top: auto;
    padding-top: 20px;
  }

  .card__tags {
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 10px;
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      a {
        display: inline-block;
        color: var(--green);
        background: var(--lightest-navy);
        padding: 4px 10px;
        border-radius: 4px;
        font-family: var(--font-mono);
        font-size: var(--fz-xxs);
        line-height: 1.75;
        transition: var(--transition);

        &:hover {
          background: var(--green);
          color: var(--navy);
        }
      }
    }
  }
`;

const BlogCard = ({ post, featured = false }) => {
  const { frontmatter, html } = post;
  const { title, description, slug, date, tags, featuredImage, category } = frontmatter;
  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Calculate reading time
  const wordCount = html ? html.trim().split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / 225) || 1;

  const image = featuredImage ? getImage(featuredImage) : null;

  return (
    <StyledBlogCard featured={featured}>
      <div className="card__inner">
        {image ? (
          <div className="card__image">
            <GatsbyImage image={image} alt={title} />
            {category && <span className="card__category">{category}</span>}
          </div>
        ) : (
          !featured && (
            <div className="card__content" style={{ width: '100%' }}>
              <div className="card__icon">
                <IconBookmark />
              </div>
            </div>
          )
        )}

        <div className="card__content">
          <header>
            {!image && featured && (
              <div className="card__icon">
                <IconBookmark />
              </div>
            )}
            
            <div className="card__meta">
              <span className="card__date">{formattedDate}</span>
              <span>•</span>
              <span className="card__reading-time">{readingTime} min read</span>
            </div>

            <h3 className="card__title">
              <Link to={slug}>{title}</Link>
            </h3>

            {description && <p className="card__excerpt">{description}</p>}
          </header>

          {tags && tags.length > 0 && (
            <footer className="card__footer">
              <ul className="card__tags">
                {tags.slice(0, featured ? 5 : 3).map((tag, i) => (
                  <li key={i}>
                    <Link to={`/pensieve/tags/${kebabCase(tag)}/`}>
                      {tag}
                    </Link>
                  </li>
                ))}
              </ul>
            </footer>
          )}
        </div>
      </div>
    </StyledBlogCard>
  );
};

BlogCard.propTypes = {
  post: PropTypes.object.isRequired,
  featured: PropTypes.bool,
};

export default BlogCard;
