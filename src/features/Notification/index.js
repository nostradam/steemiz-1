import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import IconDone from 'material-ui/svg-icons/action/done';
import IconError from 'material-ui/svg-icons/alert/error';
import IconWarning from 'material-ui/svg-icons/alert/warning';
import { lightGreen500, red500, yellow500 } from 'material-ui/styles/colors';
import { selectNotificationState } from './selectors';
import { actionLaunchBegin, close } from './actions/notification';
import styled from 'styled-components';

const DivNotification = styled.div`
  display: flex;
  align-items: center;
  
  & svg {
    margin-right: 10px;
  }
`;

function Notification(props) {
  const { close, notificationState, actionLaunch } = props;
  const { isOpen, status, message, actionName, actionFunction } = notificationState;
  let statusIcon = '';
  if (status === 'success') {
    statusIcon = <IconDone color={lightGreen500} />
  } else if (status === 'warning') {
    statusIcon = <IconWarning color={yellow500} />
  } else if (status === 'fail') {
    statusIcon = <IconError color={red500} />
  }

  return (
    <Snackbar
      open={isOpen}
      message={<DivNotification>{statusIcon}<span>{message}</span></DivNotification>}
      bodyStyle={{ padding: '0 20px 0 10px' }}
      action={actionName}
      autoHideDuration={4000}
      onActionClick={() => actionLaunch(actionFunction)}
      onRequestClose={close}
    />
  );
}

Notification.propTypes = {
  notificationState: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    actionName: PropTypes.string,
    actionFunction: PropTypes.func,
    status: PropTypes.oneOf(['success', 'warning', 'fail', '']),
  }).isRequired,
  close: PropTypes.func.isRequired,
  actionLaunch: PropTypes.func.isRequired,
};

const mapStateToProps = () => createStructuredSelector({
  notificationState: selectNotificationState(),
});

const mapDispatchToProps = dispatch => ({
  close: () => dispatch(close()),
  actionLaunch: actionFunction => dispatch(actionLaunchBegin(actionFunction)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
