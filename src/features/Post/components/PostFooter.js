import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedRelative } from 'react-intl';
import IconWatch from 'material-ui/svg-icons/action/watch-later';
import IconFb from 'react-icons/lib/fa/facebook-square';
import IconTwitter from 'react-icons/lib/fa/twitter-square';
import IconLinked from 'react-icons/lib/fa/linkedin-square';
import IconComments from 'react-icons/lib/fa/comments';
import styled from 'styled-components';

import ResteemButton from '../ResteemButton';
import ContentPayoutAndVotes from 'components/ContentPayoutAndVotes';
import CommentReplyForm from 'features/Comment/CommentReplyForm';
import Author from 'components/Author';
import { displayContentNbComments } from 'utils/helpers/steemitHelpers';
import { COLOR, SIZE_SMALL } from 'styles/icons';
import SmallFlatButton from 'components/SmallFlatButton';
import SmallIconButton from 'components/SmallIconButton';
import ReplyButton from 'components/ReplyButton';

const Footer = styled.footer`
  padding: 3rem 0 1rem 0;
`;
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media screen and (max-width: 930px) {
    flex-direction: column;
  }
`;
const TimeAuthor = styled.div`
  display: flex;
  align-items: center;
  margin: 6px 15px 0 0;
  
  & > * {
    margin-right: 4px;
  }
`;
const Divider = styled.div`
  display: flex;
  align-items: center;
  
  & > div {
    display: flex;
    padding: 0 10px;
    border-left: 1px solid #8a8a8a;
  }
  
  & > div:first-child {
    border-left: 0;
  }
  
  @media screen and (max-width: 930px) {
    margin-top: 1rem;
  }
`;
const Reply = styled.div`
  border: 1px solid #efefef;
  padding: 10px;
  margin: 40px 0;
`;

export default class PostFooter extends PureComponent {
  static propTypes = {
    post: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
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
    const { post } = this.props;
    const { showReplyForm } = this.state;
    return (
      <Footer>
        <Container>
          <Divider>
            <TimeAuthor>
              <IconWatch color={COLOR} style={{ width: SIZE_SMALL }} />
              <FormattedRelative value={`${post.created}Z`} />
              <span>by</span>
              <Author name={post.author} reputation={post.author_reputation} />
            </TimeAuthor>
            <ContentPayoutAndVotes type="post" content={post} />
          </Divider>

          <Divider>
            <ResteemButton author={post.author} permlink={post.permlink} />
            <div>
              <ReplyButton onClick={this.switchReplyForm} />
            </div>
            <div>
              <SmallFlatButton
                label={displayContentNbComments(post)}
                icon={IconComments}
              />
            </div>
            <div>
              <SmallIconButton icon={IconFb} tooltip="Share on Facebook" />
              <SmallIconButton icon={IconTwitter} tooltip="Share on Twitter" />
              <SmallIconButton icon={IconLinked} tooltip="Share on Linkedin" />
            </div>
          </Divider>
        </Container>
        {showReplyForm && (
          <Reply>
            <CommentReplyForm content={post} closeForm={this.closeReplyForm} />
          </Reply>
        )}
      </Footer>
    );
  }
}
