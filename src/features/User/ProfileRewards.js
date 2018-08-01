import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { NavLink, Route } from 'react-router-dom';
import numeral from 'numeral';
import titleWrapper from 'titleWrapper';
import styled from 'styled-components';

import { selectLastWeekRewardsAuthor, selectLastWeekRewardsCuration } from './selectors';
import asyncComponent from 'asyncComponent';

const TabTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e7e7e8;
  margin-bottom: .5rem;
`;
const TabKey = styled(NavLink)`
  font-family: 'nunito_sanssemibold';
  color: #d4d4d4;
  display: inline-block;
  border-bottom: 1px solid transparent;
  margin: 0 2.3rem -1px 0.6rem;
  font-size: 1.1rem;
  cursor: pointer;
  line-height: 5rem;
  
  &:hover {
    color: #4aa7f4;
    border-bottom: 1px solid #4aa7f4;
    transition: 0.4s ease;
  }
  
  &.active {
    color: #4aa7f4;
  }
`;
const Statistic = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const StatText = styled.p`
  color: #9f9fa0;
  font-size: 0.9rem;
  line-height: 1.2rem;
  margin-right: 3rem;
`;
const StatNumber = styled.div`
  border-left: 1px solid #e6e6e6;
  padding: 1rem 1rem 1rem 3rem;
  
  & h3 {
    margin: 0;
    color: #4aa7f4;
    font-size: 1.3rem;
  }
  
  & p {
    color: #b1d7f8;
    font-size: 0.8rem;
    margin: 0;
  }
`;

const ProfileRewardsCuration = asyncComponent(() => import('./ProfileRewardsCuration'), 'features/User/ProfileRewardsCuration');
const ProfileRewardsAuthor = asyncComponent(() => import('./ProfileRewardsAuthor'), 'features/User/ProfileRewardsAuthor');

const RewardStat = props => (
  <Statistic>
    <StatText>
      Estimated {props.type} rewards last week
    </StatText>
    <StatNumber>
      <h3>{numeral(props.estimation).format('0,0.000')}</h3>
      <p>Steem Power</p>
    </StatNumber>
  </Statistic>
);

function ProfileRewards(props) {
  const { lastWeekRewardsCuration, lastWeekRewardsAuthor, match } = props;
  const accountName = match.params.accountName;
  return (
    <div>
      <TabTitle>
        <div>
          <TabKey activeClassName="active" to={`/@${accountName}/rewards`} exact>Curation</TabKey>
          <TabKey activeClassName="active" to={`/@${accountName}/rewards/author`} exact>Author</TabKey>
        </div>
        <Route path={`${match.path}`} exact render={props => <RewardStat type="curation" estimation={lastWeekRewardsCuration} />} />
        <Route path={`${match.path}/author`} exact render={props => <RewardStat type="author" estimation={lastWeekRewardsAuthor} />} />
      </TabTitle>
      <Route path={`${match.path}`} exact component={ProfileRewardsCuration} />
      <Route path={`${match.path}/author`} exact component={ProfileRewardsAuthor} />
    </div>
  );
}

const mapStateToProps = (state, props) => createStructuredSelector({
  lastWeekRewardsAuthor: selectLastWeekRewardsAuthor(props.match.params.accountName),
  lastWeekRewardsCuration: selectLastWeekRewardsCuration(props.match.params.accountName),
});

ProfileRewards.propTypes = {
  lastWeekRewardsAuthor: PropTypes.number.isRequired,
  lastWeekRewardsCuration: PropTypes.number.isRequired,
};

export default connect(mapStateToProps)(titleWrapper(ProfileRewards, 'Rewards'));
