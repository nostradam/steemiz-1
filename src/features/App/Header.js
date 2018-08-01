import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import steemconnect from 'sc2-sdk';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Popover from 'material-ui/Popover';
import IconMenu from 'material-ui/svg-icons/navigation/menu';
import IconClose from 'material-ui/svg-icons/navigation/close';
import styled from 'styled-components';

import { selectMe, selectMyAccount } from 'features/User/selectors';
import { selectCurrentCategory, selectCurrentTag } from './selectors';
import { logoutBegin } from 'features/User/actions/logout';

import logo from 'styles/assets/imgs/logos/logo.png'
import PostCreate from 'features/Post/PostCreate';
import AvatarSteemit from 'components/AvatarSteemit';
import GreenButton from 'components/GreenButton';
import HeaderMenu from './components/HeaderMenu';
import Search from '../Search/PostSearchInput';

const StyledHeader = styled.header`
  min-height: 4.2rem;
  background: #fcfcfd;
  padding: .3rem 1.5rem;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  border-radius: 0;
  z-index: 10;
  will-change: transform;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  
  @media screen and (max-width: 1200px) {
    box-shadow: 0 0 10px 1px #c3c2c2;
  }
`;
const StyledHeaderSearch = styled.div`
  padding: 0.5rem 0 0.3rem;
  display: flex;
  align-items: center;
`;
const StyledCollapse = styled.div`
  display: flex;
  align-items: flex-end;
  flex-direction: column-reverse;
  overflow: hidden;
  max-width: 45rem;
  transition: max-height 0.4s ease-out;
`;
const StyledCollapseControl = styled.div`
  display: none;
  
  @media screen and (max-width: 768px) {
    display: block;
  }
`;
const CollapsedMenu = styled.div`
  display: flex;
  align-items: center;
  
  @media screen and (max-width: 768px) {
    display: ${props => props.show ? 'flex' : 'none'};
    position: fixed;
    bottom: -100%;
    background: white;
    width: 100%;
    justify-content: flex-end;
    padding: 0 1rem 1rem 0;
    left: 0;
  }
`;
const StyledUsername = styled.button`
  background: url(styles/assets/imgs/icons/arrow_down.png) transparent no-repeat calc(100% - 15px) center/12px;
  cursor: pointer;
  color: #999;
  padding: 0.5rem 2.5rem;
  border: 0;
  font-size: 15px;
  
  @media screen and (min-width: 1600px) {
    max-width: 18rem;
  }
`;
const StyledPopover = styled(Popover)`
  min-width: 20rem;
  border-radius: 0.5rem !important;
`;
const StyledConnect = styled.div`
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
`;

class Header extends Component {
  static propTypes = {
    me: PropTypes.string.isRequired,
    currentCategory: PropTypes.string.isRequired,
    currentTag: PropTypes.string,
    myAccount: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.state = {
      filter: {
        post: 1,
        category: "videos",
      },
      dropdownMenu: {
        open: false,
      },
      collapseOpen: false,
    }
  }

  handleCloseDropdownMenu = () => {
    this.setState({
      dropdownMenu: {
        open: false,
      }
    });
  };

  handleControlCollapse = () => {
    this.setState({
      collapseOpen: !this.state.collapseOpen
    });
  };

  handleShowDropdownMenu = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      dropdownMenu: {
        open: true,
        anchorEl: event.currentTarget,
      }
    })
  };

  render() {
    const { me, myAccount, currentTag, currentCategory } = this.props;
    const { filter, dropdownMenu, collapseOpen } = this.state;
    return (
      <StyledHeader>
        <StyledHeaderSearch>
          <Link to="/" id="logo">
            <img src={logo} alt="logo" />
          </Link>
          <Search />
        </StyledHeaderSearch>
        {me && (
          <StyledCollapse>
            {/*<SelectField
              style={{ fontSize: '.9rem' }}
              value={currentCategory}
              className="select_filter"
              maxHeight={400}
              autoWidth={true}
            >
              <MenuItem value="trending" key="trending" primaryText={<Link className="menu_link" to={`/trending${currentTag ? `/${currentTag}` : ''}`}>trending</Link>} />
              <MenuItem value="created" key="created" primaryText={<Link className="menu_link" to={`/created${currentTag ? `/${currentTag}` : ''}`}>new</Link>} />
              <MenuItem value="hot" key="hot" primaryText={<Link className="menu_link" to={`/hot${currentTag ? `/${currentTag}` : ''}`}>hot</Link>} />
              <MenuItem value="promoted" key="promoted" primaryText={<Link className="menu_link" to="/promoted">promoted</Link>} />
            </SelectField>
            <SelectField
              style={{ fontSize: '.9rem' }}
              value={filter.category}
              className="select_filter"
              maxHeight={400}
              autoWidth={true}
            >
              <MenuItem value="videos" key={1} primaryText="videos only" />
              <MenuItem value="articles" key={2} primaryText="articles only" />
            </SelectField>
            <SelectField
              style={{ fontSize: '.9rem' }}
              value="EN"
              className="select_filter"
              autoWidth={true}
            >
              <MenuItem value="EN" key={1} primaryText="EN" />
              <MenuItem value="FR" key={2} primaryText="FR" />
            </SelectField>*/}
            <CollapsedMenu show={collapseOpen}>
              <PostCreate />
              <StyledUsername onClick={this.handleShowDropdownMenu}>
                {me}
              </StyledUsername>
              <div>
                <AvatarSteemit name={me} votingPower={myAccount.voting_power} />
              </div>
              <StyledPopover
                open={dropdownMenu.open}
                anchorEl={dropdownMenu.anchorEl}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                onRequestClose={this.handleCloseDropdownMenu}
                onClick={this.handleCloseDropdownMenu}
              >
                <HeaderMenu me={me} logout={this.props.logout}
                            closeMenu={this.handleCloseDropdownMenu} />
              </StyledPopover>
            </CollapsedMenu>
            <StyledCollapseControl>
              <IconButton onClick={this.handleControlCollapse}>
                {collapseOpen ? <IconClose /> : <IconMenu />}
              </IconButton>
            </StyledCollapseControl>
          </StyledCollapse>
        )}
        {!me && (
          <div>
            <StyledConnect>
              <a href={steemconnect.getLoginURL()}>
                <GreenButton>Connect</GreenButton>
              </a>
            </StyledConnect>
          </div>
        )}
      </StyledHeader>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  me: selectMe(),
  myAccount: selectMyAccount(),
  currentCategory: selectCurrentCategory(),
  currentTag: selectCurrentTag(),
});

const mapDispatchToProps = (dispatch, props) => ({
  logout: () => dispatch(logoutBegin()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
