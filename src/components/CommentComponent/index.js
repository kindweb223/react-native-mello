import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import PropTypes from 'prop-types'

import { Actions } from 'react-native-router-flux'
import Feather from 'react-native-vector-icons/Feather'

import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import styles from './styles'


export default class CommentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  onComment() {
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
        <Feather name="message-square" size={16} color={COLORS.LIGHT_GREY} />
        <Text style={styles.iconText}>{comments}</Text>
      </TouchableOpacity>
    );
  }
}

CommentComponent.propTypes = {
  idea: PropTypes.objectOf(PropTypes.any).isRequired,
}
