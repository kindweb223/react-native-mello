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
import { NetworkConsumer } from 'react-native-offline'
import ImagePicker from 'react-native-image-picker'
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker'

import pubnub from '../../lib/pubnub'
import Analytics from '../../lib/firebase'
import bugsnag from '../../lib/bugsnag'

import SideMenu from 'react-native-side-menu'

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
import { TIP_SHARE_LINK_URL, ANDROID_PUSH_SENDER_ID, PIN_FEATURE } from '../../service/api'
import AlertController from '../../components/AlertController'
import SideMenuComponent from '../../components/SideMenuComponent'
import * as COMMON_FUNC from '../../service/commonFunc'
import SearchScreen from '../SearchScreen';
import FirstTimeEntyTipComponent from '../../components/FirstTimeEntyTipComponent'

const SEARCH_ICON = require('../../../assets/images/Search/Grey.png')
const SETTING_ICON = require('../../../assets/images/Settings/Grey.png')

import LocalStorage from '../../components/LocalStorage'
import OfflineIndicator from '../../components/LocalStorage/OfflineIndicator'


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
  getCard, addLink,
} from '../../redux/card/actions'
import { images } from '../../themes';
import Search from 'react-native-search-box';

const TOASTER_DURATION = 3000
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
      selectedFeedList: [],
      backFeedList: [],
      feedClickEvent: 'normal',
      showLongHoldActionBar: false,
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
      filterSortType: 'recent',
      unSelectFeed: false,
      isSideMenuOpen: false,
      selectedItemTitle: 'All flows',
      fileData: null,
      isVisibleSelectFeedoModal: false,
      addLinkURL: '',
      selectedAddLink: '',  // value to set if the user taps add link,
      showFirstFlowTip: false,
      showProfilePhotoTip: false
    };

    this.currentRef = null;
    this.animatedOpacity = new Animated.Value(0);
    this.isInitialized = false;

    this.animatedSelectFeed = new Animated.Value(1);
  }

  // Show tip for first flow
  async onShowFirstFlowTip() {
    const firstFlowTipData = await AsyncStorage.getItem('FirstFlowTip')

    if(firstFlowTipData) {
      this.setState({ showFirstFlowTip: false })
    } else {
      this.setState({ showFirstFlowTip: true })
    }
  }

  // Show tip for profile photo upload
  async onShowProfilePhotoTip() {
    const { user } = this.props
    const profilePhotoTipData = await AsyncStorage.getItem('ProfilePhotoTip')
    const FirstInviteFlowData = await AsyncStorage.getItem('FirstInviteTip')
    const FirstAcceptFlowData = await AsyncStorage.getItem('FirstAcceptFlow')

    if (profilePhotoTipData) {
      this.setState({ showProfilePhotoTip: false })
    } else {
      if ((FirstInviteFlowData || FirstAcceptFlowData) && !user.userInfo.imageUrl) {
        this.setState({ showProfilePhotoTip: true })
      } else {
        this.setState({ showProfilePhotoTip: false })
      }
    }
  }

  showSharePermissionModal(permissionInfo) {
    // If we haven't asked to enable share extension before
    if (!permissionInfo) {
        this.setState({ showSharePermissionModal: true })
    } else {
      // show tips when opening app the second time
      this.onShowFirstFlowTip()
      this.onShowProfilePhotoTip()
    }
  }

  hideSharePermissionModal() {
    this.setState({ showSharePermissionModal: false })
    // hide tip when dismiss the share permission modal
    this.onShowFirstFlowTip()
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
    // hide tip when dismiss the share permission modal
    this.onShowFirstFlowTip()
  }

  onEnableShareWidget = () => {
    AsyncStorage.setItem('permissionInfo', JSON.stringify('true'))
    this.setState({ showSharePermissionModal: false, enableShareWidget: true })
  }

  getFeedsFromStorage = () => {
    const { user } = this.props

    const key = user.userInfo.id + '/flows'

    // console.log('GFL user is ', user, ' key is ', key)

    // console.log('AS get ', key)
    AsyncStorage.getItem(key)
    .then((result) => {
      const feeds = JSON.parse(result)
      // feeds.shift()
      // console.log('AS get async result', feeds)
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
    } else {
      // show tips when opening app the second time
      this.onShowFirstFlowTip()
      this.onShowProfilePhotoTip()
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
    console.log("Subscribing to events")
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

    this.props.getFeedoList(null, this.getFeedsFromStorage)

    this.props.getActivityFeed(this.props.user.userInfo.id, { page: 0, size: PAGE_COUNT })

    Intercom.addEventListener(Intercom.Notifications.UNREAD_COUNT, this._onUnreadIntercomChange);

    bugsnag.setUser(this.props.user.userInfo.id)

    AppState.addEventListener('change', this.onHandleAppStateChange.bind(this));
    appOpened(this.props.user.userInfo.id);

    //for android share extension when app launched at first
    if (Platform.OS === 'android') {
      AsyncStorage.getItem("AndroidShareExtension").then((value) => {
        let shareExtData = JSON.parse(value)
        console.log('shareExtensionData', shareExtData)
        if (shareExtData !== null && shareExtData.type !== '' && shareExtData.value !== '') {
          setTimeout(() => {
            Actions.ChooseLinkImageFromExtension({mode: shareExtData.type, value: shareExtData.value, prev_scene: 'HomeScreen'});
          }, 100)
        }

        AsyncStorage.removeItem('AndroidShareExtension');
      });
    }

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
      if (feedo.error.code === 'error.hunt.not.found') {
        AlertController.shared.showAlert('Error', 'This flow no longer exists')
      }

      if (feedo.error.code === 'error.hunt.access.denied') {
        AlertController.shared.showAlert('Error', 'You don\'t have access to this flow')
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
      (feedo.loading === 'PUBNUB_GET_FEED_DETAIL_FULFILLED') ||  (feedo.loading === 'DELETE_CARD_FULFILLED') ||
      (feedo.loading === 'REPORT_CARD_FULFILLED') ||
      (feedo.loading === 'PUBNUB_MOVE_IDEA_FULFILLED') || (feedo.loading === 'MOVE_CARD_FULFILLED') ||
      (feedo.loading === 'READ_ACTIVITY_FEED_FULFILLED') || (feedo.loading === 'DEL_ACTIVITY_FEED_FULFILLED') ||
      (feedo.loading === 'UPDATE_CARD_FULFILLED') || (feedo.loading === 'GET_CARD_FULFILLED') ||
      (feedo.loading === 'DEL_DUMMY_CARD') || (feedo.loading === 'MOVE_DUMMY_CARD') || (feedo.loading === 'REPORT_DUMMY_CARD') ||
      (feedo.loading === 'PUBNUB_DELETE_INVITEE_FULFILLED') || (feedo.loading === 'GET_FEED_DETAIL_REJECTED') ||
      (feedo.loading === 'SAVE_FLOW_PREFERENCE_FULFILLED') || (feedo.loading === 'SET_FEEDO_LIST_FROM_STORAGE') ||
      (feedo.loading === 'GET_INVITED_FEEDO_LIST_FULFILLED') ||
      (feedo.loading === 'UPDATE_PROFILE_FULFILLED') || (feedo.loading === 'GET_FEED_DETAIL_FULFILLED') ||
      (feedo.loading === 'PUBNUB_DELETE_FEED' &&
                          Actions.currentScene !== 'FeedDetailScreen' &&
                          Actions.currentScene !== 'CommentScreen' && Actions.currentScene !== 'ActivityCommentScreen' &&
                          Actions.currentScene !== 'LikesListScreen' && Actions.currentScene !== 'ActivityLikesListScreen'))
    {
      let feedoList = [];
      let feedoPinnedList = [];
      let feedoUnPinnedList = [];

      if (feedo.feedoList && feedo.feedoList.length > 0) {
        feedoList = feedo.feedoList.map(item => {
          const filteredIdeas = orderBy(
            filter(item.ideas, idea => idea !== null && idea.coverImage !== null && idea.coverImage !== ''),
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

        // refresh list if card addedd or card moved
        if ((feedo.loading === 'UPDATE_CARD_FULFILLED' || feedo.loading === 'MOVE_CARD_FULFILLED') && feedo.isCreateCard) {
          nextProps.getFeedoList(null, this.getFeedsFromStorage)
        } else {
          const { filterSortType, filterShowType } = prevState

          const feedoFullList = filter(feedoList, item => item.status === 'PUBLISHED' && item.metadata.myInviteStatus !== 'INVITED')

          // Filter pinned flows and orderby myLastActivityDate
          feedoPinnedList = filter(feedoFullList, item => item.pinned !== null);
          feedoUnPinnedList = filter(feedoFullList, item => item.pinned === null);
          feedoList = HomeScreen.getFilteredFeeds(feedoPinnedList, feedoUnPinnedList, filterShowType, filterSortType);
        } 
      } else {
        if (user.loading !== 'USER_SIGNOUT_FULFILLED') {
          // nextProps.getFeedoList(null, this.getFeedsFromStorage)
        }
      }
      

      if (prevState.feedClickEvent === 'long' && feedoList.length === 0) {
        return {
          isLongHoldMenuVisible: false,
          feedClickEvent: 'normal',
          selectedFeedList: []
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
        this.setState({ inviteToasterTitle: 'Invitation declined' })
      }
      setTimeout(() => {
        this.setState({ isShowInviteToaster: false })
      }, TOASTER_DURATION)
    }

    if (prevProps.feedo.loading !== 'UPDATE_FEED_INVITATION_FULFILLED' && feedo.loading === 'UPDATE_FEED_INVITATION_FULFILLED') {
      // Set Asynstorage data when accepting the first flow
      const FirstAcceptFlowData = await AsyncStorage.getItem('FirstAcceptFlow')
      if (!FirstAcceptFlowData) {
        AsyncStorage.setItem('FirstAcceptFlow', JSON.stringify(true))
        this.onShowProfilePhotoTip()
      }
    }

    if (prevProps.feedo.loading !== 'UPDATE_PROFILE_FULFILLED' && feedo.loading === 'UPDATE_PROFILE_FULFILLED') {
      // Set Asynstorage data when accepting the first flow
      if (user.userInfo.imageUrl) {
        this.onCloseProfilePhotoTip()
      }
    }

    if (prevProps.feedo.loading !== 'UPDATE_FEED_FULFILLED' && feedo.loading === 'UPDATE_FEED_FULFILLED') {
      // Close first flow tip
      this.onCloseFirstFlowTip()
    }

    if (prevProps.feedo.loading !== 'INVITE_HUNT_FULFILLED' && feedo.loading === 'INVITE_HUNT_FULFILLED') {
      // hide first invite tip if invited the person to this flow
      COMMON_FUNC.handleFirstInviteTipStorageData()
      this.onShowProfilePhotoTip()
    }
  
    if (feedo.loading === 'PUBNUB_GET_FEED_DETAIL_FULFILLED' && Actions.currentScene !== 'FeedDetailScreen' ||
        feedo.loading === 'PUBNUB_MOVE_IDEA_FULFILLED' && Actions.currentScene !== 'FeedDetailScreen' ||
        feedo.loading === 'GET_CARD_FULFILLED' && Actions.currentScene !== 'FeedDetailScreen' ||
        feedo.loading === 'PUBNUB_LIKE_CARD_FULFILLED' && Actions.currentScene !== 'FeedDetailScreen' ||
        feedo.loading === 'PUBNUB_UNLIKE_CARD_FULFILLED' && Actions.currentScene !== 'FeedDetailScreen' ||
        feedo.loading === 'PUBNUB_USER_INVITED_FULFILLED' ||
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

        this.props.getInvitedFeedList();
      }
    }

    if ((prevProps.feedo.loading !== 'GET_FEEDO_LIST_FULFILLED' && feedo.loading === 'GET_FEEDO_LIST_FULFILLED') ||
        (prevProps.feedo.loading !== 'UPDATE_FEED_FULFILLED' && feedo.loading === 'UPDATE_FEED_FULFILLED') ||
        (prevProps.feedo.loading !== 'FEED_FULFILLED' && feedo.loading === 'FEED_FULFILLED') ||
        (prevProps.feedo.loading !== 'DEL_FEED_FULFILLED' && feedo.loading === 'DEL_FEED_FULFILLED') ||
        (prevProps.feedo.loading !== 'ARCHIVE_FEED_FULFILLED' && feedo.loading === 'ARCHIVE_FEED_FULFILLED') ||
        (prevProps.feedo.loading !== 'GET_INVITED_FEEDO_LIST_FULFILLED' && feedo.loading === 'GET_INVITED_FEEDO_LIST_FULFILLED') ||
        (feedo.loading === 'PUBNUB_DELETE_FEED' &&
                          Actions.currentScene !== 'FeedDetailScreen' &&
                          Actions.currentScene !== 'CommentScreen' && Actions.currentScene !== 'ActivityCommentScreen' &&
                          Actions.currentScene !== 'LikesListScreen' && Actions.currentScene !== 'ActivityLikesListScreen')) {
      this.state.isRefreshing && this.setState({ isRefreshing: false })                   
      await this.setBubbles(feedoList)
    }


    if (feedo.loading === 'SET_FEED_DETAIL_ACTION' && prevProps.feedo.feedDetailAction !== feedo.feedDetailAction) {
      if (feedo.feedDetailAction.action === 'Delete') {
        this.setState({ isShowActionToaster: true })
        this.handleDeleteFeed(feedo.feedDetailAction.feedList)
      }

      if (feedo.feedDetailAction.action === 'Archive') {
        this.setState({ isShowActionToaster: true })
        this.handleArchiveFeed(feedo.feedDetailAction.feedList)
      }

      if (feedo.feedDetailAction.action === 'Leave') {
        this.setState({ isShowActionToaster: true })
        this.handleLeaveFeed(feedo.feedDetailAction.feedList)
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

      if (clipboardContent !== '') {
        var allUrls = this.getUrls(clipboardContent)
        if (allUrls && allUrls.length > 0) {
          this.setState({ addLinkURL: allUrls[0] })
        }
        else {
          this.setState({ addLinkURL: '' })
        }
      }

      const lastClipboardData = await AsyncStorage.getItem(CONSTANTS.CLIPBOARD_DATA)
      if (clipboardContent !== '' && clipboardContent !== lastClipboardData) {
        AsyncStorage.setItem(CONSTANTS.CLIPBOARD_DATA, clipboardContent);
        this.props.showClipboardToaster(clipboardContent, 'home')
      }
    }
  }

  getUrls(text) {
    return text.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi);
  }

  onHandleAppStateChange = async(nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      appOpened(this.props.user.userInfo.id);
      if (Actions.currentScene === 'HomeScreen') {
        this.props.getFeedoList(null, this.getFeedsFromStorage)

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
          this.props.getFeedoList(null, this.getFeedsFromStorage);
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
          this.props.getFeedoList(null, this.getFeedsFromStorage);
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
          this.props.getFeedoList(null, this.getFeedsFromStorage);
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

  handleLongHoldMenu = (index, feed) => {
    const selectedFeedList = []
    selectedFeedList.push({
      index,
      feed
    })

    this.setState({
      feedClickEvent: 'long',
      selectedFeedList,
      isLongHoldMenuVisible: true,
      showLongHoldActionBar: true,
      unSelectFeed: COMMON_FUNC.isFeedOwner(feed) ? true : false
    }, () => {
      Animated.spring(this.animatedSelectFeed, {
        toValue: 0.85,
        useNativeDriver: true
      }).start();
    });
  }

  updateSelectedFeedList = (index, feed) => {
    let { selectedFeedList } = this.state

    if (selectedFeedList.length > 0 && !COMMON_FUNC.isFeedOwner(selectedFeedList[0].feed)) {
      selectedFeedList = []
    }

    if (COMMON_FUNC.isFeedOwner(feed)) {
      if (find(selectedFeedList, item => item.index === index)) {
        selectedFeedList = filter(selectedFeedList, item => item.index !== index)
      } else {
        selectedFeedList = [
          ...selectedFeedList,
          {
            index,
            feed
          }
        ]
      }
    }
    this.setState({
      selectedFeedList,
      showLongHoldActionBar: selectedFeedList.length > 0 ? true : false,
      unSelectFeed: true
    })  
  }

  closeLongHoldMenu = () => {
    this.setState({
      selectedLongHoldFeedoIndex: -1,
      selectedFeedList: [],
      feedClickEvent: 'normal',
      isLongHoldMenuVisible: false,
      unSelectFeed: false
    }, () => {
      Animated.spring(this.animatedSelectFeed, {
        toValue: 1,
        useNativeDriver: true
      }).start();
    })
  }

  handleArchiveFeed = (backFeedList) => {
    this.closeLongHoldMenu()
    
    this.setState({ isShowActionToaster: true, isArchive: true, toasterTitle: 'Flow archived', backFeedList })
    this.props.addDummyFeed({ backFeedList, flag: 'archive' })

    setTimeout(() => {
      this.setState({ isShowActionToaster: false })
      this.archiveFeed(backFeedList)
    }, TOASTER_DURATION)
  }

  archiveFeed = (backFeedList) => {
    if (this.state.isArchive) {
      Analytics.logEvent('dashboard_archive_feed', {})

      this.props.archiveFeed(backFeedList)
      this.setState({ isArchive: false, backFeedList: [] })
    }
  }

  handleDeleteFeed = (backFeedList) => {
    this.closeLongHoldMenu()

    this.setState({ isShowActionToaster: true, isDelete: true, toasterTitle: 'Flow deleted', backFeedList })
    this.props.addDummyFeed({ backFeedList, flag: 'delete' })

    setTimeout(() => {
      this.setState({ isShowActionToaster: false })
      this.deleteFeed(backFeedList)
    }, TOASTER_DURATION)
  }

  deleteFeed = (backFeedList) => {
    if (this.state.isDelete) {
      Analytics.logEvent('dashboard_delete_feed', {})

      this.props.deleteFeed(backFeedList)
      this.setState({ isDelete: false, backFeedList: [] })
    }
  }

  handleLeaveFeed = (backFeedList) => {
    this.closeLongHoldMenu()

    this.setState({ isShowActionToaster: true, isLeave: true, toasterTitle: 'Left Flow', backFeedList })
    this.props.addDummyFeed({ backFeedList, flag: 'leave' })

    setTimeout(() => {
      this.setState({ isShowActionToaster: false })
      this.leaveFeed(backFeedList)
    }, TOASTER_DURATION)
  }

  leaveFeed = (backFeedList) => {
    if (this.state.isLeave) {
      Analytics.logEvent('dashboard_leave_feed', {})
      const { feedo, user } = this.props

      const invitee = filter(feedo.leaveFeedList[0].invitees, invitee => invitee.userProfile.id === user.userInfo.id)
      this.props.deleteInvitee(backFeedList[0].feed.id, invitee[0].id)
      this.setState({ isLeave: false, backFeedList: [] })
    }
  }

  handlePinFeed = (backFeedList) => {
    this.closeLongHoldMenu()

    this.setState({ isShowActionToaster: true, isPin: true, toasterTitle: 'Flow pinned', backFeedList })

    this.pinFeed(backFeedList)

    setTimeout(() => {
      this.setState({ isShowActionToaster: false, isPin: false })
    }, TOASTER_DURATION)
  }

  pinFeed = (backFeedList) => {
    Analytics.logEvent('dashboard_pin_feed', {})
    this.props.pinFeed(backFeedList[0].feed.id)
  }

  handleUnpinFeed = (backFeedList) => {
    this.closeLongHoldMenu()

    this.setState({ isShowActionToaster: true, isUnPin: true, toasterTitle: 'Flow un-pinned', backFeedList })

    this.unpinFeed(backFeedList)

    setTimeout(() => {
      this.setState({ isShowActionToaster: false, isUnPin: true })
    }, TOASTER_DURATION)
  }

  unpinFeed = (backFeedList) => {
    Analytics.logEvent('dashboard_unpin_feed', {})
    this.props.unpinFeed(backFeedList[0].feed.id)
  }

  handleDuplicateFeed = (backFeedList) => {
    this.closeLongHoldMenu()

    this.setState({ isShowActionToaster: true, isDuplicate: true, toasterTitle: 'Flow duplicated' })
    this.props.duplicateFeed(backFeedList)

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

  handleEditFeed = (selectedFeedList) => {
    this.closeLongHoldMenu()

    setTimeout(() => {
      this.props.closeClipboardToaster()
      this.props.setCurrentFeed({})

      this.setState({
        isVisibleNewFeed: true,
        isEditFeed: true,
        selectedFeedList,
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
      this.unpinFeed(this.state.backFeedList)
    } else if (this.state.isUnPin) {
      this.pinFeed(this.state.backFeedList)
    } else if (this.state.isDelete) {
      this.props.removeDummyFeed({ backFeedList: this.state.backFeedList, flag: 'delete' })
    } else if (this.state.isArchive) {
      this.props.removeDummyFeed({ backFeedList: this.state.backFeedList, flag: 'archive' })
    } else if (this.state.isDuplicate) {
      if (this.props.feedo.duplicatedFeedList.length > 0) {
        const data = this.props.feedo.duplicatedFeedList.map((item, index) => {
          return { 'id': index, feed: item.feed }
        })
        this.props.deleteDuplicatedFeed(data)
      }
    } else if (this.state.isLeave) {
      this.props.removeDummyFeed({ backFeedList: this.state.backFeedList, flag: 'leave' })
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

  onOpenNewFeedModal = () => {
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
    const { addLinkURL } = this.state

    this.props.closeClipboardToaster()
    var options = {
      storageOptions: {
        skipBackup: true,
        path: 'feedo'
      },
      mediaType: 'mixed'
    };

    if (type === 'ADD_TEXT') {
      Analytics.logEvent('dashboard_new_card', {})

      this.setState({
        isVisibleCreateNewFeedModal: false,
        isVisibleCard: true,
        cardViewMode: CONSTANTS.CARD_NEW,
        selectedIdeaInvitee: null,
      });
    } else if (type === 'NEW_FLOW') {
      Analytics.logEvent('dashboard_new_feed', {})

      this.props.setCurrentFeed({});
      this.setState({
        isVisibleCreateNewFeedModal: false,
        isVisibleNewFeed: true,
        isEditFeed: false,
      });
    } else if (type === 'UPLOAD_PHOTO') {
      this.onAddMedia(1)
    } else if (type === 'TAKE_PHOTO') {
      this.onAddMedia(0)
    } else if (type === 'ATTACH_FILE') {
      this.onAddDocument();
    } else if (type === 'ADD_LINK') {
      Analytics.logEvent('dashboard_new_card', {})

      this.setState({
        isVisibleCreateNewFeedModal: false,
        isVisibleCard: true,
        cardViewMode: CONSTANTS.CARD_NEW,
        selectedIdeaInvitee: null,
        selectedAddLink: addLinkURL
      });

      // Clear the selected value for later
      setTimeout(() => {
        this.setState({selectedAddLink: ''});
      }, 5000)
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

  onAddMedia(index) {
    Permissions.checkMultiple(['camera', 'photo']).then(response => {
      if (response.camera === 'authorized' && response.photo === 'authorized') {
        //permission already allowed
        this.onTapMediaPickerActionSheet(index)
      }
      else {
        Permissions.request('camera').then(response => {
          if (response === 'authorized') {
            //camera permission was authorized
            Permissions.request('photo').then(response => {
              if (response === 'authorized') {
                //photo permission was authorized
                this.onTapMediaPickerActionSheet(index)
              }
              else if (Platform.OS === 'ios') {
                Permissions.openSettings();
              }    
            });
          }
          else if (Platform.OS === 'ios') {
            Permissions.openSettings();
          }
        });
      }
    });
  }

  onTapMediaPickerActionSheet(index) {
    var options = {
      storageOptions: {
        skipBackup: true,
        path: 'feedo'
      },
      mediaType: 'mixed'
    };
        
    if (index === 0) {
      // from camera
      if (DeviceInfo.isEmulator()) {
        Alert.alert("It's impossible to take a photo on Simulator")
      } else {
        this.pickMediaFromCamera(options);
      }
    } else if (index === 1) {
      // from library
      this.pickMediaFromLibrary(options);
    }
  }

  pickMediaFromCamera(options) {
    ImagePicker.launchCamera(options, (response)  => {
      if (!response.didCancel) {
        if (!response.fileName) {
          response.fileName = response.uri.replace(/^.*[\\\/]/, '')
        }
        this.handleFile(response)
      }
    });
  }

  pickMediaFromLibrary(options) {
    ImagePicker.launchImageLibrary(options, (response)  => {
      if (!response.didCancel) {
        this.handleFile(response)
      }
    });
  }

  onAddDocument() {
    if (Platform.OS === 'ios') {
      this.PickerDocumentShow();
    }
    else {
      Permissions.check('storage').then(response => { //'storage' permission doesn't support on iOS
        if (response === 'authorized') {
          //permission already allowed
          this.PickerDocumentShow();
        }
        else {
          Permissions.request('storage').then(response => {
            if (response === 'authorized') {
              //storage permission was authorized
              this.PickerDocumentShow();
            }
          });
        }
      });
    }
  }

  PickerDocumentShow () {
    DocumentPicker.show({
      filetype: [DocumentPickerUtil.allFiles()],
    },(error, response) => {
      if (error === null) {
        this.handleFile(response)
      }
    });
    return;
  }

  handleFile = (file) => {
    this.setState({
      fileData: file
    }, () => {
      this.setState({
        isVisibleCreateNewFeedModal: false,
        isVisibleCard: true,
        cardViewMode: CONSTANTS.CARD_NEW,
        selectedIdeaInvitee: null
      });
    })
  }

  get renderNewFeedModals() {
    const { isEditFeed, isVisibleNewFeed, isVisibleCreateNewFeedModal, selectedFeedList, addLinkURL } = this.state

    if (!isVisibleNewFeed && !isVisibleCreateNewFeedModal) {
      return;
    }

    return (
      <Animated.View
        style={[
          styles.modalContainer,
          styles.quickActionModalContainer,
          { opacity: this.animatedOpacity }
        ]}
      >
        {isVisibleCreateNewFeedModal && (
          <CreateNewFeedComponent
            addLinkURL={addLinkURL}
            onSelect={(type) => this.onSelectNewFeedType(type)}
            onClose={() => this.onCloseCreateNewFeedModal()}
          />
        )}

        {isVisibleNewFeed && (
          <NewFeedScreen
            feedData={isEditFeed ? selectedFeedList[0].feed : {}}
            onClose={(data) => this.onCloseNewFeedModal(data)}
            selectedFeedId={isEditFeed ? selectedFeedList[0].feed.id : null}
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
    
    this.setState({ isVisibleSelectFeedoModal: true })
  }

  onCloseCardModal() {
    this.animatedOpacity.setValue(1);
    Animated.timing(this.animatedOpacity, {
      toValue: 0,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
    }).start(() => {
      this.setState({ 
        isVisibleCard: false,
        fileData: null
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
          fileData={this.state.fileData}
          shareUrl={this.state.selectedAddLink}
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
    this.props.getFeedoList(null, this.getFeedsFromStorage)
    this.props.getInvitedFeedList()
  }

  dismiss = (e) => {
    this.setState({ showShareTipsModal: false })
    this.onShowFirstFlowTip()
  };

  onFilterShow = (type, selectedItemTitle) => {
    this.setState({ filterShowType: type, selectedItemTitle, isSideMenuOpen: false }, () => {
      this.filterFeeds()
    })
  }

  onFilterSort = (type) => {
    this.setState({ filterSortType: type }, () => {
      this.filterFeeds()
    })
  }

  onCloseSelectHunt() {
    this.isDisabledKeyboard = false;
    this.setState({ isVisibleSelectFeedoModal: false })
    if (!this.props.feedo.currentFeed.id) {
      this.props.setCurrentFeed(this.draftFeedo);
    }
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

  toggleSideMenu = () => {
    this.setState({ isSideMenuOpen: !this.state.isSideMenuOpen });
  }

  updateMenuState(isSideMenuOpen) {
    this.setState({ isSideMenuOpen });
  }

  onCloseFirstFlowTip = () => {
    // Delete Asyncstorage data for first flow tip
    COMMON_FUNC.handleFirstFlowTipStorageData()
    this.setState({ showFirstFlowTip: false })
  }

  onCloseProfilePhotoTip = () => {
    // Delete Asyncstorage data for profile Photo tip
    COMMON_FUNC.handleProfilePhotoTipStorageData()
    this.setState({ showProfilePhotoTip: false })
  }

  render () {
    const {
      loading,
      feedoList,
      invitedFeedList,
      badgeCount,
      showFeedInvitedNewUserBubble,
      feedClickEvent,
      selectedFeedList,
      isLongHoldMenuVisible,
      unSelectFeed,
      selectedLongHoldFeedoIndex,
      isSideMenuOpen,
      filterShowType,
      selectedItemTitle
    } = this.state
    const menu = <SideMenuComponent onItemSelected={this.onFilterShow} selectedItem={filterShowType} />

    return (
      <SideMenu
        menu={menu}
        isOpen={isSideMenuOpen}
        onChange={isOpen => this.updateMenuState(isOpen)}
        bounceBackOnOverdraw={false}
      >
      { this.renderSelectHunt }
      <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View feedAction="null" />
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" backgroundColor="blue" />}
          {Platform.OS === 'android' && (
            <View style={styles.statusBarUnderlay} />
          )}
            <NetworkConsumer pingInterval={CONSTANTS.NETWORK_CONSUMER_PING_INTERVAL}>
            {({ isConnected }) => (
          <View style={styles.headerView}>
            <TouchableOpacity
              style={styles.menuIconView}
              activeOpacity={0.7}
              onPress={this.toggleSideMenu}
            >
              <Image source={images.iconMenu} style={styles.menuIcon} />
            </TouchableOpacity>
            <Text style={styles.title}>
              {selectedItemTitle}
            </Text>
            {/* <TouchableOpacity
              style={styles.searchIconView}
              onPress={() => this.onSearch()}
            >
              <Image style={styles.searchIcon} source={SEARCH_ICON} />
            </TouchableOpacity> */}
            <View>
              <TouchableOpacity style={styles.settingIconView} onPress={() => this.handleSetting()}>
                { isConnected ? <Image source={SETTING_ICON} /> : null }
              </TouchableOpacity>
            </View>
          </View>
          )}
        </NetworkConsumer>

          <View
            style={[!isLongHoldMenuVisible ? styles.feedListContainer : styles.feedListContainerLongHold, feedClickEvent === 'normal' && { paddingBottom: 30 }]}
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

            {filterShowType === 'shared' && invitedFeedList.length === 0 && feedoList.length === 0 &&
              <View>
                <SpeechBubbleComponent
                  page="shared"
                  title="Flows can be shared with friends and colleagues for collaboration. Flows you've been invited to will appear here."
                  subTitle="All you need to know about sharing in 15 secs "
                />
              </View>
            }
            {filterShowType !== 'shared' && feedoList.length === 0 && (
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
              selectedFeedList={selectedFeedList}
              feedClickEvent={feedClickEvent}
              unSelectFeed={unSelectFeed}
              isLongHoldMenuVisible={isLongHoldMenuVisible}
              animatedSelectFeed={this.animatedSelectFeed}
              updateSelectIndex={this.updateSelectedFeedList}
              handleLongHoldMenu={this.handleLongHoldMenu}
              clearCurrentFeed={() => this.props.setCurrentFeed({})}
              page="home"
              isRefreshing={this.state.isRefreshing}
              onRefreshFeed={() => this.onRefreshFeed()}
            />

            <OfflineIndicator />
          </View>

        </View>

        {!isLongHoldMenuVisible && (
          <DashboardActionBar
            showList={true}
            showSearch
            listType={this.props.user.listHomeType}
            onAddFeed={this.onOpenNewFeedModal.bind(this)}
            handleFilter={() => this.handleFilter()}
            handleList={() => this.handleList()}
            handleSearch={() => this.onSearch()}
            filterType={this.state.filterShowType}
            sortType={this.state.filterSortType}
            badgeCount={badgeCount}
            page="home"
            filtering={false}
          />
        )}

        {!loading && this.state.showFirstFlowTip && (
          <FirstTimeEntyTipComponent
            type={0}
            onCloseTip={this.onCloseFirstFlowTip}
            onTapFlow={this.onOpenNewFeedModal}
            delay={5000}
          />
        )}

        {!loading && this.state.showProfilePhotoTip && (
          <FirstTimeEntyTipComponent
            type={2}
            onCloseTip={this.onCloseProfilePhotoTip}
            onTapFlow={this.handleSetting}
            delay={500}
          />
        )}

        {this.renderNewFeedModals}

        {isLongHoldMenuVisible && (
          <FeedLongHoldMenuScreen
            selectedFeedList={selectedFeedList}
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

        {isLongHoldMenuVisible && (
          <View style={styles.topButtonView}>
            <TouchableOpacity onPress={() => this.closeLongHoldMenu()}>
              <Text style={[styles.btnDoneText, { color: COLORS.PURPLE }]}>Done</Text>
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
          onBackdropPress={() => this.hideSharePermissionModal()}
          onBackButtonPress={() => this.hideSharePermissionModal()}
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
      </View>
      </SideMenu>
    )
  }

  get renderSelectHunt() {
    const { feedoList } = this.state

    if (this.state.isVisibleSelectFeedoModal) {
      return (
        <SearchScreen
          cachedFeedList={ feedoList }
          onClosed={ () => this.setState({ isVisibleSelectFeedoModal: false }) }
        />
      );
    }
  }
}

const mapStateToProps = ({ user, feedo, card }) => ({
  feedo,
  user,
  card
})

const mapDispatchToProps = dispatch => ({
  getFeedoList: (index, errorAction) => dispatch(getFeedoList(index))
  .then(result => {
    // console.log('GFL resolves on HS, success looks like ', result)
    if(result.error){
      errorAction(error)
    }
  })
  .catch(error => {
    // console.log('GFL error on HS')
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
