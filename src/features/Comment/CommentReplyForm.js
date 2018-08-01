import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import AvatarSteemit from 'components/AvatarSteemit';
import { Item, Detail } from './CommentItem';
import { selectMe } from 'features/User/selectors';
import { replyBegin } from './actions/reply';

class CommentReplyForm extends Component {
  static propTypes = {
    content: PropTypes.object.isRequired,
    closeForm: PropTypes.func.isRequired,
    me: PropTypes.string.isRequired,
  };

  constructor() {
    super();
    this.state = {
      body: '',
    }
  }

  onChange = (evt, val) => {
    this.setState({ body: val });
  };

  reply = () => {
    this.props.reply(this.state.body);
    this.props.closeForm();
  };

  render() {
    const { closeForm, me } = this.props;
    const { body } = this.state;
    return (
      <Item>
        <AvatarSteemit name={me} />
        <Detail>
          <TextField
            name="comment-reply"
            value={body}
            multiLine
            fullWidth
            hintText="Reply"
            onChange={this.onChange}
          />
          <div>
            <RaisedButton
              label="Post"
              primary={true}
              onClick={this.reply}
            />
            <FlatButton
              label="Close"
              primary={true}
              onClick={closeForm}
            />
          </div>
        </Detail>
      </Item>
    );
  }
}

const mapStateToProps = () => createStructuredSelector({
  me: selectMe(),
});

const mapDispatchToProps = (dispatch, props) => ({
  reply: body => dispatch(replyBegin(props.content, body)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommentReplyForm);