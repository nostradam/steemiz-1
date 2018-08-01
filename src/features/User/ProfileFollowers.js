import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { withRouter } from 'react-router-dom';
import titleWrapper from 'titleWrapper';
import styled from 'styled-components';

import UserCard from './components/UserCard';
import InfiniteList from 'components/InfiniteList';
import { selectFollowersAccounts, selectFollowersFromUser } from './selectors';
import { getFollowersBegin } from './actions/getFollowers';


function ProfileFollowers(props) {
  const { getFollowers, followersAccounts, followersFromUser } = props;
  return (
    <div>
      {!isEmpty(followersFromUser) && (
        <InfiniteList
          list={followersAccounts}
          hasMore={followersFromUser.hasMore || (followersFromUser.list && followersAccounts.length < followersFromUser.list.length)}
          isLoading={followersFromUser.isLoading}
          initLoad={getFollowers}
          loadMoreCb={() => getFollowers({ addMore: true, lastFollower: followersAccounts[followersAccounts.length - 1].name })}
          itemMappingCb={user => (
            <UserCard
              key={user.id}
              user={user}
            />
          )}
        />
      )}
    </div>
  );
}

ProfileFollowers.defaultProps = {
  followersAccounts: [],
};

ProfileFollowers.propTypes = {
  getFollowers: PropTypes.func.isRequired,
  followersAccounts: PropTypes.array,
  followersFromUser: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => createStructuredSelector({
  followersAccounts: selectFollowersAccounts(props.match.params.accountName),
  followersFromUser: selectFollowersFromUser(props.match.params.accountName),
});

const mapDispatchToProps = (dispatch, props) => ({
  getFollowers: query => dispatch(getFollowersBegin(props.match.params.accountName, query, true, 20)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(titleWrapper(ProfileFollowers, 'Followers')));
