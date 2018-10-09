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

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ text: nextProps.value })
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
      keyboardType,
      textContentType,
      autoCapitalize,
      isErrorView,
      label,
      editable
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
        {label.length > 0 && (
          <Text style={styles.label}>{label}</Text>
        )}
        <View style={[styles.inputView, { backgroundColor }]}>
          <TextInput
            editable={editable}
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
            autoCapitalize={autoCapitalize}
            keyboardType={keyboardType}
            returnKeyType={returnKeyType}
            textContentType={textContentType}
            onSubmitEditing={() => this.props.onSubmitEditing()}
            selectionColor={COLORS.PURPLE}
          />
        
          {this.props.children}
        </View>
        {isErrorView && (
          <View style={styles.errorView}>
            {isError && errorText.length > 0 && (
              <Text style={styles.errorText}>{errorText}</Text>
            )}
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
  ContainerStyle: {},
  returnKeyType: 'go',
  keyboardType: "default",
  textContentType: 'none',
  autoCapitalize: 'none',
  isErrorView: true,
  label: '',
  editable: true,
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
  keyboardType: PropTypes.string,
  textContentType: PropTypes.string,
  autoCapitalize: PropTypes.string,
  isErrorView: PropTypes.bool,
  label: PropTypes.string,
  editable: PropTypes.bool
}

export default TextInputComponent
