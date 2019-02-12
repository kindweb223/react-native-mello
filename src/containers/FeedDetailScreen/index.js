/* global require */
import React from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Animated,
  TouchableOpacity,
  TouchableHighlight,
  AsyncStorage,
  Alert,
  RefreshControl,
  AppState,
  Clipboard,
  Share,
  Platform,
  BackHandler
} from 'react-native'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Actions } from 'react-native-router-flux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ActionSheet from 'react-native-actionsheet'
import Modal from "react-native-modal"
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import ImagePicker from 'react-native-image-picker'
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker'
import Permissions from 'react-native-permissions'
import * as mime from 'react-native-mime-types'
import GestureRecognizer from 'react-native-swipe-gestures'
import Masonry from '../../components/MasonryComponent'

import DashboardActionBar from '../../navigations/DashboardActionBar'
import FeedCardComponent from '../../components/FeedCardComponent'
import FeedCollapseComponent from '../../components/FeedCollapseComponent'
import AvatarPileComponent from '../../components/AvatarPileComponent'
import FeedNavbarSettingComponent from '../../components/FeedNavbarSettingComponent'
import FeedControlMenuComponent from '../../components/FeedControlMenuComponent'
import ToasterComponent from '../../components/ToasterComponent'
import FeedLoadingStateComponent from '../../components/FeedLoadingStateComponent'
import ShareScreen from '../ShareScreen'
import InviteeScreen from '../InviteeScreen'
import NewFeedScreen from '../NewFeedScreen'
import CardFilterComponent from '../../components/CardFilterComponent'
import CardLongHoldMenuScreen from '../CardLongHoldMenuScreen'
import SelectHuntScreen from '../SelectHuntScreen'
import TagCreateScreen from '..//TagCreateScreen'
import CardDetailScreen from '../CardDetailScreen'
import CardNewScreen from '../CardNewScreen'
import LoadingScreen from '../LoadingScreen'
import EmptyStateComponent from '../../components/EmptyStateComponent'
import SpeechBubbleComponent from '../../components/SpeechBubbleComponent'
import FollowMemberScreen from '../FollowMembersScreen'

import {
  getFeedDetail,
  setFeedDetailAction,
  pinFeed,
  unpinFeed,
  duplicateFeed,
  deleteDuplicatedFeed,
  getFileUploadUrl,
  uploadFileToS3,
  addFile,
  deleteFile,
  setCurrentFeed,
  updateInvitation,
  deleteDummyCard,
  moveDummyCard,
  getActivityFeed,
  getFeedoList,
  updateSharingPreferences,
  deleteInvitee,
  saveFlowViewPreference,
} from '../../redux/feedo/actions';
import {
  setCurrentCard,
  deleteCard,
  moveCard,
} from '../../redux/card/actions'
import {
  showClipboardToaster,
  closeClipboardToaster
} from '../../redux/user/actions'

import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import * as COMMON_FUNC from '../../service/commonFunc'
import styles from './styles'
import { TAGS_FEATURE, SHARE_LINK_URL } from "../../service/api"

import Analytics from '../../lib/firebase'

const TOASTER_DURATION = 5000

const ACTION_NONE = 0;
const ACTION_FEEDO_PIN = 1;
const ACTION_FEEDO_UNPIN = 2;
const ACTION_FEEDO_DUPLICATE = 3;
const ACTION_CARD_MOVE = 4;
const ACTION_CARD_EDIT = 5;
const ACTION_CARD_DELETE = 6;

const FeedDetailMode = 1;
const TagCreateMode = 2;

const PAGE_COUNT = 50

class FeedDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentBackFeed: {},
      currentFeed: {},
      loading: false,
      apiLoading: false,
      
      isVisibleCard: false,
      cardViewMode: CONSTANTS.CARD_NONE,
      cardMode: CONSTANTS.MAIN_APP_CARD_FROM_DETAIL,

      isVisibleEditFeed: false,
      isVisibleLongHoldMenu: false,
      isVisibleSelectFeedo: false,
      openMenu: false,
      isShowToaster: false,
      isShowShare: false,
      pinText: 'Pin',
      selectedIdeaInvitee: null,
      selectedIdeaLayout: {},
      isInviteeModal: false,
      showFilterModal: false,
      filterShowType: 'all',
      filterSortType: 'date',
      selectedLongHoldIdea: {},
      selectedLongHoldInvitees: [],
      selectedLongHoldCardIndex: -1,
      currentActionType: ACTION_NONE,
      totalCardCount: 0,
      isVisibleCardOpenMenu: false,
      currentScreen: FeedDetailMode,
      feedoMode: 1,
      showBubble: false,
      showBubbleCloseButton: false,
      isExistingUser: false,
      showEmptyBubble: false,
      feedoViewMode: CONSTANTS.FEEDO_FROM_MAIN,
      isRefreshing: false,
      avatars: [],
      invitees: [],
      filteredInvitees: [],
      copiedUrl: '',
      appState: AppState.currentState,
      isMasonryView: false,
      isShowInviteToaster: false,
      inviteToasterTitle: '',
      viewPreference: 'LIST',
      isLeaveFlowClicked: false,
    };
    this.animatedOpacity = new Animated.Value(0)
    this.menuOpacity = new Animated.Value(0)
    this.menuZIndex = new Animated.Value(0)
    this.animatedSelectCard = new Animated.Value(1);

    this.cardItemRefs = [];
    this.moveCardId = null;

    this.animatedTagTransition = new Animated.Value(1)

    this.selectedFile = null
    this.selectedFileMimeType = null
    this.selectedFileType = null
    this.selectedFileName = null
    this.prevFeedo = null;

    this.userActions = [];
    this.userActionTimer = null;
    this.scrollviewHeight = 0
  }

  UNSAFE_componentWillMount() {
    const { data } = this.props
    if (data.metadata) {
      this.setState({ viewPreference: data.metadata.myViewPreference ? data.metadata.myViewPreference : 'LIST' })
    }
  }

  componentDidMount() {
    const { data } = this.props
    Analytics.setCurrentScreen('FeedDetailScreen')

    this.setState({ loading: true })
    this.props.getFeedDetail(data.id);
    AppState.addEventListener('change', this.onHandleAppStateChange);

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.onHandleAppStateChange);
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    this.backToDashboard();
    return true;
  }
  
  async UNSAFE_componentWillReceiveProps(nextProps) {
    const { feedo, card } = nextProps

    if (this.state.isVisibleSelectFeedo) {
      if (this.props.feedo.loading !== 'GET_FEEDO_LIST_PENDING' && feedo.loading === 'GET_FEEDO_LIST_PENDING') {
        // success in getting feedo list
        this.setState({
          apiLoading: true
        });
      } else if (this.props.feedo.loading === 'GET_FEEDO_LIST_PENDING' && (feedo.loading === 'GET_FEEDO_LIST_FULFILLED' || feedo.loading === 'GET_FEEDO_LIST_REJECTED')) {
        // success in getting feedo list
        this.setState({
          apiLoading: false
        });
      }  
      return;
    }
    if ((this.props.feedo.loading === 'ADD_FILE_PENDING' && feedo.loading === 'ADD_FILE_FULFILLED') ||
        (this.props.feedo.loading === 'DELETE_FILE_PENDING' && feedo.loading === 'DELETE_FILE_FULFILLED')) {
      // updating a feed
      this.setState({
        apiLoading: false
      })
    }

    if (feedo.loading === 'PUBNUB_DELETE_FEED') {
      this.props.getFeedoList()
      Actions.popTo('HomeScreen')
    }

    if (this.props.feedo.loading !== 'GET_FEED_DETAIL_FULFILLED' && feedo.loading === 'GET_FEED_DETAIL_FULFILLED') {
      this.setState({ viewPreference: feedo.currentFeed.metadata.myViewPreference ? feedo.currentFeed.metadata.myViewPreference : 'LIST' })
    }

    if ((this.props.feedo.loading !== 'GET_FEED_DETAIL_FULFILLED' && feedo.loading === 'GET_FEED_DETAIL_FULFILLED') ||
        (this.props.feedo.loading === 'DELETE_INVITEE_PENDING' && feedo.loading === 'DELETE_INVITEE_FULFILLED') ||
        (this.props.feedo.loading === 'UPDATE_SHARING_PREFERENCES_PENDING' && feedo.loading === 'UPDATE_SHARING_PREFERENCES_FULFILLED') ||
        (this.props.feedo.loading === 'UPDATE_INVITEE_PERMISSION_PENDING' && feedo.loading === 'UPDATE_INVITEE_PERMISSION_FULFILLED') ||
        (this.props.feedo.loading === 'UPDATE_FEED_PENDING' && feedo.loading === 'UPDATE_FEED_FULFILLED') ||
        (this.props.feedo.loading === 'INVITE_HUNT_PENDING' && feedo.loading === 'INVITE_HUNT_FULFILLED') ||
        (this.props.feedo.loading === 'DELETE_FILE_PENDING' && feedo.loading === 'DELETE_FILE_FULFILLED') ||
        (this.props.feedo.loading === 'ADD_FILE_PENDING' && feedo.loading === 'ADD_FILE_FULFILLED') ||
        (this.props.feedo.loading === 'ADD_HUNT_TAG_PENDING' && feedo.loading === 'ADD_HUNT_TAG_FULFILLED') ||
        (this.props.feedo.loading === 'REMOVE_HUNT_TAG_PENDING' && feedo.loading === 'REMOVE_HUNT_TAG_FULFILLED') ||
        (this.props.card.loading !== 'UPDATE_CARD_FULFILLED' && card.loading === 'UPDATE_CARD_FULFILLED') || 
        (this.props.card.loading !== 'DELETE_CARD_FULFILLED' && card.loading === 'DELETE_CARD_FULFILLED') ||
        (this.props.card.loading !== 'MOVE_CARD_FULFILLED' && card.loading === 'MOVE_CARD_FULFILLED') ||
        (this.props.feedo.loading === 'UPDTE_FEED_INVITATION_PENDING' && feedo.loading === 'UPDTE_FEED_INVITATION_FULFILLED') ||
        (feedo.loading === 'ADD_CARD_COMMENT_FULFILLED') || (feedo.loading === 'DELETE_CARD_COMMENT_FULFILLED') ||
        (feedo.loading === 'PUBNUB_GET_FEED_DETAIL_FULFILLED') || (feedo.loading === 'PUBNUB_MOVE_IDEA_FULFILLED') ||
        (feedo.loading === 'PUBNUB_LIKE_CARD_FULFILLED') || (feedo.loading === 'PUBNUB_UNLIKE_CARD_FULFILLED') ||
        (feedo.loading === 'GET_CARD_FULFILLED') || (feedo.loading === 'GET_CARD_COMMENTS_FULFILLED') ||
        (feedo.loading === 'PUBNUB_DELETE_INVITEE_FULFILLED')) {

      if (feedo.currentFeed.metadata.myInviteStatus === 'DECLINED') {
        Actions.pop()
      }

      if (this.props.feedo.loading === 'INVITE_HUNT_PENDING' && feedo.loading === 'INVITE_HUNT_FULFILLED') {
        this.setState({ isShowInviteToaster: true, inviteToasterTitle: 'Invitation sent' })

        setTimeout(() => {
          this.setState({ isShowInviteToaster: false })
        }, TOASTER_DURATION)
      }

      if (this.props.feedo.loading === 'UPDTE_FEED_INVITATION_PENDING' && feedo.loading === 'UPDTE_FEED_INVITATION_FULFILLED' && feedo.currentFeed.metadata.myInviteStatus !== 'DECLINED') {
        this.setState({ isShowInviteToaster: true, inviteToasterTitle: 'Invitation accepted' })

        setTimeout(() => {
          this.setState({ isShowInviteToaster: false })
        }, TOASTER_DURATION)
      }

      const currentFeed = feedo.currentFeed
      let filterIdeas = currentFeed.ideas
      for (let i = 0; i < this.userActions.length; i ++) {
        const cardInfo = this.userActions[i];
        filterIdeas = _.filter(filterIdeas, idea => idea.id !== cardInfo.ideaId)
      }
      currentFeed.ideas = filterIdeas;

      this.setBubbles(currentFeed)
      this.setState({
        loading: false,
        isRefreshing: false,
        totalCardCount: currentFeed.ideas.length,
        pinText: !currentFeed.pinned ? 'Pin' : 'Unpin'
      })

      this.setState({ currentBackFeed: currentFeed }, () => {
        let redrawMasonry = false

        if (feedo.loading === 'UPDATE_CARD_FULFILLED' || card.loading === 'UPDATE_CARD_FULFILLED' ||
          (feedo.loading === 'ADD_CARD_COMMENT_FULFILLED' && Actions.currentScene === 'CommentScreen') ||
          (feedo.loading === 'DELETE_CARD_COMMENT_FULFILLED' && Actions.currentScene === 'CommentScreen'))
        {
          redrawMasonry = true
        }
        
        this.filterCards(currentFeed, redrawMasonry)
      })

      if (feedo.loading === 'PUBNUB_GET_FEED_DETAIL_FULFILLED' || feedo.loading === 'GET_CARD_FULFILLED' ||
          feedo.loading === 'PUBNUB_LIKE_CARD_FULFILLED' || feedo.loading === 'PUBNUB_UNLIKE_CARD_FULFILLED' ||
          (feedo.loading === 'GET_CARD_COMMENTS_FULFILLED' && (Actions.currentScene !== 'CommentScreen' && Actions.currentScene !== 'ActivityCommentScreen'))
      ) {
        this.props.getActivityFeed(this.props.user.userInfo.id, { page: 0, size: PAGE_COUNT })
      }

      if (this.state.isLeaveFlowClicked && !COMMON_FUNC.isFeedOwnerEditor(currentFeed) &&
          this.props.feedo.loading === 'DELETE_INVITEE_PENDING' && feedo.loading === 'DELETE_INVITEE_FULFILLED') {
        const feedId = this.props.data.id
        this.props.setFeedDetailAction({
          action: 'Leave',
          feedId
        })
        this.setState({ isShowShare: false })
        setTimeout(() => Actions.pop(), 300);
      }
    }

    // if (feedo.loading === 'GET_FEED_DETAIL_PENDING') {
    //   this.setState({ currentFeed: {} })
    // }

    if (this.props.feedo.loading === 'GET_FILE_UPLOAD_URL_PENDING' && feedo.loading === 'GET_FILE_UPLOAD_URL_FULFILLED') {
      // success in getting a file upload url
      this.setState({
        apiLoading: true
      })
      if (this.selectedFile) {
        this.props.uploadFileToS3(feedo.fileUploadUrl.uploadUrl, this.selectedFile, this.selectedFileName, this.selectedFileMimeType);
      }
    }

    if (this.props.feedo.loading === 'UPLOAD_FILE_PENDING' && feedo.loading === 'UPLOAD_FILE_FULFILLED') {
      // success in uploading a file
      let { id } = this.props.feedo.currentFeed
      const { objectKey } = this.props.feedo.fileUploadUrl

      this.setState({
        apiLoading: true
      })
      if (this.selectedFileType) {
        this.props.addFile(id, this.selectedFileType, this.selectedFileMimeType, this.selectedFileName, objectKey);
      }
    }

    if (feedo.loading === 'GET_FILE_UPLOAD_URL_REJECTED' || feedo.loading === 'UPLOAD_FILE_REJECTED' || feedo.loading === 'ADD_FILE_REJECTED') {
      this.setState({
        apiLoading: false
      })
    }

    if (this.props.feedo.loading !== 'GET_FEED_DETAIL_REJECTED' && feedo.loading === 'GET_FEED_DETAIL_REJECTED') {
      Actions.pop()
    }
  }

  onHandleAppStateChange = async(nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active' && Actions.currentScene === 'FeedDetailScreen' && !this.state.isVisibleCard) {
      if (this.state.loading === false) {
        this.setState({ loading: true })
        this.props.getFeedDetail(this.props.data.id);
        this.showClipboardToast()
      }
    }
    this.setState({ appState: nextAppState });
    return;
  }

  async showClipboardToast() {
    const clipboardContent = await Clipboard.getString();
    const lastClipboardData = await AsyncStorage.getItem(CONSTANTS.CLIPBOARD_DATA);
    if (clipboardContent !== '' && clipboardContent !== lastClipboardData) {
      AsyncStorage.setItem(CONSTANTS.CLIPBOARD_DATA, clipboardContent);
      this.props.showClipboardToaster(clipboardContent, 'card')
    }
  }

  async setBubbles(currentFeed) {
    const { user } = this.props

    let bubbleFirstCardAsyncData = await AsyncStorage.getItem('BubbleFirstCardTimeCreated')
    let bubbleFirstCardData = JSON.parse(bubbleFirstCardAsyncData)

    if (currentFeed.ideas.length > 0) {
      const bubbleAsyncData = await AsyncStorage.getItem('CardBubbleState')
      const bubbleData = JSON.parse(bubbleAsyncData)

      if (!bubbleData || (bubbleData.userId === user.userInfo.id && bubbleData.state !== 'false')) {
        const ownCards = _.filter(currentFeed.ideas, idea => idea.metadata.owner === true)

        if (ownCards.length === 0 && !(bubbleFirstCardData && (bubbleFirstCardData.userId === user.userInfo.id && bubbleFirstCardData.state === 'true'))) {
          this.setState({ showBubble: true })
          setTimeout(() => {
            this.setState({ showBubbleCloseButton: true })
          }, 30000)
        } else {
          this.setState({ showBubble: false })
        }
      }
    }

    if (currentFeed.ideas.length === 0) {
      this.setState({ showEmptyBubble: true })
      if (bubbleFirstCardData && (bubbleFirstCardData.userId === user.userInfo.id && bubbleFirstCardData.state === 'true')) {
        this.setState({ isExistingUser: true })     // Existing user, no cards
      } else {
        this.setState({ isExistingUser: false })    // New user, no cards
      }
    }
  }

  closeBubble = () => {
    this.setState({ showBubble: false })
    const data = {
      userId: this.props.user.userInfo.id,
      state: 'false'
    }
    AsyncStorage.setItem('CardBubbleState', JSON.stringify(data));
  }

  filterCards = (currentFeed, redrawMasonry = true) => {
    const { currentBackFeed, filterShowType, filterSortType } = this.state
    const { ideas } = currentFeed
    let filterIdeas = {}, sortIdeas = {}

    if (filterShowType === 'all') {
      filterIdeas = currentBackFeed.ideas
    }

    if (filterShowType === 'like') {
      filterIdeas = _.filter(ideas, idea => idea.metadata.liked)
    }

    if (filterSortType === 'date') {
      sortIdeas = _.orderBy(filterIdeas, ['publishedDate'], ['desc'])
    }

    if (filterSortType === 'like') {
      sortIdeas = _.orderBy(filterIdeas, ['metadata.likes'], ['desc'])
    }

    if (filterSortType === 'comment') {
      sortIdeas = _.orderBy(filterIdeas, ['metadata.comments'], ['desc'])
    }

    let avatars = []
    if (!_.isEmpty(currentFeed)) {
      invitees = currentFeed.invitees
      filteredInvitees = COMMON_FUNC.filterRemovedInvitees(currentFeed.invitees)

      filteredInvitees.forEach((item, key) => {
        avatars = [
          ...avatars,
          item.userProfile
        ]
      })

      this.setState({ avatars, invitees, filteredInvitees })
    }

    this.setState({
      currentFeed: {
        ...currentFeed,
        ideas: sortIdeas
      }
    })

    if (this.state.viewPreference === 'MASONRY' && this.refs.masonry && redrawMasonry) {
      this.setMasonryData(sortIdeas)
    }
  }

  onFilterShow = (type) => {
    const { currentFeed } = this.state

    this.setState({ filterShowType: type }, () => {
      this.filterCards(currentFeed)
    })
  }

  onFilterSort = (type) => {
    const { currentFeed } = this.state

    this.setState({ filterSortType: type }, () => {
      this.filterCards(currentFeed)
    })
  }

  setMasonryData = (ideas) => {
    this.setState({ isMasonryView: true }, () => {

      if (ideas.length > 0) {
        const MasonryData = ideas.map((data, i) => ({
          key: `item_${i}`,
          index: i,
          data
        }))
        this.refs.masonry.clear()
        setTimeout(() => {
          this.refs.masonry.addItems(MasonryData)
        }, 150)
      }
    })
  }

  onLayoutMasonry = (event) => {
    if (!this.state.isMasonryView) {
      this.setMasonryData(this.state.currentFeed.ideas)
    }
  }

  backToDashboard = () => {
    if (this.props.prevPage === 'home') {
      Actions.popTo('HomeScreen');
    } else {
      Actions.popTo('NotificationScreen');
    }
  }

  handleSetting = () => {
    const { openMenu } = this.state
    this.setState({ openMenu: !openMenu, settingItem: null })
  }

  handleShare = () => {
    Analytics.logEvent('feed_detail_share', {})

    this.setState({ isShowShare: true })
  }

  hideSettingMenu = () => {
    const feedId = this.props.data.id
    const { settingItem } = this.state

    switch(settingItem) {
      case 'AddPeople':
        this.handleAddPeople()
        return
      case 'Pin':
        this.handlePinFeed(feedId)
        return
      case 'Unpin':
        this.handleUnpinFeed(feedId)
        return
      case 'ShareLink':
        return
      case 'Duplicate':
        this.handleDuplicateFeed(feedId)
        return
      case 'Delete':
        setTimeout(() => {
          this.feedoActionSheet.show()
        }, 200)
        return
      case 'Archive':
        Analytics.logEvent('feed_detail_archive_feed', {})

        this.props.setFeedDetailAction({
          action: 'Archive',
          feedId
        })
        Actions.pop()
        return
      case 'Edit':
        this.setState({ feedoViewMode: CONSTANTS.FEEDO_FROM_MAIN })
        this.handleEdit(feedId);
        return
      case 'Leave Flow':
        Analytics.logEvent('feed_detail_leave_feed', {})

        this.props.setFeedDetailAction({
          action: 'Leave',
          feedId
        })
        Actions.pop()
        return
      default:
        return
    }
  }

  handleEdit = (feedId) => {
    Analytics.logEvent('feed_detail_edit_feed', {})

    this.setState({
      isVisibleCard: false,
      isVisibleEditFeed: true,
    }, () => {
      this.animatedOpacity.setValue(0);
      Animated.timing(this.animatedOpacity, {
        toValue: 1,
        duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
      }).start();
    });  

  }

  handleSettingItem = (item) => {
    if (item === 'ShareLink') { // Don't close menu
      this.setState({ settingItem: item })
      this.showShareModal()
    } else {
      this.setState({ settingItem: item, openMenu: false })
    }
  }

  handleAddPeople = () => {
    this.setState({ isShowShare: true })
  }

  handlePinFeed = (feedId) => {
    this.setState({ 
      isShowToaster: true,
      currentActionType: ACTION_FEEDO_PIN,
      toasterTitle: 'Flow pinned',
      feedId, pinText: 'Unpin',
    })

    this.pinFeed(feedId)

    setTimeout(() => {
      this.setState({ isShowToaster: false, currentActionType: ACTION_NONE })
    }, TOASTER_DURATION)
  }

  pinFeed = (feedId) => {
    Analytics.logEvent('feed_detail_pin_feed', {})

    this.props.pinFeed(feedId)
  }

  handleUnpinFeed = (feedId) => {
    this.setState({ 
      isShowToaster: true,
      currentActionType: ACTION_FEEDO_UNPIN,
      toasterTitle: 'Flow un-pinned',
      feedId,
      pinText: 'Pin',
    })

    this.unpinFeed(feedId)

    setTimeout(() => {
      this.setState({ isShowToaster: false, currentActionType: ACTION_NONE })
    }, TOASTER_DURATION)
  }

  unpinFeed = (feedId) => {
    Analytics.logEvent('feed_detail_unpin_feed', {})

    this.props.unpinFeed(feedId)
  }

  handleDuplicateFeed = (feedId) => {
    this.setState({ 
      isShowToaster: true,
      currentActionType: ACTION_FEEDO_DUPLICATE,
      toasterTitle: 'Flow duplicated',
      feedId,
    })
    this.props.duplicateFeed(feedId)
    setTimeout(() => {
      this.setState({ isShowToaster: false })
      this.duplicateFeed()
    }, TOASTER_DURATION)
  }
  
  duplicateFeed = () => {
    if (this.state.currentActionType === ACTION_FEEDO_DUPLICATE) {
      Analytics.logEvent('feed_detail_duplicate_feed', {})

      this.setState({ currentActionType: ACTION_NONE })
    }
  }

  undoAction = () => {
    if (this.state.currentActionType === ACTION_FEEDO_PIN) {
      this.setState({ pinText: 'Pin' })
      this.unpinFeed(this.state.feedId)
    } else if (this.state.currentActionType === ACTION_FEEDO_UNPIN) {
      this.setState({ pinText: 'Unpin' })
      this.pinFeed(this.state.feedId)
    } else if (this.state.currentActionType === ACTION_FEEDO_DUPLICATE) {
      if (this.props.feedo.duplicatedId) {
        this.props.deleteDuplicatedFeed(this.props.feedo.duplicatedId)
      }
    } else if (this.state.currentActionType === ACTION_CARD_DELETE || this.state.currentActionType === ACTION_CARD_MOVE) {
      clearTimeout(this.userActionTimer);
      this.userActionTimer = null;
      this.userActions.shift();

      if (this.state.currentActionType === ACTION_CARD_DELETE) {
        this.props.deleteDummyCard('null', 1)
      }

      if (this.state.currentActionType === ACTION_CARD_MOVE) {
        this.props.moveDummyCard('null', 'null', 1)
      }

      this.setState((state) => { 
        let filterIdeas = this.props.feedo.currentFeed.ideas;
        for(let i = 0; i < this.userActions.length; i ++) {
          const cardInfo = this.userActions[i];
          filterIdeas = _.filter(filterIdeas, idea => idea.id !== cardInfo.ideaId)
        }
        state.currentFeed.ideas = filterIdeas;

        if (this.state.viewPreference === 'MASONRY' && this.refs.masonry) {
          this.filterCards(state.currentFeed)
        }

        return state;
      }, () => {
        this.setBubbles(this.state.currentFeed)
      });
  
      this.processCardActions();
      return;
    }
    this.setState({
      isShowToaster: false, 
      currentActionType: ACTION_NONE,
    })
  }

  onTapFeedoActionSheet = (index) => {
    if (index === 0) {
      Analytics.logEvent('feed_detail_delete_feed', {})

      this.props.setFeedDetailAction({
        action: 'Delete',
        feedId: this.props.data.id
      })
      Actions.pop()
    }
  }

  onCloseEditFeedModal() {
    this.animatedOpacity.setValue(1);
    Animated.timing(this.animatedOpacity, {
      toValue: 0,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
    }).start(() => {
      this.setState({ 
        isVisibleEditFeed: false,
      });
    });
  }

  onOpenNewCardModal() {
    if (!COMMON_FUNC.isFeedGuest(this.state.currentFeed)) {
      this.props.closeClipboardToaster()
      this.props.setCurrentCard({});
      this.setState({
        isVisibleCard: true,
        cardViewMode: CONSTANTS.CARD_NEW,
        selectedIdeaInvitee: null,
        selectedIdeaLayout: {},
      }, () => {
        this.animatedOpacity.setValue(0);
        Animated.timing(this.animatedOpacity, {
          toValue: 1,
          duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
        }).start();
      });
    }
  }

  onCloseCardModal() {
    this.animatedOpacity.setValue(1);
    Animated.timing(this.animatedOpacity, {
      toValue: 0,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
    }).start(() => {
      this.setState({ 
        isVisibleCard: false,
        cardViewMode: CONSTANTS.CARD_NONE
      });
    });
  }

  onSelectCard(index, idea, invitees) {
    if (this.state.isVisibleLongHoldMenu) {
      this.setState({
        selectedLongHoldCardIndex: index,
        selectedLongHoldIdea: idea,
        selectedLongHoldInvitees: invitees
      })
    } else {
      this.props.setCurrentCard(idea);
      const { currentFeed } = this.state;
      const invitee = _.find(invitees, (o) => {
        return (o.id == idea.inviteeId)
      });
      let cardViewMode = CONSTANTS.CARD_VIEW;
      if (COMMON_FUNC.isFeedOwner(currentFeed) || COMMON_FUNC.isFeedEditor(currentFeed)) {
        cardViewMode = CONSTANTS.CARD_EDIT;
      }

      // Contributor can just edit own cards
      if (COMMON_FUNC.isFeedContributor(currentFeed) && COMMON_FUNC.isCardOwner(idea)) {
        cardViewMode = CONSTANTS.CARD_EDIT;
      }

      this.cardItemRefs[index].measure((ox, oy, width, height, px, py) => {
        this.props.closeClipboardToaster()

        this.setState({
          isVisibleCard: true,
          cardViewMode,
          selectedIdeaInvitee: invitee,
          selectedIdeaLayout: { ox, oy, width, height, px, py },
        }, () => {
          this.animatedOpacity.setValue(0);
          Animated.timing(this.animatedOpacity, {
            toValue: 1,
            duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
          }).start();
        });
      });
    }
  }

  onLayoutScroll = (event) => {
    this.scrollviewHeight = event.nativeEvent.layout.height
  }

  onLongPressCard(index, idea, invitees) {
    if (COMMON_FUNC.isFeedGuest(this.state.currentFeed)) {
      return
    }

    ReactNativeHapticFeedback.trigger('impactHeavy', true);

    this.setState({
      selectedLongHoldCardIndex: index,
      selectedLongHoldIdea: idea,
      selectedLongHoldInvitees: invitees,
      isVisibleLongHoldMenu: true
    }, () => {
      Animated.spring(this.animatedSelectCard, {
        toValue: 0.85,
        useNativeDriver: true
      }).start();
    });
  }

  onCloseLongHold = () => {
    this.setState({
      isVisibleLongHoldMenu: false
    }, () => {
      Animated.spring(this.animatedSelectCard, {
        toValue: 1,
        useNativeDriver: true
      }).start();
    });
  }

  onHiddenLongHoldMenu() {
    if (this.state.currentActionType === ACTION_CARD_MOVE) {
      this.prevFeedo = this.props.feedo.currentFeed;
      this.setState({
        isVisibleSelectFeedo: true,
      });
    }
  }

  onMoveCard = (ideaId) => {
    if (this.state.isVisibleLongHoldMenu) {
      this.onCloseLongHold();
    }

    this.setState({ 
      isVisibleCard: false,
      isVisibleCardOpenMenu: false,
      currentActionType: ACTION_CARD_MOVE,
    });
    this.moveCardId = ideaId;

    this.prevFeedo = this.props.feedo.currentFeed;
    this.setState({
      isVisibleSelectFeedo: true,
    })
  }

  processCardActions() {
    if (this.userActions.length === 0) {
      this.setState({
        isShowToaster: false, 
        currentActionType: ACTION_NONE,
      });
      return;
    }
    const currentCardInfo = this.userActions[0];
    this.setState({ 
      currentActionType: currentCardInfo.currentActionType,
      isShowToaster: true,
      toasterTitle: currentCardInfo.toasterTitle,
    });
    this.userActionTimer = setTimeout(() => {
      // this.setState({ isShowToaster: false })
      if (this.state.currentActionType === ACTION_CARD_DELETE) {
        Analytics.logEvent('feed_detail_delete_card', {})
        this.props.deleteCard(currentCardInfo.ideaId)
      } else if (this.state.currentActionType === ACTION_CARD_MOVE) {
        Analytics.logEvent('feed_detail_move_card', {})
        this.props.moveCard(currentCardInfo.ideaId, currentCardInfo.feedoId);
      }
      this.userActionTimer = null;
      this.userActions.shift();
      this.processCardActions();
    }, TOASTER_DURATION + 5);
  }

  onDeleteCard = (ideaId) => {
    if (this.state.isVisibleLongHoldMenu) {
      this.onCloseLongHold();
    }

    this.onCloseCardModal();
    this.setState({
      isShowToaster: true,
    });

    const cardInfo = {};
    cardInfo.currentActionType = ACTION_CARD_DELETE;
    cardInfo.toasterTitle = 'Card deleted';
    cardInfo.ideaId = ideaId;
    this.userActions.push(cardInfo);

    this.setState((state) => { 
      let filterIdeas = state.currentFeed.ideas;
      for(let i = 0; i < this.userActions.length; i ++) {
        const cardInfo = this.userActions[i];
        filterIdeas = _.filter(filterIdeas, idea => idea.id !== cardInfo.ideaId)
      }
      state.currentFeed.ideas = filterIdeas;

      if (this.state.viewPreference === 'MASONRY' && this.refs.masonry) {
        this.setMasonryData(filterIdeas)
      }

      return state;
    }, () => {
      this.setBubbles(this.state.currentFeed)
    });

    this.props.deleteDummyCard(cardInfo.ideaId, 0)

    this.processCardActions();
  }

  onSelectFeedoToMoveCard(feedoId) {
    this.prevFeedo = null;

    this.onCloseCardModal();

    this.setState({
      isVisibleSelectFeedo: false,
      isShowToaster: true,
    });

    const cardInfo = {};
    cardInfo.currentActionType = ACTION_CARD_MOVE;
    cardInfo.toasterTitle = 'Card moved';
    cardInfo.ideaId = this.moveCardId;
    cardInfo.feedoId = feedoId;
    this.userActions.push(cardInfo);

    this.setState((state) => { 
      let filterIdeas = state.currentFeed.ideas;
      for(let i = 0; i < this.userActions.length; i ++) {
        const cardInfo = this.userActions[i];
        filterIdeas = _.filter(filterIdeas, idea => idea.id !== cardInfo.ideaId)
      }
      state.currentFeed.ideas = filterIdeas;

      if (this.state.viewPreference === 'MASONRY' && this.refs.masonry) {
        this.setMasonryData(filterIdeas)
      }

      return state;
    }, () => {
      this.setBubbles(this.state.currentFeed)
    });

    this.props.moveDummyCard(cardInfo.ideaId, cardInfo.feedoId, 0)

    this.processCardActions();
    this.moveCardId = null;
  }

  onCloseSelectFeedoModal() {
    if (this.prevFeedo.id !== this.props.feedo.currentFeed.id) {
      const moveToFeedo = this.props.feedo.currentFeed;
      this.props.setCurrentFeed(this.prevFeedo);
      if (moveToFeedo.id) {
        this.onSelectFeedoToMoveCard(moveToFeedo.id);
        return;
      }
    }
    this.prevFeedo = null;
    this.setState({
      isVisibleSelectFeedo: false,
      currentActionType: ACTION_NONE,
    });
  }

  onOpenCardAction(idea) {
    this.setState({
      isVisibleCardOpenMenu: true,
      selectedLongHoldIdea: idea,
    })
  }

  get renderNewCardModal() {
    const { isVisibleCard, cardViewMode, cardMode, isVisibleEditFeed } = this.state

    if (!isVisibleCard && !isVisibleEditFeed) {
      return;
    }

    return (
      <Animated.View 
        style={[
          styles.modalContainer,
          { opacity: this.animatedOpacity }
        ]}
      >
        {
          isVisibleCard && (
            cardViewMode === CONSTANTS.CARD_NEW
            ? <CardNewScreen 
                viewMode={this.state.cardViewMode}
                cardMode={cardMode}
                invitee={this.state.selectedIdeaInvitee}
                shareUrl=''
                onClose={() => this.onCloseCardModal()}
              />
            : <CardDetailScreen
                prevPage={this.props.prevPage}
                viewMode={this.state.cardViewMode}
                invitee={this.state.selectedIdeaInvitee}
                intialLayout={this.state.selectedIdeaLayout}
                shareUrl=''
                onClose={() => this.onCloseCardModal()}
                onOpenAction={(idea) => this.onOpenCardAction(idea)}
                onMoveCard={this.onMoveCard}
                onDeleteCard={this.onDeleteCard}
              />
        )}
        {  
          isVisibleEditFeed && 
            <NewFeedScreen 
              feedData={this.state.currentFeed}
              onClose={() => this.onCloseEditFeedModal()}
              selectedFeedId={this.props.data.id}
              viewMode={this.state.feedoViewMode}
              isNewCard={false}
            />
        }
      </Animated.View>
    );
  }
  
  handleFilter = () => {
    Analytics.logEvent('feed_detail_filter_card', {})

    this.setState({ showFilterModal: true })
  }

  closeShareModal = () => {
    this.setState({ isShowShare: false })
  }

  moveHomeScreen = () => {
    this.setState({ isShowShare: false }, () => {
      setTimeout(() => {
        Actions.HomeScreen()
      }, 50)
    })
  }

  onAddMedia = () => {
    Permissions.checkMultiple(['camera', 'photo']).then(response => {
      if (response.camera === 'authorized' && response.photo === 'authorized') {
        //permission already allowed
        this.imagePickerActionSheetRef.show();
      }
      else {
        Permissions.request('camera').then(response => {
          if (response === 'authorized') {
            //camera permission was authorized
            Permissions.request('photo').then(response => {
              if (response === 'authorized') {
                //photo permission was authorized
                this.imagePickerActionSheetRef.show();
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

  PickerDocumentShow = () => {
    DocumentPicker.show({
      filetype: [DocumentPickerUtil.allFiles()],
    },(error, response) => {
      if (error === null) {
        if (response.fileSize > 1024 * 1024 * 10) {
          Alert.alert('Warning', 'File size must be less than 10MB')
        } else {
          let type = 'FILE';
          const mimeType = mime.lookup(response.uri);
          if (mimeType !== false) {
            if (mimeType.indexOf('image') !== -1 || mimeType.indexOf('video') !== -1) {
              type = 'MEDIA';
            }
          }
          this.uploadFile(response, type);
        }
      }      
    });
    return;
  }

  uploadFile(file, type) {
    this.selectedFile = file.uri;
    
    if (_.endsWith(file.uri, '.pages')) {
      this.selectedFileMimeType = 'application/x-iwork-pages-sffpages'
    } else if (_.endsWith(file.uri, '.numbers')) {
      this.selectedFileMimeType = 'application/x-iwork-numbers-sffnumbers'
    } else if (_.endsWith(file.uri, '.key')) {
      this.selectedFileMimeType = 'application/x-iwork-keynote-sffkey'
    } else {
      this.selectedFileMimeType = mime.lookup(file.uri);
    }

    this.selectedFileName = file.fileName;
    this.selectedFileType = type;
    if (this.props.feedo.currentFeed.id) {
      this.props.getFileUploadUrl(this.props.feedo.currentFeed.id);
    }
  }

  pickMediaFromCamera(options) {
    ImagePicker.launchCamera(options, (response)  => {
      if (!response.didCancel) {
        if (response.fileSize > 1024 * 1024 * 10) {
          Alert.alert('Warning', 'File size must be less than 10MB')
        } else {
          if (!response.fileName) {
            response.fileName = response.uri.replace(/^.*[\\\/]/, '')
          }
          this.uploadFile(response, 'MEDIA');
        }
      }
    });
  }

  pickMediaFromLibrary(options) {
    ImagePicker.launchImageLibrary(options, (response)  => {
      if (!response.didCancel) {
        if (response.fileSize > 1024 * 1024 * 10) {
          Alert.alert('Warning', 'File size must be less than 10MB')
        } else {
          this.uploadFile(response, 'MEDIA');
        }
      }
    });
  }

  onTapMediaPickerActionSheet(index) {
    var options = {
      storageOptions: {
        skipBackup: true,
        path: 'feedo'
      }
    };
        
    if (index === 0) {
      // from camera
      this.pickMediaFromCamera(options);
    } else if (index === 1) {
      // from library
      this.pickMediaFromLibrary(options);
    }
  }

  get renderCreateTag() {
    if (this.state.currentScreen !== TagCreateMode) {
      return;
    }

    const animatedMove  = this.animatedTagTransition.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 150],
    });
    const animatedOpacity  = this.animatedTagTransition.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });

    return (
      <Animated.View
        style={[
          styles.tagCreationContainer,
          {
            left: animatedMove,
            opacity: animatedOpacity,
          }
        ]}
      >
        <TagCreateScreen
          onBack={() => this.onCloseCreationTag()}
        />
      </Animated.View>
    );
  }


  onOpenCreationTag = () => {
    this.setState({
      currentScreen: TagCreateMode,
    }, () => {
      this.animatedTagTransition.setValue(1)
      Animated.timing(this.animatedTagTransition, {
        toValue: 0,
        duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
      }).start();
    });
  }

  onCloseCreationTag() {
    this.animatedTagTransition.setValue(0)
    Animated.timing(this.animatedTagTransition, {
      toValue: 1,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
    }).start(() => {
      this.setState({
        currentScreen: FeedDetailMode,
      });
    });
  }

  onDeleteFile = (id, fileId) => {
    this.setState({ apiLoading: true })
    this.props.deleteFile(id, fileId)
  }

  onRefreshFeed = () => {
    this.setState({ isRefreshing: true })
    this.props.getFeedDetail(this.props.data.id)
  }

  handleList = () => {
    const { currentFeed, viewPreference } = this.state
    const { userInfo } = this.props.user

    const invitee = _.find(currentFeed.invitees, data => data.userProfile.id === userInfo.id)

    const preference = viewPreference === 'MASONRY' ? 'LIST' : 'MASONRY'
    if (preference === 'MASONRY') {
      this.setState({ isMasonryView: false })
    }
    this.setState({ viewPreference: preference })
    this.props.saveFlowViewPreference(currentFeed.id, invitee.id, preference)
  }

  get renderSelectHunt() {
    if (this.state.isVisibleSelectFeedo) {
      const { currentFeed } = this.state
      return (
        <View style={[styles.modalContainer, {backgroundColor: 'transparent'}]}>
          <SelectHuntScreen
            selectMode={CONSTANTS.FEEDO_SELECT_FROM_MOVE_CARD}
            hiddenFeedoId={currentFeed.id}
            direction='top'
            onClosed={() => this.onCloseSelectFeedoModal()}
          />
        </View>
      );
    }
  }

  onUpdateInvitation = (feedId, type) => {
    this.props.updateInvitation(feedId, type)
  }

  handleLinkSharing = (value, data) => {
    const { updateSharingPreferences } = this.props
    if (value) {
      updateSharingPreferences(
        data.id,
        {
          level: 'REGISTERED_ONLY',
          permissions: 'ADD'
        }
      )
    } else {
      updateSharingPreferences(
        data.id,
        {
          level: 'INVITEES_ONLY'
        }
      )
    }
  }

  showShareModal = () => {
    const { data } = this.props
    
    COMMON_FUNC.handleShareFeed(data)
  }

  leaveFeed = (selectedContact, feedId) => {
      Analytics.logEvent('feeddetail_leave_feed', {})
      const { feedo, user, deleteInvitee } = this.props

      if (selectedContact !== null) {
        const invitee = _.filter(feedo.currentFeed.invitees, invitee => invitee.userProfile.id === selectedContact.userProfile.id)
        deleteInvitee(feedId, invitee[0].id)
      } else {
        this.setState({ isLeaveFlowClicked: true })
        const invitee = _.filter(feedo.currentFeed.invitees, invitee => invitee.userProfile.id === user.userInfo.id)
        deleteInvitee(feedId, invitee[0].id)
      }
  }

  render () {
    const {
      currentFeed,
      loading,
      pinText,
      avatars,
      selectedLongHoldCardIndex,
      isVisibleLongHoldMenu,
      invitees
    } = this.state

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, isVisibleLongHoldMenu && { paddingBottom: 0 }]}>
          {!isVisibleLongHoldMenu && (
            <View style={styles.navBar}>
              <TouchableOpacity style={styles.backView} onPress={this.backToDashboard}>
                <Ionicons name="ios-arrow-back" size={32} color={COLORS.PURPLE} />
              </TouchableOpacity>
              <View style={styles.rightHeader}>
                <View style={styles.avatarView}>
                  <TouchableOpacity onPress={() => this.handleShare()}>
                    <AvatarPileComponent avatars={avatars} />
                  </TouchableOpacity>
                </View>
                <View style={styles.settingView}>
                  <FeedNavbarSettingComponent handleSetting={() => this.handleSetting()} />
                </View>
              </View>
            </View>
          )}

          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                tintColor={COLORS.PURPLE}
                refreshing={this.state.isRefreshing}
                onRefresh={() => this.onRefreshFeed()}
              />
            }
            scrollEventThrottle={16}
            style={[
              styles.scrollView,
              {
                transform: [{ scale: this.animatedSelectCard}],
              }
            ]}
          >     
            <GestureRecognizer
              style={{ width: '100%', height: '100%' }}
              onSwipeRight={this.backToDashboard}
            >
              <View style={styles.detailView} onLayout={this.onLayoutScroll}>
                {!_.isEmpty(currentFeed) && !isVisibleLongHoldMenu && (
                  <View style={styles.collapseView}>
                    <FeedCollapseComponent
                      feedData={currentFeed}
                      longHold={isVisibleLongHoldMenu}
                      onEditFeed={() => {
                        this.setState({ feedoViewMode: CONSTANTS.FEEDO_FROM_COLLAPSE })
                        this.handleEdit(currentFeed.id)
                      }}
                      onOpenCreationTag={this.onOpenCreationTag}
                      onAddMedia={this.onAddMedia}
                      onAddDocument={this.onAddDocument}
                      deleteFile={this.onDeleteFile}
                    />
                  </View>
                )}

                {!_.isEmpty(currentFeed) && currentFeed.metadata.myInviteStatus === 'INVITED' && (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => this.onUpdateInvitation(currentFeed.id, true)} activeOpacity={0.8}>
                      <View style={[styles.buttonView, styles.acceptButtonView]}>
                        <Text style={[styles.buttonText, styles.acceptButtonText]}>Accept</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onUpdateInvitation(currentFeed.id, false)} activeOpacity={0.8}>
                      <View style={[styles.buttonView, styles.ignoreButtonView]}>
                        <Text style={[styles.buttonText, styles.ignoreButtonText]}>Ignore</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}

                {!_.isEmpty(currentFeed) && currentFeed && currentFeed.ideas && currentFeed.ideas.length > 0 && this.state.showBubble && (
                  <SpeechBubbleComponent
                    page="detail"
                    title="Flows contain cards. Cards can have, images, text, attachments and likes. My granny enjoys liking."
                    subTitle="Watch a 15 sec video about the cards "
                    onCloseBubble={() => this.closeBubble()}
                    showBubbleCloseButton={this.state.showBubbleCloseButton}
                  />
                )}

                {
                (!_.isEmpty(currentFeed) && currentFeed && currentFeed.ideas)
                  ? this.state.viewPreference === 'LIST'
                    ? currentFeed.ideas.length > 0
                      ? <View
                          style={{ paddingHorizontal: 8, marginTop: Platform.OS === 'android' && isVisibleLongHoldMenu ? 30 : 0}}
                        >
                          {currentFeed.ideas.map((item, index) => (
                          <View
                            key={index}
                          >
                            <TouchableHighlight
                              ref={ref => this.cardItemRefs[index] = ref}
                              style={{ paddingHorizontal: 8, borderRadius: 5 }}
                              underlayColor="#fff"
                              onPress={() => this.onSelectCard(index, item, invitees)}
                              onLongPress={() => this.onLongPressCard(index, item, invitees)}
                            >
                              <FeedCardComponent
                                idea={item}
                                invitees={invitees}
                                listType={this.state.viewPreference}
                                cardType="view"
                                prevPage={this.props.prevPage}
                                longHold={isVisibleLongHoldMenu}
                                longSelected={isVisibleLongHoldMenu && selectedLongHoldCardIndex === index}
                                onLinkPress={() => this.onSelectCard(index, item, invitees)}
                                onLinkLongPress={() => this.onLongPressCard(index, item, invitees)}
                              />
                            </TouchableHighlight>
                          </View>
                          ))}
                        </View>
                      : <View style={styles.emptyView}>
                          {loading
                            ? <View style={styles.loadingView}>
                                <FeedLoadingStateComponent />
                              </View>
                            : <View style={styles.emptyInnerView}>
                                {this.state.showEmptyBubble && (
                                  this.state.isExistingUser
                                  ? <EmptyStateComponent
                                      page="card_exist"
                                      title="Ah, that sense of freshness! Let's start a new day."
                                      subTitle="Need a few hints on all awesome ways to create a card?"
                                      ctaTitle="Create a card"
                                      onCreateNewCard={this.onOpenNewCardModal.bind(this)}
                                    />
                                  : <EmptyStateComponent
                                      page="card"
                                      title="It's pretty boring here... Let's create some cards!"
                                      subTitle="Watch a 15 sec video about creating cards"
                                      ctaTitle="Create your first card"
                                      onCreateNewCard={this.onOpenNewCardModal.bind(this)}
                                    />
                                )}
                              </View>
                          }
                        </View>
                    : <View
                        style={{ paddingHorizontal: currentFeed.ideas.length > 0 ? 8 : 0, marginTop: Platform.OS === 'android' && isVisibleLongHoldMenu ? 30 : 0}}
                      >
                        <Masonry
                          onLayout={(event) => this.onLayoutMasonry(event)}
                          ref="masonry"
                          isExistingUser={this.state.isExistingUser}
                          showEmptyBubble={this.state.showEmptyBubble}
                          onOpenNewCardModal={this.onOpenNewCardModal.bind(this)}
                          ideas={currentFeed.ideas}
                          columns={2}
                          keyExtractor={item => item.key}
                          renderItem={(item) => 
                            <View>
                              <TouchableHighlight
                                ref={ref => this.cardItemRefs[item.index] = ref}
                                style={{ paddingHorizontal: 8, borderRadius: 5 }}
                                underlayColor="#fff"
                                onPress={() => this.onSelectCard(item.index, item.data, invitees)}
                                onLongPress={() => this.onLongPressCard(item.index, item.data, invitees)}
                              >
                                <FeedCardComponent
                                  idea={item.data}
                                  invitees={invitees}
                                  listType={this.state.viewPreference}
                                  cardType="view"
                                  prevPage={this.props.prevPage}
                                  longSelected={isVisibleLongHoldMenu && selectedLongHoldCardIndex === item.index}
                                  onLinkPress={() => this.onSelectCard(item.index, item.data, invitees)}
                                  onLinkLongPress={() => this.onLongPressCard(item.index, item.data, invitees)}
                                />
                              </TouchableHighlight>
                            </View>}
                        />
                      </View>
                  : <View style={styles.emptyView}>
                    {loading
                      ? <View style={styles.loadingView}>
                          <FeedLoadingStateComponent />
                        </View>
                      : <View style={styles.emptyInnerView}>
                          {this.state.showEmptyBubble && (
                            this.state.isExistingUser
                              ? <EmptyStateComponent
                                  page="card_exist"
                                  title="Ah, that sense of freshness! Let's start a new day."
                                  subTitle="Need a few hints on all awesome ways to create a card?"
                                  ctaTitle="Create a card"
                                  onCreateNewCard={this.onOpenNewCardModal.bind(this)}
                                />
                              : <EmptyStateComponent
                                  page="card"
                                  title="It's pretty boring here... Let's create some cards!"
                                  subTitle="Watch a 15 sec video about creating cards"
                                  ctaTitle="Create your first card"
                                  onCreateNewCard={this.onOpenNewCardModal.bind(this)}
                                />
                          )}
                        </View>
                    }
                    </View>
                }
              </View>
            </GestureRecognizer>
          </Animated.ScrollView>
        </View>

        {TAGS_FEATURE && this.renderCreateTag}
        
        {!isVisibleLongHoldMenu && 
          <DashboardActionBar
            onAddFeed={this.onOpenNewCardModal.bind(this)}
            handleFilter={this.handleFilter}
            handleList={() => this.handleList()}
            filterType={this.state.filterShowType}
            sortType={this.state.filterSortType}
            notifications={false}
            feed={currentFeed}
            showList={true}
            listType={this.state.viewPreference}
            page="detail"
          />
        }

        {this.renderNewCardModal}
        {this.renderSelectHunt}

        <ActionSheet
          ref={ref => this.feedoActionSheet = ref}
          title={'Are you sure you want to delete this flow, everything will be gone ...'}
          options={['Delete flow', 'Cancel']}
          cancelButtonIndex={1}
          destructiveButtonIndex={0}
          tintColor={COLORS.PURPLE}
          onPress={(index) => this.onTapFeedoActionSheet(index)}
        />

        {this.state.isShowToaster && (
          <ToasterComponent
            isVisible={this.state.isShowToaster}
            title={this.state.toasterTitle}
            onPressButton={() => this.undoAction()}
          />
        )}

        {this.state.isShowInviteToaster && (
          <ToasterComponent
            isVisible={this.state.isShowInviteToaster}
            title={this.state.inviteToasterTitle}
            buttonTitle="OK"
            onPressButton={() => this.setState({ isShowInviteToaster: false })}
          />
        )}

        <Modal
          isVisible={this.state.isShowShare}
          style={styles.shareScreenContainer}
          backdropColor='#f5f5f5'
          backdropOpacity={0.9}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          animationInTiming={300}
          animationOutTiming={100}
          onModalHide={() => {}}
          onBackdropPress={() => this.closeShareModal()}
          onBackButtonPress={() => this.closeShareModal()}
        >
          {
            COMMON_FUNC.isFeedOwnerEditor(currentFeed)
            ? <InviteeScreen
                onClose={() => this.closeShareModal()}
                deleteInvitee={(selectedContact) => this.leaveFeed(selectedContact, currentFeed.id)}
                data={currentFeed}
              />
            : <FollowMemberScreen
                onClose={() => this.closeShareModal()}
                deleteInvitee={() => this.leaveFeed(null, currentFeed.id)}
                data={currentFeed}
              />
          }
        </Modal>

        <Modal 
          isVisible={this.state.openMenu}
          style={styles.shareScreenContainer}
          backdropColor='#fff'
          backdropOpacity={0}
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInTiming={500}
          onModalHide={() => this.hideSettingMenu()}
          onBackdropPress={() => this.setState({ openMenu: false })}
          onBackButtonPress={() => this.setState({ openMenu: false })}
        >
          <Animated.View style={styles.settingMenuView}>
            <FeedControlMenuComponent
              handleSettingItem={item => this.handleSettingItem(item)}
              feedo={currentFeed}
              pinText={pinText}
              handleLinkSharing={value => this.handleLinkSharing(value, currentFeed)}
            />
          </Animated.View>
        </Modal>

        {isVisibleLongHoldMenu && (
          <CardLongHoldMenuScreen
            idea={this.state.selectedLongHoldIdea}
            currentFeed={currentFeed}
            invitees={this.state.selectedLongHoldInvitees}
            onMove={this.onMoveCard}
            onDelete={this.onDeleteCard}
            onClose={() => this.onCloseLongHold()}
          />
        )}

        {isVisibleLongHoldMenu && (
          <View style={styles.topButtonView}>
            <TouchableOpacity onPress={() => this.onCloseLongHold()}>
              <View style={styles.btnDoneView}>
                <Text style={styles.btnDoneText}>Done</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        

        <CardFilterComponent
          cardCount={currentFeed && currentFeed.ideas ? currentFeed.ideas.length : 0}
          totalCardCount={this.state.totalCardCount}
          show={this.state.showFilterModal}
          onFilterShow={this.onFilterShow}
          onFilterSort={this.onFilterSort}
          onClose={() => this.setState({ showFilterModal: false }) }
        />

        <ActionSheet
          ref={ref => this.imagePickerActionSheetRef = ref}
          title='Select a Photo / Video'
          options={['Take A Photo', 'Select From Photos', 'Cancel']}
          cancelButtonIndex={2}
          tintColor={COLORS.PURPLE}
          onPress={(index) => this.onTapMediaPickerActionSheet(index)}
        />

        {this.state.apiLoading && <LoadingScreen />}

      </SafeAreaView>
    )
  }
}

const mapStateToProps = ({ feedo, card, user }) => ({
  feedo,
  card,
  user
})

const mapDispatchToProps = dispatch => ({
  getFeedDetail: data => dispatch(getFeedDetail(data)),
  setFeedDetailAction: data => dispatch(setFeedDetailAction(data)),  
  pinFeed: (data) => dispatch(pinFeed(data)),
  unpinFeed: (data) => dispatch(unpinFeed(data)),
  duplicateFeed: (data) => dispatch(duplicateFeed(data)),
  deleteDuplicatedFeed: (data) => dispatch(deleteDuplicatedFeed(data)),
  setCurrentCard: (data) => dispatch(setCurrentCard(data)),
  deleteCard: (ideaId) => dispatch(deleteCard(ideaId)),
  moveCard: (ideaId, huntId) => dispatch(moveCard(ideaId, huntId)),
  getFileUploadUrl: (id) => dispatch(getFileUploadUrl(id)),
  uploadFileToS3: (signedUrl, file, fileName, mimeType) => dispatch(uploadFileToS3(signedUrl, file, fileName, mimeType)),
  addFile: (feedId, fileType, contentType, name, objectKey) => dispatch(addFile(feedId, fileType, contentType, name, objectKey)),
  deleteFile: (feedId, fileId) => dispatch(deleteFile(feedId, fileId)),
  setCurrentFeed: (data) => dispatch(setCurrentFeed(data)),
  updateInvitation: (feedId, type) => dispatch(updateInvitation(feedId, type)),
  deleteDummyCard: (ideaId, type) => dispatch(deleteDummyCard(ideaId, type)),
  moveDummyCard: (ideaId, feedId, type) => dispatch(moveDummyCard(ideaId, feedId, type)),
  getActivityFeed: (userId, param) => dispatch(getActivityFeed(userId, param)),
  getFeedoList: () => dispatch(getFeedoList()),
  updateSharingPreferences: (feedId, data) => dispatch(updateSharingPreferences(feedId, data)),
  deleteInvitee: (feedId, inviteeId) => dispatch(deleteInvitee(feedId, inviteeId)),
  showClipboardToaster: (data, prevPage) => dispatch(showClipboardToaster(data, prevPage)),
  closeClipboardToaster: () => dispatch(closeClipboardToaster()),
  saveFlowViewPreference: (feedId, inviteeId, preference) => dispatch(saveFlowViewPreference(feedId, inviteeId, preference))
})

FeedDetailScreen.defaultProps = {
  data: [],
  getFeedDetail: () => {},
  setFeedDetailAction: () => {},
  prevPage: 'home'
}

FeedDetailScreen.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  feedo: PropTypes.objectOf(PropTypes.any),
  getFeedDetail: PropTypes.func,
  setFeedDetailAction: PropTypes.func,
  pinFeed: PropTypes.func.isRequired,
  unpinFeed: PropTypes.func.isRequired,
  duplicateFeed: PropTypes.func.isRequired,
  deleteDuplicatedFeed: PropTypes.func.isRequired,
  deleteDummyCard: PropTypes.func,
  moveDummyCard: PropTypes.func,
  prevPage: PropTypes.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedDetailScreen)

