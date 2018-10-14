/* global require */
import React from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Animated,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  AsyncStorage,
  AppState,
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
import COLORS from '../../service/colors'
import styles from './styles'
import CONSTANTS from '../../service/constants';

const EMPTY_ICON = require('../../../assets/images/empty_state/asset-emptystate.png')
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
} from '../../redux/feedo/actions'

import { 
  setUserInfo,
  addDeviceToken,
  updateDeviceToken,
} from '../../redux/user/actions'

import { 
  getCard,
} from '../../redux/card/actions'

const TAB_STYLES = {
  height: '100%',
  paddingTop: 10,
  paddingRight: 10
}

const TOASTER_DURATION = 5000


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
      emptyState: true,
      isShowToaster: false,
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
      showEmptyBubble: false
    };

    this.currentRef = null;
    this.animatedOpacity = new Animated.Value(0);
  }

  async componentDidMount() {
    this.setState({ loading: true })

    const userInfo = await AsyncStorage.getItem('userInfo')
    this.props.setUserInfo(JSON.parse(userInfo))
    this.registerPushNotification();
    this.props.getFeedoList(this.state.tabIndex)
    AppState.addEventListener('change', this.onHandleAppStateChange.bind(this));
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.onHandleAppStateChange);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { feedo, card } = nextProps

    if (prevState.apiLoading !== feedo.loading && ((feedo.loading === 'GET_FEEDO_LIST_FULFILLED') || (feedo.loading === 'GET_FEEDO_LIST_REJECTED') ||
      (feedo.loading === 'FEED_FULFILLED') || (feedo.loading === 'DEL_FEED_FULFILLED') || (feedo.loading === 'ARCHIVE_FEED_FULFILLED') ||
      (feedo.loading === 'DUPLICATE_FEED_FULFILLED') || (feedo.loading === 'UPDATE_FEED_FULFILLED') ||
      (feedo.loading === 'DELETE_CARD_FULFILLED') || (feedo.loading === 'MOVE_CARD_FULFILLED') ||
      (feedo.loading === 'UPDATE_CARD_FULFILLED') || (feedo.loading === 'INVITE_HUNT_FULFILLED') ||
      (feedo.loading === 'ADD_HUNT_TAG_FULFILLED') || (feedo.loading === 'REMOVE_HUNT_TAG_FULFILLED') ||
      (feedo.loading === 'RESTORE_ARCHIVE_FEED_FULFILLED') || (feedo.loading === 'ADD_DUMMY_FEED'))) {

      let feedoList = []
      let emptyState = prevState.emptyState

      if (feedo.feedoList && feedo.feedoList.length > 0) {
        feedoList = feedo.feedoList.map(item => {
          const filteredIdeas = filter(item.ideas, idea => idea.coverImage !== null && idea.coverImage !== '')

          return Object.assign(
            {},
            item,
            { coverImages: R.slice(0, filteredIdeas.length > 4 ? 4 : filteredIdeas.length, filteredIdeas) }
          )
        })

        feedoList = orderBy(
          filter(feedoList, item => item.status === 'PUBLISHED'),
          ['publishedDate'],
          ['desc']
        )
        
        if (prevState.tabIndex === 1) {
          feedoList = filter(feedoList, item => item.pinned !== null)
        }

        emptyState = false
      }

      return {
        feedoList,
        loading: false,
        emptyState,
        apiLoading: feedo.loading
      }
    } else if (prevState.apiLoading !== feedo.loading && (feedo.loading === 'GET_CARD_FULFILLED')) {
      const { card } = nextProps
      return {
        loading: false,
        currentIdea: card.currentCard,
        apiLoading: feedo.loading
      }
    }

    return {
      apiLoading: feedo.loading
    }
  }

  async componentDidUpdate(prevProps) {
    const { feedo } = this.props
    const { feedoList } = feedo

    if ((prevProps.feedo.loading === 'GET_FEEDO_LIST_PENDING' && feedo.loading === 'GET_FEEDO_LIST_FULFILLED') ||
        (prevProps.feedo.loading !== 'UPDATE_FEED_FULFILLED' && feedo.loading === 'UPDATE_FEED_FULFILLED') ||
        (prevProps.feedo.loading !== 'FEED_FULFILLED' && feedo.loading === 'FEED_FULFILLED') ||
        (prevProps.feedo.loading !== 'DEL_FEED_FULFILLED' && feedo.loading === 'DEL_FEED_FULFILLED') ||
        (prevProps.feedo.loading !== 'ARCHIVE_FEED_FULFILLED' && feedo.loading === 'ARCHIVE_FEED_FULFILLED')) {
      await this.setBubbles(feedoList)
    }

    if (this.props.feedo.loading === 'SET_FEED_DETAIL_ACTION' && prevProps.feedo.feedDetailAction !== this.props.feedo.feedDetailAction) {
      if (this.props.feedo.feedDetailAction.action === 'Delete') {
        this.setState({ isShowToaster: true })
        this.handleDeleteFeed(this.props.feedo.feedDetailAction.feedId)
      }

      if (this.props.feedo.feedDetailAction.action === 'Archive') {
        this.setState({ isShowToaster: true })
        this.handleArchiveFeed(this.props.feedo.feedDetailAction.feedId)
      }
    } else if (prevProps.user.loading === 'USER_SIGNOUT_PENDING' && this.props.user.loading === 'USER_SIGNOUT_FULFILLED') {
      Actions.LoginStartScreen()
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
    } else if (this.props.feedo.loading === 'GET_CARD_FULFILLED' && (this.state.currentPushNotificationType === CONSTANTS.NEW_COMMENT_ON_IDEA || this.state.currentPushNotificationType === USER_JOINED_HUNT) && this.state.currentPushNotificationData) {
      Actions.CommentScreen({
        idea: this.state.currentIdea,
      });
      this.setState({
        currentPushNotificationType: CONSTANTS.UNKOWN_PUSH_NOTIFICATION,
        currentPushNotificationData: null,
      });
    } else if (this.props.feedo.loading === 'GET_CARD_FULFILLED' && this.state.currentPushNotificationType === CONSTANTS.NEW_IDEA_ADDED && this.state.currentPushNotificationData) {
      const invitee = _.find(this.state.currentPushNotificationData.invitees, (o) => {
        return (o.id == this.state.currentIdea.inviteeId)
      });
      this.setState({
        isVisibleCard: true,
        cardViewMode: CONSTANTS.CARD_VIEW,
        selectedIdeaInvitee: invitee,
      });
      this.setState({
        currentPushNotificationType: CONSTANTS.UNKOWN_PUSH_NOTIFICATION,
        currentPushNotificationData: null,
      });
    } else if (this.props.feedo.loading === 'GET_CARD_FULFILLED' && this.state.currentPushNotificationType === CONSTANTS.NEW_LIKE_ON_IDEA && this.state.currentPushNotificationData) {
      Actions.LikesListScreen({idea: this.state.currentIdea});
      this.setState({
        currentPushNotificationType: CONSTANTS.UNKOWN_PUSH_NOTIFICATION,
        currentPushNotificationData: null,
      });
    } 
  }

  async setBubbles(feedoList) {
    const { user } = this.props

    // New user, invited to existing feed
    if (feedoList && feedoList.length > 0) {
      let bubbleAsyncData = await AsyncStorage.getItem('BubbleFeedInvitedNewUser')
      let bubbleData = JSON.parse(bubbleAsyncData)

      if(!bubbleData || (bubbleData.userId === user.userInfo.id && bubbleData.state !== 'false')) {
        const ownFeeds = filter(feedoList, feed => feed.metadata.owner === true)
        console.log('FEEDO: ', feedoList)
        if (ownFeeds.length === 0) {
          this.setState({ showFeedInvitedNewUserBubble: true })
          setTimeout(() => {
            this.setState({ showBubbleCloseButton: true })
          }, 30000)
        } else {
          this.setState({ showFeedInvitedNewUserBubble: false })
        }
      }
    }

    if (feedoList && feedoList.length === 0) {
      const bubbleAsyncData = await AsyncStorage.getItem('BubbleFeedFirstTimeCreated')
      const bubbleData = JSON.parse(bubbleAsyncData)

      this.setState({ emptyState: true, showEmptyBubble: true })
      if (bubbleData && (bubbleData.userId === user.userInfo.id && bubbleData.state === 'true')) {
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

  onHandleAppStateChange(nextAppState) {
    this.setState({appState: nextAppState});
  }

  parsePushNotification(notification) {
    if (this.state.appState === 'active') {
      return;
    }
    console.log('NOTIFICATION : ', notification);
    const type = notification.data.type;
    switch (type) {
      case CONSTANTS.USER_INVITED_TO_HUNT: {
        const { huntId, inviteeId } = notification.data;
        const { feedoList } = this.state
        const matchedHunt = find(feedoList, feedo => feedo.id === huntId);
        if (matchedHunt) {
          Actions.FeedDetailScreen({
            data: matchedHunt
          });
        } else {
          this.setState({
            currentPushNotificationType: CONSTANTS.USER_INVITED_TO_HUNT,
            currentPushNotificationData: huntId,
          });
          this.props.getFeedoList(this.state.tabIndex);
        }
        break;
      }
      case CONSTANTS.NEW_COMMENT_ON_IDEA: {
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
          currentPushNotificationType: CONSTANTS.NEW_COMMENT_ON_IDEA,
          currentPushNotificationData: commentId,
        });
        this.props.getCard(ideaId);
        break;
      }
      case CONSTANTS.NEW_IDEA_ADDED: {
        const { huntId, ideaId } = notification.data;
        const { feedoList } = this.state
        const matchedHunt = find(feedoList, feedo => feedo.id === huntId);
        if (matchedHunt) {
          const matchedIdea = find(matchedHunt.ideas, idea => idea.id === ideaId);
          if (matchedIdea) {
            const invitee = _.find(matchedHunt.invitees, (o) => {
              return (o.id == matchedIdea.inviteeId)
            });
            this.setState({
              isVisibleCard: true,
              selectedIdeaInvitee: invitee,
            });
            return;
          }
        }
        this.setState({
          currentPushNotificationType: CONSTANTS.NEW_IDEA_ADDED,
          currentPushNotificationData: matchedHunt,
        });
        this.props.getCard(ideaId);
        break;
      }
      case CONSTANTS.NEW_LIKE_ON_IDEA: {
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
          currentPushNotificationType: CONSTANTS.NEW_LIKE_ON_IDEA,
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
    }
  }

  registerPushNotification() {
    PushNotification.configure({
      onRegister: (token) => {
        console.log('TOKEN : ', token);
        AsyncStorage.getItem(CONSTANTS.USER_DEVICE_TOKEN, (error, result) => {
          if (error) {
            console.log('error : ', error);
            return;
          }
          console.log('result : ', result);
          const data = {
            deviceToken: token.token,
            deviceTypeEnum: Platform.OS === 'ios' ? 'IPHONE' : 'ANDROID',
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
        this.parsePushNotification(notification);
      },
      senderID: "sender-id",
    });
  }

  onChangeTab(value) {
    // if (value.ref.props.tabLabel.label === 'All') {
    //   this.currentRef = this.scrollTabAll;
    // } else if (value.ref.props.tabLabel.label === 'Pinned') {
    //   this.currentRef = this.scrollTabPinned;
    // } else if (value.ref.props.tabLabel.label === 'Shared with me') {
    //   this.currentRef = this.scrollTabSharedWithMe;
    // }
    // if (this.currentRef) {
    //   this.currentRef.measure((ox, oy, width, height, px, py) => {
    //     console.log('onChangeTab : ', value.ref.props.tabLabel.label + " : " + height);
    //     if (height != 0) {
    //       this.setState({scrollableTabViewContainer: {height}});
    //     }
    //   });
    // }

    this.setState({ 
      tabIndex: value.i,
      loading: true,
      scrollableTabViewContainer: {},
    })
    this.props.getFeedoList(value.i)
  }

  handleLongHoldMenu = (selectedFeedData) => {
    this.setState({ selectedFeedData })
    this.setState({ isLongHoldMenuVisible: true })
  }

  handleArchiveFeed = (feedId) => {
    this.setState({ isLongHoldMenuVisible: false })
    this.setState({ isArchive: true, toasterTitle: 'Feedo archived', feedId })
    this.props.addDummyFeed({ feedId, flag: 'archive' })

    setTimeout(() => {
      this.setState({ isShowToaster: false })
      this.archiveFeed(feedId)
    }, TOASTER_DURATION)
  }

  archiveFeed = (feedId) => {
    if (this.state.isArchive) {
      this.props.archiveFeed(feedId)
      this.setState({ isArchive: false })
    }
  }

  handleDeleteFeed = (feedId) => {
    this.setState({ isLongHoldMenuVisible: false })
    this.setState({ isDelete: true, toasterTitle: 'Feedo deleted', feedId })
    this.props.addDummyFeed({ feedId, flag: 'delete' })

    setTimeout(() => {
      this.setState({ isShowToaster: false })
      this.deleteFeed(feedId)
    }, TOASTER_DURATION)
  }

  deleteFeed = (feedId) => {
    if (this.state.isDelete) {
      this.props.deleteFeed(feedId)
      this.setState({ isDelete: false })
    }
  }

  handlePinFeed = (feedId) => {
    this.setState({ isLongHoldMenuVisible: false })
    this.setState({ isPin: true, toasterTitle: 'Feed pinned', feedId })

    this.props.addDummyFeed({ feedId, flag: 'pin' })

    setTimeout(() => {
      this.setState({ isShowToaster: false })
      this.pinFeed(feedId)
    }, TOASTER_DURATION)
  }

  pinFeed = (feedId) => {
    if (this.state.isPin) {
      this.props.pinFeed(feedId)
      this.setState({ isPin: false })
    }
  }

  handleUnpinFeed = (feedId) => {
    this.setState({ isLongHoldMenuVisible: false })
    this.setState({ isUnPin: true, toasterTitle: 'Feed un-pinned', feedId })
    this.props.addDummyFeed({ feedId, flag: 'unpin' })

    setTimeout(() => {
      this.setState({ isShowToaster: false })
      this.unpinFeed(feedId)
    }, TOASTER_DURATION)
  }

  unpinFeed = (feedId) => {
    if (this.state.isUnPin) {
      this.props.unpinFeed(feedId)
      this.setState({ isUnPin: false })
    }
  }

  handleDuplicateFeed = (feedId) => {
    this.setState({ isLongHoldMenuVisible: false })
    this.setState({ isDuplicate: true, toasterTitle: 'Feed duplicated', feedId })
    this.props.duplicateFeed(feedId)

    setTimeout(() => {
      this.setState({ isShowToaster: false })
      this.duplicateFeed()
    }, TOASTER_DURATION + 5)
  }
  
  duplicateFeed = () => {
    if (this.state.isDuplicate) {
      this.setState({ isDuplicate: false })
    }
  }

  handleEditFeed = (feedId) => {
    this.setState({ 
      isLongHoldMenuVisible: false,
    }, () => {
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
          }).start();
        });  
      }, 300);
    });
  }

  undoAction = () => {
    if (this.state.isPin) {
      this.props.removeDummyFeed({ feedId: this.state.feedId, flag: 'pin' })
    } else if (this.state.isUnPin) {
      this.props.removeDummyFeed({ feedId: this.state.feedId, flag: 'unpin' })
    } else if (this.state.isDelete) {
      this.props.removeDummyFeed({ feedId: this.state.feedId, flag: 'delete' })
    } else if (this.state.isArchive) {
      this.props.removeDummyFeed({ feedId: this.state.feedId, flag: 'archive' })
    } else if (this.state.isDuplicate) {
      if (this.props.feedo.duplicatedId) {
        this.props.deleteDuplicatedFeed(this.props.feedo.duplicatedId)
      }
    }

    this.setState({
      isShowToaster: false, isArchive: false, isDelete: false, isPin: false, isUnPin: false, isDuplicate: false
    })
  }

  onLongHoldMenuHide = () => {
    const { isArchive, isDelete, isPin, isUnPin, isDuplicate, feedId } = this.state

    if (isArchive || isDelete || isPin || isUnPin || isDuplicate) {
      this.setState({ isShowToaster: true })
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
      this.setState({
        isVisibleCreateNewFeedModal: false,
        isVisibleCard: true,
        cardViewMode: CONSTANTS.CARD_NEW,
        selectedIdeaInvitee: null,
      });
    } else if (type === 'New Feed') {
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
          />  
        )}
      </Animated.View>
    );
  }

  handleFilter = () => {
  }

  handleSetting = () => {
    Actions.ProfileScreen()
  }

  onScrollableTabViewLayout(event, selectedIndex) {
    const { loading } = this.state
    if (this.state.tabIndex === selectedIndex && !loading) {
      if (!this.state.scrollableTabViewContainer.height || event.nativeEvent.layout.height > this.state.scrollableTabViewContainer.height) {
        const height = event.nativeEvent.layout.height;
        setTimeout(() => {
          this.setState({ scrollableTabViewContainer: { height: height + 150 } });
        }, 0);
      }
    }
  }

  onSearch = () => {
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
          onClose={() => this.onCloseCardModal()}
        />
      </Animated.View>
    );
  }

  render () {
    const { loading, feedoList, emptyState, tabIndex } = this.state
    
    const normalHeaderOpacity = this.state.scrollY.interpolate({
      inputRange: [20, 60],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    })

    const miniHeaderOpacity = this.state.scrollY.interpolate({
      inputRange: [60, 120],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    })

    const miniHeaderZIndex = this.state.scrollY.interpolate({
      inputRange: [0, 40, 80],
      outputRange: [11, 9, 11],
      extrapolate: 'clamp'
    })

    return (
      <SafeAreaView style={styles.safeArea}>
        <View feedAction="null" />
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" backgroundColor="blue" />}
          {Platform.OS === 'android' && (
            <View style={styles.statusBarUnderlay} />
          )}

          <Animated.View style={[styles.navbarView, { zIndex: miniHeaderZIndex }]}>
            <View style={styles.searchIconView}>
              <TouchableOpacity onPress={() => this.onSearch()}>
                <Image source={SEARCH_ICON} />
              </TouchableOpacity>
            </View>
            <Animated.View style={[styles.minHeader, { opacity: miniHeaderOpacity }]}>
              <View style={styles.minTitleView}>
                <Text style={styles.minTitle}>My feeds</Text>
              </View>
              <View style={styles.settingIconView}>
                <TouchableOpacity onPress={() => this.handleSetting()}>
                  <Image source={SETTING_ICON} />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>          

          <ScrollView
            ref={ref => this.scrollView = ref}
            scrollEventThrottle={16}
            scrollEnabled={emptyState && tabIndex === 0 ? false : true}
            style={styles.feedListView }
            onScroll={
              Animated.event(
                [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
              )
            }
          >
            <Animated.View style={[styles.normalHeader, { opacity: normalHeaderOpacity }]}>
              <DashboardNavigationBar handleSetting={this.handleSetting} />
            </Animated.View>

            {emptyState && (tabIndex === 0 && feedoList.length === 0)
            ? <View style={styles.emptyView}>
                {loading
                  ? <FeedLoadingStateComponent />
                  : <View style={styles.emptyInnerView}>
                      {this.state.showEmptyBubble && (
                        this.state.isExistingUser
                          ? <EmptyStateComponent
                              page="feed_exist"
                              title="It's awesome to start fresh!"
                              subTitle=""
                              ctaTitle="Start a new feed"
                              onCreateNewFeed={() => {
                                this.animatedOpacity.setValue(1);
                                this.onSelectNewFeedType('New Feed')
                              }}
                            />
                          : <EmptyStateComponent
                              page="feed"
                              title="First time here? No worries, you are in good hands..."
                              subTitle="Watch a 15 sec video about creating feeds"
                              ctaTitle="Start your first feed"
                              onCreateNewFeed={() => {
                                this.animatedOpacity.setValue(1);
                                this.onSelectNewFeedType('New Feed')
                              }}
                            />
                      )}
                    </View>
                }
              </View>
            : <ScrollableTabView
                style={this.state.scrollableTabViewContainer}
                prerenderingSiblingsNumber={0}
                tabBarActiveTextColor={COLORS.PURPLE}
                tabBarInactiveTextColor={COLORS.MEDIUM_GREY}
                onChangeTab={this.onChangeTab.bind(this)}
                prerenderingSiblingsNumber={0}
                renderTabBar={() => <TabBar
                                      underlineHeight={0}
                                      underlineBottomPosition={0}
                                      tabBarStyle={styles.tabBarStyle}
                                      tabBarTextStyle={styles.tabBarTextStyle}
                                      tabMargin={16}
                                      tabStyles={{ 'tab': TAB_STYLES }}
                                    />}
              >
                <View
                  style={ styles.feedListContainer }
                  ref={ref => this.scrollTabAll = ref} 
                  tabLabel={{ label: 'All' }}
                  onLayout={(event) => this.onScrollableTabViewLayout(event, 0)}
                >
                  {this.state.showFeedInvitedNewUserBubble && (
                    <View style={{ height: 200 }}>
                      <SpeechBubbleComponent
                        page="feed"
                        title="So you've been invited to feedo? Exciting, isn't it?!"
                        subTitle="Watch a 15 sec Quick Start video "
                        showBubbleCloseButton={this.state.showBubbleCloseButton}
                        onCloseBubble={() => this.closeBubble()}
                      />
                    </View>
                  )}

                  <FeedoListContainer
                    loading={loading}
                    feedoList={feedoList}
                    handleFeedMenu={this.handleLongHoldMenu}
                    page="home"
                  />
                </View>
                <View
                  style={ styles.feedListContainer }
                  ref={ref => this.scrollTabPinned = ref}
                  tabLabel={{ label: 'Pinned' }}
                  onLayout={(event) => this.onScrollableTabViewLayout(event, 1)}
                >
                  {feedoList.length > 0
                    ? <FeedoListContainer
                        loading={loading}
                        feedoList={feedoList}
                        handleFeedMenu={this.handleLongHoldMenu}
                        page="home"
                      />
                    : !loading && ( 
                        <View style={styles.emptyTabInnerSubView}>
                          <SpeechBubbleComponent
                            page="pinned"
                            title="Your pinned items will appear here. To pin a feed tap and hold it to bring up a quick actions and select"
                            subTitle="Watch a 15 sec Quick Start video "
                          />
                        </View>
                      )
                  }
                </View>
                <View
                  style={ styles.feedListContainer }
                  ref={ref => this.scrollTabSharedWithMe = ref}
                  tabLabel={{ label: 'Shared with me' }}
                  onLayout={(event) => this.onScrollableTabViewLayout(event, 2)}
                >
                  {feedoList.length > 0
                    ? <FeedoListContainer
                        loading={loading}
                        feedoList={feedoList}
                        handleFeedMenu={this.handleLongHoldMenu}
                        page="home"
                      />
                    : !loading && (
                        <View style={styles.emptyTabInnerSubView}>
                          <SpeechBubbleComponent
                            page="shared"
                            title="Feeds can be shared with friends and colleagues for collaboration. Feeds you've been invited to will appear here."
                            subTitle="All you need to know about sharing in 15 sec "
                          />
                        </View>
                      )
                  }
                </View>
              </ScrollableTabView>
            }
          </ScrollView>

        </View>

        {!this.state.isLongHoldMenuVisible && (
          <DashboardActionBar 
            filtering={false}
            notifications={false}
            onAddFeed={this.onOpenNewFeedModal.bind(this)}
            handleFilter={() => this.handleFilter()}
          />
        )}

        {this.renderNewFeedModals}
        <Modal 
          isVisible={this.state.isLongHoldMenuVisible}
          style={styles.longHoldModalContainer}
          backdropColor='#e0e0e0'
          backdropOpacity={0.9}
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInTiming={1300}
          onModalHide={this.onLongHoldMenuHide}
          onBackdropPress={() => this.setState({ isLongHoldMenuVisible: false })}
        >
          <FeedLongHoldMenuScreen
            feedData={this.state.selectedFeedData}
            handleArchiveFeed={this.handleArchiveFeed}
            handleDeleteFeed={this.handleDeleteFeed}
            handlePinFeed={this.handlePinFeed}
            handleUnpinFeed={this.handleUnpinFeed}
            handleDuplicateFeed={this.handleDuplicateFeed}
            handleEditFeed={this.handleEditFeed}
          />
        </Modal>

        {this.state.isShowToaster && (
          <ToasterComponent
            isVisible={this.state.isShowToaster}
            title={this.state.toasterTitle}
            onPressButton={this.undoAction}
          />
        )}

        {this.renderCardModal}

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
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen)

