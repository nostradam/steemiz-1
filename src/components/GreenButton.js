import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledGreenButton = styled.button`
  transition: 0.4s ease;
  border: 1px solid #f0f0f2;
  height: 2.8rem;
  color: #4aa7f4;
  padding: 0 2rem;
  border-radius: 2rem;
  background: #ffffff;
  cursor: pointer;
  font-family: 'nunito_sanssemibold';
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  align-items: center;
`;

const GreenButton = props => {
  return (
    <StyledGreenButton {...props}>{props.children}</StyledGreenButton>
  )
};

GreenButton.propTypes = {
  children: PropTypes.node
};

export default GreenButton;
