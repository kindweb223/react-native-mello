import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import PropTypes from 'prop-types'
import styles from './styles'
const CLOSE_ICON = require('../../../../assets/images/Close/Grey.png')
const SHARE_ICON = require('../../../../assets/images/Share/Blue.png')

class ShareWidgetPermissionModal extends React.Component {
  componentDidMount() {
  }

  get renderHeader() {
    return (
      <TouchableOpacity 
        style={styles.closeButtonView}
        activeOpacity={0.7}
        onPress={() => this.props.onClose()}
      >
        <Image source={CLOSE_ICON} />
      </TouchableOpacity>
    )
  }

  enableShareWidget = () => {
    this.props.onEnableShareWidget()
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerView}>
          {this.renderHeader}
        </View>

        <View style={styles.mainView}>
          <View style={styles.iconView}>
            <Image source={SHARE_ICON} style={styles.shareIcon} />
          </View>
          <Text style={styles.title}>Did you know you can save to Mello from anywhere?</Text>
          <Text style={styles.subTitle}>Tap the share button and save anything from anwyhere to Mello.</Text>
        </View>

        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.button} onPress={() => this.enableShareWidget()}>
            <Text style={styles.buttonText}>Enable share extension</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    )
  }
}

ShareWidgetPermissionModal.defaultProps = {
  onEnableShareWidget: () => {},
  onClose: () => {}
}

ShareWidgetPermissionModal.propTypes = {
  onEnableShareWidget: PropTypes.func,
  onClose: PropTypes.func
}

export default ShareWidgetPermissionModal