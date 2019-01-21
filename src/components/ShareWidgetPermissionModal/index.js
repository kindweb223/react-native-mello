import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import PropTypes from 'prop-types'
import SVGImage from 'react-native-remote-svg'
import styles from './styles'
import { images } from '../../themes'
const CLOSE_ICON = require('../../../assets/images/Close/Grey.png')
// const SHARE_ICON = require('../../../assets/images/Share/Purple.png')

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
            <SVGImage source={images.shareLinkPurple} style={styles.shareIcon} />
          </View>
          <Text style={styles.title}>Did you know you can save to Mello from anywhere?</Text>
          <Text style={styles.subTitle}>Just tab Share button in your favorite app and send to Mello.</Text>
        </View>

        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.button} onPress={() => this.enableShareWidget()}>
            <Text style={styles.buttonText}>Enable share widget</Text>
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