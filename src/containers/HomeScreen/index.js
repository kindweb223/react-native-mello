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
  Alert,
  BackHandler
} from 'react-native'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import PushNotification from 'react-native-push-notification';
import Modal from "react-native-modal"
import { Actions } from 'react-native-router-flux'
import * as R from 'ramda'
import { find, filter, orderBy } from 'lodash'
import DeviceInfo from 'react-native-device-info';
import Permissions from 'react-native-permissions'
import Intercom from 'react-native-intercom'

import pubnub from '../../lib/pubnub'
import Analytics from '../../lib/firebase'

import DashboardActionBar from '../../navigations/DashboardActionBar'
import FeedoListContainer from '../FeedoListContainer'
import NewFeedScreen from '../NewFeedScreen'
import CardNewScreen from '../CardNewScreen'
import CreateNewFeedComponent from '../../components/CreateNewFeedComponent'
import FeedLongHoldMenuScreen from '../FeedLongHoldMenuScreen'
import ToasterComponent from '../../components/ToasterComponent'
import EmptyStateComponent from '../../components/EmptyStateComponent'
import SpeechBubbleComponent from '../../components/SpeechBubbleComponent'
import ShareWidgetPermissionModal from '../../components/ShareWidgetModal/PermissionModal'
import ShareWidgetTipsModal from '../../components/ShareWidgetModal/TipsModal'
import ShareWidgetConfirmModal from '../../components/ShareWidgetModal/ConfirmModal'
import ShareExtensionTip from '../../components/ShareExtensionTip'
import FeedFilterComponent from '../../components/FeedFilterComponent'
import styles from './styles'
import CONSTANTS from '../../service/constants';
import COLORS from '../../service/colors'
import { TIP_SHARE_LINK_URL, ANDROID_PUSH_SENDER_ID, PIN_FEATURE, SEARCH_FEATURE } from '../../service/api'
const SEARCH_ICON = require('../../../assets/images/Search/Grey.png')
const SETTING_ICON = require('../../../assets/images/Settings/Grey.png')

import LocalStorage from '../../components/LocalStorage'


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
  getActivityFeed,
  setFeedoListFromStorage
} from '../../redux/feedo/actions'

import {
  setUserInfo,
  addDeviceToken,
  updateDeviceToken,
  appOpened,
  getUserSession,
  setHomeListType,
  showClipboardToaster,
  closeClipboardToaster
} from '../../redux/user/actions'

import {
  getCard,
} from '../../redux/card/actions'

const TOASTER_DURATION = 5000
const PAGE_COUNT = 50

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feedoList: [],
      feedoPinnedList: [],
      feedoUnPinnedList: [],
      loading: false,
      apiLoading: null,
      isVisibleNewFeed: false,
      isEditFeed: false,
      isVisibleCreateNewFeedModal: false,
      isLongHoldMenuVisible: false,
      selectedFeedData: {},
      isShowActionToaster: false,
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
      selectedLongHoldFeedoIndex: -1,
      feedClickEvent: 'normal',
      showLongHoldActionBar: true,
      isShowInviteToaster: false,
      inviteToasterTitle: '',
      isShowCardAddedToaster: false,
      cardAddedToasterTitle: '',
      showSharePermissionModal: false,
      enableShareWidget: false,
      showShareTipsModal: false,
      showShareConfirmModal: false,
      showFilterModal: false,
      filterShowType: 'all',
      filterSortType: 'recent'
    };

    this.currentRef = null;
    this.animatedOpacity = new Animated.Value(0);
    this.isInitialized = false;

    this.animatedSelectFeed = new Animated.Value(1);
  }

  showSharePermissionModal(permissionInfo) {
    // If we haven't asked to enable share extension before
    if (!permissionInfo) {
        this.setState({ showSharePermissionModal: true })
    }
  }

  onCloseSharePermissionModal = () => {
    if (this.state.enableShareWidget) {
      setTimeout(() => {
        this.setState({ showShareTipsModal: true })
      }, 100)
    }
  }

  onSkipShareWidget = () => {
    AsyncStorage.setItem('permissionInfo', JSON.stringify('true'))
    this.setState({ showSharePermissionModal: false, enableShareWidget: false })
  }

  onEnableShareWidget = () => {
    AsyncStorage.setItem('permissionInfo', JSON.stringify('true'))
    this.setState({ showSharePermissionModal: false, enableShareWidget: true })
  }

  getFeedsFromStorage = () => {
    console.log('GFL calling gffs')
    const { user } = this.props 

    console.log('GFL user is ', user)
    const key = user.userInfo.id + '/flows'

    console.log('GFL user is ', user, ' key is ', key)

    AsyncStorage.getItem(key)
    .then((result) => {
      const feeds = JSON.parse(result)
      feeds.shift()
      console.log('GFL async result', feeds)
      this.props.setFeedoListFromStorage(feeds)
    })
    .catch((error) => console.log('GFL async error', error))

  }

  async componentDidMount() {
    Analytics.setCurrentScreen('DashboardScreen')

    this.props.setUserInfo(JSON.parse(await AsyncStorage.getItem('userInfo')))

    let permissionInfo = JSON.parse(await AsyncStorage.getItem('permissionInfo'))

    // Check push notification
    if (Platform.OS === 'ios') {
      Permissions.check('notification')
        .then(response => {
          // Ask for notifications permission first
          if (response === 'undetermined') {
            Permissions.request('notification').then(response => {
              // Then show share widget tip
              this.showSharePermissionModal(permissionInfo)
            });
          }
          // If notification permissions already asked, show share widget tip
          else {
            this.showSharePermissionModal(permissionInfo)
          }
      });
    }

    this.setState({ loading: true })

    // Set the inital list view mode
    const viewMode = JSON.parse(await AsyncStorage.getItem('DashboardViewMode'))
    if (viewMode && viewMode.userId === this.props.user.userInfo.id) {
      this.props.setHomeListType(viewMode.type)
    }
    else {
      this.props.setHomeListType('thumbnail')
    }

    // Subscribe to comments channel for new comments and updates
    console.log("Subscribe to: ", this.props.user.userInfo.eventSubscriptionToken)
    pubnub.subscribe({
      channels: [this.props.user.userInfo.eventSubscriptionToken]
    });

    this.registerPushNotification();

    // To enable iOS push notifications for Intercom
    Intercom.registerIdentifiedUser({ userId: this.props.user.userInfo.id });

    if (Platform.OS === 'ios') {
      Intercom.registerForPush();
    } else {
      AsyncStorage.getItem(CONSTANTS.USER_DEVICE_TOKEN, (error, result) => {
        if (error) {
          console.log('error : ', error);
          return;
        }
        if (result) {
          const deviceTokenInfo = JSON.parse(result);
          Intercom.sendTokenToIntercom(deviceTokenInfo.deviceToken);
        }
      })
    }
    Intercom.handlePushMessage();

    this.props.getFeedoList(null, this.getFeedsFromStorage, this.getFeedsFromStorage)
    console.log('GFL called on HomeScreen.js')

    this.props.getInvitedFeedList()
    this.props.getActivityFeed(this.props.user.userInfo.id, { page: 0, size: PAGE_COUNT })

    Intercom.addEventListener(Intercom.Notifications.UNREAD_COUNT, this._onUnreadIntercomChange);

    AppState.addEventListener('change', this.onHandleAppStateChange.bind(this));
    appOpened(this.props.user.userInfo.id);

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.onHandleAppStateChange);
    Intercom.removeEventListener(Intercom.Notifications.UNREAD_COUNT, this._onUnreadIntercomChange);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  _onUnreadIntercomChange = ({ count }) => {
    // console.log('INTERCOM_COUNT: ', count)
  }

  handleBackButton = () => {
    //nothing happens
    return true;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { feedo, card, user } = nextProps

    if (feedo.loading === 'GET_FEED_DETAIL_REJECTED') {
      if (feedo.error.code === 'error.hunt.not.found' || feedo.error.code === 'error.hunt.access.denied') {
        Alert.alert('Error', 'This flow is no longer available')
      }
    }

    if ((prevState.apiLoading !== feedo.loading && ((feedo.loading === 'GET_FEEDO_LIST_FULFILLED') ||
      (feedo.loading === 'GET_FEEDO_LIST_REJECTED') ||(feedo.loading === 'FEED_FULFILLED') ||
      (feedo.loading === 'DUPLICATE_FEED_FULFILLED') || (feedo.loading === 'UPDATE_FEED_FULFILLED') ||
      (feedo.loading === 'UPDATE_FEED_INVITATION_FULFILLED') || (feedo.loading === 'INVITE_HUNT_FULFILLED') ||
      (feedo.loading === 'ADD_HUNT_TAG_FULFILLED') || (feedo.loading === 'REMOVE_HUNT_TAG_FULFILLED') ||
      (feedo.loading === 'PIN_FEED_FULFILLED') || (feedo.loading === 'UNPIN_FEED_FULFILLED') ||
      (feedo.loading === 'RESTORE_ARCHIVE_FEED_FULFILLED') || (feedo.loading === 'ADD_DUMMY_FEED'))) ||
      (feedo.loading === 'DEL_FEED_FULFILLED') || (feedo.loading === 'ARCHIVE_FEED_FULFILLED') || (feedo.loading === 'LEAVE_FEED_FULFILLED') ||
      (feedo.loading === 'PUBNUB_GET_FEED_DETAIL_FULFILLED') || (feedo.loading === 'DELETE_CARD_FULFILLED') ||
      (feedo.loading === 'PUBNUB_MOVE_IDEA_FULFILLED') || (feedo.loading === 'MOVE_CARD_FULFILLED') ||
      (feedo.loading === 'READ_ACTIVITY_FEED_FULFILLED') || (feedo.loading === 'DEL_ACTIVITY_FEED_FULFILLED') ||
      (feedo.loading === 'UPDATE_CARD_FULFILLED') || (feedo.loading === 'GET_CARD_FULFILLED') ||
      (feedo.loading === 'DEL_DUMMY_CARD') || (feedo.loading === 'MOVE_DUMMY_CARD') ||
      (feedo.loading === 'PUBNUB_DELETE_INVITEE_FULFILLED') || (feedo.loading === 'GET_FEED_DETAIL_REJECTED') ||
      (feedo.loading === 'SAVE_FLOW_PREFERENCE_FULFILLED') || (feedo.loading === 'SET_FEEDO_LIST_FROM_STORAGE') ||
      (feedo.loading === 'PUBNUB_DELETE_FEED' &&
                          Actions.currentScene !== 'FeedDetailScreen' &&
                          Actions.currentScene !== 'CommentScreen' && Actions.currentScene !== 'ActivityCommentScreen' &&
                          Actions.currentScene !== 'LikesListScreen' && Actions.currentScene !== 'ActivityLikesListScreen'))
    {
      let feedoList = [];
      let feedoPinnedList = [];
      let feedoUnPinnedList = [];

      console.log('FL = ', feedo.loading, feedo)

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

        if ((feedo.loading !== 'UPDATE_CARD_FULFILLED' || !feedo.isCreateCard)) {
          const { filterSortType, filterShowType } = prevState

          const feedoFullList = filter(feedoList, item => item.status === 'PUBLISHED' && item.metadata.myInviteStatus !== 'INVITED')

          // Filter pinned flows and orderby myLastActivityDate
          feedoPinnedList = filter(feedoFullList, item => item.pinned !== null);
          feedoUnPinnedList = filter(feedoFullList, item => item.pinned === null);
          feedoList = HomeScreen.getFilteredFeeds(feedoPinnedList, feedoUnPinnedList, filterShowType, filterSortType);
        } else {
          nextProps.getFeedoList(null, this.getFeedsFromStorage, this.getFeedsFromStorage)
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
        feedoPinnedList,
        feedoUnPinnedList,
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
    const { feedo, user, card } = this.props
    const { feedoList } = feedo

    if (prevProps.feedo.loading !== 'UPDATE_FEED_INVITATION_FULFILLED' &&
        feedo.loading === 'UPDATE_FEED_INVITATION_FULFILLED' &&
        Actions.currentScene !== 'NotificationScreen' && Actions.currentScene !== 'FeedDetailScreen'
    ) {
      this.setState({ isShowInviteToaster: true })

      if (feedo.inviteUpdateType) {
        this.setState({ inviteToasterTitle: 'Invitation accepted' })
      } else {
        this.setState({ inviteToasterTitle: 'Invitation ignored' })
      }
      setTimeout(() => {
        this.setState({ isShowInviteToaster: false })
      }, TOASTER_DURATION)
    }

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

    if (feedo.loading === 'SET_FEED_DETAIL_ACTION' && prevProps.feedo.feedDetailAction !== feedo.feedDetailAction) {
      if (feedo.feedDetailAction.action === 'Delete') {
        this.setState({ isShowActionToaster: true })
        this.handleDeleteFeed(feedo.feedDetailAction.feedId)
      }

      if (feedo.feedDetailAction.action === 'Archive') {
        this.setState({ isShowActionToaster: true })
        this.handleArchiveFeed(feedo.feedDetailAction.feedId)
      }

      if (feedo.feedDetailAction.action === 'Leave') {
        this.setState({ isShowActionToaster: true })
        this.handleLeaveFeed(feedo.feedDetailAction.feedId)
      }
    } else if (prevProps.user.loading === 'USER_SIGNOUT_PENDING' && user.loading === 'USER_SIGNOUT_FULFILLED') {
      this.props.closeClipboardToaster()
    } else if (feedo.loading === 'GET_FEEDO_LIST_FULFILLED' && this.state.currentPushNotificationType === CONSTANTS.USER_INVITED_TO_HUNT && this.state.currentPushNotificationData) {
      const { currentPushNotificationData } = this.state

      const matchedHunt = find(feedoList, feed => feed.id === currentPushNotificationData);
      if (matchedHunt) {
        Actions.FeedDetailScreen({
          data: matchedHunt
        });
      }
      this.setState({
        currentPushNotificationType: CONSTANTS.UNKOWN_PUSH_NOTIFICATION,
        currentPushNotificationData: null,
      });
    } else if (card.loading === 'GET_CARD_FULFILLED' && (this.state.currentPushNotificationType === CONSTANTS.COMMENT_ADDED || this.state.currentPushNotificationType === CONSTANTS.USER_JOINED_HUNT) && this.state.currentPushNotificationData) {
      Actions.CommentScreen({
        idea: card.currentCard,
      });
      this.setState({
        currentPushNotificationType: CONSTANTS.UNKOWN_PUSH_NOTIFICATION,
        currentPushNotificationData: null,
      });
    } else if (card.loading === 'GET_CARD_FULFILLED' && this.state.currentPushNotificationType === CONSTANTS.IDEA_ADDED && this.state.currentPushNotificationData) {
      if (Actions.currentScene === 'FeedDetailScreen') {
        Actions.FeedDetailScreen({
          type: 'replace',
          data: this.state.currentPushNotificationData
        })
      } else {
        Actions.FeedDetailScreen({
          data: this.state.currentPushNotificationData
        })
      }

      this.setState({
        currentPushNotificationType: CONSTANTS.UNKOWN_PUSH_NOTIFICATION,
        currentPushNotificationData: null,
      });
    } else if (card.loading === 'GET_CARD_FULFILLED' && this.state.currentPushNotificationType === CONSTANTS.IDEA_LIKED && this.state.currentPushNotificationData) {
      Actions.LikesListScreen({ idea: card.currentCard });
      this.setState({
        currentPushNotificationType: CONSTANTS.UNKOWN_PUSH_NOTIFICATION,
        currentPushNotificationData: null,
      });
    } else if (prevProps.feedo.loading !== 'UPDATE_CARD_FULFILLED' && feedo.loading === 'UPDATE_CARD_FULFILLED' && Actions.currentScene === 'HomeScreen') {
      this.setState({ isShowCardAddedToaster: true, cardAddedToasterTitle: 'Card added to ' + feedo.currentFeed.headline })

      setTimeout(() => {
        this.setState({ isShowCardAddedToaster: false })
      }, TOASTER_DURATION)
    }
  }

  async setBubbles(feedoList) {
    const { user } = this.props

    let bubbleFirstFeedAsyncData = await AsyncStorage.getItem('BubbleFeedFirstTimeCreated')
    let bubbleFirstFeedData = JSON.parse(bubbleFirstFeedAsyncData)

    let ownFeedoList = []
    let invitedFeedList = []
    if (feedoList) {
      ownFeedoList = filter(feedoList, feed => feed.metadata && feed.metadata.owner)
      invitedFeedList = filter(feedoList, feed => feed.metadata && !feed.metadata.owner && feed.metadata.myInviteStatus === 'INVITED')
    }

    // New user, invited to existing feed
    if (feedoList && invitedFeedList.length > 0) {
      let bubbleAsyncData = await AsyncStorage.getItem('BubbleFeedInvitedNewUser')
      let bubbleData = JSON.parse(bubbleAsyncData)

      if(!bubbleData || (bubbleData.userId === user.userInfo.id && bubbleData.state !== 'false')) {
        if (ownFeedoList.length === 0 && !(bubbleFirstFeedData && (bubbleFirstFeedData.userId === user.userInfo.id && bubbleFirstFeedData.state === 'true'))) {
          this.setState({ showFeedInvitedNewUserBubble: true })
          setTimeout(() => {
            this.setState({ showBubbleCloseButton: true })
          }, 10000)
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
        this.props.showClipboardToaster(clipboardContent, 'home')
      }
    }
  }

  onHandleAppStateChange = async(nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      appOpened(this.props.user.userInfo.id);
      if (Actions.currentScene === 'HomeScreen') {
        this.props.getFeedoList(null, this.getFeedsFromStorage, this.getFeedsFromStorage)

        // TEMPORARY: REMOVE WITH PUBNUB INTEGRATION
        // this.props.getInvitedFeedList()
        // this.props.getActivityFeed(this.props.user.userInfo.id, { page: 0, size: PAGE_COUNT })
      }
      this.showClipboardToast();

      if (Actions.currentScene !== 'TutorialScreen' && Actions.currentScene !== 'LoginScreen') {
        this.props.getUserSession()
      }
    }
    this.setState({appState: nextAppState});
  }

  parsePushNotification(notification) {
    console.log('NOTIFICATION : ', notification);
    const { feedoList } = this.props.feedo

    if(!notification.data)
      return

    const type = notification.data.type;
    if (notification.badge >= 0) {
      PushNotification.setApplicationIconBadgeNumber(notification.badge)
    }

    // Handle background and foreground notifications
    switch (type) {
      case CONSTANTS.USER_INVITED_TO_HUNT: {
        const { huntId } = notification.data;
        const matchedHunt = find(feedoList, feedo => feedo.id === huntId);

        if (matchedHunt) {
          if (Actions.currentScene === 'FeedDetailScreen') {
            Actions.FeedDetailScreen({ type: 'replace', data: matchedHunt });
          } else {
            Actions.FeedDetailScreen({ data: matchedHunt })
          }
        } else {
          this.setState({
            currentPushNotificationType: CONSTANTS.USER_INVITED_TO_HUNT,
            currentPushNotificationData: huntId
          });
          this.props.getFeedoList(null, this.getFeedsFromStorage, this.getFeedsFromStorage);
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
        const matchedHunt = find(feedoList, feedo => feedo.id === huntId);

        if (matchedHunt) {
          this.props.setCurrentFeed(matchedHunt)
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
        const { huntId, ideaId } = notification.data
        const matchedHunt = find(feedoList, feedo => feedo.id === huntId);

        this.props.setCurrentFeed(matchedHunt)

        this.setState({
          currentPushNotificationType: CONSTANTS.IDEA_ADDED,
          currentPushNotificationData: matchedHunt,
        });
        this.props.getCard(ideaId);
        break;
      }
      case CONSTANTS.IDEA_LIKED: {
        const { huntId, ideaId } = notification.data;
        const matchedHunt = find(feedoList, feedo => feedo.id === huntId);

        if (matchedHunt) {
          this.props.setCurrentFeed(matchedHunt)
          const matchedIdea = find(matchedHunt.ideas, idea => idea.id === ideaId);
          if (matchedIdea) {
            Actions.LikesListScreen({ idea: matchedIdea });
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
          this.props.getFeedoList(null, this.getFeedsFromStorage, this.getFeedsFromStorage);
        }
        break;
      }
      case CONSTANTS.HUNT_UPDATED: {
        const { huntId } = notification.data;
        const matchedHunt = find(feedoList, feedo => feedo.id === huntId);

        if (matchedHunt) {
          if (Actions.currentScene === 'FeedDetailScreen') {
            Actions.FeedDetailScreen({ type: 'replace', data: matchedHunt });
          } else {
            Actions.FeedDetailScreen({ data: matchedHunt })
          }
        } else {
          this.setState({
            currentPushNotificationType: CONSTANTS.USER_INVITED_TO_HUNT,
            currentPushNotificationData: huntId,
          });
          this.props.getFeedoList(null, this.getFeedsFromStorage, this.getFeedsFromStorage);
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
      senderID: ANDROID_PUSH_SENDER_ID,
    });
  }

  handleLongHoldMenu = (index, selectedFeedData) => {
    this.setState({
      selectedLongHoldFeedoIndex: index,
      feedClickEvent: 'long',
      selectedFeedData,
      isLongHoldMenuVisible: true
    }, () => {
      Animated.spring(this.animatedSelectFeed, {
        toValue: 0.85,
        useNativeDriver: true
      }).start();
    });
  }

  closeLongHoldMenu = () => {
    this.setState({
      selectedLongHoldFeedoIndex: -1,
      feedClickEvent: 'normal',
      isLongHoldMenuVisible: false
    }, () => {
      Animated.spring(this.animatedSelectFeed, {
        toValue: 1,
        useNativeDriver: true
      }).start();
    })
  }

  handleArchiveFeed = (feedId) => {
    this.closeLongHoldMenu()

    this.setState({ isShowActionToaster: true, isArchive: true, toasterTitle: 'Flow archived', feedId })
    this.props.addDummyFeed({ feedId, flag: 'archive' })

    setTimeout(() => {
      this.setState({ isShowActionToaster: false })
      this.archiveFeed(feedId)
    }, TOASTER_DURATION)
  }

  archiveFeed = (feedId) => {
    if (this.state.isArchive) {
      Analytics.logEvent('dashboard_archive_feed', {})

      this.props.archiveFeed(feedId)
      this.setState({ isArchive: false })
    }
  }

  handleDeleteFeed = (feedId) => {
    console.log('DEL_FEED_ID: ', feedId)
    this.closeLongHoldMenu()

    this.setState({ isShowActionToaster: true, isDelete: true, toasterTitle: 'Flow deleted', feedId })
    this.props.addDummyFeed({ feedId, flag: 'delete' })

    setTimeout(() => {
      this.setState({ isShowActionToaster: false })
      this.deleteFeed(feedId)
    }, TOASTER_DURATION)
}

  deleteFeed = (feedId) => {
    if (this.state.isDelete) {
      Analytics.logEvent('dashboard_delete_feed', {})

      this.props.deleteFeed(feedId)
      this.setState({ isDelete: false })
    }
  }

  handleLeaveFeed = (feedId) => {
    this.closeLongHoldMenu()

    this.setState({ isShowActionToaster: true, isLeave: true, toasterTitle: 'Left Flow', feedId })
    this.props.addDummyFeed({ feedId, flag: 'leave' })

    setTimeout(() => {
      this.setState({ isShowActionToaster: false })
      this.leaveFeed(feedId)
    }, TOASTER_DURATION)
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
    this.closeLongHoldMenu()

    this.setState({ isShowActionToaster: true, isPin: true, toasterTitle: 'Flow pinned', feedId })

    this.pinFeed(feedId)

    setTimeout(() => {
      this.setState({ isShowActionToaster: false, isPin: false })
    }, TOASTER_DURATION)
  }

  pinFeed = (feedId) => {
    Analytics.logEvent('dashboard_pin_feed', {})

    this.props.pinFeed(feedId)
  }

  handleUnpinFeed = (feedId) => {
    this.closeLongHoldMenu()

    this.setState({ isShowActionToaster: true, isUnPin: true, toasterTitle: 'Flow un-pinned', feedId })

    this.unpinFeed(feedId)

    setTimeout(() => {
      this.setState({ isShowActionToaster: false, isUnPin: true })
    }, TOASTER_DURATION)
  }

  unpinFeed = (feedId) => {
    Analytics.logEvent('dashboard_unpin_feed', {})

    this.props.unpinFeed(feedId)
  }

  handleDuplicateFeed = (feedId) => {
    this.closeLongHoldMenu()

    this.setState({ isShowActionToaster: true, isDuplicate: true, toasterTitle: 'Flow duplicated', feedId })
    this.props.duplicateFeed(feedId)

    setTimeout(() => {
      this.setState({ isShowActionToaster: false })
      this.duplicateFeed()
    }, TOASTER_DURATION + 5)
  }

  duplicateFeed = () => {
    if (this.state.isDuplicate) {
      Analytics.logEvent('dashboard_duplicate_feed', {})

      this.setState({ isDuplicate: false })
    }
  }

  handleEditFeed = (feedId) => {
    this.closeLongHoldMenu()

    setTimeout(() => {
      this.props.closeClipboardToaster()
      this.props.setCurrentFeed({})

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
    }, 400)
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
    this.props.closeClipboardToaster()

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
            viewMode={CONSTANTS.FEEDO_FROM_MAIN}

            // feedoMode={CONSTANTS.SHARE_EXTENTION_FEEDO}
          />
        )}
      </Animated.View>
    );
  }

  handleFilter = () => {
    Analytics.logEvent('dashboard_filter_flow', {})

    this.setState({ showFilterModal: true })
  }

  handleList = () => {
    const { listHomeType } = this.props.user
    const type = listHomeType === 'LIST' ? 'THUMBNAIL' : 'LIST'
    AsyncStorage.setItem('DashboardViewMode', JSON.stringify({ userId: this.props.user.userInfo.id, type }));
    this.props.setHomeListType(type)
  }

  handleSetting = () => {
    Analytics.logEvent('dashboard_settings', {})

    Actions.ProfileScreen()
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
        isVisibleCard: false
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
        <CardNewScreen
          viewMode={this.state.cardViewMode}
          cardMode={cardMode}
          invitee={this.state.selectedIdeaInvitee}
          shareUrl=""
          prevPage="home"
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
    this.props.getInvitedFeedList()
  }

  dismiss = (e) => {
    this.setState({ showShareTipsModal: false })
  };

  onFilterShow = (type) => {
    this.setState({ filterShowType: type }, () => {
      this.filterFeeds()
    })
  }

  onFilterSort = (type) => {
    this.setState({ filterSortType: type }, () => {
      this.filterFeeds()
    })
  }

  static getFilteredFeeds = (feedoPinnedList, feedoUnPinnedList, filterShowType, filterSortType) => {
    let orderField = ['metadata.myLastActivityDate'];
    let orderType = ['desc'];

    if (filterSortType === 'headline') {
      orderField = [feed => feed.headline.toLowerCase()];
      orderType = ['asc'];
    } else if (filterSortType === 'acceptedDate') {
      orderField = ['metadata.inviteAcceptedDate'];
      orderType = ['desc'];
    }

    if (filterShowType === 'all') {
      filteredPinnedFeedList = orderBy(
        feedoPinnedList,
        orderField,
        orderType
      );
      filteredUnPinnedFeedList = orderBy(
        feedoUnPinnedList,
        orderField,
        orderType
      );
    } else if (filterShowType === 'owned') {
      filteredPinnedFeedList = orderBy(
        filter(feedoPinnedList, item => item.metadata.owner === true),
        orderField,
        orderType
      );
      filteredUnPinnedFeedList = orderBy(
        filter(feedoUnPinnedList, item => item.metadata.owner === true),
        orderField,
        orderType
      );
    } else if (filterShowType === 'shared') {
      filteredPinnedFeedList = orderBy(
        filter(feedoPinnedList, item => item.metadata.owner === false),
        orderField,
        orderType
      );
      filteredUnPinnedFeedList = orderBy(
        filter(feedoUnPinnedList, item => item.metadata.owner === false),
        orderField,
        orderType
      );
    }

    return [...filteredPinnedFeedList, ...filteredUnPinnedFeedList]
  }

  filterFeeds = () => {
    const { feedoPinnedList, feedoUnPinnedList, filterShowType, filterSortType } = this.state;
    const feedoList = HomeScreen.getFilteredFeeds(feedoPinnedList, feedoUnPinnedList, filterShowType, filterSortType);
    this.setState({ feedoList });
  }

  render () {
    const {
      loading,
      feedoList,
      invitedFeedList,
      badgeCount,
      showFeedInvitedNewUserBubble,
      feedClickEvent,
      selectedLongHoldFeedoIndex
    } = this.state

    return (
      <SafeAreaView style={styles.safeArea}>
        <View feedAction="null" />
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" backgroundColor="blue" />}
          {Platform.OS === 'android' && (
            <View style={styles.statusBarUnderlay} />
          )}

          <View style={styles.headerView}>
            <TouchableOpacity
              style={styles.searchIconView}
              onPress={() => SEARCH_FEATURE ? this.onSearch() : {}}
            >
              {SEARCH_FEATURE && (
                <Image style={styles.searchIcon} source={SEARCH_ICON} />
              )}
            </TouchableOpacity>
            <View style={styles.settingIconView}>
              <TouchableOpacity onPress={() => this.handleSetting()}>
                <Image source={SETTING_ICON} />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={[!this.state.isLongHoldMenuVisible ? styles.feedListContainer : styles.feedListContainerLongHold, feedClickEvent === 'normal' && { paddingBottom: 30 }]}
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

            {feedoList.length === 0 && (
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
              invitedFeedList={invitedFeedList}
              selectedLongHoldFeedoIndex={selectedLongHoldFeedoIndex}
              feedClickEvent={feedClickEvent}
              animatedSelectFeed={this.animatedSelectFeed}
              updateSelectIndex={(index, item) =>
                this.setState({ selectedLongHoldFeedoIndex: index, selectedFeedData: item, showLongHoldActionBar: true })
              }
              handleLongHoldMenu={this.handleLongHoldMenu}
              page="home"
              isRefreshing={this.state.isRefreshing}
              onRefreshFeed={() => this.onRefreshFeed()}
            />
          </View>

        </View>

        {!this.state.isLongHoldMenuVisible && (
          <DashboardActionBar
            showList={true}
            listType={this.props.user.listHomeType}
            onAddFeed={this.onOpenNewFeedModal.bind(this)}
            handleFilter={() => this.handleFilter()}
            handleList={() => this.handleList()}
            filterType={this.state.filterShowType}
            sortType={this.state.filterSortType}
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

        {this.state.isShowInviteToaster && (
          <ToasterComponent
            isVisible={this.state.isShowInviteToaster}
            title={this.state.inviteToasterTitle}
            buttonTitle="OK"
            onPressButton={() => this.setState({ isShowInviteToaster: false })}
          />
        )}

        {this.state.isShowCardAddedToaster && (
          <ToasterComponent
            isVisible={this.state.isShowCardAddedToaster}
            title={this.state.cardAddedToasterTitle}
            buttonTitle="OK"
            onPressButton={() => this.setState({ isShowCardAddedToaster: false })}
          />
        )}

        <Modal
          isVisible={this.state.showSharePermissionModal}
          style={{ margin: 8 }}
          backdropColor={COLORS.MODAL_BACKDROP}
          backdropOpacity={0.4}
          animationInTiming={500}
          onBackdropPress={() => this.setState({ showSharePermissionModal: false })}
          onBackButtonPress={() => this.setState({ showSharePermissionModal: false })}
          onModalHide={() => this.onCloseSharePermissionModal()}
        >
          <ShareWidgetPermissionModal
            onClose={() => this.onSkipShareWidget()}
            onEnableShareWidget={() => this.onEnableShareWidget()}
          />
        </Modal>

        {
          this.state.showShareTipsModal &&
            <ShareExtensionTip
              onDismiss={this.dismiss}
              ref={ref => (this.ref = ref)}
            />
        }

        <Modal
          isVisible={this.state.showShareConfirmModal}
          animationIn="fadeIn"
          animationOut="fadeOut"
          style={{ margin: 8 }}
          backdropColor={COLORS.MODAL_BACKDROP}
          backdropOpacity={0.4}
          animationInTiming={500}
          onBackdropPress={() => this.setState({ showShareConfirmModal: false })}
          onBackButtonPress={() => this.setState({ showShareConfirmModal: false })}
        >
          <ShareWidgetConfirmModal
            onClose={() => this.setState({ showShareConfirmModal: false })}
          />
        </Modal>

        <FeedFilterComponent
          show={this.state.showFilterModal}
          onFilterShow={this.onFilterShow}
          onFilterSort={this.onFilterSort}
          onClose={() => this.setState({ showFilterModal: false }) }
        />

        <LocalStorage />

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
  getFeedoList: (index, successAction, errorAction) => dispatch(getFeedoList(index))
  .then(success => {
    console.log('GFL success on HS')
    successAction(success)
  })
  .catch(error => {
    console.log('GFL error on HS')
    errorAction(error)
  }),
  setFeedoListFromStorage: (feeds) => dispatch(setFeedoListFromStorage(feeds)),
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
  showClipboardToaster: (data, prevPage) => dispatch(showClipboardToaster(data, prevPage)),
  closeClipboardToaster: () => dispatch(closeClipboardToaster()),
})

HomeScreen.propTypes = {
  getFeedoList: PropTypes.func.isRequired,
  setFeedoListFromStorage: PropTypes.func.isRequired,
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
