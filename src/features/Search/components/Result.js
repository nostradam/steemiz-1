import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormattedRelative } from 'react-intl';
import isEmpty from 'lodash/isEmpty';
import IconFavorite from 'material-ui/svg-icons/action/favorite';
import IconSms from 'material-ui/svg-icons/notification/sms';
import Author from 'components/Author';
import CircularProgress from 'components/CircularProgress';
import { COLOR, COLOR_HOVER, SIZE_SMALL } from 'styles/icons';
import { formatAmount, } from 'utils/helpers/steemitHelpers';
import { Post, PictureLink, Content, Title, Description, InfoBlock, Details, Price, SocialLink, Info, Block } from 'components/ContentItem';

const Result = ({ content, placeholderImg }) => {
  const mainTag = content.tags[0];
  const contentLink = `/${mainTag}/@${content.author}/${content.permlink}`;
  const pending = content.pending_payout_value || 0;
  const total = (!isEmpty(content.total_payout_value) && content.total_payout_value.amount) ? content.total_payout_value.amount : 0;
  const payout = pending + total;
  return (
    <Post>
      {(content.main_img || placeholderImg) && (
        <PictureLink
          to={contentLink}
          style={{background: `url(${content.main_img}) no-repeat #eee center center / cover`}}
        />
      )}
      <Content>
        <Link to={contentLink} className="post_card__block">
          <Title>{content.title}</Title>
        </Link>
        <Link to={contentLink} className="post_card__block">
          <Description>{content.summary}</Description>
        </Link>
        <InfoBlock>
          <Details>
            <Price>
              {content.isUpdating && <CircularProgress size={20} thickness={3} style={{ marginRight: 10 }} />}
              {formatAmount(payout)}
            </Price>
            <SocialLink to="/" title="Favorites" className="social_area social_area--like">
              <IconFavorite color={COLOR} hoverColor={COLOR_HOVER} style={{ width: SIZE_SMALL, margin: '0 0.3rem' }} />
              <span>{content.net_votes}</span>
            </SocialLink>
            <SocialLink title="Responses" to={contentLink} className="social_area social_area--comment">
              <IconSms color={COLOR} hoverColor={COLOR_HOVER} style={{ width: SIZE_SMALL, margin: '0 0.3rem' }} />
              <span>{content.children}</span>
            </SocialLink>
          </Details>
          <Info>
            <Block>
              <span>by </span>
              <Author name={content.author} />
            </Block>
            <Block>
              <FormattedRelative value={`${content.created}Z`} /> in <Link to={`/trending/${mainTag}`}>{mainTag}</Link>
            </Block>
          </Info>
        </InfoBlock>
      </Content>
    </Post>
  );
};

Result.propTypes = {
  content: PropTypes.object.isRequired,
  placeholderImg: PropTypes.bool,
};

Result.defaultProps = {
  placeholderImg: false,
};

export default Result;
