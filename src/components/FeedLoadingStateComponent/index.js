import React from 'react'
import {
  View,
  Text,
  Animated,
  Easing
} from 'react-native'
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
        duration: 500,
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
        <View style={styles.thumbnailsView} />
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
        />
      </View>
    )
  }
}

const FeedLoadingStateComponent = () => (
  <View style={styles.container}>
    <FeedLoadingStateItem />
    <FeedLoadingStateItem />
    <FeedLoadingStateItem />
    <FeedLoadingStateItem />   
  </View>
)

export default FeedLoadingStateComponent
