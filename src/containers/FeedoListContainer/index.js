import React from 'react'
import {
  FlatList,
  TouchableOpacity,
  Animated,
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
    this.state = {
      clickEvent: 'normal'
    }
  }

  onLongPressFeedo(index, item) {
    ReactNativeHaptic.generate('impactHeavy')

    if (this.props.handleFeedMenu) {
      this.props.handleFeedMenu(index, item)
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
    const marginBottom = listType === 'list' ? 14 : 12

    return (
      <View key={index}>
        {item.metadata.myInviteStatus !== 'DECLINED' && (
          <View index={index}>
            <View style={[selectedLongHoldFeedoIndex === index ? styles.feedoSelectItem : styles.feedoItem, { paddingVertical }]}>
              {feedoList.length > 0 && index === 0 && feedClickEvent === 'normal' && (
                <View style={[styles.separator, { marginBottom }]} />
              )}

              {item.metadata.myInviteStatus === 'ACCEPTED'
                ? <TouchableOpacity
                    activeOpacity={0.8}
                    delayLongPress={1000}
                    onLongPress={() => this.onLongPressFeedo(index, item)}
                    onPress={() => this.onPressFeedo(index, item)}
                  >
                    <FeedItemComponent item={item} pinFlag={item.pinned ? true : false} page={this.props.page} listType={this.props.listType} />
                  </TouchableOpacity>
                : <NotificationItemComponent data={item} hideTumbnail={true} />
              }
            </View>

            {this.props.feedoList.length > 0 && (
              <View style={[feedClickEvent === 'normal' && styles.separator]} />
            )}
          </View>
        )}
      </View>
    )
  }

  onLayout = event => {
    console.log('EVENT: ', event.nativeEvent.layout.height)
    this.props.onLayout(event.nativeEvent.layout.height)
  }

  render() {
    const { loading, refresh, feedoList, feedClickEvent, animatedSelectFeed, animatedSelectFeedPos } = this.props;
    if (loading) return <FeedLoadingStateComponent animating />

    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            tintColor={COLORS.PURPLE}
            refreshing={this.props.isRefreshing}
            onRefresh={() => refresh ? this.props.onRefreshFeed() : {}}
          />
        }
        style={[
          styles.container
        ]}
      >
        
        <Animated.View
          onLayout={this.onLayout}
          style={[
            {
              transform: [
                { scale: animatedSelectFeed }
              ],
              marginTop: animatedSelectFeedPos
            },
            feedClickEvent === 'normal' ? { marginBottom: CONSTANTS.ACTION_BAR_HEIGHT - 35 } : { marginBottom: 0 },
          ]}
        >
          {feedoList.map((item, index) => (
            this.renderItem(item, index)
          ))}
        </Animated.View>
      </ScrollView>
    )
  }
}

FeedoListContainer.defaultProps = {
  handleFeedMenu: () => {},
  page: 'search',
  refresh: true,
  isRefresh: false,
  selectedLongHoldFeedoIndex: -1,
  feedClickEvent: 'normal'
}

FeedoListContainer.propTypes = {
  loading: PropTypes.bool.isRequired,
  refresh: PropTypes.bool.isRequired,
  isRefresh: PropTypes.bool,
  feedoList: PropTypes.arrayOf(PropTypes.any).isRequired,
  handleFeedMenu: PropTypes.func,
  page: PropTypes.string,
  selectedLongHoldFeedoIndex: PropTypes.number,
  feedClickEvent: PropTypes.string
}

export default FeedoListContainer