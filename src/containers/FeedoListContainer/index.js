import React from 'react'
import {
  TouchableOpacity,
  View,
  RefreshControl,
  Animated
} from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import _ from 'lodash'

import FeedItemComponent from '../../components/FeedItemComponent'
import FeedLoadingStateComponent from '../../components/FeedLoadingStateComponent'
import NotificationItemComponent from '../../components/NotificationItemComponent'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import styles from './styles'
import * as COMMON_FUNC from '../../service/commonFunc'
import TouchableDebounce from '../../components/TouchableDebounce';

class FeedoListContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      didTap: false
    }
  }

  onLongPressFeedo(index, item) {
    ReactNativeHapticFeedback.trigger('impactHeavy', true);

    if (this.props.handleLongHoldMenu) {
      this.props.handleLongHoldMenu(index, item)
    }
  }

  onPressFeedo(index, item) {
    const { feedClickEvent } = this.props

    if (feedClickEvent === 'normal') {
      this.props.clearCurrentFeed()

      Actions.FeedDetailScreen({
        data: item
      })
    } else {
      this.props.updateSelectIndex(index, item)
    }
  }

  renderItem(item, index) {
    const { feedoList, feedClickEvent, selectedFeedList, unSelectFeed, isLongHoldMenuVisible } = this.props
    const { listHomeType } = this.props
    const paddingVertical = listHomeType === 'LIST' ? 12 : 9

    return (
      <View key={index}>
        {item.metadata.myInviteStatus !== 'DECLINED' && (
          <View index={index}>
            {feedoList.length > 0 && index === 0 && feedClickEvent === 'normal' && (
              <View style={[styles.separator]} />
            )}

            <View
              style={[
                isLongHoldMenuVisible && _.find(selectedFeedList, item => item.index === index) ? styles.feedoSelectItem : styles.feedoItem,
                { paddingVertical: 3 },
                unSelectFeed && !COMMON_FUNC.isFeedOwner(item) ? { opacity: 0.4 } : { opacity: 1 }
              ]}
            >
              <View
                style={[
                  { paddingVertical },
                  isLongHoldMenuVisible && _.find(selectedFeedList, item => item.index === index) ? styles.feedoSelectInnerItem : styles.feedoInnerItem
                ]}
              >
                <TouchableDebounce
                  activeOpacity={0.8}
                  delayLongPress={1000}
                  onLongPress={() => this.onLongPressFeedo(index, item)}
                  onPress={() => this.onPressFeedo(index, item) }
                >
                  <FeedItemComponent item={item} pinFlag={item.pinned ? true : false} page={this.props.page} listType={listHomeType} />
                </TouchableDebounce>
              </View>
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
    const {
      loading,
      refresh,
      feedClickEvent,
      feedoList,
      invitedFeedList,
      animatedSelectFeed
    } = this.props;

    if (loading) return <FeedLoadingStateComponent animating />
    
    return (
      <Animated.ScrollView
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
            transform: [{ scale: animatedSelectFeed}],
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
      </Animated.ScrollView>
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
  invitedFeedList: [],
  selectedFeedList: [],
  unSelectFeed: false,
  isLongHoldMenuVisible: false
}

FeedoListContainer.propTypes = {
  loading: PropTypes.bool.isRequired,
  refresh: PropTypes.bool.isRequired,
  isRefresh: PropTypes.bool,
  feedoList: PropTypes.arrayOf(PropTypes.any).isRequired,
  handleLongHoldMenu: PropTypes.func,
  page: PropTypes.string,
  feedClickEvent: PropTypes.string,
  invitedFeedList: PropTypes.arrayOf(PropTypes.any),
  selectedFeedList: PropTypes.arrayOf(PropTypes.any),
  unSelectFeed: PropTypes.bool,
  isLongHoldMenuVisible: PropTypes.bool
}

const mapStateToProps = ({ user }) => ({
  listHomeType: user.listHomeType
})

export default connect(
  mapStateToProps,
  null
)(FeedoListContainer)