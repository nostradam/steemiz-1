import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import styled from 'styled-components';
import IconSms from 'material-ui/svg-icons/notification/sms';
import background_url from 'styles/assets/imgs/bg.jpg';
import AvatarSteemit from 'components/AvatarSteemit';
import UserSteemPower from '../UserSteemPower';
import FollowerCount from '../FollowerCount';
import FollowButton from '../FollowButton';

const User = styled.div`
  overflow: hidden;
  position: relative;
`;
const Overlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0.2;
  background: #000;
`;
const Wrapper = styled.div`
  display: flex;
  position: relative;
  padding: 3rem 2rem 3rem 3rem;
  overflow: hidden;
`;
const Container = styled.div`
  padding-right: 2.2rem;
`;
const Info = styled.div`
  color: white;
`;
const Name = styled.h2`
  margin: 1rem 0 0;
  font-size: 2.5rem;
  font-family: 'nunito_sanslight';
  font-weight: normal;
  display: flex;
  align-items: center;
  
  & > span {
    border-radius: .5rem;
    font-size: .9rem;
    padding: .25rem;
    margin-left: .5rem;
    background-color: grey;
    font-weight: bold;
  }
`;
const Position = styled.p`
  margin: 10px 0;
`;
const Stats = styled.div`
  overflow: hidden;
  padding-top: 0.8rem;
`;
const Stat = styled.div`
  float: left;
  padding: 0 1.5rem;
  margin: 0.5rem 0;
  
  & h3 {
    font-size: 20px;
    margin: 0;
    line-height: 25px;
  }
  
  & p {
    font-size: 12px;
    margin: 0;
    color: #e6e6e6;
  }
`;
const StatSteemPower = styled(Stat)`
  margin-left: -1.5rem;
  border-right: 1px solid #e6e6e6;
  
  & h3 {
    color: #e6e550;
  }
`;

function UserHeader(props) {
  const { account } = props;
  if (isEmpty(account)) {
    return <div/>;
  }
  const accountName = account.name;
  const { reputation, post_count } = account;
  const metadata = account.json_metadata;
  const about = metadata.profile && metadata.profile.about;
  const coverImageData = metadata.profile && metadata.profile.cover_image;
  const coverImage = coverImageData ? `${process.env.REACT_APP_STEEMCONNECT_IMG_HOST}/@${accountName}/cover` : background_url;
  return (
    <User style={{ background: `url(${coverImage}) transparent no-repeat center center/cover` }}>
      <Overlay />
      <Wrapper>
        <Container>
          <AvatarSteemit name={accountName} size={140} votingPower={account.voting_power} />
        </Container>
        <Info>
          <Name>
            {accountName}
            <span>{reputation}</span>
          </Name>
          <Position>{about}</Position>
          <Stats>
            <StatSteemPower>
              <h3><UserSteemPower account={account} /></h3>
              <p>Steem Power</p>
            </StatSteemPower>
            <Stat>
              <h3>{post_count}</h3>
              <p>Posts</p>
            </Stat>
            <Stat>
              <h3><FollowerCount accountName={accountName} unit="followers" /></h3>
              <p>Followers</p>
            </Stat>
            <Stat>
              <h3><FollowerCount accountName={accountName} unit="followings" /></h3>
              <p>Following</p>
            </Stat>
            <Stat>
              <FollowButton accountName={accountName} />
            </Stat>
          </Stats>
        </Info>
      </Wrapper>
    </User>
  );
}

UserHeader.propTypes = {
  account: PropTypes.object.isRequired,
};

export default UserHeader;
