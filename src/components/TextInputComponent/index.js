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
    }, () => {
      this.props.onFocus()
    })
  }

  onBlur = () => {
    this.setState({
      backgroundColor: COLORS.SOFT_GREY,
      placeholderTextColor: COLORS.DARK_GREY,
      textColor: '#000'
    }, () => {
      this.props.onBlur()
    })
  }

  render() {
    const {
      placeholder,
      isSecure,
      isError,
      errorText,
      ContainerStyle,
      returnKeyType,
      keyboardType
    } = this.props

    let {
      backgroundColor,
      textColor,
      placeholderTextColor
    } = this.state

    if (isError) {
      backgroundColor = COLORS.LIGHT_RED,
      textColor = COLORS.RED,
      placeholderTextColor = COLORS.RED
    }

    return (
      <View style={[styles.container, ContainerStyle]}>
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
            keyboardType={keyboardType}
            returnKeyType={returnKeyType}
            onSubmitEditing={() => this.props.onSubmitEditing()}
          />
        
          {this.props.children}
        </View>
        <View style={styles.errorView}>
          {isError && errorText.length > 0 && (
            <Text style={styles.errorText}>{errorText}</Text>
          )}
        </View>
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
  ContainerStyle: {},
  returnKeyType: 'go',
  keyboardType: "default",
  handleChange: () => {},
  onFocus: () => {},
  onBlur: () => {},
  onSubmitEditing: () => {}
}

TextInputComponent.propTypes = {
  errorText: PropTypes.string,
  isError: PropTypes.bool,
  isSecure: PropTypes.bool,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  handleChange: PropTypes.func,
  ContainerStyle: PropTypes.objectOf(PropTypes.any),
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onSubmitEditing: PropTypes.func,
  returnKeyType: PropTypes.string,
  keyboardType: PropTypes.string
}

export default TextInputComponent
