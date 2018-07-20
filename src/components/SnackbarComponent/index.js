import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'
import PropTypes from 'prop-types'
import styles from './styles'

class SnackBarComponent extends React.Component {
  render() {
    const { title, buttonTitle, isVisible } = this.props
    return (
      <Modal 
        isVisible={isVisible}
        backdropOpacity={0.5}
        style={styles.modalContainer}
        animationIn={'slideInDown'}
        animationOut={'slideOutUp'}
      >
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={() => this.props.onPressButton()}>
            <View style={styles.buttonView}>
              <Text style={styles.button}>{buttonTitle}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }
}

SnackBarComponent.defaultProps = {
  onPressButton: () => {},
  isVisible: false
}

SnackBarComponent.propTypes = {
  title: PropTypes.string.isRequired,
  buttonTitle: PropTypes.string.isRequired,
  onPressButton: PropTypes.func,
  isVisible: PropTypes.bool
}

export default SnackBarComponent