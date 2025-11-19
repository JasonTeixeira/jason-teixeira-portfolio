import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledFilters = styled.div`
  margin-bottom: 50px;

  .filters__search {
    margin-bottom: 30px;
  }

  .search__input {
    width: 100%;
    max-width: 500px;
    padding: 15px 20px;
    background: var(--lightest-navy);
    border: 1px solid var(--lightest-navy);
    border-radius: var(--border-radius);
    color: var(--lightest-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-md);
    transition: var(--transition);

    &:focus {
      outline: none;
      border-color: var(--green);
      background: var(--light-navy);
    }

    &::placeholder {
      color: var(--slate);
    }
  }

  .filters__controls {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    align-items: center;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  .filters__group {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .filters__label {
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    color: var(--slate);
    text-transform: uppercase;
  }

  .filters__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .tag__button {
    ${({ theme }) => theme.mixins.smallButton};
    padding: 8px 16px;
    font-size: var(--fz-xs);
    background: ${props => props.active ? 'var(--green)' : 'var(--lightest-navy)'};
    color: ${props => props.active ? 'var(--navy)' : 'var(--green)'};
    border: 1px solid ${props => props.active ? 'var(--green)' : 'var(--lightest-navy)'};
    cursor: pointer;
    transition: var(--transition);

    &:hover {
      background: var(--green);
      color: var(--navy);
      border-color: var(--green);
    }
  }

  .filters__select {
    padding: 10px 15px;
    background: var(--lightest-navy);
    border: 1px solid var(--lightest-navy);
    border-radius: var(--border-radius);
    color: var(--lightest-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    cursor: pointer;
    transition: var(--transition);

    &:hover,
    &:focus {
      border-color: var(--green);
      outline: none;
    }
  }

  .filters__results {
    margin-top: 20px;
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    color: var(--slate);

    strong {
      color: var(--green);
    }
  }
`;

const BlogFilters = ({ 
  searchTerm, 
  onSearchChange, 
  selectedTag, 
  onTagChange, 
  sortBy, 
  onSortChange, 
  tags, 
  resultsCount 
}) => {
  return (
    <StyledFilters>
      <div className="filters__search">
        <input
          type="text"
          className="search__input"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search blog posts"
        />
      </div>

      <div className="filters__controls">
        <div className="filters__group">
          <span className="filters__label">Filter:</span>
          <div className="filters__tags">
            <button
              className="tag__button"
              onClick={() => onTagChange('all')}
              active={selectedTag === 'all'}
            >
              All
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                className="tag__button"
                onClick={() => onTagChange(tag)}
                active={selectedTag === tag}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="filters__group">
          <span className="filters__label">Sort:</span>
          <select 
            className="filters__select" 
            value={sortBy} 
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort posts"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {(searchTerm || selectedTag !== 'all') && (
        <div className="filters__results">
          Showing <strong>{resultsCount}</strong> {resultsCount === 1 ? 'post' : 'posts'}
          {searchTerm && ` matching "${searchTerm}"`}
          {selectedTag !== 'all' && ` tagged with "${selectedTag}"`}
        </div>
      )}
    </StyledFilters>
  );
};

BlogFilters.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  selectedTag: PropTypes.string.isRequired,
  onTagChange: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
  tags: PropTypes.array.isRequired,
  resultsCount: PropTypes.number.isRequired,
};

export default BlogFilters;
