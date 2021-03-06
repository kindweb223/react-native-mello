import React from 'react'
import {
  View,
  Text,
  Animated,
  Easing
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import styles from './styles'
import CONSTANTS from '../../service/constants'

class FeedLoadingStateItem extends React.Component {
  constructor(props) {
    super(props)
    this.animatedValue = new Animated.Value(0)
  }

  componentDidMount() {
    this.animate()
  }

  animate() {
    this.animatedValue.setValue(0)
    Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: 800,
        easing: Easing.linear
      }
    ).start(() => this.animate())
  }

  render() {
    const marginLeft = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, CONSTANTS.SCREEN_SUB_WIDTH]
    })

    return (
      <View style={styles.subContainer}>
        <View style={styles.thumbnailsView}>
          <View style={[styles.splitter, { left: '25%' }]} />
          <View style={[styles.splitter, { left: '50%' }]} />
          <View style={[styles.splitter, { left: '75%' }]} />
        </View>
        <View style={styles.feedInfoView}>
          <View style={styles.titleView} />
        </View>
        <View style={styles.bottomView}>
          <View style={styles.actionView} />
          <View style={styles.actionView} />
          <View style={styles.actionView} />
        </View>
        <Animated.View
          style={[ styles.animationBar, { marginLeft: marginLeft }]}
        >
          <Gradient />
        </Animated.View>
      </View>
    )
  }
}

const Gradient = () => {
  return(
    <LinearGradient
      colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.1)']}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 0.0 }}
      style={{
        flex: 1,
        width: 150
      }}
    />
  )
}

const FeedLoadingStateComponent = () => (
  <View style={styles.container}>
    <FeedLoadingStateItem />
    <FeedLoadingStateItem />
    <FeedLoadingStateItem />
    <FeedLoadingStateItem />
    <FeedLoadingStateItem />
  </View>
)

export default FeedLoadingStateComponent
