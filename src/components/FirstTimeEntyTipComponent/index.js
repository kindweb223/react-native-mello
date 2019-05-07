import React from 'react'
import { View, Text, TouchableOpacity, Animated, Image } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import PropTypes from 'prop-types'
import Triangle from 'react-native-triangle';
import styles from './styles'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
const FIRST_FLOW_ICON = require('../../../assets/images/IconFlow/IconMediumFlowBlue.png')
const FIRST_INVITE_ICON = require('../../../assets/images/IconFlow/IconMediumFlowBlue.png')

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
  }
]

class FirstTimeEntyTipComponent extends React.Component {
  state = {
    fadeAnimateWidth: new Animated.Value(0),
    fadeAnimateHeight: new Animated.Value(0)
  }

  componentDidMount() {
    const { delay } = this.props
    setTimeout(() => {
      Animated.sequence([
        Animated.timing(
          this.state.fadeAnimateHeight,
          {
            toValue: 90,
            duration: 100
          }
        ),
        Animated.timing(
          this.state.fadeAnimateWidth,
          {
            toValue: CONSTANTS.SCREEN_WIDTH,
            duration: 100
          }
        ),
      ]).start()
    }, delay)
  }

  render() {
    const { type } = this.props
    const { fadeAnimateWidth, fadeAnimateHeight } = this.state
    const data = TIP_TYPE[type]

    return (
      <Animated.View
        style={[
          styles.container,
          { width: fadeAnimateWidth, height: fadeAnimateHeight },
          type === 0 ? { bottom: CONSTANTS.ACTION_BAR_HEIGHT - 5 } : { top: CONSTANTS.STATUSBAR_HEIGHT + 50 }
        ]}
      >
        <TouchableOpacity
          style={[styles.tipBody, type === 0 ? { marginTop: 0 } : { marginTop: 11 }]}
          onPress={() => this.props.onTapFlow()} activeOpacity={0.8}
        >
          <View style={styles.avatarIconView}>
            <Image source={data.icon} style={styles.avatarIcon} resizeMode="stretch" />
          </View>
          <View style={styles.contentView}>
            <Text style={styles.title}>{data.title}</Text>
            <Text style={styles.description}>{data.description}</Text>
          </View>
          <TouchableOpacity onPress={() => this.props.onCloseTip()} style={styles.buttonView}>
            <MaterialCommunityIcons name="close" size={25} color={COLORS.DARK_GREY} />
          </TouchableOpacity>
        </TouchableOpacity>
        <View style={[styles.triangel, type === 0 ? { bottom: 4, right: 20 } : { top: 4, right: 60 }]}>
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