import React, { PureComponent } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FormattedRelative } from 'react-intl';
import styled from 'styled-components';
import Body from 'components/Body';
import { sortCommentsFromSteem } from 'utils/helpers/stateHelpers';
import ContentPayoutAndVotes from 'components/ContentPayoutAndVotes';
import AvatarSteemit from 'components/AvatarSteemit';
import Author from 'components/Author';
import ReplyButton from 'components/ReplyButton';
import CommentReplyForm from './CommentReplyForm';

const Container = styled.div`
  padding: 0.5rem 0;
`;
export const Item = styled.div`
  display: flex;
  padding-bottom: 1rem;
`;
export const Detail = styled.div`
  width: 100%;
  padding: 0.2rem 1rem;
`;
const Head = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 10px;
  
  & > * {
    margin-right: 0.3rem;
  }
`;
const StyledBody = styled.div`
  & p {
    margin: 0 0 5px;
    line-height: 1.6rem;
  }
  
  & h1, & h2, & h3, & h4, & h5, & h6 {
    margin: 0 0 8px;
  } 
  
  & img {
    max-width: 100%;
  }
`;
const Footer = styled.div`
  display: flex;
  
  & > * {
    margin-right: 8px;
  }
  
  @media screen and (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;
const Child = styled.div`
  padding-left: 4rem;
  
  @media screen and (max-width: 768px) {
    padding-left: 0;
  }
`;

class CommentItem extends PureComponent {
  constructor() {
    super();
    this.state = {
      showReplyForm: false,
      isEditing: false,
    };
  }

  closeReplyForm = () => {
    this.setState({ showReplyForm: false });
  };

  switchReplyForm = () => {
    this.setState({ showReplyForm: !this.state.showReplyForm });
  };

  render() {
    const { comment, commentsChild, commentsData, sortOrder } = this.props;
    const { showReplyForm } = this.state;
    return (
      <Container>
        <Item>
          <div>
            <Link to={`/@${comment.author}`}>
              <AvatarSteemit name={comment.author} />
            </Link>
          </div>
          <Detail>
            <Head>
              <Author name={comment.author}
                      reputation={comment.author_reputation} />
              <span>
                <FormattedRelative value={`${comment.created}Z`} />
              </span>
            </Head>
            <StyledBody>
              <Body post={comment} />
            </StyledBody>
            <Footer>
              <ContentPayoutAndVotes type="comment" content={comment} />
              <ReplyButton onClick={this.switchReplyForm} />
            </Footer>
          </Detail>
        </Item>
        <Child>
          {showReplyForm && (
            <Container>
              <CommentReplyForm content={comment} closeForm={this.closeReplyForm} />
            </Container>
          )}
          {commentsChild[comment.id] && sortCommentsFromSteem(
            commentsChild[comment.id],
            commentsData,
            sortOrder
          ).map(commentId =>
            <CommentItem
              {...this.props}
              key={commentId}
              comment={commentsData[commentId]}
            />
          )}
        </Child>
      </Container>
    );
  }
}

export default withRouter(CommentItem);
