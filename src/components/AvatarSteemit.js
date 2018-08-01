import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'material-ui/Avatar';
import CircularProgress from 'material-ui/CircularProgress';
import styled from 'styled-components';

const StyledAvatarSteemit = styled.div`
  position: relative;
  border: solid lightgrey;
  border-radius: 100%;
  box-sizing: content-box;
  
  &:hover .avatar-hover {
    opacity: 1;
  }
`;
const StyledAvatar = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const StyledAvatarHover = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background: rgba(64, 193, 152, 0.6);
  opacity: 0;
  transition: 0.3s ease;
  color: white;
  position: absolute;
  font-family: Roboto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const AvatarSteemit = ({ name, size, votingPower }) => {
  const percentVotingPower = votingPower ? parseInt(votingPower / 100, 10) : 0;
  let borderWidth = 2;
  borderWidth = votingPower ? borderWidth : 0;
  const fontWeight = size <= 48 ? '400' : '200';
  return (
    <StyledAvatarSteemit style={{ borderWidth: borderWidth, width: size + 5, height: size + 5 }}>
      {votingPower && <CircularProgress
        mode="determinate"
        value={percentVotingPower}
        style={{
          position: 'absolute',
          transform: 'translate(-50%,-50%)',
          top: '50%',
          left: '50%',
        }}
        innerStyle={{
          transform: 'rotate(-90deg)',
        }}
        size={size + borderWidth * 5}
        thickness={borderWidth}
      />}
      <StyledAvatar>
        <Avatar
          src={`${process.env.REACT_APP_STEEMCONNECT_IMG_HOST}/@${name}?s=${size}`}
          backgroundColor="#999"
          size={size}
          style={{ display: 'block' }}
        />
      </StyledAvatar>
      {votingPower && (
        <StyledAvatarHover className="avatar-hover" style={{ fontWeight: fontWeight, width: size, height: size }}>
          <span style={{ fontSize: size / 2.5 }}>{percentVotingPower}</span>
        </StyledAvatarHover>
      )}
    </StyledAvatarSteemit>
  )
};

AvatarSteemit.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
  votingPower: PropTypes.number,
};

AvatarSteemit.defaultProps = {
  size: 48,
  votingPower: undefined,
};

export default AvatarSteemit;
