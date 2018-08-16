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
    this.state = {
      comment: '',
    };
  }

  onSend() {
    if (this.props.onSend) {
      this.props.onSend(this.state.comment)
    }
    this.setState({
      comment: ''
    });
  }

  render() {
    const {
    } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          <TextInput
            style={styles.textInput}
            placeholder='Type comment...'
            autoCorrect={false}
            multiline={true}
            underlineColorAndroid='transparent'
            value={this.state.comment}
            onChangeText={(value) => this.setState({comment: value})}
          />
          <TouchableOpacity
            style={styles.buttonContainer}
            activeOpacity={0.6}
            onPress={() => this.onSend()}
          >
            <FontAwesome5 name='arrow-circle-right' size={27} color={this.state.comment ? COLORS.PURPLE : COLORS.MEDIUM_GREY} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}


InputToolbarComponent.defaultProps = {
  onSend: () => {},
};


InputToolbarComponent.propTypes = {
  onSend: PropTypes.func,
};
