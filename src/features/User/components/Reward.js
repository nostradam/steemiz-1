import React from 'react';
import PropTypes from 'prop-types';
import { FormattedRelative } from 'react-intl';
import { Link } from 'react-router-dom';
import numeral from 'numeral';
import styled from 'styled-components';

const Container = styled.div`
  padding: 1rem;
  display: flex;
  
  &:nth-child(odd) {
    background-color: #f0f0f2;
  }
  
  &:nth-child(even) {
    background-color: #f8f8fb;
  }
`;
const Timestamp = styled.div`
  width: 150px;
  margin-right: 10px;
  color: #999999;
`;
const SteemPowerText = styled.span`
  color: #999999;
  margin-right: 5px;
`;

const Reward = ({ reward, type }) => {
  return (
    <Container>
      <Timestamp className="timestamp">
        <FormattedRelative value={`${reward.timestamp}Z`} />
      </Timestamp>
      {type === 'curation' && (
        <Link className="history__text"
              to={`/trending/@${reward.comment_author}/${reward.comment_permlink}`}>
          <SteemPowerText>{numeral(reward.steemPower).format('0,0.000')} STEEM POWER for</SteemPowerText>
          {`${reward.comment_author}/${reward.comment_permlink}`}
        </Link>
      )}
      {type === 'author' && (
        <Link className="history__text" to={`/trending/@${reward.author}/${reward.permlink}`}>
          <SteemPowerText>
            {reward.sbd_payout}, and {numeral(reward.steemPower).format('0,0.000')} STEEM POWER for
          </SteemPowerText>
          {`${reward.author}/${reward.permlink}`}
        </Link>
      )}
    </Container>
  )
};

Reward.propTypes = {
  reward: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
};

export default Reward;
