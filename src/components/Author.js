import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledAuthor = styled.span`
  color: #8a8a8a;
`;
const StyledName = styled.span`
  margin-right: 4px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;
const StyledAuthorReputation = styled.span`
  color: grey;
  font-size: .60rem;
  background-color: #efefef;
  border-radius: 50px;
  font-weight: bold;
  width: 20px;
  text-align: center;
  padding: 4px;
  margin: 1px 5px 0;
`;

const Author = ({ name, reputation }) => {
  return (
    <StyledAuthor>
      <Link to={`/@${name}`}>
        <StyledName>{name}</StyledName>
      </Link>
      {reputation && <StyledAuthorReputation title="Reputation">{reputation}</StyledAuthorReputation>}
    </StyledAuthor>
  )
};

Author.propTypes = {
  name: PropTypes.string.isRequired,
  reputation: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};

export default Author;
