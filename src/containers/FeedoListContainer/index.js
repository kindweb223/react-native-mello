import React from 'react'
import {
  FlatList,
  TouchableOpacity,
  Animated,
  View,
  RefreshControl
} from 'react-native'

import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import ReactNativeHaptic from 'react-native-haptic'
import _ from 'lodash'

import FeedItemComponent from '../../components/FeedItemComponent'
import FeedLoadingStateComponent from '../../components/FeedLoadingStateComponent'
import NotificationItemComponent from '../../components/NotificationItemComponent'
import COLORS from '../../service/colors'
import styles from './styles'

class ListRow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      scaleValue: new Animated.Value(0),
    }
  }

  componentDidMount() {
    // Animated.timing(this.state.scaleValue, {
    //   toValue: 1,
    //   duration: 150,
    //   delay: this.props.index * 100
    // }).start()
  }

  render() {    
    return (
      // <Animated.View style={{ opacity: this.state.scaleValue }}>
      //   { this.props.children }
      // </Animated.View>
      <View>
        { this.props.children }
      </View>
    )
  }
}

class FeedoListContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedLongHoldFeedoIndex: -1,
    }
    this.animatedSelectFeedo = new Animated.Value(1);
  }

  onLongPressFeedo(index, item) {
    ReactNativeHaptic.generate('impactHeavy')
    this.setState({
      selectedLongHoldFeedoIndex: index,
    }, () => {
      Animated.sequence([
        Animated.timing(this.animatedSelectFeedo, {
          toValue: 0.95,
          duration: 100,
        }),
        Animated.timing(this.animatedSelectFeedo, {
          toValue: 1,
          duration: 100,
        }),
      ]).start(() => {
        this.setState({
          selectedLongHoldFeedoIndex: -1,
        });
        if (this.props.handleFeedMenu) {
          this.props.handleFeedMenu(item)
        }
      });
    });
  }

  renderItem({ item, index }) {
    const marginTop = this.props.listType === 'list' ? 15 : 12
    const marginBottom = this.props.listType === 'list' ? 14 : 12

    return (
      <Animated.View 
        style={
          this.state.selectedLongHoldFeedoIndex === index && 
          {
            transform: [
              { scale: this.animatedSelectFeedo },
            ],
            backgroundColor: '#fff',
          }
        }
      >
        {item.metadata.myInviteStatus !== 'DECLINED' && (
          <ListRow index={index}>
            {this.props.feedoList.length > 0 && index === 0 && (
              <View style={[styles.separator, { marginBottom }]} />
            )}

            {item.metadata.myInviteStatus === 'ACCEPTED'
              ? <TouchableOpacity
                  activeOpacity={0.8}
                  delayLongPress={1000}
                  onLongPress={() => this.onLongPressFeedo(index, item)}
                  onPress={() => {
                    Actions.FeedDetailScreen({
                      data: item
                    })
                  }}
                >
                  <FeedItemComponent item={item} pinFlag={item.pinned ? true : false} page={this.props.page} listType={this.props.listType} />
                </TouchableOpacity>
              : <NotificationItemComponent data={item} hideTumbnail={true} />
            }

            {this.props.feedoList.length > 0 && (
              <View style={[styles.separator, { marginTop, marginBottom }]} />
            )}
          </ListRow>
        )}
      </Animated.View>
    )
  }

  render() {
    const { loading, refresh, feedoList, handleFeedMenu, tabLabel } = this.props;
    if (loading) return <FeedLoadingStateComponent animating />

    return (
      <FlatList
        refreshControl={
          <RefreshControl
            tintColor={COLORS.PURPLE}
            refreshing={this.props.isRefreshing}
            onRefresh={() => refresh ? this.props.onRefreshFeed() : {}}
          />
        }
        style={styles.flatList}
        data={feedoList}
        keyExtractor={item => item.id}
        automaticallyAdjustContentInsets={true}
        renderItem={this.renderItem.bind(this)}
        keyboardShouldPersistTaps="handled"
      />
    )
  }
}

FeedoListContainer.defaultProps = {
  handleFeedMenu: () => {},
  page: 'search',
  refresh: true,
  isRefresh: false
}

FeedoListContainer.propTypes = {
  loading: PropTypes.bool.isRequired,
  refresh: PropTypes.bool.isRequired,
  isRefresh: PropTypes.bool,
  feedoList: PropTypes.arrayOf(PropTypes.any).isRequired,
  handleFeedMenu: PropTypes.func,
  page: PropTypes.string
}

export default FeedoListContainer