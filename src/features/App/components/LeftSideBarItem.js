import React from 'react';
import PropTypes from 'prop-types';
import { NavLink, withRouter } from 'react-router-dom';
import { COLOR, COLOR_HOVER } from 'styles/icons';
import styled from 'styled-components';

const StyledLink = styled.div`
  display: inline-block;
  height: 2.8rem;
  width: 2.8rem;
  line-height: 2.8rem;
  border-radius: 100%;
  text-align: center;
  margin: 0 0 1.5rem;
  
  &:hover .label {
    display: block;
  }
`;
const StyledLinkInner = styled(NavLink)`
  line-height: 3.2rem;
  transition: 0.3s ease;
  display: inline-block;
  text-decoration: none;
  text-align: center;
  border-radius: 3rem;
  padding: 0 8px;
  
  &:active, &:hover, &:focus, &.active {
    background: #ffffff;
  }
`;
const StyledLabel = styled.span`
  display: none;
  padding: 0 1rem 0 2.5rem;
  white-space: nowrap;
  color: #666666;
`;

const ICON_STYLE = {
  float: 'left',
  margin: '.6rem 0',
};

function LeftSideBarItem(props) {
  const { label, to, exact, location: { pathname } } = props;
  const isActive = exact ? pathname === to : pathname.indexOf(to) === 0;
  const Icon = props.icon;

  return (
    <StyledLink>
      <StyledLinkInner activeClassName="active" to={to} exact={exact}>
        <Icon color={isActive ? COLOR_HOVER : COLOR} style={ICON_STYLE} />
        <StyledLabel className="label">{label}</StyledLabel>
      </StyledLinkInner>
    </StyledLink>
  );
}

LeftSideBarItem.defaultProps = {
  exact: true,
};

LeftSideBarItem.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.func.isRequired,
  exact: PropTypes.bool,
  onClick: PropTypes.func,
};

export default withRouter(LeftSideBarItem);