import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { Link } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';

import Body from 'components/Body';
import AvatarSteemit from 'components/AvatarSteemit';
import Author from 'components/Author';
import InfiniteList from 'components/InfiniteList';
import CommentItem from 'features/Comment/CommentItem';
import PostRelated from 'features/Search/PostRelated';
import { getCommentsFromPostBegin } from 'features/Comment/actions/getCommentsFromPost';
import {
  selectCommentsChild,
  selectCommentsData,
  selectCommentsIsLoading
} from 'features/Comment/selectors';
import { selectIsConnected } from 'features/User/selectors';
import { selectCurrentComments, selectCurrentPost } from './selectors';
import { getOnePostBegin, setCurrentPostId } from './actions/getOnePost';
import PostTags from './components/PostTags';
import PostFooter from './components/PostFooter';

const Post = styled.div`
  background: #ffffff;
  border-radius: 2px;
  padding: 2rem 1.5rem;
`;
const Content = styled.div`
  max-width: 70rem;
  margin: 0 auto;
`;
const ContentLarge = styled.div`
  max-width: 80rem;
  margin: 2rem auto;
  padding-top: 3rem;
`;
const Article = styled.article`
  line-height: 1.58;
  letter-spacing: -.003em;
`;
const StyledBody = styled.div`
  & img {
    max-width: 100%;
  }
`;
const Title = styled.h1`
  color: #333;
`;
const BlockAuthor = styled.div`
  padding: 1rem 0;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  
  & > * {
    margin-right: .3rem;
  }
`;
const SignUp = styled.div`
  text-align: center;
  padding: 1rem 0 2.2rem;
  border-top: 1px solid #d5d5d5;
  border-bottom: 1px solid #d5d5d5;
`;

class PostRead extends Component {
  static defaultProps = {
    location: {
      state: undefined,
    }
  };

  static propTypes = {
    location: PropTypes.shape({
      state: PropTypes.shape({
        postId: PropTypes.number,
      }),
    }).isRequired,
    getOnePost: PropTypes.func.isRequired,
    setCurrentPostId: PropTypes.func.isRequired,
    getCommentsFromPost: PropTypes.func.isRequired,
    isConnected: PropTypes.bool.isRequired,
    post: PropTypes.object,
    commentsData: PropTypes.object.isRequired,
    commentsChild: PropTypes.object.isRequired,
    currentComments: PropTypes.object,
    commentsIsLoading: PropTypes.bool.isRequired,
  };

  constructor() {
    super();
    this.state = {
      nbCommentsDisplayed: 10,
    };
  }

  componentDidMount() {
    const { match: { params : { author, permlink }} } = this.props;
    this.props.getOnePost(author, permlink);
  }

  componentWillReceiveProps(nextProps) {
    if (isEmpty(nextProps.currentComments) && nextProps.commentsIsLoading === false) {
      const { match: { params : { topic, author, permlink }}} = nextProps;
      this.props.getCommentsFromPost(topic, author, permlink);
    }

    const { match: { params : { author, permlink }} } = this.props;
    const nextAuthor = nextProps.match.params.author;
    const nextPermlink = nextProps.match.params.permlink;
    if (author !== nextAuthor || permlink !== nextPermlink) {
      this.props.getOnePost(nextAuthor, nextPermlink);
    }
  }

  componentWillUnmount() {
    this.props.setCurrentPostId(undefined);
  }

  addMoreComments = () => {
    this.setState({
      nbCommentsDisplayed: this.state.nbCommentsDisplayed + 10,
    });
  };

  render() {
    const { post, currentComments, commentsData, commentsChild, commentsIsLoading, isConnected } = this.props;
    const { nbCommentsDisplayed } = this.state;
    let listComments, listCommentsDisplayed = [];
    if (!isEmpty(currentComments)) {
      listComments = currentComments.list;
      listCommentsDisplayed = listComments.slice(0, nbCommentsDisplayed);
    }
    return (
      <div>
        {!isEmpty(post) && (
          <Post>
            <Helmet>
              <title>{post.title}</title>
            </Helmet>
            <Content>
              <Article>
                <Title>{post.title}</Title>
                <BlockAuthor>
                  <AvatarSteemit name={post.author} />
                  <Author name={post.author} reputation={post.author_reputation} />
                  <span>in</span>
                  <Link to={`/trending/${post.category}`}>{post.category}</Link>
                </BlockAuthor>
                <StyledBody>
                  <Body post={post} jsonMetadata={post.json_metadata} />
                </StyledBody>
              </Article>
            </Content>
            <ContentLarge>
              {post.json_metadata.tags ? <PostTags post={post} /> : <div />}
              <PostFooter post={post} />
            </ContentLarge>
            {!isConnected && (
              <SignUp>
                <p>Authors get paid when people like you upvote their post.</p>
                <p>Join our amazing community to comment and reward others.</p>
                <Link to="/signup">
                  <RaisedButton
                    label="Sign up now to receive FREE STEEM"
                    primary={true}
                    labelStyle={{ textTransform: 'initial' }}
                    buttonStyle={{ background: "#368dd2" }}
                  >
                  </RaisedButton>
                </Link>
              </SignUp>
            )}
            <ContentLarge className={isConnected ? 'border_top' : ''}>
              <InfiniteList
                list={listCommentsDisplayed}
                hasMore={listComments && listComments.length > nbCommentsDisplayed}
                isLoading={commentsIsLoading}
                loadMoreCb={this.addMoreComments}
                itemMappingCb={commentId =>
                  <CommentItem
                    key={commentId}
                    comment={commentsData[commentId]}
                    commentsData={commentsData}
                    commentsChild={commentsChild}
                  />}
              />
            </ContentLarge>
          </Post>
        )}
      </div>
    );
  }
}

const mapStateToProps = () => createStructuredSelector({
  post: selectCurrentPost(),
  commentsData: selectCommentsData(),
  commentsChild: selectCommentsChild(),
  currentComments: selectCurrentComments(),
  commentsIsLoading: selectCommentsIsLoading(),
  isConnected: selectIsConnected(),
});

const mapDispatchToProps = dispatch => ({
  getOnePost: (author, permlink) => dispatch(getOnePostBegin(author, permlink)),
  setCurrentPostId: id => dispatch(setCurrentPostId(id)),
  getCommentsFromPost: (category, author, permlink) => dispatch(getCommentsFromPostBegin(category, author, permlink)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostRead);
