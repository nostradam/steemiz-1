import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedRelative } from 'react-intl';
import CircularProgress from 'components/CircularProgress';
import extractDesc from 'utils/helpers/extractDesc';
import IconFavorite from 'material-ui/svg-icons/action/favorite';
import IconSms from 'material-ui/svg-icons/notification/sms';
import IconReply from 'material-ui/svg-icons/content/reply';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import styled from 'styled-components';

import Author from './Author';
import VoteButton from 'features/Vote/VoteButton';
import {
  calculateContentPayout,
  displayContentNbComments,
  formatAmount,
} from 'utils/helpers/steemitHelpers';
import { COLOR, COLOR_HOVER, COLOR_LIGHT_TEXT, SIZE_SMALL } from 'styles/icons';

export const Post = styled.div`
  position: relative;
  display: flex;
  background: #ffffff;
  margin: 1rem 0 1.5rem 0;
  transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
`;
export const PictureLink = styled(Link)`
  width: 20%;
  
  @media screen and (max-width: 768px) {
    display: none;
  }
`;
export const Content = styled.div`
  padding: 1.3rem;
  color: #999;
  max-width: 100%;
`;
export const Title = styled.h3`
  color: #6f6f6f;
  margin: 0 0 0.4rem;
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
`;
export const Description = styled.p`
  color: #999;
  margin: 0;
  line-height: 1.4rem;
  max-height: 2.8rem;
  overflow: hidden;
`;
export const ResteemedBy = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: .8rem;
  font-style: italic;
`;
export const InfoBlock = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
`;
export const Details = styled.div`
  display: flex;
  align-items: center;
`;
export const Info = styled.div`
  display: flex;
  align-items: center;
`;
export const Price = styled.div`
  color: #7bb54d;
  font-size: 1.3rem;
  font-family: 'nunito_sanssemibold';
  margin: 0 0.5rem 0 0;
  display: flex;
`;
export const SocialLink = styled(Link)`
  color: #cccccc;
  border-radius: 0.3rem;
  margin: 0 0.25rem;
  padding: 0.2rem 0.5rem;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  
  @media screen and (max-width: 768px) {
    display: none;
  }
`;
export const Block = styled.div`
  margin: .3rem 1rem;
`;

function ContentItem(props) {
  const { content, type, currentCategory } = props;
  const payout = calculateContentPayout(content);
  const splitUrl = content.url.split('#');
  const linkUrl = splitUrl[0];
  const hashUrl = splitUrl[1] ? `#${splitUrl[1]}` : '';
  const isResteemed = content.reblogged_by.length > 0;
  const resteemedBy = content.reblogged_by[0];
  return (
    <Post>
      {type === 'post' && content.main_img && (
        <PictureLink
          to={{ pathname: linkUrl, hash: hashUrl }}
          style={{background: `url(${content.main_img}) no-repeat #eee center center / cover`}}
        />
      )}
      <Content>
        <div>
          <Link to={{ pathname: linkUrl, hash: hashUrl }}>
            <Title>{content.title || content.root_title}</Title>
          </Link>
          {isResteemed && (
            <ResteemedBy>
              <Chip labelColor={COLOR_LIGHT_TEXT}>
                <Avatar>
                  <IconReply color="white" style={{ width: SIZE_SMALL, margin: '0 0.3rem' }} />
                </Avatar>
                Resteemed by {' '}<Link to={`/@${resteemedBy}`}>{resteemedBy}</Link>
              </Chip>
            </ResteemedBy>
          )}
        </div>
        <Link to={{ pathname: linkUrl, hash: hashUrl }}>
          <Description>{extractDesc(content)}</Description>
        </Link>
        <InfoBlock>
          <Details>
            <VoteButton content={content} type={type} />
            <Price>
              {content.isUpdating && <CircularProgress size={20} thickness={3} style={{ marginRight: 10 }} />}
              {formatAmount(payout)}
            </Price>
            <SocialLink to="/" title="Favorites">
              <IconFavorite color={COLOR} hoverColor={COLOR_HOVER} style={{ width: SIZE_SMALL, margin: '0 0.3rem' }} />
              <span>{content.net_votes}</span>
            </SocialLink>
            <SocialLink title="Responses" to={{ pathname: linkUrl, hash: hashUrl }}>
              <IconSms color={COLOR} hoverColor={COLOR_HOVER} style={{ width: SIZE_SMALL, margin: '0 0.3rem' }} />
              <span>{displayContentNbComments(content)}</span>
            </SocialLink>
          </Details>
          <Info>
            <Block>
              <span>by </span>
              <Author name={content.author} reputation={content.author_reputation} />
            </Block>
            <Block>
              <FormattedRelative value={`${content.created}Z`} /> in <Link to={`/${currentCategory}/${content.category}`}>{content.category}</Link>
            </Block>
          </Info>
        </InfoBlock>
      </Content>
    </Post>
  );
}

ContentItem.defaultProps = {
  currentCategory: 'trending',
};

ContentItem.propTypes = {
  type: PropTypes.oneOf([
    'post', 'comment',
  ]).isRequired,
  content: PropTypes.object.isRequired,
  currentCategory: PropTypes.string,
};

export default ContentItem;