import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';

import asyncComponent from 'asyncComponent';
import UserHeader from './components/UserHeader';
import UserMenu from './components/UserMenu';
import { setCurrentUserBegin } from './actions/setCurrentUser';
import { selectCurrentAccount } from './selectors';

const ProfileBlog = asyncComponent(() => import('./ProfileBlog'));
const ProfileComments = asyncComponent(() => import('./ProfileComments'));
const ProfileReplies = asyncComponent(() => import('./ProfileReplies'));
const ProfileVotes = asyncComponent(() => import('./ProfileVotes'));
const ProfileFollowers = asyncComponent(() => import('./ProfileFollowers'));
const ProfileFollowings = asyncComponent(() => import('./ProfileFollowings'));
const ProfileRewards = asyncComponent(() => import('./ProfileRewards'));
const ProfileWallet = asyncComponent(() => import('./ProfileWallet'));

const Container = styled.div`
  padding: 0.71rem 1.42rem 1.5rem 0rem;
`;
const Content = styled.div`
  overflow: hidden;
`;

class Profile extends Component {
  static propTypes = {
    account: PropTypes.shape({
      name: PropTypes.string,
      reputation: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      post_count: PropTypes.number,
      follower_count: PropTypes.number,
      following_count: PropTypes.number,
    }).isRequired,
  };

  static defaultProps = {
    account: {
      name: undefined,
      reputation: 0,
      post_count: 0,
      follower_count: 0,
      following_count: 0,
    }
  };

  componentDidMount() {
    const { match, account } = this.props;
    if (match.params.accountName !== account.name) {
      this.props.setCurrentUser(match.params.accountName);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.accountName !== this.props.match.params.accountName) {
      this.props.setCurrentUser(nextProps.match.params.accountName);
    }
  }

  render() {
    const { account, match } = this.props;
    const accountName = match.params.accountName;
    if (isEmpty(account)) {
      return <div/>;
    }
    if (match.isExact) {
      return <Redirect to={`/@${accountName}/blog`} />;
    }
    return (
      <Container>
        <UserHeader account={account} />
        <Helmet
          titleTemplate={`%s | @${accountName}`}
          defaultTitle={`@${accountName}`}
        />
        <Content>
          <UserMenu accountName={accountName} />
          <div>
            <Route path="/@:accountName/blog" exact component={ProfileBlog} />
            <Route path="/@:accountName/comments" exact component={ProfileComments} />
            <Route path="/@:accountName/replies" exact component={ProfileReplies} />
            <Route path="/@:accountName/votes" exact component={ProfileVotes} />
            <Route path="/@:accountName/followers" exact component={ProfileFollowers} />
            <Route path="/@:accountName/followings" exact component={ProfileFollowings} />
            <Route path="/@:accountName/rewards" component={ProfileRewards} />
            <Route path="/@:accountName/wallet" component={ProfileWallet} />
          </div>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state, props) => createStructuredSelector({
  account: selectCurrentAccount(),
});

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUserBegin(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
