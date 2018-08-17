import React from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import PropTypes from 'prop-types'

import { Actions } from 'react-native-router-flux'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import styles from './styles'


export default class InputToolbarComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  onSend() {
    if (this.props.onSend) {
      this.props.onSend()
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
    } = this.props;

    return (
      <View style={styles.container}>
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
            style={styles.buttonContainer}
            activeOpacity={0.6}
            onPress={() => this.onSend()}
          >
            <FontAwesome5 name='arrow-circle-right' size={27} color={this.props.comment ? COLORS.PURPLE : COLORS.MEDIUM_GREY} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}


InputToolbarComponent.defaultProps = {
  comment: '',
  onChangeText: () => {},
  onSend: () => {},
};


InputToolbarComponent.propTypes = {
  comment: PropTypes.string,
  onChangeText: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
};
