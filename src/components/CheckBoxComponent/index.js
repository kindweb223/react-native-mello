import React, {Component} from 'react'
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import PropTypes from 'prop-types'
import Octicons from 'react-native-vector-icons/Octicons'
import COLORS from '../../service/colors'
import styles from './styles'

export default class CheckBox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { isChecked } = this.props
    return (
      <TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.onClick()} activeOpacity={0.9}>
        <View style={styles.container}>
          <View style={[
            styles.checkboxView,
            isChecked ? { backgroundColor: COLORS.LIGHT_PURPLE } : { backgroundColor: COLORS.LIGHT_GREY_LINE }
          ]}>
            {isChecked && (
              <Octicons
                name="check"
                size={18}
                color={isChecked ? COLORS.PURPLE : COLORS.MEDIUM_GREY}
              />
            )}
          </View>
          <View style={styles.rightTextView}>
            <Text>{this.props.rightText}</Text>
            {this.props.children}
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

CheckBox.defaultProps = {
  PropTypes: '',
  onClick: () => {}
}

CheckBox.propTypes = {
  rightText: PropTypes.string,
  isChecked: PropTypes.bool.isRequired,
  onClick: PropTypes.func
}