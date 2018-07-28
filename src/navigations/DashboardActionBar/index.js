import React from 'react'
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native'

import PropTypes from 'prop-types'
import { Feather, MaterialCommunityIcons } from 'react-native-vector-icons'
import NotificationComponent from '../../components/NotificationComponent'
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
            <TouchableOpacity>
              <View style={[styles.iconStyle, styles.filterButton]}>
                <MaterialCommunityIcons name="filter-variant" style={styles.filteringButtonIcon} />
              </View>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.actionView}>
          <NotificationComponent count={10} />
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
}

DashboardActionBar.propTypes = {
  filtering: PropTypes.bool,
  onAddFeed: PropTypes.func,
}

export default DashboardActionBar
