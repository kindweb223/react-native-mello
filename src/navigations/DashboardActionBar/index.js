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
import _ from 'lodash'
import COLORS from '../../service/colors'
import styles from './styles'
import * as COMMON_FUNC from '../../service/commonFunc'

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
    const { filtering, showType, sortType, notifications, feed } = this.props
    console.log('FEED: ', feed)
    return (
      <View style={[styles.container, filtering ? styles.filterContainer : styles.actionContainer]}>
        {filtering && (
          <View style={styles.filteringView}>
            <TouchableOpacity onPress={() => this.props.handleFilter()}>
              <View style={[styles.iconStyle, styles.filterButton]}>
                <MaterialCommunityIcons
                  name="filter-variant"
                  size={30}
                  color={showType === 'all' && sortType ==='date' ? COLORS.MEDIUM_GREY : COLORS.PURPLE}
                />
              </View>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.actionView}>
          {notifications &&
            <View style={styles.notificationView}>
              <Ionicons
                name="md-notifications"
                size={20}
                color={COLORS.PURPLE}
              />
              <Text style={styles.notificationText}>0</Text>
            </View>
          }

          {!(!_.isEmpty(feed) && COMMON_FUNC.isFeedGuest(feed)) && (
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
          )}

        </View>
      </View>
    )
  }
}

DashboardActionBar.defaultProps = {
  filtering: true,
  handleFilter: () => {},
  showType: 'all',
  sortType: 'date',
  notifications: true,
  feed: {}
}

DashboardActionBar.propTypes = {
  showType: PropTypes.string,
  sortType: PropTypes.string,
  filtering: PropTypes.bool,
  onAddFeed: PropTypes.func,
  handleFilter: PropTypes.func,
  notifications: PropTypes.bool,
  feed: PropTypes.object
}

export default DashboardActionBar
