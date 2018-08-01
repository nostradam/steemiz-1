import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import IconView from 'material-ui/svg-icons/action/view-quilt';
import IconStar from 'material-ui/svg-icons/toggle/star';
import IconRss from 'material-ui/svg-icons/communication/rss-feed';
import IconAccountCircle from 'material-ui/svg-icons/action/account-circle';
import IconSettings from 'material-ui/svg-icons/action/settings';
import styled from 'styled-components';

import LeftSideBarItem from './components/LeftSideBarItem';
import { selectMe } from '../User/selectors';

const StyledAside = styled.aside`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: fixed;
  top: 5.7rem;
  bottom: 0;
  left: 0;
  width: 5.5rem;
  padding: 1rem;
  text-align: center;
  z-index: 1;
  will-change: transform;
`;

function LeftSideBar(props) {
  const { me } = props;
  if (!me) {
    return '';
  }
  return (
    <StyledAside>
      <div>
        <LeftSideBarItem to="/" label="All post" icon={IconView} />
        {/*<LeftSideBarItem to={`/@${me}/feed`} label="Following Feed" icon={IconStar} />
        <LeftSideBarItem to={`/@${me}/blog`} label="My Blog" icon={IconRss} />*/}
      </div>
      <div>
        <LeftSideBarItem to={`/@${me}`} label="Profile" icon={IconAccountCircle} exact={false} />
        {/*<LeftSideBarItem to="#" label="Settings" icon={IconSettings} />*/}
      </div>
    </StyledAside>
  );
}

const mapStateToProps = createStructuredSelector({
  me: selectMe(),
});

export default withRouter(connect(mapStateToProps)(LeftSideBar));
