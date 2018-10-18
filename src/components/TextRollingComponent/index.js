import React from 'react'
import {
  View,
  Text,
  Animated,
  Easing
} from 'react-native'

import styles from './styles'

const SENTENCE_LIST = [
  'inspiration',
  'news',
  'feedback',
  'answers',
  'opinions',
  'ideas'
]

class TextRollingComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rollIndex: 0
    }
    this.animatedValue = new Animated.Value(0)
  }

  componentDidMount() {
    this.animate()
  }

  animate() {
    this.setState((state) => {
      state.rollIndex = state.rollIndex === SENTENCE_LIST.length - 1 ? 0 : state.rollIndex + 1
      return state
    })

    this.animatedValue.setValue(0);
    Animated.timing(
      this.animatedValue,
      {
        toValue: 400,
        duration: 400,
        delay: 1200
      }
    ).start(() => {
      this.animate()
    })
  }

  render() {
    const { rollIndex } = this.state
    console.log('INDEX: ', rollIndex)
    const translateY = this.animatedValue.interpolate({
      inputRange: [0, 400],
      outputRange: [-32 * (rollIndex - 2), -32 * (rollIndex - 1)],
      extrapolate: 'clamp'
    })

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.textListView, { transform: [{ translateY }] }]}>
          {SENTENCE_LIST.map((item, key) => (
            <Text key={key} style={styles.titleText}>{item}</Text>
          ))}
        </Animated.View>
      </View>
    )
  }
}

export default TextRollingComponent