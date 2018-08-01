import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import numeral from 'numeral';
import titleWrapper from 'titleWrapper';
import styled from 'styled-components';

import UserSteemPower from './UserSteemPower';
import UserEstimatedValue from './UserEstimatedValue';
import { selectCurrentAccount } from './selectors';

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid #e6e6e6;
`;
const Title = styled.div`
  font-family: 'nunito_sanssemibold';
  display: inline-block;
  font-size: 1.3rem;
  line-height: 3rem;
  color: #a2a2a3;
  padding-left: 1rem;
`;
const Balance = styled.div`
  display: flex;
  align-items: center;
`;
const BalanceText = styled.p`
  max-width: 21rem;
  width: 100%;
  padding-right: 3rem;
  color: #9f9fa0;
  font-size: 0.9rem;
`;
const Total = styled.h4`
  color: #99d570;
  font-size: 1.3rem;
  padding: 1rem 1rem 1rem 3rem;
  margin: 0;
  border-left: 1px solid #e6e6e6;
`;
const Dols = styled.span`
  font-size: 0.8rem;
  color: #b9e09f;
`;
const WalletRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 1rem;
  
  &:nth-child(odd) {
    background-color: #f0f0f2;
  }
  
  &:nth-child(even) {
    background-color: #f8f8fb;
  }
`;
const WalletRowNumber = styled.div`
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-right: 1rem;
  
  & h3 {
    color: #99d570;
    font-size: 1.3rem;
    margin: 0;
  }
`;
const Label = styled.span`
  font-size: 0.8rem;
  color: #b9e09f;
  margin: 0;
`;

function ProfileRewards(props) {
  const { currentAccount } = props;
  const steem = parseFloat(currentAccount.balance);
  const savingBalance = parseFloat(currentAccount.savings_balance);
  const savingSbdBalance = parseFloat(currentAccount.savings_sbd_balance);
  return (
    <div>
      <Header>
        <Title>Balances</Title>
        <Balance>
          <BalanceText>
            The estimated value is based on an average value of Steem in US
            dollars.
          </BalanceText>
          <Total>
            <Dols>$</Dols><UserEstimatedValue account={currentAccount} />
          </Total>
        </Balance>
      </Header>
      <div>
        <WalletRow>
          <div>
            <h3>STEEM</h3>
            <p>
              Tradeable tokens that may be transferred anywhere at anytime.<br/>
              Steem can be converted to STEEM POWER in a process called powering up.
            </p>
          </div>
          <WalletRowNumber>
            <h3>{numeral(steem).format('0,0.000')}</h3>
            <Label>Steem</Label>
          </WalletRowNumber>
        </WalletRow>
        <WalletRow>
          <div>
            <h3>STEEM POWER</h3>
            <p>
              Influence tokens which give you more control over post payouts and allow you to earn on curation rewards.
            </p>
          </div>
          <WalletRowNumber>
            <h3><UserSteemPower account={currentAccount} /></h3>
            <Label>Steem</Label>
          </WalletRowNumber>
        </WalletRow>
        <WalletRow>
          <div>
            <h3>STEEM DOLLARS</h3>
            <p>
              Tokens worth about $1.00 of STEEM, currently collecting 0% APR.
            </p>
          </div>
          <WalletRowNumber>
            <h3>
              <Label>$</Label>
              {numeral(currentAccount.sbd_balance).format('0,0.00')}
              </h3>
          </WalletRowNumber>
        </WalletRow>
        <WalletRow>
          <div>
            <h3>SAVINGS</h3>
            <p>
              Balance subject to 3 day withdraw waiting period, STEEM DOLLARS currently collecting 0% APR.
            </p>
          </div>
          <WalletRowNumber>
            <h3>{numeral(savingBalance).format('0,0.00')}</h3>
            <Label>steem</Label>
            <h3>
              <Label>$</Label>
              {numeral(savingSbdBalance).format('0,0.00')}
            </h3>
          </WalletRowNumber>
        </WalletRow>
      </div>
    </div>
);
}

ProfileRewards.propTypes = {
  currentAccount: PropTypes.object.isRequired,
};

const mapStateToProps = () => createStructuredSelector({
  currentAccount: selectCurrentAccount(),
});

export default connect(mapStateToProps)(titleWrapper(ProfileRewards, 'Wallet'));
