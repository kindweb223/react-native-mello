import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native'

import PropTypes from 'prop-types'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import styles from './styles'

class DashboardActionBar extends React.Component {

  constructor(props) {
    super(props);

    this.animatedPlusButton = new Animated.Value(1);
  }

  onPressInAddFeed() {
    Animated.timing(this.animatedPlusButton, {
      toValue: 0.8,
      duration: 100,
    }).start();
  }

  onPressOutAddFeed() {
    Animated.timing(this.animatedPlusButton, {
      toValue: 1,
      duration: 100,
    }).start();

    if (this.props.onAddFeed) {
      this.props.onAddFeed();
    }
  }

  render () {
    const { filtering } = this.props

    return (
      <View style={[styles.container, filtering ? styles.filterContainer : styles.actionContainer]}>
        {filtering && (
          <View style={styles.filteringView}>
            <TouchableOpacity onPress={() => this.props.handleFilter()}>
              <View style={[styles.iconStyle, styles.filterButton]}>
                <MaterialCommunityIcons name="filter-variant" style={styles.filteringButtonIcon} />
              </View>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.actionView}>
          <View style={styles.notificationView}>
            <Ionicons name="md-notifications" style={styles.notificationIcon} />
            <Text style={styles.notificationText}>0</Text>
          </View>

          <Animated.View 
            style={[styles.plusButtonView, 
              {
                transform: [
                  { scale: this.animatedPlusButton },
                ],
              },
            ]}
          >
            <TouchableWithoutFeedback
              onPressIn={this.onPressInAddFeed.bind(this)}
              onPressOut={this.onPressOutAddFeed.bind(this)}
            >
              <View style={[styles.iconStyle, styles.plusButton]}>
                <Feather name="plus" style={styles.plusButtonIcon} />
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </View>
      </View>
    )
  }
}

DashboardActionBar.defaultProps = {
  filtering: true,
  handleFilter: () => {}
}

DashboardActionBar.propTypes = {
  filtering: PropTypes.bool,
  onAddFeed: PropTypes.func,
  handleFilter: PropTypes.func
}

export default DashboardActionBar
