/* global require */
import React from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  Animated,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { Actions } from 'react-native-router-flux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import DashboardActionBar from '../../navigations/DashboardActionBar'
import FeedCardComponent from '../../components/FeedCardComponent'
import FeedCollapseComponent from '../../components/FeedCollapseComponent'
import AvatarPileComponent from '../../components/AvatarPileComponent'
import FeedNavbarSettingComponent from '../../components/FeedNavbarSettingComponent'
import FeedControlMenuComponent from '../../components/FeedControlMenuComponent'
import { getFeedDetailData, setFeedDetailAction } from '../../redux/feedo/actions'
import COLORS from '../../service/colors'
import styles from './styles'
import actionSheetStyles from '../FeedLongHoldMenuScreen/styles'

const EMPTY_ICON = require('../../../assets/images/empty_state/asset-emptystate.png')
const ACTIONSHEET_OPTIONS = [
  <Text key="0" style={actionSheetStyles.actionButtonText}>Delete feed</Text>,
  'Cancel'
]

class FeedDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      feedDetailData: {},
      loading: false,
      openMenu: false
    };

    this.menuOpacity = new Animated.Value(0)
    this.menuZIndex = new Animated.Value(0)
  }

  componentDidMount() {
    this.setState({ loading: true })
    this.props.getFeedDetailData(this.props.data.id)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.feedo.loading === 'GET_FEED_DETAIL_FULFILLED' && nextProps.feedo.feedDetailData !== prevState.feedDetailData) {
      return {
        loading: false,
        feedDetailData: nextProps.feedo.feedDetailData
      }
    }
    if (nextProps.feedo.loading !== 'GET_FEED_DETAIL_FULFILLED') {
      return {
        feedDetailData: {}
      }
    }
    return null
  }

  backToDashboard = () => {
    Actions.pop()
  }

  handleSetting = () => {
    const { openMenu } = this.state

    if (openMenu) {
      this.menuOpacity.setValue(1);
      Animated.timing(this.menuOpacity, {
        toValue: 0,
        duration: 100
      }).start(() => {
        this.menuZIndex.setValue(12);
        Animated.timing(this.menuZIndex, {
          toValue: 0
        }).start()
      })
    } else {
      this.menuZIndex.setValue(0);
      Animated.timing(this.menuZIndex, {
        toValue: 12
      }).start(() => {
        this.menuOpacity.setValue(0);
        Animated.timing(this.menuOpacity, {
          toValue: 1,
          duration: 100
        }).start()
      })
    }

    this.setState({ openMenu: !openMenu })
  }

  handleSettingItem = (item) => {
    switch(item) {
      case 'Pin':
        return
      case 'Unpin':
        return
      case 'Share':
        return
      case 'Delete':
        this.ActionSheet.show()
        return
      case 'Archive':
        this.handleSetting()
        this.props.setFeedDetailAction({
          action: 'Archive',
          feedId: this.props.data.id
        })
        Actions.pop()
        return
      case 'Duplicate':
        return
      default:
        return
    }
  }

  onTapActionSheet = (index) => {
    if (index === 0) {
      this.handleSetting()

      this.props.setFeedDetailAction({
        action: 'Delete',
        feedId: this.props.data.id
      })

      Actions.pop()
    }
  }

  checkOwner = (data) =>{
    if (data.invitees.length === 1 && data.owner.id === data.invitees[0].userProfile.id) {
      return true
    }
    return false
  }

  render () {
    const { data } = this.props
    const { feedDetailData, loading } = this.state

    const navbarBackground = this.state.scrollY.interpolate({
      inputRange: [40, 41],
      outputRange: ['transparent', '#fff'],
      extrapolate: 'clamp'
    })

    const settingViewOpacity = this.state.scrollY.interpolate({
      inputRange: [60, 90],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    })

    const settingMenuY = this.state.scrollY.interpolate({
      inputRange: [0, 35],
      outputRange: [120, 60],
      extrapolate: 'clamp'
    })

    const avatarPosition = this.state.scrollY.interpolate({
      inputRange: [30, 90],
      outputRange: [0, 100],
      extrapolate: 'clamp'
    })

    const normalHeaderOpacity = this.state.scrollY.interpolate({
      inputRange: [20, 35],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    })

    let avatars = []
    if (!isEmpty(feedDetailData)) {
      const isOwner = this.checkOwner(feedDetailData)

      if (isOwner) {
        avatars = [
          {
            id: 1,
            imageUrl: feedDetailData.owner.imageUrl,
            userName: `${feedDetailData.owner.firstName} ${feedDetailData.owner.lastName}`
          }
        ]
      } else {
        feedDetailData.invitees.forEach((item, key) => {
          avatars = [
            ...avatars,
            {
              id: key,
              imageUrl: item.userProfile.imageUrl,
              userName: `${item.userProfile.firstName} ${item.userProfile.lastName}`
            }
          ]
        })
      }
    }

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>

          <Animated.View
            style={[styles.settingMenuView, { opacity: this.menuOpacity, zIndex: this.menuZIndex, top: settingMenuY }]}
          >
            <FeedControlMenuComponent handleSettingItem={item => this.handleSettingItem(item)} data={feedDetailData} />
          </Animated.View>

          <Animated.View style={[styles.miniNavView, { backgroundColor: navbarBackground }]}>
            <TouchableOpacity onPress={this.backToDashboard}>
              <View style={styles.backView}>
                <Ionicons name="ios-arrow-back" style={styles.backIcon} />
              </View>
            </TouchableOpacity>
            <View style={styles.rightHeader}>
              <Animated.View style={[styles.avatarView, { right: avatarPosition }]}>
                <AvatarPileComponent avatars={avatars} />
              </Animated.View>
              <Animated.View style={[styles.settingView, { opacity: settingViewOpacity }]}>
                <FeedNavbarSettingComponent handleSetting={() => this.handleSetting()} />
              </Animated.View>
            </View>
          </Animated.View>

          <ScrollView
            scrollEventThrottle={16}
            style={styles.scrollView}
            onScroll={
              Animated.event(
                [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
              )
            }
          >       
            <Animated.View style={[styles.normalHeader, { opacity: normalHeaderOpacity }]}>
              <View key="2" style={styles.headerTitleView}>
                <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">{data.headline}</Text>
                <View>
                  <FeedNavbarSettingComponent handleSetting={this.handleSetting} />
                </View>
              </View>
            </Animated.View>
            
              <View style={styles.detailView}>
                <FeedCollapseComponent data={data} feedData={feedDetailData} />

                {!isEmpty(feedDetailData) && feedDetailData && feedDetailData.ideas.length > 0
                  ? feedDetailData.ideas.map(item => (
                      <FeedCardComponent key={item.id} data={item} invitees={feedDetailData.invitees} />
                    ))
                  : <View style={styles.emptyView}>
                      {loading
                        ? <ActivityIndicator animating />
                        : [
                            <Image key="0" source={EMPTY_ICON} />,
                            <Text key="1" style={styles.emptyText}>It is lonely here</Text>
                          ]
                        }
                    </View>
                }
              </View>
          </ScrollView>

        </View>

        <DashboardActionBar />

        <ActionSheet
          ref={o => this.ActionSheet = o}
          title={<Text style={actionSheetStyles.titleText}>Are you sure you want to delete this feed, everything will be gone ...</Text>}
          options={ACTIONSHEET_OPTIONS}
          cancelButtonIndex={1}
          destructiveButtonIndex={2}
          tintColor={COLORS.PURPLE}
          styles={actionSheetStyles}
          onPress={(index) => this.onTapActionSheet(index)}
        />
      </SafeAreaView>
    )
  }
}

const mapStateToProps = ({ feedo }) => ({
  feedo
})

const mapDispatchToProps = dispatch => ({
  getFeedDetailData: data => dispatch(getFeedDetailData(data)),
  setFeedDetailAction: data => dispatch(setFeedDetailAction(data))
})

FeedDetailScreen.defaultProps = {
  data: [],
  getFeedDetailData: () => {},
  setFeedDetailAction: () => {}
}

FeedDetailScreen.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  feedo: PropTypes.objectOf(PropTypes.any),
  getFeedDetailData: PropTypes.func,
  setFeedDetailAction: PropTypes.func
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedDetailScreen)

