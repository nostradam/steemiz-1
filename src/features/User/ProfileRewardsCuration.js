import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import titleWrapper from 'titleWrapper';
import styled from 'styled-components';

import InfiniteList from 'components/InfiniteList';
import Reward from './components/Reward';
import { selectHistoryTransfer, selectRewardsCuration } from './selectors';
import { getTransferHistoryBegin } from './actions/getTransferHistory';

export const Title = styled.h3`
  font-size: 1.3rem;
  line-height: 2rem;
  color: #a2a2a3;
  padding-left: 1rem;
  text-transform: capitalize;
`;
export const Result = styled.div`
  list-style-type: none;
  padding: 0;
  border-top: 1px solid #e6e6e6;
`;

function ProfileRewardsCuration(props) {
  const { getTransferHistory, historyTransfer: { hasMore, isLoading }, rewardsCuration } = props;
  return (
    <div>
      <Title>
        Curation Rewards History
      </Title>
      <Result>
        <InfiniteList
          list={rewardsCuration}
          hasMore={hasMore}
          isLoading={isLoading}
          initLoad={getTransferHistory}
          loadMoreCb={getTransferHistory}
          itemMappingCb={(reward, index) => (
            <Reward key={index} reward={reward} type="curation" />
          )}
        />
      </Result>
    </div>
  );
}

ProfileRewardsCuration.propTypes = {
  historyTransfer: PropTypes.object.isRequired,
  rewardsCuration: PropTypes.array.isRequired,
  getTransferHistory: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => createStructuredSelector({
  historyTransfer: selectHistoryTransfer(props.match.params.accountName),
  rewardsCuration: selectRewardsCuration(props.match.params.accountName),
});

const mapDispatchToProps = (dispatch, props) => ({
  getTransferHistory: () => dispatch(getTransferHistoryBegin(props.match.params.accountName)),
});

export default connect(mapStateToProps, mapDispatchToProps)(titleWrapper(ProfileRewardsCuration, 'Rewards Curation'));
