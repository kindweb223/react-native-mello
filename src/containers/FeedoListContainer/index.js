import React from 'react'
import {
  TouchableOpacity,
  View,
  RefreshControl,
  ScrollView
} from 'react-native'

import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import ReactNativeHaptic from 'react-native-haptic'
import _ from 'lodash'

import FeedItemComponent from '../../components/FeedItemComponent'
import FeedLoadingStateComponent from '../../components/FeedLoadingStateComponent'
import NotificationItemComponent from '../../components/NotificationItemComponent'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import styles from './styles'

class FeedoListContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  onLongPressFeedo(index, item) {
    ReactNativeHaptic.generate('impactHeavy')

    if (this.props.handleLongHoldMenu) {
      this.props.handleLongHoldMenu(index, item)
    }
  }

  onPressFeedo(index, item) {
    const { feedClickEvent } = this.props

    if (feedClickEvent === 'normal') {
      Actions.FeedDetailScreen({
        data: item
      })
    } else {
      this.props.updateSelectIndex(index, item)
    }
  }

  renderItem(item, index) {
    const { feedoList, listType, feedClickEvent, selectedLongHoldFeedoIndex } = this.props
    const paddingVertical = listType === 'list' ? 15 : 12

    return (
      <View key={index}>
        {item.metadata.myInviteStatus !== 'DECLINED' && (
          <View index={index}>
            {feedoList.length > 0 && index === 0 && feedClickEvent === 'normal' && (
              <View style={[styles.separator]} />
            )}

            <View style={[selectedLongHoldFeedoIndex === index ? styles.feedoSelectItem : styles.feedoItem, { paddingVertical }]}>
              <TouchableOpacity
                activeOpacity={0.8}
                delayLongPress={1000}
                onLongPress={() => this.onLongPressFeedo(index, item)}
                onPress={() => this.onPressFeedo(index, item)}
              >
                <FeedItemComponent item={item} pinFlag={item.pinned ? true : false} page={this.props.page} listType={this.props.listType} />
              </TouchableOpacity>
            </View>

            {this.props.feedoList.length > 0 && (
              <View style={[feedClickEvent === 'normal' && styles.separator]} />
            )}
          </View>
        )}
      </View>
    )
  }

  render() {
    const { loading, refresh, feedClickEvent, feedoList, invitedFeedList, animatedSelectFeed } = this.props;
    if (loading) return <FeedLoadingStateComponent animating />

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            tintColor={COLORS.PURPLE}
            refreshing={this.props.isRefreshing}
            onRefresh={() => refresh ? this.props.onRefreshFeed() : {}}
          />
        }
        style={[
          styles.container,
          {
            transform: [{ scale: animatedSelectFeed._value}],
          },
        ]}
      >        
        <View
          style={[
            { marginBottom: CONSTANTS.ACTION_BAR_HEIGHT - 28 }
          ]}
        >
          {invitedFeedList.map((item, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              delayLongPress={1000}
              onLongPress={() => this.onLongPressFeedo(index, item)}
              onPress={() => this.onPressFeedo(index, item)}
            >
              {feedClickEvent === 'normal' &&
                <View style={styles.separator} />
              }
              <View style={styles.itemView}>
                <NotificationItemComponent data={item} hideTumbnail={true} prevPage='home' />
              </View>
            </TouchableOpacity>
          ))}

          {feedoList.map((item, index) => (
            this.renderItem(item, index)
          ))}
        </View>
      </ScrollView>
    )
  }
}

FeedoListContainer.defaultProps = {
  handleLongHoldMenu: () => {},
  page: 'search',
  refresh: true,
  isRefresh: false,
  selectedLongHoldFeedoIndex: -1,
  feedClickEvent: 'normal',
  invitedFeedList: []
}

FeedoListContainer.propTypes = {
  loading: PropTypes.bool.isRequired,
  refresh: PropTypes.bool.isRequired,
  isRefresh: PropTypes.bool,
  feedoList: PropTypes.arrayOf(PropTypes.any).isRequired,
  handleLongHoldMenu: PropTypes.func,
  page: PropTypes.string,
  selectedLongHoldFeedoIndex: PropTypes.number,
  feedClickEvent: PropTypes.string,
  invitedFeedList: PropTypes.arrayOf(PropTypes.any)
}

export default FeedoListContainer