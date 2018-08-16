import React from 'react'
import {
  View,
  Text,
  TextInput
} from 'react-native'
import PropTypes from 'prop-types'
import styles from './styles'
import COLORS from '../../service/colors'

class TextInputComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.value,
      backgroundColor: COLORS.SOFT_GREY,
      placeholderTextColor: COLORS.DARK_GREY,
      textColor: '#000'
    };
  }

  onChange = text => {
    this.setState({ text })
    this.props.handleChange(text)
  }

  onFocus = () => {
    this.setState({
      backgroundColor: COLORS.LIGHT_PURPLE,
      placeholderTextColor: COLORS.PURPLE,
      textColor: COLORS.PURPLE
    })
  }

  onBlur = () => {
    this.setState({
      backgroundColor: COLORS.SOFT_GREY,
      placeholderTextColor: COLORS.DARK_GREY,
      textColor: '#000'
    })
  }

  render() {
    const { placeholder, isSecure, isError, errorText } = this.props
    let {
      backgroundColor,
      textColor,
      placeholderTextColor
    } = this.state

    if (isError) {
      backgroundColor = COLORS.LIGHT_RED,
      textColor = COLORS.MEDIUM_RED
    }

    return (
      <View style={styles.container}>
        <View style={[styles.inputView, { backgroundColor }]}>
          <TextInput
            ref={ref => this.textRef = ref}
            value={this.state.text}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            style={[
              styles.inputStyle,
              {
                color: textColor
              }
            ]}
            onChangeText={this.onChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            autoCorrect={false}
            underlineColorAndroid='transparent'
            secureTextEntry={isSecure}
            autoCapitalize="none"
          />
        
          {this.props.children}
        </View>
        {isError && errorText.length > 0 && (
          <View style={styles.errorView}>
              <Text style={styles.errorText}>{errorText}</Text>
          </View>
        )}
      </View>
    )
  }
}

TextInputComponent.defaultProps = {
  errorText: '',
  isError: false,
  isSecure: false,
  value: '',
  placeholder: '',
  handleChange: () => {}
}

TextInputComponent.propTypes = {
  errorText: PropTypes.string,
  isError: PropTypes.bool,
  isSecure: PropTypes.bool,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  handleChange: PropTypes.func
}

export default TextInputComponent
