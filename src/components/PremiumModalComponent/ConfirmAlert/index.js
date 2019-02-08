import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import styles from './styles'

class PremiumAlert extends React.Component {
  componentDidMount() {
  }

  render() {
    return (
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Oops you need to have a premium account to upload more than 10MB.</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonView} activeOpacity={0.8} onPress={() => this.props.onOk()}>
              <Text style={styles.buttonText}>Ok</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonView, styles.discoverButton]} activeOpacity={0.8} onPress={() => this.props.onDiscover()}>
              <Text style={styles.buttonText}>Discover</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

PremiumAlert.defaultProps = {
  onDiscover: () => {},
  onOk: () => {}
}

PremiumAlert.propTypes = {
  onDiscover: PropTypes.func,
  onOk: PropTypes.func
}

export default PremiumAlert