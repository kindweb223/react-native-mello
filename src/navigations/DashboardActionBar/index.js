import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Image
} from 'react-native'

import { Actions } from 'react-native-router-flux'
import PropTypes from 'prop-types'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import _ from 'lodash'
import COLORS from '../../service/colors'
import styles from './styles'
import * as COMMON_FUNC from '../../service/commonFunc'

const BELL_ICON_B = require('../../../assets/images/Bell/Blue.png')
const BELL_ICON_G = require('../../../assets/images/Bell/Grey.png')

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
    const { filtering, showType, sortType, notifications, feed, badgeCount } = this.props
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
            <TouchableOpacity
              style={[styles.notificationView, badgeCount === 0 && styles.notificationEmptyView]}
              onPress={() => badgeCount > 0 ? Actions.NotificationScreen() : {}}
            >
              <Image source={badgeCount > 0 ? BELL_ICON_B : BELL_ICON_G} />
              {badgeCount > 0 && (
                <Text style={styles.notificationText}>{badgeCount}</Text>
              )}
            </TouchableOpacity>
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
  feed: {},
  badgeCount: 0
}

DashboardActionBar.propTypes = {
  showType: PropTypes.string,
  sortType: PropTypes.string,
  filtering: PropTypes.bool,
  onAddFeed: PropTypes.func,
  handleFilter: PropTypes.func,
  notifications: PropTypes.bool,
  feed: PropTypes.object,
  badgeCount: PropTypes.number
}

export default DashboardActionBar
