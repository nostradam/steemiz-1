import React, { Component } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import IconSearch from 'material-ui/svg-icons/action/search';
import AutoComplete from 'material-ui/AutoComplete';
import debounce from 'lodash/debounce';
import { COLOR_INACTIVE } from 'styles/icons';
import { selectPostSearch, selectPostSuggestions } from './selectors';

import CircularProgress from 'components/CircularProgress';
import { postSearchInit } from 'features/Search/actions/postSearch';
import { suggestBegin } from 'features/Search/actions/suggest';
import styled from 'styled-components';

const StyledSearch = styled.div`
  margin: 0 0.4rem 0 1rem;
  height: 2.9rem;
  width: 20rem;
  background: #ffffff;
  border-radius: 2rem;
  border: 1px solid #f0f0f2;
  display: flex;
  align-items: center;
  padding: 0 15px;
  
  @media screen and (max-width: 480px) {
    width: 14rem;
  }
`;
const StyledSearchInput = styled(AutoComplete)`
  font-family: 'nunito_sanssemibold';
  color: #999999;
  border: 0;
  border-radius: 2rem;
  margin-left: 6px;
  width: 100%;
  
  &:focus {
    outline: 0;
  }
`;

class PostSearchInput extends Component {
  handleInput = term => {
    if (term) {
      this.props.suggest(term);
    }
  };

  validate = term => {
    if (term !== this.props.postSearch.q) {
      this.props.initSearch();
    }
    this.props.history.push(`/search/${term}`);
  };

  render() {
    const { isLoading } = this.props.postSearch;
    return (
      <StyledSearch>
        <IconSearch color={COLOR_INACTIVE} />
        <StyledSearchInput
          style={{ width: 244 }}
          hintText="Search for posts"
          underlineShow={false}
          dataSource={this.props.postSuggestions}
          onUpdateInput={debounce(this.handleInput, 500)}
          onNewRequest={this.validate}
        />
        {isLoading && <CircularProgress size={20} thickness={3} />}
      </StyledSearch>
    );
  }
}

const mapStateToProps = () => createStructuredSelector({
  postSuggestions: selectPostSuggestions(),
  postSearch: selectPostSearch(),
});

const mapDispatchToProps = dispatch => ({
  initSearch: () => dispatch(postSearchInit()),
  suggest: term => dispatch(suggestBegin(term)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PostSearchInput));
