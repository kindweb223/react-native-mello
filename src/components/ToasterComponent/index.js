import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'
import PropTypes from 'prop-types'
import styles from './styles'

class ToasterComponent extends React.Component {
  render() {
    const { title, buttonTitle, isVisible } = this.props
    return (
      <Modal 
          isVisible={isVisible}
          backdropOpacity={0}
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInTiming={500}
          animationOutTiming={500}
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

ToasterComponent.defaultProps = {
  onPressButton: () => {},
  title: '',
  buttonTitle: 'Undo',
  isVisible: false
}

ToasterComponent.propTypes = {
  title: PropTypes.string,
  buttonTitle: PropTypes.string,
  onPressButton: PropTypes.func,
  isVisible: PropTypes.bool
}

export default ToasterComponent