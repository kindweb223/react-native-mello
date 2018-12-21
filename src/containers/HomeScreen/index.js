/* global require */
import React from 'react'
import {
  SafeAreaView,
  View,
  Text,
  Animated,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  AsyncStorage,
  AppState,
  Clipboard,
  Alert
} from 'react-native'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import PushNotification from 'react-native-push-notification';
import ScrollableTabView from 'react-native-scrollable-tab-view'
import TabBar from 'react-native-underline-tabbar'
import Modal from "react-native-modal"
import { Actions } from 'react-native-router-flux'
import * as R from 'ramda'
import { find, filter, orderBy } from 'lodash'
import DeviceInfo from 'react-native-device-info';

import pubnub from '../../lib/pubnub'
import Analytics from '../../lib/firebase'

import DashboardNavigationBar from '../../navigations/DashboardNavigationBar'
import DashboardActionBar from '../../navigations/DashboardActionBar'
import FeedoListContainer from '../FeedoListContainer'
import NewFeedScreen from '../NewFeedScreen'
import NewCardScreen from '../NewCardScreen'
import CreateNewFeedComponent from '../../components/CreateNewFeedComponent'
import FeedLongHoldMenuScreen from '../FeedLongHoldMenuScreen'
import ToasterComponent from '../../components/ToasterComponent'
import FeedLoadingStateComponent from '../../components/FeedLoadingStateComponent'
import EmptyStateComponent from '../../components/EmptyStateComponent'
import SpeechBubbleComponent from '../../components/SpeechBubbleComponent'
import ClipboardToasterComponent from '../../components/ClipboardToasterComponent'
import COLORS from '../../service/colors'
import styles from './styles'
import CONSTANTS from '../../service/constants';

const SEARCH_ICON = require('../../../assets/images/Search/Grey.png')
const SETTING_ICON = require('../../../assets/images/Settings/Grey.png')

import {
  getFeedoList,
  pinFeed,
  unpinFeed,
  deleteFeed,
  archiveFeed,
  duplicateFeed,
  deleteDuplicatedFeed,
  addDummyFeed,
  removeDummyFeed,
  setFeedDetailAction,
  setCurrentFeed,
  deleteInvitee,
  getInvitedFeedList,
  getActivityFeed
} from '../../redux/feedo/actions'

import { 
  setUserInfo,
  addDeviceToken,
  updateDeviceToken,
  appOpened,
  getUserSession,
  setHomeListType
} from '../../redux/user/actions'

import { 
  getCard,
} from '../../redux/card/actions'

const TAB_STYLES = {
  height: '100%',
  paddingTop: 0,
  paddingLeft: 0,
  paddingRight: 0
}

const TOASTER_DURATION = 5000
const PAGE_COUNT = 50

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feedoList: [],
      loading: false,
      apiLoading: null,
      isVisibleNewFeed: false,
      isEditFeed: false,
      isVisibleCreateNewFeedModal: false,
      isLongHoldMenuVisible: false,
      selectedFeedData: {},
      tabIndex: 0,
      isShowActionToaster: false,
      scrollableTabViewContainer: {},
      scrollY: new Animated.Value(0),
      currentPushNotificationType: CONSTANTS.UNKOWN_PUSH_NOTIFICATION,
      currentPushNotificationData: null,
      currentIdea: {},
      isVisibleCard: false,
      selectedIdeaInvitee: null,
      cardViewMode: CONSTANTS.CARD_NONE,
      appState: AppState.currentState,
      showFeedInvitedNewUserBubble: false,
      showBubbleCloseButton: false,
      isExistingUser: false,
      showEmptyBubble: false,
      isRefreshing: false,
      invitedFeedList: [],
      badgeCount: 0,
      isShowClipboardToaster: false,
      tmpClipboardData: '',
      clipboardData: '',
      selectedLongHoldFeedoIndex: -1,
      feedClickEvent: 'normal',
      showLongHoldActionBar: true
    };

    this.currentRef = null;
    this.animatedOpacity = new Animated.Value(0);
    this.isInitialized = false;

    this.animatedSelectFeed = new Animated.Value(1);
    this.animatedSelectFeedPos = new Animated.Value(0);
    this.feedListViewHeight = 0
  }

  async componentDidMount() {
    Analytics.setCurrentScreen('DashboardScreen')

    this.setState({ loading: true })

    const userInfo = await AsyncStorage.getItem('userInfo')
    this.props.setUserInfo(JSON.parse(userInfo))

    // Subscribe to comments channel for new comments and updates
    console.log("Subscribe to: ", this.props.user.userInfo.eventSubscriptionToken)
    pubnub.subscribe({
      channels: [this.props.user.userInfo.eventSubscriptionToken]
    });

    this.registerPushNotification();
    this.props.getFeedoList(this.state.tabIndex)
    this.props.getInvitedFeedList()
    this.props.getActivityFeed(this.props.user.userInfo.id, { page: 0, size: PAGE_COUNT })

    AppState.addEventListener('change', this.onHandleAppStateChange.bind(this));
    appOpened(this.props.user.userInfo.id);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.onHandleAppStateChange);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { feedo, card, user } = nextProps

    if (feedo.loading === 'GET_FEED_DETAIL_REJECTED') {
      if (feedo.error.code === 'error.hunt.not.found' || feedo.error.code === 'error.hunt.access.denied') {
        Alert.alert('Error', 'This flow is no longer available')
      }
    }

    if ((prevState.apiLoading !== feedo.loading && ((feedo.loading === 'GET_FEEDO_LIST_FULFILLED') || (feedo.loading === 'GET_FEEDO_LIST_REJECTED') ||
      (feedo.loading === 'FEED_FULFILLED') || (feedo.loading === 'DEL_FEED_FULFILLED') || (feedo.loading === 'ARCHIVE_FEED_FULFILLED') ||
      (feedo.loading === 'DUPLICATE_FEED_FULFILLED') || (feedo.loading === 'UPDATE_FEED_FULFILLED') || (feedo.loading === 'LEAVE_FEED_FULFILLED') ||
      (feedo.loading === 'UPDTE_FEED_INVITATION_FULFILLED') || (feedo.loading === 'INVITE_HUNT_FULFILLED') ||
      (feedo.loading === 'ADD_HUNT_TAG_FULFILLED') || (feedo.loading === 'REMOVE_HUNT_TAG_FULFILLED') ||
      (feedo.loading === 'PIN_FEED_FULFILLED') || (feedo.loading === 'UNPIN_FEED_FULFILLED') ||
      (feedo.loading === 'RESTORE_ARCHIVE_FEED_FULFILLED') || (feedo.loading === 'ADD_DUMMY_FEED'))) ||
      (feedo.loading === 'PUBNUB_GET_FEED_DETAIL_FULFILLED') || (feedo.loading === 'DELETE_CARD_FULFILLED') || 
      (feedo.loading === 'PUBNUB_MOVE_IDEA_FULFILLED') ||
      (feedo.loading === 'MOVE_CARD_FULFILLED') || (feedo.loading === 'UPDATE_CARD_FULFILLED') ||
      (feedo.loading === 'READ_ACTIVITY_FEED_FULFILLED') || (feedo.loading === 'DEL_ACTIVITY_FEED_FULFILLED') ||
      (feedo.loading === 'UPDATE_CARD_FULFILLED') || (feedo.loading === 'GET_CARD_FULFILLED') ||
      (feedo.loading === 'DEL_DUMMY_CARD') || (feedo.loading === 'MOVE_DUMMY_CARD') ||
      (feedo.loading === 'PUBNUB_DELETE_INVITEE_FULFILLED') || (feedo.loading === 'GET_FEED_DETAIL_REJECTED') ||
      (feedo.loading === 'PUBNUB_DELETE_FEED' &&
                          Actions.currentScene !== 'FeedDetailScreen' && 
                          Actions.currentScene !== 'CommentScreen' && Actions.currentScene !== 'ActivityCommentScreen' &&
                          Actions.currentScene !== 'LikesListScreen' && Actions.currentScene !== 'ActivityLikesListScreen'))
    {
      let feedoList = []

      if (feedo.feedoList && feedo.feedoList.length > 0) {        
        feedoList = feedo.feedoList.map(item => {
          const filteredIdeas = orderBy(
            filter(item.ideas, idea => idea.coverImage !== null && idea.coverImage !== ''),
            ['publishedDate'],
            ['desc']
          )

          let coverImages = []
          if (filteredIdeas.length > 4) {
            coverImages = R.slice(0, 4, filteredIdeas)
          } else {
            coverImages = R.slice(0, filteredIdeas.length, filteredIdeas)
            for (let i = 0; i < 4 - filteredIdeas.length; i ++) {
              coverImages.push(null)
            }
          }

          return Object.assign(
            {},
            item,
            { coverImages }
          )
        })

        feedoList = orderBy(
          filter(feedoList, item => item.status === 'PUBLISHED'),
          ['publishedDate'],
          ['desc']
        )
        
        if (prevState.tabIndex === 0) {
          feedoList = filter(feedoList, item => item.metadata.owner)
        }

        if (prevState.tabIndex === 1) {
          feedoList = orderBy(
            filter(feedoList, item => item.metadata.myInviteStatus !== 'INVITED' && item.owner.id !== user.userInfo.id),
            ['metadata.inviteAcceptedDate'],
            ['desc']
          )
        }

        if (prevState.tabIndex === 2) {
          feedoList = filter(feedoList, item => item.pinned !== null)
        }
      }

      if (prevState.feedClickEvent === 'long' && feedoList.length === 0) {
        return {
          isLongHoldMenuVisible: false,
          feedClickEvent: 'normal',
          selectedLongHoldFeedoIndex: -1,
          selectedFeedData: {}
        }
      }

      return {
        feedoList,
        invitedFeedList: feedo.invitedFeedList,
        badgeCount: feedo.badgeCount,
        loading: false,
        apiLoading: feedo.loading
      }
    } else if (prevState.apiLoading !== card.loading && (card.loading === 'GET_CARD_FULFILLED')) {
      return {
        loading: false,
        currentIdea: card.currentCard,
        apiLoading: card.loading
      }
    }

    if (feedo.loading === 'GET_ACTIVITY_FEED_FULFILLED') {
      return {
        invitedFeedList: feedo.invitedFeedList,
        badgeCount: feedo.badgeCount
      }
    }

    return {
      apiLoading: feedo.loading
    }
  }

  async componentDidUpdate(prevProps) {
    const { feedo, user } = this.props
    const { feedoList } = feedo

    if (feedo.loading === 'PUBNUB_GET_FEED_DETAIL_FULFILLED' && Actions.currentScene !== 'FeedDetailScreen' ||
        feedo.loading === 'PUBNUB_MOVE_IDEA_FULFILLED' && Actions.currentScene !== 'FeedDetailScreen' ||
        feedo.loading === 'GET_CARD_FULFILLED' && Actions.currentScene !== 'FeedDetailScreen' ||
        feedo.loading === 'PUBNUB_LIKE_CARD_FULFILLED' && Actions.currentScene !== 'FeedDetailScreen' ||
        feedo.loading === 'PUBNUB_UNLIKE_CARD_FULFILLED' && Actions.currentScene !== 'FeedDetailScreen' ||
        (feedo.loading === 'GET_CARD_COMMENTS_FULFILLED' &&
                          Actions.currentScene !== 'FeedDetailScreen' && 
                          Actions.currentScene !== 'CommentScreen' && Actions.currentScene !== 'ActivityCommentScreen' &&
                          Actions.currentScene !== 'LikesListScreen' && Actions.currentScene !== 'ActivityLikesListScreen') ||
        (feedo.loading === 'PUBNUB_DELETE_FEED' &&
                          Actions.currentScene !== 'FeedDetailScreen' && 
                          Actions.currentScene !== 'CommentScreen' && Actions.currentScene !== 'ActivityCommentScreen' &&
                          Actions.currentScene !== 'LikesListScreen' && Actions.currentScene !== 'ActivityLikesListScreen')
    ) {
      this.props.getActivityFeed(user.userInfo.id, { page: 0, size: PAGE_COUNT })
    }

    if (prevProps.feedo.loading !== 'GET_ACTIVITY_FEED_VISITED_FULFILLED' && feedo.loading === 'GET_ACTIVITY_FEED_VISITED_FULFILLED') {
      this.setState({ badgeCount: feedo.badgeCount })
    }

    if (prevProps.feedo.loading !== 'GET_FEEDO_LIST_FULFILLED' && feedo.loading === 'GET_FEEDO_LIST_FULFILLED') {
      if (!this.isInitialized) {
        this.isInitialized = true;
        this.showClipboardToast();
      }
    }

    if ((prevProps.feedo.loading !== 'GET_FEEDO_LIST_FULFILLED' && feedo.loading === 'GET_FEEDO_LIST_FULFILLED') ||
        (prevProps.feedo.loading !== 'UPDATE_FEED_FULFILLED' && feedo.loading === 'UPDATE_FEED_FULFILLED') ||
        (prevProps.feedo.loading !== 'FEED_FULFILLED' && feedo.loading === 'FEED_FULFILLED') ||
        (prevProps.feedo.loading !== 'DEL_FEED_FULFILLED' && feedo.loading === 'DEL_FEED_FULFILLED') ||
        (prevProps.feedo.loading !== 'ARCHIVE_FEED_FULFILLED' && feedo.loading === 'ARCHIVE_FEED_FULFILLED') ||
        (feedo.loading === 'PUBNUB_DELETE_FEED' &&
                          Actions.currentScene !== 'FeedDetailScreen' && 
                          Actions.currentScene !== 'CommentScreen' && Actions.currentScene !== 'ActivityCommentScreen' &&
                          Actions.currentScene !== 'LikesListScreen' && Actions.currentScene !== 'ActivityLikesListScreen')) {
      this.setState({ isRefreshing: false })
      await this.setBubbles(feedoList)
    }

    if (this.props.feedo.loading === 'SET_FEED_DETAIL_ACTION' && prevProps.feedo.feedDetailAction !== this.props.feedo.feedDetailAction) {
      if (this.props.feedo.feedDetailAction.action === 'Delete') {
        this.setState({ isShowActionToaster: true })
        this.handleDeleteFeed(this.props.feedo.feedDetailAction.feedId)
      }

      if (this.props.feedo.feedDetailAction.action === 'Archive') {
        this.setState({ isShowActionToaster: true })
        this.handleArchiveFeed(this.props.feedo.feedDetailAction.feedId)
      }

      if (this.props.feedo.feedDetailAction.action === 'Leave') {
        this.setState({ isShowActionToaster: true })
        this.handleLeaveFeed(this.props.feedo.feedDetailAction.feedId)
      }
    } else if (prevProps.user.loading === 'USER_SIGNOUT_PENDING' && this.props.user.loading === 'USER_SIGNOUT_FULFILLED') {
      Actions.LoginScreen()
    } else if (this.props.feedo.loading === 'GET_FEEDO_LIST_FULFILLED' && this.state.currentPushNotificationType === CONSTANTS.USER_INVITED_TO_HUNT && this.state.currentPushNotificationData) {
      const { feedoList, currentPushNotificationData } = this.state

      const matchedHunt = find(feedoList, feedo => feedo.id === currentPushNotificationData);
      if (matchedHunt) {
        Actions.FeedDetailScreen({
          data: matchedHunt
        });
      }
      this.setState({
        currentPushNotificationType: CONSTANTS.UNKOWN_PUSH_NOTIFICATION,
        currentPushNotificationData: null,
      });
    } else if (this.props.card.loading === 'GET_CARD_FULFILLED' && (this.state.currentPushNotificationType === CONSTANTS.COMMENT_ADDED || this.state.currentPushNotificationType === CONSTANTS.USER_JOINED_HUNT) && this.state.currentPushNotificationData) {
      Actions.CommentScreen({
        idea: this.state.currentIdea,
      });
      this.setState({
        currentPushNotificationType: CONSTANTS.UNKOWN_PUSH_NOTIFICATION,
        currentPushNotificationData: null,
      });
    } else if (this.props.card.loading === 'GET_CARD_FULFILLED' && this.state.currentPushNotificationType === CONSTANTS.IDEA_ADDED && this.state.currentPushNotificationData) {
      const invitee = find(this.state.currentPushNotificationData.invitees, (o) => {
        return (o.id == this.state.currentIdea.inviteeId)
      });
      this.setState({
        isVisibleCard: true,
        cardViewMode: CONSTANTS.CARD_VIEW,
        selectedIdeaInvitee: invitee,
        tmpClipboardData: '',
        clipboardData: '',
      });
      this.animatedOpacity.setValue(0);
      Animated.timing(this.animatedOpacity, {
        toValue: 1,
        duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
      }).start();
      this.setState({
        currentPushNotificationType: CONSTANTS.UNKOWN_PUSH_NOTIFICATION,
        currentPushNotificationData: null,
      });
    } else if (this.props.card.loading === 'GET_CARD_FULFILLED' && this.state.currentPushNotificationType === CONSTANTS.IDEA_LIKED && this.state.currentPushNotificationData) {
      Actions.LikesListScreen({idea: this.state.currentIdea});
      this.setState({
        currentPushNotificationType: CONSTANTS.UNKOWN_PUSH_NOTIFICATION,
        currentPushNotificationData: null,
      });
    } 
  }

  async setBubbles(feedoList) {
    const { user } = this.props
    const { tabIndex } = this.state

    let bubbleFirstFeedAsyncData = await AsyncStorage.getItem('BubbleFeedFirstTimeCreated')
    let bubbleFirstFeedData = JSON.parse(bubbleFirstFeedAsyncData)

    let ownFeedoList = []
    let invitedFeedList = []
    if (feedoList) {
      ownFeedoList = filter(feedoList, feed => feed.metadata && feed.metadata.owner)
      invitedFeedList = orderBy(
        filter(feedoList, item => item.metadata.myInviteStatus !== 'INVITED' && item.owner.id !== user.userInfo.id),
        ['metadata.inviteAcceptedDate'],
        ['desc']
      )
    }

    // New user, invited to existing feed
    if (feedoList && invitedFeedList.length > 0) {
      let bubbleAsyncData = await AsyncStorage.getItem('BubbleFeedInvitedNewUser')
      let bubbleData = JSON.parse(bubbleAsyncData)

      if(!bubbleData || (bubbleData.userId === user.userInfo.id && bubbleData.state !== 'false')) {
        if (tabIndex === 0 && ownFeedoList.length === 0 && !(bubbleFirstFeedData && (bubbleFirstFeedData.userId === user.userInfo.id && bubbleFirstFeedData.state === 'true'))) {
          this.setState({ showFeedInvitedNewUserBubble: true })
          setTimeout(() => {
            this.setState({ showBubbleCloseButton: true })
          }, 30000)
        } else {
          this.setState({ showFeedInvitedNewUserBubble: false })
        }
      }
    }    

    if (feedoList && ownFeedoList.length === 0) {
      this.setState({ showEmptyBubble: true })
      if (bubbleFirstFeedData && (bubbleFirstFeedData.userId === user.userInfo.id && bubbleFirstFeedData.state === 'true')) {
        this.setState({ isExistingUser: true })     // Existing user, no feeds
      } else {
        this.setState({ isExistingUser: false })    // New user, no feeds
      }
    }
  }

  closeBubble = () => {
    this.setState({ showFeedInvitedNewUserBubble: false })
    const data = {
      userId: this.props.user.userInfo.id,
      state: 'false'
    }
    AsyncStorage.setItem('BubbleFeedInvitedNewUser', JSON.stringify(data));
  }

  async showClipboardToast() {
    if (Actions.currentScene !== 'FeedDetailScreen') {
      const clipboardContent = await Clipboard.getString();
      const lastClipboardData = await AsyncStorage.getItem(CONSTANTS.CLIPBOARD_DATA)
      if (clipboardContent !== '' && clipboardContent !== lastClipboardData) {
        AsyncStorage.setItem(CONSTANTS.CLIPBOARD_DATA, clipboardContent);
        this.setState({
          isShowClipboardToaster: true,
          tmpClipboardData: clipboardContent,
        })
      }
    }
  }

  onHandleAppStateChange = async(nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      appOpened(this.props.user.userInfo.id);
      if (Actions.currentScene === 'HomeScreen') {
        this.props.getFeedoList(this.state.tabIndex);

        // TEMPORARY: REMOVE WITH PUBNUB INTEGRATION
        // this.props.getInvitedFeedList()
        // this.props.getActivityFeed(this.props.user.userInfo.id, { page: 0, size: PAGE_COUNT })            
      }  
      this.showClipboardToast();
      this.props.getUserSession()
    }
    this.setState({appState: nextAppState});
  }

  parsePushNotification(notification) {
    console.log('NOTIFICATION : ', notification);

    const type = notification.data.type;
    if (notification.badge) {
      PushNotification.setApplicationIconBadgeNumber(notification.badge)
    }

    // Handle background and foreground notifications
    switch (type) {
      case CONSTANTS.USER_INVITED_TO_HUNT: {
        const { huntId, inviteeId } = notification.data;
        const { feedoList } = this.state
        const matchedHunt = find(feedoList, feedo => feedo.id === huntId);
        if (matchedHunt) {
          const currentFeedo = this.props.feedo.currentFeed;
          if (Actions.currentScene === 'FeedDetailScreen') {
            Actions.FeedDetailScreen({type: 'replace', data: matchedHunt});
          } else {
            Actions.FeedDetailScreen({data: matchedHunt})
          }
        } else {
          this.setState({
            currentPushNotificationType: CONSTANTS.USER_INVITED_TO_HUNT,
            currentPushNotificationData: huntId
          });
          this.props.getFeedoList(this.state.tabIndex);
          this.props.getInvitedFeedList()
        }
        break;
      }
    }

    // Return if app as active. The remaining cases should only be processed if app is in background
    if (this.state.appState === 'active') {
      return;
    }

    switch (type) {
      case CONSTANTS.COMMENT_ADDED: {
        const { ideaId, huntId, commentId } = notification.data;
        const { feedoList } = this.state
        const matchedHunt = find(feedoList, feedo => feedo.id === huntId);
        if (matchedHunt) {
          const matchedIdea = find(matchedHunt.ideas, idea => idea.id === ideaId);
          if (matchedIdea) {
            Actions.CommentScreen({
              idea: matchedIdea,
            });
            return;
          }
        }
        this.setState({
          currentPushNotificationType: CONSTANTS.COMMENT_ADDED,
          currentPushNotificationData: commentId,
        });
        this.props.getCard(ideaId);
        break;
      }
      case CONSTANTS.IDEA_ADDED: {
        const { huntId, ideaId } = notification.data;
        const { feedoList } = this.state
        const matchedHunt = find(feedoList, feedo => feedo.id === huntId);
        this.setState({
          currentPushNotificationType: CONSTANTS.IDEA_ADDED,
          currentPushNotificationData: matchedHunt,
        });
        this.props.getCard(ideaId);
        break;
      }
      case CONSTANTS.IDEA_LIKED: {
        const { huntId, ideaId } = notification.data;
        const { feedoList } = this.state
        const matchedHunt = find(feedoList, feedo => feedo.id === huntId);
        if (matchedHunt) {
          const matchedIdea = find(matchedHunt.ideas, idea => idea.id === ideaId);
          if (matchedIdea) {
            Actions.LikesListScreen({idea: matchedIdea});
            return;
          }
        }
        this.setState({
          currentPushNotificationType: CONSTANTS.IDEA_LIKED,
          currentPushNotificationData: ideaId,
        });
        this.props.getCard(ideaId);

        break;
      }
      case CONSTANTS.USER_JOINED_HUNT: {
        const { huntId } = notification.data;
        const { feedoList } = this.state
        const matchedHunt = find(feedoList, feedo => feedo.id === huntId);
        if (matchedHunt) {
          Actions.FeedDetailScreen({
            data: matchedHunt
          });
        } else {
          this.setState({
            currentPushNotificationType: CONSTANTS.USER_JOINED_HUNT,
            currentPushNotificationData: huntId,
          });
          this.props.getFeedoList(this.state.tabIndex);
        }
        break;
      }
      case CONSTANTS.HUNT_UPDATED: {
        const { huntId } = notification.data;
        const { feedoList } = this.state
        const matchedHunt = find(feedoList, feedo => feedo.id === huntId);
        if (matchedHunt) {
          const currentFeedo = this.props.feedo.currentFeed;
          if (Actions.currentScene === 'FeedDetailScreen') {
            Actions.FeedDetailScreen({type: 'replace', data: matchedHunt});
          } else {
            Actions.FeedDetailScreen({data: matchedHunt})
          }
        } else {
          this.setState({
            currentPushNotificationType: CONSTANTS.USER_INVITED_TO_HUNT,
            currentPushNotificationData: huntId,
          });
          this.props.getFeedoList(this.state.tabIndex);
        }
        break;
      }
      case CONSTANTS.USER_MENTIONED: {
        break;
      }
    }
  }

  registerPushNotification() {
    PushNotification.configure({
      onRegister: (token) => {
        Analytics.logEvent('dashboard_register_push_notification', {})

        console.log('PUSH TOKEN : ', token);
        AsyncStorage.getItem(CONSTANTS.USER_DEVICE_TOKEN, (error, result) => {
          if (error) {
            console.log('error : ', error);
            return;
          }
          console.log('TOKEN_RESULT : ', result);
          const data = {
            deviceToken: token.token,
            deviceTypeEnum: Platform.OS === 'ios' ? 'IPHONE' : 'ANDROID',
            deviceManufacturer: DeviceInfo.getManufacturer(),
            deviceModel: DeviceInfo.getModel(),
            osVersion: DeviceInfo.getSystemVersion(),
          }
          if (!result) {
            this.props.addDeviceToken(this.props.user.userInfo.id, data);
          } else {
            const deviceTokenInfo = JSON.parse(result);
            if (deviceTokenInfo.deviceToken !== token.token) {
              this.props.updateDeviceToken(this.props.user.userInfo.id, deviceTokenInfo.id, data);
              return;
            }
          }
        });
      },
      onNotification: (notification) => {
        Analytics.logEvent('dashboard_parse_push_notification', {})
        this.parsePushNotification(notification);
      },
      senderID: "sender-id",
    });
  }

  onChangeTab(value) {
    const { feedo, user } = this.props

    this.setState({ 
      // loading: true,
      tabIndex: value.i,
      scrollableTabViewContainer: {}
    })
    // this.props.getFeedoList(value.i)
    if (feedo.feedoList && feedo.feedoList.length > 0) {        
      feedoList = feedo.feedoList.map(item => {
        const filteredIdeas = orderBy(
          filter(item.ideas, idea => idea.coverImage !== null && idea.coverImage !== ''),
          ['publishedDate'],
          ['desc']
        )

        let coverImages = []
        if (filteredIdeas.length > 4) {
          coverImages = R.slice(0, 4, filteredIdeas)
        } else {
          coverImages = R.slice(0, filteredIdeas.length, filteredIdeas)
          for (let i = 0; i < 4 - filteredIdeas.length; i ++) {
            coverImages.push(null)
          }
        }

        return Object.assign(
          {},
          item,
          { coverImages }
        )
      })

      feedoList = orderBy(
        filter(feedoList, item => item.status === 'PUBLISHED'),
        ['publishedDate'],
        ['desc']
      )
      
      if (value.i === 0) {
        feedoList = filter(feedoList, item => item.metadata.owner)
      }
      if (value.i === 1) {
        feedoList = orderBy(
          filter(feedoList, item => item.metadata.myInviteStatus !== 'INVITED' && item.owner.id !== user.userInfo.id),
          ['metadata.inviteAcceptedDate'],
          ['desc']
        )
      }
      if (value.i === 2) {
        feedoList = filter(feedoList, item => item.pinned !== null)
      }

      this.setState({ feedoList })

      if (this.state.feedClickEvent !== 'normal') {
        this.setState({ selectedLongHoldFeedoIndex: -1, showLongHoldActionBar: false })
      }
    }
  }

  handleLongHoldMenu = (index, selectedFeedData) => {
    console.log('PPP: ', this.feedListViewHeight)
    this.setState({ selectedLongHoldFeedoIndex: index, feedClickEvent: 'long' }, () => {
      Animated.parallel([
        Animated.timing(this.animatedSelectFeed, {
          toValue: 0.85,
          duration: 150,
        }),
        Animated.timing(this.animatedSelectFeedPos, {
          toValue: -this.feedListViewHeight / 10,
          duration: 150,
        })
      ]).start(() => {
        this.setState({
          selectedFeedData,
          isLongHoldMenuVisible: true
        });
      });
    })
  }

  closeLongHoldMenu = () => {
    this.setState({ selectedLongHoldFeedoIndex: -1, feedClickEvent: 'normal' }, () => {
      Animated.parallel([
        Animated.timing(this.animatedSelectFeed, {
          toValue: 1,
          duration: 100
        }),
        Animated.timing(this.animatedSelectFeedPos, {
          toValue: 0,
          duration: 100,
        })
      ]).start(() => {
        this.setState({ isLongHoldMenuVisible: false })
      })
    })
  }

  handleArchiveFeed = (feedId) => {
    Animated.parallel([
      Animated.timing(this.animatedSelectFeed, {
        toValue: 1,
        duration: 150,
      }),
      Animated.timing(this.animatedSelectFeedPos, {
        toValue: 0,
        duration: 100,
      })
    ]).start(() => {
      this.setState({ isLongHoldMenuVisible: false, selectedLongHoldFeedoIndex: -1, feedClickEvent: 'normal' })
      this.setState({ isShowActionToaster: true, isArchive: true, toasterTitle: 'Flow archived', feedId })
      this.props.addDummyFeed({ feedId, flag: 'archive' })

      setTimeout(() => {
        this.setState({ isShowActionToaster: false })
        this.archiveFeed(feedId)
      }, TOASTER_DURATION)
    })
  }

  archiveFeed = (feedId) => {
    if (this.state.isArchive) {
      Analytics.logEvent('dashboard_archive_feed', {})

      this.props.archiveFeed(feedId)
      this.setState({ isArchive: false })
    }
  }

  handleDeleteFeed = (feedId) => {
    Animated.parallel([
      Animated.timing(this.animatedSelectFeed, {
        toValue: 1,
        duration: 150,
      }),
      Animated.timing(this.animatedSelectFeedPos, {
        toValue: 0,
        duration: 100,
      })
    ]).start(() => {
      this.setState({ isLongHoldMenuVisible: false, selectedLongHoldFeedoIndex: -1, feedClickEvent: 'normal' })
      this.setState({ isShowActionToaster: true, isDelete: true, toasterTitle: 'Flow deleted', feedId })
      this.props.addDummyFeed({ feedId, flag: 'delete' })
  
      setTimeout(() => {
        this.setState({ isShowActionToaster: false })
        this.deleteFeed(feedId)
      }, TOASTER_DURATION)      
    })
  }

  deleteFeed = (feedId) => {
    if (this.state.isDelete) {
      Analytics.logEvent('dashboard_delete_feed', {})

      this.props.deleteFeed(feedId)
      this.setState({ isDelete: false })
    }
  }

  handleLeaveFeed = (feedId) => {
    Animated.parallel([
      Animated.timing(this.animatedSelectFeed, {
        toValue: 1,
        duration: 150,
      }),
      Animated.timing(this.animatedSelectFeedPos, {
        toValue: 0,
        duration: 100,
      })
    ]).start(() => {
      this.setState({ isLongHoldMenuVisible: false, selectedLongHoldFeedoIndex: -1, feedClickEvent: 'normal' })
      this.setState({ isShowActionToaster: true, isLeave: true, toasterTitle: 'Left Flow', feedId })
      this.props.addDummyFeed({ feedId, flag: 'leave' })
  
      setTimeout(() => {
        this.setState({ isShowActionToaster: false })
        this.leaveFeed(feedId)
      }, TOASTER_DURATION)      
    })
  }

  leaveFeed = (feedId) => {
    if (this.state.isLeave) {
      Analytics.logEvent('dashboard_leave_feed', {})
      const { feedo, user } = this.props

      const invitee = filter(feedo.leaveFeed[0].invitees, invitee => invitee.userProfile.id === user.userInfo.id)
      this.props.deleteInvitee(feedId, invitee[0].id)
      this.setState({ isLeave: false })
    }
  }

  handlePinFeed = (feedId) => {
    Animated.parallel([
      Animated.timing(this.animatedSelectFeed, {
        toValue: 1,
        duration: 150,
      }),
      Animated.timing(this.animatedSelectFeedPos, {
        toValue: 0,
        duration: 100,
      })
    ]).start(() => {
      this.setState({ isLongHoldMenuVisible: false, selectedLongHoldFeedoIndex: -1, feedClickEvent: 'normal' })
      this.setState({ isShowActionToaster: true, isPin: true, toasterTitle: 'Flow pinned', feedId })

      this.pinFeed(feedId)

      setTimeout(() => {
        this.setState({ isShowActionToaster: false, isPin: false })
      }, TOASTER_DURATION)
    })
  }

  pinFeed = (feedId) => {
    Analytics.logEvent('dashboard_pin_feed', {})

    this.props.pinFeed(feedId)
  }

  handleUnpinFeed = (feedId) => {
    Animated.parallel([
      Animated.timing(this.animatedSelectFeed, {
        toValue: 1,
        duration: 150,
      }),
      Animated.timing(this.animatedSelectFeedPos, {
        toValue: 0,
        duration: 100,
      })
    ]).start(() => {
      this.setState({ isLongHoldMenuVisible: false, selectedLongHoldFeedoIndex: -1, feedClickEvent: 'normal' })
      this.setState({ isShowActionToaster: true, isUnPin: true, toasterTitle: 'Flow un-pinned', feedId })

      this.unpinFeed(feedId)

      setTimeout(() => {
        this.setState({ isShowActionToaster: false, isUnPin: true })
      }, TOASTER_DURATION)
    })
  }

  unpinFeed = (feedId) => {
    Analytics.logEvent('dashboard_unpin_feed', {})

    this.props.unpinFeed(feedId)
  }

  handleDuplicateFeed = (feedId) => {
    Animated.parallel([
      Animated.timing(this.animatedSelectFeed, {
        toValue: 1,
        duration: 150,
      }),
      Animated.timing(this.animatedSelectFeedPos, {
        toValue: 0,
        duration: 100,
      })
    ]).start(() => {
      this.setState({ isLongHoldMenuVisible: false, selectedLongHoldFeedoIndex: -1, feedClickEvent: 'normal' })
      this.setState({ isShowActionToaster: true, isDuplicate: true, toasterTitle: 'Flow duplicated', feedId })
      this.props.duplicateFeed(feedId)
  
      setTimeout(() => {
        this.setState({ isShowActionToaster: false })
        this.duplicateFeed()
      }, TOASTER_DURATION + 5)      
    })
  }
  
  duplicateFeed = () => {
    if (this.state.isDuplicate) {
      Analytics.logEvent('dashboard_duplicate_feed', {})

      this.setState({ isDuplicate: false })
    }
  }

  handleEditFeed = (feedId) => {
    Animated.parallel([
      Animated.timing(this.animatedSelectFeed, {
        toValue: 1,
        duration: 150,
      }),
      Animated.timing(this.animatedSelectFeedPos, {
        toValue: 0,
        duration: 100,
      })
    ]).start(() => {
      this.setState({ isLongHoldMenuVisible: false, selectedLongHoldFeedoIndex: -1, feedClickEvent: 'normal' }, () => {
        setTimeout(() => {
          this.props.setCurrentFeed({});
          this.setState({
            isVisibleNewFeed: true,
            isEditFeed: true,
          }, () => {
            this.animatedOpacity.setValue(0);
            Animated.timing(this.animatedOpacity, {
              toValue: 1,
              duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
            }).start()
          })
        }, 300)
      })
    })
  }

  undoAction = () => {
    if (this.state.isPin) {
      this.unpinFeed(this.state.feedId)
    } else if (this.state.isUnPin) {
      this.pinFeed(this.state.feedId)
    } else if (this.state.isDelete) {
      this.props.removeDummyFeed({ feedId: this.state.feedId, flag: 'delete' })
    } else if (this.state.isArchive) {
      this.props.removeDummyFeed({ feedId: this.state.feedId, flag: 'archive' })
    } else if (this.state.isDuplicate) {
      if (this.props.feedo.duplicatedId) {
        this.props.deleteDuplicatedFeed(this.props.feedo.duplicatedId)
      }
    } else if (this.state.isLeave) {
      this.props.removeDummyFeed({ feedId: this.state.feedId, flag: 'leave' })
    }

    this.setState({
      isShowActionToaster: false, isArchive: false, isDelete: false, isPin: false, isUnPin: false, isDuplicate: false, isLeave: false
    })
  }

  onAddClipboardLink = () => {
    this.setState({
      clipboardData: this.state.tmpClipboardData,
      isShowClipboardToaster: false,
    });

    this.animatedOpacity.setValue(0);
    Animated.timing(this.animatedOpacity, {
      toValue: 1,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
    }).start();
    this.onSelectNewFeedType('New Card');
  }

  onDismissClipboardToaster() {
    this.setState({
      isShowClipboardToaster: false,
    });
  }

  onLongHoldMenuHide = () => {
    const { isArchive, isDelete, isPin, isUnPin, isDuplicate, isLeave } = this.state

    if (isArchive || isDelete || isPin || isUnPin || isDuplicate || isLeave) {
      this.setState({ isShowActionToaster: true })
    }
  }

  onOpenNewFeedModal() {
    this.setState({
      isVisibleCreateNewFeedModal: true,
    }, () => {
      this.animatedOpacity.setValue(0);
      Animated.timing(this.animatedOpacity, {
        toValue: 1,
        duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
      }).start();
    });
  }

  onSelectNewFeedType(type) {
    if (type === 'New Card') {
      Analytics.logEvent('dashboard_new_card', {})

      this.setState({
        isVisibleCreateNewFeedModal: false,
        isVisibleCard: true,
        cardViewMode: CONSTANTS.CARD_NEW,
        selectedIdeaInvitee: null,
      });
    } else if (type === 'New Flow') {
      Analytics.logEvent('dashboard_new_feed', {})

      this.props.setCurrentFeed({});
      this.setState({ 
        isVisibleCreateNewFeedModal: false,
        isVisibleNewFeed: true,
        isEditFeed: false,
      });
    }
  }

  onCloseCreateNewFeedModal() {
    this.animatedOpacity.setValue(1);
    Animated.timing(this.animatedOpacity, {
      toValue: 0,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
    }).start(() => {
      this.setState({ 
        isVisibleCreateNewFeedModal: false,
      });
    });
  }
  
  onCloseNewFeedModal(data) {
    // Ignore discarding feed
    // if (data.currentFeed) {
    //   if (data.type === 'update') {
    //     this.setState({
    //       isLongHoldMenuVisible: true,
    //       selectedFeedData: data.currentFeed
    //     })
    //   }
    // }

    this.animatedOpacity.setValue(1);
    Animated.timing(this.animatedOpacity, {
      toValue: 0,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
    }).start(() => {
      this.setState({
        isVisibleNewFeed: false,
      });
    });
  }

  userSignOut = () => {
    this.setState({ showProfile: false })
  }

  get renderNewFeedModals() {
    const { isEditFeed, isVisibleNewFeed, isVisibleCreateNewFeedModal, selectedFeedData } = this.state

    if (!isVisibleNewFeed && !isVisibleCreateNewFeedModal) {
      return;
    }

    return (
      <Animated.View 
        style={[
          styles.modalContainer,
          { opacity: this.animatedOpacity }
        ]}
      >
        {isVisibleCreateNewFeedModal && (
          <CreateNewFeedComponent 
            onSelect={(type) => this.onSelectNewFeedType(type)}
            onClose={() => this.onCloseCreateNewFeedModal()}
          />
        )}

        {isVisibleNewFeed && (
          <NewFeedScreen
            feedData={isEditFeed ? selectedFeedData : {}}
            onClose={(data) => this.onCloseNewFeedModal(data)}
            selectedFeedId={isEditFeed ? selectedFeedData.id : null}

            // feedoMode={CONSTANTS.SHARE_EXTENTION_FEEDO}
          />  
        )}
      </Animated.View>
    );
  }

  handleFilter = () => {
  }

  handleList = () => {
    const { listHomeType } = this.props.user
    const type = listHomeType === 'list' ? 'thumbnail' : 'list'
    this.props.setHomeListType(type)
  }

  handleSetting = () => {
    Analytics.logEvent('dashboard_settings', {})

    Actions.ProfileScreen()
  }

  onScrollableTabViewLayout(event, selectedIndex) {
    const { loading } = this.state

    const tabContentHeight = CONSTANTS.SCREEN_HEIGHT - CONSTANTS.ACTION_BAR_HEIGHT - CONSTANTS.TAB_BAR_HEIGHT - 60 - 50
    this.feedListViewHeight = tabContentHeight

    if (selectedIndex !== 0) {
      if (this.state.tabIndex === selectedIndex && !loading) {
        if (!this.state.scrollableTabViewContainer.height || event.nativeEvent.layout.height > this.state.scrollableTabViewContainer.height) {
          let height = event.nativeEvent.layout.height;
          if (height < tabContentHeight) {
            height = tabContentHeight
          }

          this.feedListViewHeight = height
          setTimeout(() => {
            this.setState({ scrollableTabViewContainer: { height: height + CONSTANTS.TAB_BAR_HEIGHT } });
          }, 0);
        }
      }
    } else {
      let height = event.nativeEvent.layout.height;
      if (height < tabContentHeight) {
        height = tabContentHeight
        this.feedListViewHeight = height
        setTimeout(() => {
          this.setState({ scrollableTabViewContainer: { height: height + CONSTANTS.TAB_BAR_HEIGHT } });
        }, 0);
      }
    }
  }

  onSearch = () => {
    Analytics.logEvent('dashboard_search', {})

    Actions.FeedFilterScreen({
      initialTag: []
    })
  }

  onCloseCardModal() {
    this.animatedOpacity.setValue(1);
    Animated.timing(this.animatedOpacity, {
      toValue: 0,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
    }).start(() => {
      this.setState({ 
        isVisibleCard: false,
        tmpClipboardData: '',
        clipboardData: '',
      });
    });
  }

  get renderCardModal() {
    if (!this.state.isVisibleCard ) {
      return;
    }
    let cardMode = CONSTANTS.MAIN_APP_CARD_FROM_DETAIL;
    if (this.state.cardViewMode === CONSTANTS.CARD_NEW) {
      cardMode = CONSTANTS.MAIN_APP_CARD_FROM_DASHBOARD;
    }
    return (
      <Animated.View 
        style={[
          styles.modalContainer,
          {opacity: this.animatedOpacity}
        ]}
      >
        <NewCardScreen 
          viewMode={this.state.cardViewMode}
          cardMode={cardMode}
          invitee={this.state.selectedIdeaInvitee}
          shareUrl={this.state.clipboardData}
          onClose={() => this.onCloseCardModal()}

          // cardMode={CONSTANTS.SHARE_EXTENTION_CARD}
          // shareUrl='https://trello.com'
          // shareImageUrl='https://d2k1ftgv7pobq7.cloudfront.net/meta/p/res/images/fb4de993e22034b76539da073ea8d35c/home-hero.png'
        />
      </Animated.View>
    );
  }

  onRefreshFeed = () => {
    this.setState({ isRefreshing: true })
    this.props.getFeedoList(this.state.tabIndex)
  }

  render () {
    const {
      loading,
      feedoList,
      tabIndex,
      badgeCount,
      showFeedInvitedNewUserBubble,
      feedClickEvent,
      selectedLongHoldFeedoIndex
    } = this.state
    
    // const normalHeaderOpacity = this.state.scrollY.interpolate({
    //   inputRange: [0, 40],
    //   outputRange: [1, 0],
    //   extrapolate: 'clamp'
    // })

    // const miniHeaderOpacity = this.state.scrollY.interpolate({
    //   inputRange: [40, 100],
    //   outputRange: [0, 1],
    //   extrapolate: 'clamp'
    // })

    // const miniHeaderZIndex = this.state.scrollY.interpolate({
    //   inputRange: [0, 20, 40],
    //   outputRange: [11, 9, 11],
    //   extrapolate: 'clamp'
    // })

    return (
      <SafeAreaView style={styles.safeArea}>
        <View feedAction="null" />
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" backgroundColor="blue" />}
          {Platform.OS === 'android' && (
            <View style={styles.statusBarUnderlay} />
          )}

          {/* <Animated.View style={[styles.navbarView, { zIndex: miniHeaderZIndex }]}>
            <View style={styles.searchIconView}>
              <TouchableOpacity onPress={() => this.onSearch()}>
                <Image source={SEARCH_ICON} />
              </TouchableOpacity>
            </View>
            <Animated.View style={[styles.minHeader, { opacity: miniHeaderOpacity }]}>
              <View style={styles.minTitleView}>
                <Text style={styles.minTitle}>My flows</Text>
              </View>
              <View style={styles.settingIconView}>
                <TouchableOpacity onPress={() => this.handleSetting()}>
                  <Image source={SETTING_ICON} />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>  */}

          {/* <ScrollView
            refreshControl={
              <RefreshControl
                tintColor={COLORS.PURPLE}
                refreshing={this.state.isRefreshing}
                onRefresh={() => this.onRefreshFeed()}
              />
            }
            ref={ref => this.scrollView = ref}
            scrollEventThrottle={16}
            scrollEnabled={emptyState && tabIndex === 0 ? false : true}
            style={styles.feedListView }
            onScroll={
              Animated.event(
                [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
              )
            }
          > */}
            {/* <Animated.View style={[styles.normalHeader, { opacity: normalHeaderOpacity }]}>
              <DashboardNavigationBar handleSetting={this.handleSetting} />
            </Animated.View> */}
          <View style={{ flex: 1 }}>
            <ScrollableTabView
              style={this.state.scrollableTabViewContainer}
              content
              onChangeTab={this.onChangeTab.bind(this)}
              prerenderingSiblingsNumber={0}
              renderTabBar={() => <TabBar
                                    underlineHeight={0}
                                    underlineBottomPosition={0}
                                    tabBarStyle={styles.tabBarStyle}
                                    tabBarTextStyle={styles.tabBarTextStyle}
                                    activeTabTextStyle={styles.activeTabBarTextStyle}
                                    tabMargin={1}
                                    tabStyles={{ 'tab': TAB_STYLES }}
                                    renderTab={(tab, page, isTabActive, onPressHandler) => (
                                      <TouchableOpacity
                                        key={page}
                                        onPress={onPressHandler}
                                      >
                                        <View style={[styles.tabBarItemStyle, isTabActive && (styles.activeTabBarItemStyle)]}>
                                          <Text style={[styles.tabBarTextStyle, isTabActive && (styles.activeTabBarTextStyle)]}>
                                            {tab.label}
                                          </Text>
                                          {/* {invitedFeedList.length > 0 && page === 1 && (
                                            <View style={styles.badgeView}>
                                              <Text style={styles.badgeText}>{tab.badge}</Text>
                                            </View>
                                          )} */}
                                        </View>
                                      </TouchableOpacity>
                                    )}
                                  />}
            >
              <View
                style={[styles.feedListContainer, feedClickEvent === 'normal' && { paddingBottom: 30 }]}
                ref={ref => this.scrollTabAll = ref} 
                tabLabel={{ label: 'My flows', badge: badgeCount }}
                onLayout={(event) => this.onScrollableTabViewLayout(event, 0)}
              >
                {showFeedInvitedNewUserBubble && (
                  <View style={{ height: 200 }}>
                    <SpeechBubbleComponent
                      page="feed"
                      title="So you've been invited to feedo? Exciting isn't it?!"
                      subTitle="Watch a 15 sec Quick Start video "
                      showBubbleCloseButton={this.state.showBubbleCloseButton}
                      onCloseBubble={() => this.closeBubble()}
                    />
                  </View>
                )}

                {(tabIndex === 0 && feedoList.length === 0) && (
                  <View style={styles.emptyView}>
                    {!loading && (
                      <View style={showFeedInvitedNewUserBubble ? styles.emptyInnerSubView : styles.emptyInnerView}>
                        {this.state.showEmptyBubble && (
                          this.state.isExistingUser
                            ? <EmptyStateComponent
                                page="feed_exist"
                                title="It's awesome to start fresh!"
                                subTitle=""
                                ctaTitle="Start a new flow"
                                onCreateNewFeed={() => {
                                  this.animatedOpacity.setValue(1);
                                  this.onSelectNewFeedType('New Flow')
                                }}
                              />
                            : <EmptyStateComponent
                                page="feed"
                                title="First time here? No worries, you are in good hands..."
                                subTitle="Watch a 15 sec video about creating flows"
                                ctaTitle="Start your first flow"
                                onCreateNewFeed={() => {
                                  this.animatedOpacity.setValue(1);
                                  this.onSelectNewFeedType('New Flow')
                                }}
                              />
                        )}
                      </View>
                    )}
                  </View>
                )}

                <FeedoListContainer
                  loading={loading}
                  feedoList={feedoList}
                  selectedLongHoldFeedoIndex={selectedLongHoldFeedoIndex}
                  feedClickEvent={feedClickEvent}
                  animatedSelectFeed={this.animatedSelectFeed}
                  animatedSelectFeedPos={this.animatedSelectFeedPos}
                  updateSelectIndex={(index, item) => this.setState({ selectedLongHoldFeedoIndex: index, selectedFeedData: item, showLongHoldActionBar: true })}
                  handleFeedMenu={this.handleLongHoldMenu}
                  page="home"
                  listType={this.props.user.listHomeType}
                  isRefreshing={this.state.isRefreshing}
                  onRefreshFeed={() => this.onRefreshFeed()}
                />
              </View>
              <View
                style={[styles.feedListContainer, feedClickEvent === 'normal' && { paddingBottom: 30 }]}
                ref={ref => this.scrollTabSharedWithMe = ref}
                tabLabel={{ label: 'Shared with me', badge: badgeCount }}
                onLayout={(event) => this.onScrollableTabViewLayout(event, 2)}
              >
                {feedoList.length > 0
                  ? <FeedoListContainer
                      loading={loading}
                      feedoList={feedoList}
                      selectedLongHoldFeedoIndex={selectedLongHoldFeedoIndex}
                      feedClickEvent={feedClickEvent}
                      animatedSelectFeed={this.animatedSelectFeed}
                      animatedSelectFeedPos={this.animatedSelectFeedPos}
                      updateSelectIndex={(index, item) => this.setState({ selectedLongHoldFeedoIndex: index, selectedFeedData: item, showLongHoldActionBar: true })}
                      handleFeedMenu={this.handleLongHoldMenu}
                      page="home"
                      listType={this.props.user.listHomeType}
                      isRefreshing={this.state.isRefreshing}
                      onRefreshFeed={() => this.onRefreshFeed()}
                    />
                  : loading 
                      ? <FeedLoadingStateComponent animating />
                      : <View style={styles.emptyTabInnerSubView}>
                          <SpeechBubbleComponent
                            page="shared"
                            title="Flows can be shared with friends and colleagues for collaboration. Flows you've been invited to will appear here."
                            subTitle="All you need to know about sharing in 15 secs "
                          />
                        </View>
                    
                }
              </View>
              <View
                style={[styles.feedListContainer, feedClickEvent === 'normal' && { paddingBottom: 30 }]}
                ref={ref => this.scrollTabPinned = ref}
                tabLabel={{ label: 'Pinned', badge: badgeCount }}
                onLayout={(event) => this.onScrollableTabViewLayout(event, 1)}
              >
                {feedoList.length > 0
                  ? <FeedoListContainer
                      loading={loading}
                      feedoList={feedoList}
                      selectedLongHoldFeedoIndex={selectedLongHoldFeedoIndex}
                      feedClickEvent={feedClickEvent}
                      animatedSelectFeed={this.animatedSelectFeed}
                      animatedSelectFeedPos={this.animatedSelectFeedPos}
                      updateSelectIndex={(index, item) => this.setState({ selectedLongHoldFeedoIndex: index, selectedFeedData: item, showLongHoldActionBar: true })}
                      handleFeedMenu={this.handleLongHoldMenu}
                      page="home"
                      listType={this.props.user.listHomeType}
                      isRefreshing={this.state.isRefreshing}
                      onRefreshFeed={() => this.onRefreshFeed()}
                    />
                  : loading
                      ? <FeedLoadingStateComponent animating />
                      : <View style={styles.emptyTabInnerSubView}>
                          <SpeechBubbleComponent
                            page="pinned"
                            title="Your pinned items will appear here. To pin a feed tap and hold it to bring up quick actions and select"
                            subTitle="Watch a 15 sec Quick Start video "
                          />
                        </View>
                }
              </View>
            </ScrollableTabView>

            <View style={styles.settingIconView}>
              <TouchableOpacity onPress={() => this.handleSetting()}>
                <Image source={SETTING_ICON} />
              </TouchableOpacity>
            </View>
          </View>

        </View>

        {!this.state.isLongHoldMenuVisible && (
          <DashboardActionBar
            filtering={false}
            notifications={true}
            showList={true}
            listType={this.props.user.listHomeType}
            onAddFeed={this.onOpenNewFeedModal.bind(this)}
            handleFilter={() => this.handleFilter()}
            handleList={() => this.handleList()}
            badgeCount={badgeCount}
            page="home"
          />
        )}

        {this.renderNewFeedModals}

        {this.state.isLongHoldMenuVisible && (
          <FeedLongHoldMenuScreen
            feedData={this.state.selectedFeedData}
            showLongHoldActionBar={this.state.showLongHoldActionBar}
            handleArchiveFeed={this.handleArchiveFeed}
            handleDeleteFeed={this.handleDeleteFeed}
            handlePinFeed={this.handlePinFeed}
            handleUnpinFeed={this.handleUnpinFeed}
            handleDuplicateFeed={this.handleDuplicateFeed}
            handleEditFeed={this.handleEditFeed}
            handleLeaveFeed={this.handleLeaveFeed}
          />
        )}

        {this.state.isLongHoldMenuVisible && (
          <View style={styles.topButtonView}>
            <TouchableOpacity onPress={() => this.closeLongHoldMenu()}>
              <View style={styles.btnDoneView}>
                <Text style={styles.btnDoneText}>Done</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {this.state.isShowActionToaster && (
          <ToasterComponent
            isVisible={this.state.isShowActionToaster}
            title={this.state.toasterTitle}
            onPressButton={this.undoAction}
          />
        )}

        {this.renderCardModal}

        { 
          this.state.isShowClipboardToaster && 
          <ClipboardToasterComponent
            description={this.state.tmpClipboardData}
            onPress={() => this.onAddClipboardLink()}
            onClose={() => this.onDismissClipboardToaster()}
          />
        }
      </SafeAreaView>
    )
  }
}

const mapStateToProps = ({ user, feedo, card }) => ({
  feedo,
  user,
  card
})

const mapDispatchToProps = dispatch => ({
  getFeedoList: (index) => dispatch(getFeedoList(index)),
  pinFeed: (data) => dispatch(pinFeed(data)),
  unpinFeed: (data) => dispatch(unpinFeed(data)),
  deleteFeed: (data) => dispatch(deleteFeed(data)),
  archiveFeed: (data) => dispatch(archiveFeed(data)),
  duplicateFeed: (data) => dispatch(duplicateFeed(data)),
  deleteDuplicatedFeed: (data) => dispatch(deleteDuplicatedFeed(data)),
  addDummyFeed: (data) => dispatch(addDummyFeed(data)),
  removeDummyFeed: (data) => dispatch(removeDummyFeed(data)),
  setFeedDetailAction: (data) => dispatch(setFeedDetailAction(data)),
  setCurrentFeed: (data) => dispatch(setCurrentFeed(data)),
  setUserInfo: (data) => dispatch(setUserInfo(data)),
  addDeviceToken: (userId, data) => dispatch(addDeviceToken(userId, data)),
  updateDeviceToken: (userId, deviceId, data) => dispatch(updateDeviceToken(userId, deviceId, data)),
  getCard: (ideaId) => dispatch(getCard(ideaId)),
  deleteInvitee: (feedId, inviteeId) => dispatch(deleteInvitee(feedId, inviteeId)),
  getInvitedFeedList: () => dispatch(getInvitedFeedList()),
  getUserSession: () => dispatch(getUserSession()),
  getActivityFeed: (userId, param) => dispatch(getActivityFeed(userId, param)),
  setHomeListType: (type) => dispatch(setHomeListType(type)),
})

HomeScreen.propTypes = {
  getFeedoList: PropTypes.func.isRequired,
  feedo: PropTypes.objectOf(PropTypes.any),
  pinFeed: PropTypes.func.isRequired,
  unpinFeed: PropTypes.func.isRequired,
  deleteFeed: PropTypes.func.isRequired,
  archiveFeed: PropTypes.func.isRequired,
  duplicateFeed: PropTypes.func.isRequired,
  deleteDuplicatedFeed: PropTypes.func.isRequired,
  addDummyFeed: PropTypes.func.isRequired,
  removeDummyFeed: PropTypes.func.isRequired,
  setFeedDetailAction: PropTypes.func.isRequired,
  setUserInfo: PropTypes.func.isRequired,
  deleteInvitee: PropTypes.func.isRequired,
  getInvitedFeedList: PropTypes.func.isRequired,
  getUserSession: PropTypes.func.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen)

