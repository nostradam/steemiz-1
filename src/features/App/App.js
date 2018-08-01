import React, { Component } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import { Helmet } from 'react-helmet';

import ScrollToTop from 'components/ScrollToTop';
import { selectAppProps, selectIsSidebarOpen } from './selectors';
import { getAppConfigBegin } from './actions/getAppConfig';
import Header from './Header';
import LeftSideBar from './LeftSideBar';
import RightSideBar from './RightSideBar';
import Notification from 'features/Notification';
import Routes from 'Routes';
import styled from 'styled-components';

const AppContainer = styled.div`
  background: #f8f8fb;
  border-radius: 0;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;
const AppContent = styled.div`
  background: #f8f8fb;
  padding: 5rem 0 0 0;
  transition: 0.4s ease;
`;
const ContentInner = styled.div`
  height: 100%;
  width: 100%;
  padding: 1rem 1rem 0 1rem;
  
  @media screen and (max-width: 768px) {
    font-size: 12px;
  }
`;

class App extends Component {

  componentDidMount() {
    if (isEmpty(this.props.appProps)) {
      this.props.getAppConfig();
    }
  }

  render() {
    const { isSidebarOpen } = this.props;
    return (
      <ScrollToTop>
        <AppContainer>
          <Helmet>
            <meta charSet="utf-8" />
            <title>Nulscommunity</title>
          </Helmet>
          <Header />
          {/*<LeftSideBar />*/}
          {/*<RightSideBar />*/}
          <AppContent>
            <ContentInner>
              <Routes />
            </ContentInner>
          </AppContent>
          <Notification />
        </AppContainer>
      </ScrollToTop>
    );
  }
}

const mapStateToProps = (state, props) => createStructuredSelector({
  appProps: selectAppProps(),
  isSidebarOpen: selectIsSidebarOpen(),
});

const mapDispatchToProps = (dispatch, props) => ({
  getAppConfig: () => dispatch(getAppConfigBegin()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
