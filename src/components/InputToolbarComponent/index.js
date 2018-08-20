import React from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import PropTypes from 'prop-types'

import { Actions } from 'react-native-router-flux'
import Feather from 'react-native-vector-icons/Feather'

import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import styles from './styles'


export default class InputToolbarComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  onSend() {
    if (this.props.comment) {
      if (this.props.onSend) {
        this.props.onSend()
      }
    }
  }

  onChangeText(value) {
    if (this.props.onChangeText) {
      this.props.onChangeText(value)
    }
  }

  focus() {
    this.textInputRef.focus();
  }

  render() {
    const {
      showKeyboard,
    } = this.props;

    return (
      <View style={[styles.container, showKeyboard && styles.shadowContainer]}>
        <View style={styles.rowContainer}>
          <TextInput
            ref={ref => this.textInputRef = ref}
            style={styles.textInput}
            placeholder='Type comment...'
            autoCorrect={false}
            multiline={true}
            underlineColorAndroid='transparent'
            value={this.props.comment}
            onChangeText={(value) => this.onChangeText(value)}
          />
          <TouchableOpacity
            style={[styles.buttonContainer, {backgroundColor: this.props.comment ? COLORS.PURPLE : COLORS.MEDIUM_GREY}]}
            activeOpacity={0.6}
            onPress={() => this.onSend()}
          >
            <Feather name='arrow-right' size={20} color='#fff' />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}


InputToolbarComponent.defaultProps = {
  showKeyboard: false,
  comment: '',
  onChangeText: () => {},
  onSend: () => {},
};


InputToolbarComponent.propTypes = {
  showKeyboard: PropTypes.bool,
  comment: PropTypes.string,
  onChangeText: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
};
