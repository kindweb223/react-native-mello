import React from 'react'
import { View, Text, TouchableOpacity, Animated, Image, Platform } from 'react-native'
import { ifIphoneX } from 'react-native-iphone-x-helper'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import PropTypes from 'prop-types'
import Triangle from 'react-native-triangle';
import styles from './styles'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
const FIRST_FLOW_ICON = require('../../../assets/images/IconFlow/IconMediumFlowBlue.png')
const FIRST_INVITE_ICON = require('../../../assets/images/Feed_option/AddPeopleGrey.png')
const PROFILE_PHOTO_ICON = require('../../../assets/images/Profile/Blue.png')

const BOTTOM_POS = CONSTANTS.ACTION_BAR_HEIGHT - 5
const TOP_POS = Platform.OS === 'ios' ? ifIphoneX(85, 60) : 60

const TIP_TYPE = [
  {
    title: 'Create your first flow',
    description: 'Start your journey here.',
    icon: FIRST_FLOW_ICON,
    arrowDirection: "down"
  },
  {
    title: 'Invite friends to your flow',
    description: 'More people, more ideas.',
    icon: FIRST_INVITE_ICON,
    arrowDirection: "up"
  },
  {
    title: 'Upload your profile picture',
    description: 'Be easily recognizable by your friends.',
    icon: PROFILE_PHOTO_ICON,
    arrowDirection: "up"
  }
]

class FirstTimeEntyTipComponent extends React.Component {
  state = {
    fadeAnimateOpacity: new Animated.Value(0)
  }

  componentDidMount() {
    const { delay } = this.props
    setTimeout(() => {
      Animated.timing(
        this.state.fadeAnimateOpacity,
        {
          toValue: 1,
          duration: 50
        }
      ).start()
    }, delay)
  }

  render() {
    const { type } = this.props
    const { fadeAnimateOpacity } = this.state
    const data = TIP_TYPE[type]

    return (
      <Animated.View
        style={[
          styles.container,
          { opacity: fadeAnimateOpacity },
          type === 0 ? { bottom: BOTTOM_POS } : { top: TOP_POS }
        ]}
      >
        <TouchableOpacity
          style={[styles.tipBody, type === 0 ? { marginTop: 0 } : { marginTop: 11 }]}
          onPress={() => this.props.onTapFlow()} activeOpacity={0.8}
        >
          <View style={styles.avatarIconView}>
            <Image source={data.icon} style={type === 0 && styles.avatarIcon} resizeMode="stretch" />
          </View>
          <View style={styles.contentView}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{data.title}</Text>
            <Text style={styles.description} numberOfLines={1} ellipsizeMode="tail">{data.description}</Text>
          </View>
          <TouchableOpacity onPress={() => this.props.onCloseTip()} style={styles.buttonView}>
            <MaterialCommunityIcons name="close" size={25} color={COLORS.DARK_GREY} />
          </TouchableOpacity>
        </TouchableOpacity>
        <View style={[styles.triangel, type === 0 ? { bottom: 4, right: 20 } : (type === 1 ? { top: 4, right: 60 } : { top: 4, right: 15 })]}>
          <Triangle
            width={20}
            height={9}
            color={'#fff'}
            direction={data.arrowDirection}
          />
        </View>
      </Animated.View>
    )
  }
}

FirstTimeEntyTipComponent.defaultProps = {
  onCloseTip: () => {},
  onTapFlow: () => {}
}

FirstTimeEntyTipComponent.propTypes = {
  onCloseTip: PropTypes.func,
  onTapFlow: PropTypes.func
}

export default FirstTimeEntyTipComponent