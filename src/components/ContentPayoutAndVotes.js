import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Popover from 'material-ui/Popover';
import styled from 'styled-components';

import { getUpvotes, sortVotes } from 'utils/helpers/voteHelpers';
import CircularProgress from 'components/CircularProgress';
import SmallFlatButton from 'components/SmallFlatButton';
import Payout from 'features/Comment/Payout';
import VoteButton from 'features/Vote/VoteButton';
import VotePayout from 'features/Vote/VotePayout';
import { calculateContentPayout, formatAmount } from 'utils/helpers/steemitHelpers';

const Container = styled.div`
  display: flex;
  align-items: center;
`;
const VotingButton = styled.div`
  cursor: pointer;
  position: relative;
`;
const Voting = styled.div`
  font-weight: 600;
  margin-right: 8px;
  display: flex;
  align-items: center;
  position: relative;
`;
const StyledPopover = styled(Popover)`
  padding: 1rem;
`;
const VoteDetails = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Weight = styled.span`
  color: #d3d3d6;
  margin-left: .2rem;
`;
const VotersList = styled.div`
  font-weight: 600;
  padding-left: 7px;
  border-left: 1px solid #8a8a8a;
  position: relative;
`;

const NB_SHOW_VOTES = 15;

export default class ContentPayoutAndVotes extends PureComponent {
  static propTypes = {
    content: PropTypes.object.isRequired, // Post or comment
    type: PropTypes.oneOf(['post', 'comment']).isRequired, // post or comment
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpenMoneyCard: false,
      isOpenVoteCard: false,
      moneyAnchor: {},
      voteAnchor: {},
    };
  }

  closeCards = () => {
    this.setState({
      isOpenMoneyCard: false,
      isOpenVoteCard: false,
    })
  };

  openMoneyCard = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      isOpenMoneyCard: !this.state.isOpenMoneyCard,
      moneyAnchor: event.currentTarget,
    })
  };

  openVoteCard = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      isOpenVoteCard: !this.state.isOpenVoteCard,
      voteAnchor: event.currentTarget,
    })
  };

  render() {
    const { content, type } = this.props;
    const { isOpenMoneyCard, isOpenVoteCard } = this.state;

    const payout = calculateContentPayout(content);


    let lastVotesTooltipMsg;
    if (content.net_votes !== 0 && isOpenVoteCard) {
      const totalRshares = content.active_votes.reduce((total, vote) => total + parseInt(vote.rshares, 10), 0);
      const totalPayout = content.cashout_time.indexOf('1969') === -1 ? parseFloat(content.pending_payout_value) : parseFloat(content.total_payout_value);
      const lastVotes =
        sortVotes(getUpvotes(content.active_votes), 'rshares')
          .reverse()
          .slice(0, NB_SHOW_VOTES);

      lastVotesTooltipMsg = lastVotes.map(vote => (
        <VoteDetails key={vote.voter}>
          <div>
            <Link to={`/@${vote.voter}`}>
              {vote.voter}
            </Link>
            <Weight>({vote.percent / 100}%)</Weight>
          </div>
          <strong>
            <VotePayout vote={vote} totalRshares={totalRshares} totalPayout={totalPayout} />
          </strong>
        </VoteDetails>
      ));
      if (content.net_votes > NB_SHOW_VOTES) lastVotesTooltipMsg.push(
        <div key="...">
          ... and <strong>{content.active_votes.length - 5}</strong> more votes.
        </div>
      );
    }

    return (
      <Container>
        <VotingButton>
          <VoteButton content={content} type={type} />
        </VotingButton>
        <Voting>
          {content.isUpdating && <CircularProgress size={20} thickness={3} style={{ marginRight: 10 }} />}
          {payout === 0 ? (
            <SmallFlatButton label={formatAmount(payout)} />
          ) : (
            <SmallFlatButton onClick={this.openMoneyCard} label={formatAmount(payout)} />
          )}
          {payout !== 0 && isOpenMoneyCard && (
            <StyledPopover
              open={isOpenMoneyCard}
              anchorEl={this.state.moneyAnchor}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={this.closeCards}
              style={{ color: 'inherit' }}
            >
              <Payout content={content} />
            </StyledPopover>
          )}
        </Voting>
        <VotersList>
          {content.net_votes === 0 ? (
            <SmallFlatButton label={`${content.net_votes} votes`} />
          ) : (
            <SmallFlatButton onClick={this.openVoteCard} label={`${content.net_votes} votes`} />
          )}
          {content.net_votes !== 0 && isOpenVoteCard && (
            <StyledPopover
              open={isOpenVoteCard}
              anchorEl={this.state.voteAnchor}
              anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
              targetOrigin={{horizontal: 'left', vertical: 'top'}}
              onRequestClose={this.closeCards}
              style={{ color: 'inherit' }}
            >
              {lastVotesTooltipMsg}
            </StyledPopover>
          )}
        </VotersList>
      </Container>
    )
  }
}
