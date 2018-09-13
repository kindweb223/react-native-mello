import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native'
import PropTypes from 'prop-types'

import { Actions } from 'react-native-router-flux'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import styles from './styles'
const COMMENT_ICON_B = require('../../../assets/images/Comment/Blue.png')
const COMMENT_ICON_G = require('../../../assets/images/Comment/Grey.png')

export default class CommentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  onComment() {
    if (this.props.onComment) {
      this.props.onComment();
    }
    Actions.CommentScreen({
      idea: this.props.idea,
    });
  }

  render() {
    const {
      comments,
    } = this.props.idea.metadata;
    return (
      <TouchableOpacity 
        style={styles.buttonWrapper}
        activeOpacity={0.7}
        onPress={() => this.onComment()}
      >
        {comments > 0
          ? <Image source={COMMENT_ICON_B} style={styles.commentIcon} />
          : <Image source={COMMENT_ICON_G} style={styles.commentIcon} />
        }
        <Text style={styles.iconText}>{comments}</Text>
      </TouchableOpacity>
    );
  }
}

CommentComponent.propTypes = {
  idea: PropTypes.objectOf(PropTypes.any).isRequired,
  onComment: PropTypes.func,
}
