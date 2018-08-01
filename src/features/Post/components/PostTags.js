import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Tag = styled(Link)`
  display: inline-block;
  padding: 9px 12px;
  background: #f9f9fb;
  border-radius: 0.3rem;
  color: #999999;
  margin: 0 8px 8px 0;
  cursor: pointer;
  box-shadow: 0px 0px 1px 1px #e8e8e8;
`;

const PostTags = ({ post }) => {
  return (
    <div>
      {post.json_metadata.tags.map(tag => <Tag key={tag} to={`/trending/${tag}`}>{tag}</Tag>)}
    </div>
  )
};

PostTags.propTypes = {
  post: PropTypes.object.isRequired,
};

export default PostTags;
