import React from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import IconSms from 'material-ui/svg-icons/notification/sms';
import background_url from 'styles/assets/imgs/bg.jpg';
import AvatarSteemit from 'components/AvatarSteemit';
import UserSteemPower from '../UserSteemPower';
import FollowerCount from '../FollowerCount';
import FollowButton from '../FollowButton';

function UserHeader(props) {
  const { account } = props;
  if (isEmpty(account)) {
    return <div></div>;
  }
  const accountName = account.name;
  const { reputation, post_count } = account;
  const metadata = account.json_metadata;
  const about = metadata.profile && metadata.profile.about;
  const coverImageData = metadata.profile && metadata.profile.cover_image;
  const coverImage = coverImageData ? `${process.env.REACT_APP_STEEMCONNECT_IMG_HOST}/@${accountName}/cover` : background_url;
  return (
    <div className="user"
         style={{ background: `url(${coverImage}) transparent no-repeat center center/cover` }}>
      <div className="user__overlay" />
      <div className="user__wrapper">
        <div className="user__containner">
          <AvatarSteemit name={accountName} size={140} votingPower={account.voting_power} />
        </div>
        <div className="user__info">
          <h2 className="user__info__name">
            {accountName}
            <span>{reputation}</span>
          </h2>
          <p className="user__info__position">{about}</p>
          <div className="user__info__statistics">
            <div className="statistic statistic--steem_power">
              <h3><UserSteemPower account={account} /></h3>
              <p>Steem Power</p>
            </div>
            <div className="statistic statistic--posts">
              <h3>{post_count}</h3>
              <p>Posts</p>
            </div>
            <div className="statistic statistic--followers">
              <h3><FollowerCount accountName={accountName} unit="followers" /></h3>
              <p>Followers</p>
            </div>
            <div className="statistic statistic--following">
              <h3><FollowerCount accountName={accountName} unit="followings" /></h3>
              <p>Following</p>
            </div>
            <div className="statistic statistic--buttons">
              <FollowButton accountName={accountName} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

UserHeader.propTypes = {
  account: PropTypes.object.isRequired,
};

export default UserHeader;
