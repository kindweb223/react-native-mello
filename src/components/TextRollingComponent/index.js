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
  'ideas',
  'inspiration'
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
    this.animatedValue.setValue(0);
    Animated.timing(
      this.animatedValue,
      {
        toValue: 400,
        duration: 400,
        delay: 1400
      }
    ).start(() => {
      this.setState((state) => {
        state.rollIndex = state.rollIndex === SENTENCE_LIST.length - 2 ? 0 : state.rollIndex + 1
        return state
      }, () => {
        this.animate()
      })
      
    })
  }

  render() {
    const { rollIndex } = this.state

    const translateY = this.animatedValue.interpolate({
      inputRange: [0, 400],
      outputRange: [-32 * (rollIndex - 1), -32 * rollIndex],
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