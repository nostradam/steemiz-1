import React from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import styled from 'styled-components';
import AvatarSteemit from 'components/AvatarSteemit';
import UserSteemPower from '../UserSteemPower';

const UserProfile = styled.div`
  width: calc(25% - 2 * 0.8rem);
  background-color: #ffffff;
  position: relative;
  margin: 1rem 0.8rem;
  border-radius: 5px;
  text-align: center;
  display: inline-block;
`;
const UserAvatar = styled.div`
  display: inline-block;
  padding-top: 2rem;
`;
const UserName = styled.h3`
  color: #666;
  margin: 0.8rem 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
  display: block;
  position: relative;
`;
const UserRate = styled.span`
  color: grey;
  font-size: .60rem;
  background-color: #efefef;
  border-radius: 50px;
  font-weight: bold;
  width: 20px;
  text-align: center;
  padding: 4px;
  display: inline-block;
  margin-left: 5px;
  position: absolute;
`;
const SteemPower = styled.h4`
  color: #ff992b;
  margin: 0;
`;
const ViewProfile = styled.div`
  border-top: 1px solid #f2f2f2;
`;
const LinkViewProfile = styled(Link)`
  line-height: 3rem;
  display: inline-block;
  width: 100%;
  
  &:hover {
    text-decoration: underline;
  }
`;

const UserCard = ({ user }) => {
  return (
    <UserProfile>
      <UserAvatar>
        <AvatarSteemit name={user.name} size={140} votingPower={user.voting_power} />
      </UserAvatar>
      <UserName>
        {user.name}
        <UserRate>{user.reputation}</UserRate>
      </UserName>
      <SteemPower>
        {user && <UserSteemPower account={user} />}
      </SteemPower>
      <p>Steem Power</p>
      <ViewProfile>
        <LinkViewProfile to={`/@${user.name}`}>View Profile</LinkViewProfile>
      </ViewProfile>
    </UserProfile>
  )
};

UserCard.propTypes = {
  user: PropTypes.object.isRequired
};

export default withRouter(UserCard);
