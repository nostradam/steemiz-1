import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const Links = styled.div`
  width: 100%;
  margin-bottom: 0.5rem;
  overflow: hidden;
  position: relative;
  
  &:after {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    width: 100%;
    background: #e7e7e8;
  }
`;
const StyledNavLink = styled(NavLink)`
  font-family: 'nunito_sanssemibold';
  color: #a2a2a3;
  display: inline-block;
  line-height: 4rem;
  border-bottom: 1px solid transparent;
  margin: 0 1rem;
  font-size: 1rem;
  cursor: pointer;
  position: relative;
  
  &:after {
    content: "";
    transition: 0.2s all ease;
    position: absolute;
    bottom: -1px;
    left: 0;
    height: 1px;
    width: 0;
    background: #4aa7f4;
    z-index: 1;
  }
  
  &:hover:after {
    width: 100%;
  }
  
  &.active {
    color: #4aa7f4;
    border-bottom: 1px solid #4aa7f4;
  }
  
  &:hover {
    text-decoration: none;
    color: #4aa7f4;
  }
`;

const UserMenu = ({ accountName }) => {
  return (
    <Links>
      <StyledNavLink activeClassName="active" to={`/@${accountName}/blog`}>Blog</StyledNavLink>
      {/*<NavLink activeClassName="active" to={`/@${accountName}/comments`}>Comments</NavLink>
      <NavLink activeClassName="active" to={`/@${accountName}/replies`}>Replies</NavLink>
      <NavLink activeClassName="active" to={`/@${accountName}/votes`}>Votes</NavLink>*/}
      <StyledNavLink activeClassName="active" to={`/@${accountName}/followers`}>Followers</StyledNavLink>
      <StyledNavLink activeClassName="active" to={`/@${accountName}/followings`}>Followings</StyledNavLink>
      <StyledNavLink activeClassName="active" to={`/@${accountName}/rewards`}>Rewards</StyledNavLink>
      <StyledNavLink activeClassName="active" to={`/@${accountName}/wallet`}>Wallet</StyledNavLink>
    </Links>
  )
};

UserMenu.propTypes = {
  accountName: PropTypes.string.isRequired
};

export default UserMenu;
