/* global require */
import React from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  Animated,
  TouchableOpacity,
  TouchableHighlight,
  AsyncStorage,
  Alert,
  RefreshControl
} from 'react-native'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Actions } from 'react-native-router-flux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ActionSheet from 'react-native-actionsheet'
import Modal from "react-native-modal"
import ReactNativeHaptic from 'react-native-haptic'
import ImagePicker from 'react-native-image-picker'
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker'
import Permissions from 'react-native-permissions'
import * as mime from 'react-native-mime-types'
import GestureRecognizer from 'react-native-swipe-gestures'

import DashboardActionBar from '../../navigations/DashboardActionBar'
import FeedCardComponent from '../../components/FeedCardComponent'
import FeedCollapseComponent from '../../components/FeedCollapseComponent'
import AvatarPileComponent from '../../components/AvatarPileComponent'
import FeedNavbarSettingComponent from '../../components/FeedNavbarSettingComponent'
import FeedControlMenuComponent from '../../components/FeedControlMenuComponent'
import CardControlMenuComponent from '../../components/CardControlMenuComponent'
import ToasterComponent from '../../components/ToasterComponent'
import FeedLoadingStateComponent from '../../components/FeedLoadingStateComponent'
import ShareScreen from '../ShareScreen'
import NewFeedScreen from '../NewFeedScreen'
import CardFilterComponent from '../../components/CardFilterComponent'
import CardLongHoldMenuScreen from '../CardLongHoldMenuScreen'
import SelectHuntScreen from '../SelectHuntScreen';
import TagCreateScreen from '..//TagCreateScreen'
import NewCardScreen from '../NewCardScreen'
import LoadingScreen from '../LoadingScreen'
import EmptyStateComponent from '../../components/EmptyStateComponent'
import SpeechBubbleComponent from '../../components/SpeechBubbleComponent'

import {
  getFeedDetail,
  setFeedDetailAction,
  addDummyFeed,
  removeDummyFeed,
  pinFeed,
  unpinFeed,
  duplicateFeed,
  deleteDuplicatedFeed,
  getFileUploadUrl,
  uploadFileToS3,
  addFile,
  deleteFile,
  setCurrentFeed
} from '../../redux/feedo/actions';
import {
  setCurrentCard,
  deleteCard,
  moveCard,
} from '../../redux/card/actions'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import * as COMMON_FUNC from '../../service/commonFunc'
import styles from './styles'

const EMPTY_ICON = require('../../../assets/images/empty_state/asset-emptystate.png')
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
      avatars: []
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
  }

  componentDidMount() {
    this.setState({ loading: true })
    this.props.getFeedDetail(this.props.data.id)
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    const { feedo, card } = nextProps
    if (this.state.isVisibleSelectFeedo) {
      return;
    }
    if ((this.props.feedo.loading === 'ADD_FILE_PENDING' && feedo.loading === 'ADD_FILE_FULFILLED') ||
        (this.props.feedo.loading === 'DELETE_FILE_PENDING' && feedo.loading === 'DELETE_FILE_FULFILLED')) {
      // updating a feed
      this.setState({
        apiLoading: false
      })
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
        (this.props.card.loading === 'UPDATE_CARD_PENDING' && card.loading === 'UPDATE_CARD_FULFILLED') || 
        (this.props.card.loading === 'DELETE_CARD_PENDING' && card.loading === 'DELETE_CARD_FULFILLED') ||
        (this.props.card.loading === 'MOVE_CARD_PENDING' && card.loading === 'MOVE_CARD_FULFILLED')) {

      const currentFeed = feedo.currentFeed
      let filterIdeas = currentFeed.ideas;
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
        this.filterCards(currentFeed)
      })
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

  filterCards = (currentFeed) => {
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
      sortIdeas = _.orderBy(filterIdeas, ['dateCreated'], ['desc'])
    }

    if (filterSortType === 'like') {
      sortIdeas = _.orderBy(filterIdeas, ['metadata.likes'], ['desc'])
    }

    if (filterSortType === 'comment') {
      sortIdeas = _.orderBy(filterIdeas, ['metadata.comments'], ['desc'])
    }

    let avatars = []
    if (!_.isEmpty(currentFeed)) {
      currentFeed.invitees.forEach((item, key) => {
        avatars = [
          ...avatars,
          item.userProfile
        ]
      })
      this.setState({ avatars })
    }

    this.setState({
      currentFeed: {
        ...currentFeed,
        ideas: sortIdeas
      }
    })
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

  backToDashboard = () => {
    Actions.pop()
  }

  handleSetting = () => {
    const { openMenu } = this.state
    this.setState({ openMenu: !openMenu, settingItem: null })
  }

  handleShare = () => {
    this.setState({ isShowShare: true })
  }

  hideSettingMenu = () => {
    const feedId = this.props.data.id
    const { settingItem } = this.state

    switch(settingItem) {
      case 'Pin':
        this.handlePinFeed(feedId)
        return
      case 'Unpin':
        this.handleUnpinFeed(feedId)
        return
      case 'Share':
        this.setState({ isShowShare: true })
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
      default:
        return
    }
  }

  handleEdit = (feedId) => {
    this.setState({
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
    this.setState({ settingItem: item, openMenu: false })
  }

  handlePinFeed = (feedId) => {
    this.setState({ 
      isShowToaster: true,
      currentActionType: ACTION_FEEDO_PIN,
      toasterTitle: 'Feed pinned',
      feedId, pinText: 'Unpin',
    })
    this.props.addDummyFeed({ feedId, flag: 'pin' })
    setTimeout(() => {
      this.setState({ isShowToaster: false })
      this.pinFeed(feedId)
    }, TOASTER_DURATION)
  }

  pinFeed = (feedId) => {
    if (this.state.currentActionType === ACTION_FEEDO_PIN) {
      this.props.pinFeed(feedId)
      this.setState({ currentActionType: ACTION_NONE })
    }
  }

  handleUnpinFeed = (feedId) => {
    this.setState({ 
      isShowToaster: true,
      currentActionType: ACTION_FEEDO_UNPIN,
      toasterTitle: 'Feed un-pinned',
      feedId,
      pinText: 'Pin',
    })
    this.props.addDummyFeed({ feedId, flag: 'unpin' })

    setTimeout(() => {
      this.setState({ isShowToaster: false })
      this.unpinFeed(feedId)
    }, TOASTER_DURATION)
  }

  unpinFeed = (feedId) => {
    if (this.state.currentActionType === ACTION_FEEDO_UNPIN) {
      this.props.unpinFeed(feedId)
      this.setState({ currentActionType: ACTION_NONE })
    }
  }

  handleDuplicateFeed = (feedId) => {
    this.setState({ 
      isShowToaster: true,
      currentActionType: ACTION_FEEDO_DUPLICATE,
      toasterTitle: 'Feed duplicated',
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
      this.setState({ currentActionType: ACTION_NONE })
    }
  }

  undoAction = () => {
    if (this.state.currentActionType === ACTION_FEEDO_PIN) {
      this.setState({ pinText: 'Pin' })
      this.props.removeDummyFeed({ feedId: this.state.feedId, flag: 'pin' })
    } else if (this.state.currentActionType === ACTION_FEEDO_UNPIN) {
      this.setState({ pinText: 'Unpin' })
      this.props.removeDummyFeed({ feedId: this.state.feedId, flag: 'unpin' })
    } else if (this.state.currentActionType === ACTION_FEEDO_DUPLICATE) {
      if (this.props.feedo.duplicatedId) {
        this.props.deleteDuplicatedFeed(this.props.feedo.duplicatedId)
      }
    } else if (this.state.currentActionType === ACTION_CARD_DELETE || this.state.currentActionType === ACTION_CARD_MOVE) {
      clearTimeout(this.userActionTimer);
      this.userActionTimer = null;
      this.userActions.shift();

      this.setState((state) => { 
        let filterIdeas = this.props.feedo.currentFeed.ideas;
        for(let i = 0; i < this.userActions.length; i ++) {
          const cardInfo = this.userActions[i];
          filterIdeas = _.filter(filterIdeas, idea => idea.id !== cardInfo.ideaId)
        }
        state.currentFeed.ideas = filterIdeas;
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

  onCloseCardModal() {
    this.animatedOpacity.setValue(1);
    Animated.timing(this.animatedOpacity, {
      toValue: 0,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
    }).start(() => {
      this.setState({ 
        isVisibleCard: false,
        cardViewMode: CONSTANTS.CARD_NONE,
      });
    });
  }

  onSelectCard(idea, index) {
    this.props.setCurrentCard(idea);
    const { currentFeed } = this.state;
    const invitee = _.find(currentFeed.invitees, (o) => {
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

  onLongPressCard(index, idea, invitees) {
    if (COMMON_FUNC.isFeedGuest(this.state.currentFeed)) {
      return
    }
    ReactNativeHaptic.generate('impactHeavy');
    this.setState({
      selectedLongHoldCardIndex: index,
    }, () => {
      Animated.sequence([
        Animated.timing(this.animatedSelectCard, {
          toValue: 0.95,
          duration: 100,
        }),
        Animated.timing(this.animatedSelectCard, {
          toValue: 1,
          duration: 100,
        }),
      ]).start(() => {
        this.setState({
          selectedLongHoldIdea: idea,
          selectedLongHoldInvitees: invitees,
          isVisibleLongHoldMenu: true,
          // selectedLongHoldCardIndex: -1,
        });
      });
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

  onMoveCard(ideaId) {
    this.onCloseCardModal();
    this.setState({ 
      isVisibleCardOpenMenu: false,
      isVisibleLongHoldMenu: false,
      currentActionType: ACTION_CARD_MOVE,
    });
    this.moveCardId = ideaId;
  }
  
  onEditCard() {
    this.setState({ isVisibleLongHoldMenu: false })
    this.onSelectCard(this.state.selectedLongHoldIdea, this.state.selectedLongHoldCardIndex)
  }

  onTapCardActionSheet(index) {
    if (index === 0) {
      this.onDeleteCard(this.state.selectedLongHoldIdea.id)
    }
  }

  onConfirmDeleteCard() {
    this.setState({
      isVisibleCardOpenMenu: false,
    })
    setTimeout(() => {
      this.cardActionSheet.show()
    }, 500)
  }

  processCardActions() {
    if (this.userActionTimer) {
      // this.setState({
      //   isShowToaster: false, 
      //   currentActionType: ACTION_NONE,
      // });
      return;
    }
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
        this.props.deleteCard(currentCardInfo.ideaId)
      } else if (this.state.currentActionType === ACTION_CARD_MOVE) {
        this.props.moveCard(currentCardInfo.ideaId, currentCardInfo.feedoId);
      }
      this.userActionTimer = null;
      this.userActions.shift();
      this.processCardActions();
    }, TOASTER_DURATION + 5);
  }

  onDeleteCard(ideaId) {
    this.onCloseCardModal();
    this.setState({
      isVisibleLongHoldMenu: false,
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
      return state;
    }, () => {
      this.setBubbles(this.state.currentFeed)
    });

    this.processCardActions();
  }

  onSelectFeedoToMoveCard(feedoId) {
    this.prevFeedo = null;

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
      return state;
    }, () => {
      this.setBubbles(this.state.currentFeed)
    });

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
    if (!this.state.isVisibleCard && !this.state.isVisibleEditFeed) {
      return;
    }
    return (
      <Animated.View 
        style={[
          styles.modalContainer,
          {opacity: this.animatedOpacity}
        ]}
      >
        {
          this.state.isVisibleCard && 
            <NewCardScreen 
              viewMode={this.state.cardViewMode}
              invitee={this.state.selectedIdeaInvitee}
              intialLayout={this.state.selectedIdeaLayout}
              onClose={() => this.onCloseCardModal()}
              onOpenAction={(idea) => this.onOpenCardAction(idea)}

              // cardMode={CONSTANTS.SHARE_EXTENTION_CARD}
              // shareUrl='https://trello.com'
              // shareImageUrl='https://d2k1ftgv7pobq7.cloudfront.net/meta/p/res/images/fb4de993e22034b76539da073ea8d35c/home-hero.png'
            />
        }
        {  
          this.state.isVisibleEditFeed && 
            <NewFeedScreen 
              feedData={this.state.currentFeed}
              onClose={() => this.onCloseEditFeedModal()}
              selectedFeedId={this.props.data.id}
              viewMode={this.state.feedoViewMode}
            />
        }
      </Animated.View>
    );
  }
  
  handleFilter = () => {
    this.setState({ showFilterModal: true })
  }

  closeShareModal = () => {
    setTimeout(() => {
      this.setState({ isShowShare: false })
    }, 200)
  }

  onAddMedia = () => {
    this.imagePickerActionSheetRef.show();
  }

  onAddDocument = () => {
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
    this.selectedFileMimeType = mime.lookup(file.uri);
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
      Permissions.check('camera').then(response => {
        if (response === 'authorized') {
          this.pickMediaFromCamera(options);
        } else if (response === 'undetermined') {
          Permissions.request('camera').then(response => {
            if (response === 'authorized') {
              this.pickMediaFromCamera(options);
            }
          });
        } else {
          Permissions.openSettings();
        }
      });
    } else if (index === 1) {
      // from library
      Permissions.check('photo').then(response => {
        if (response === 'authorized') {
          this.pickMediaFromLibrary(options);
        } else if (response === 'undetermined') {
          Permissions.request('photo').then(response => {
            if (response === 'authorized') {
              this.pickMediaFromLibrary(options);
            }
          });
        } else {
          Permissions.openSettings();
        }
      });
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

  get renderSelectHunt() {
    if (this.state.isVisibleSelectFeedo) {
      const { currentFeed } = this.state
      return (
        <View style={[styles.modalContainer, {backgroundColor: 'transparent'}]}>
          <SelectHuntScreen
            selectMode={CONSTANTS.FEEDO_SELECT_FROM_MOVE_CARD}
            feedos={this.props.feedo.feedoList}
            hiddenFeedoId={currentFeed.id}
            direction='top'
            onClosed={() => this.onCloseSelectFeedoModal()}
          />
        </View>
      );
    }
  }

  render () {
    const { currentFeed, loading, pinText, avatars } = this.state

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
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

          <ScrollView
            refreshControl={
              <RefreshControl
                tintColor={COLORS.PURPLE}
                refreshing={this.state.isRefreshing}
                onRefresh={() => this.onRefreshFeed()}
              />
            }
            scrollEventThrottle={16}
            style={styles.scrollView}
          >     
            <GestureRecognizer
              style={{ width: '100%', height: '100%' }}
              onSwipeRight={this.backToDashboard}
            >
              <View style={styles.detailView}>
                {!_.isEmpty(currentFeed) && (
                  <View style={styles.collapseView}>
                    <FeedCollapseComponent
                      feedData={currentFeed}
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

                {!_.isEmpty(currentFeed) && currentFeed && currentFeed.ideas && currentFeed.ideas.length > 0 && this.state.showBubble && (
                  <SpeechBubbleComponent
                    page="detail"
                    title="Feeds contain cards. Cards can have, images, text, attachments and likes. My granny enjoys liking."
                    subTitle="Watch a 15 sec video about the cards "
                    onCloseBubble={() => this.closeBubble()}
                    showBubbleCloseButton={this.state.showBubbleCloseButton}
                  />
                )}

                {
                  !_.isEmpty(currentFeed) && currentFeed && currentFeed.ideas && currentFeed.ideas.length > 0 ?
                    currentFeed.ideas.map((item, index) => (
                      <Animated.View 
                        key={index}
                        style={
                          this.state.selectedLongHoldCardIndex === index && 
                          {
                            transform: [
                              { scale: this.animatedSelectCard },
                            ],
                          }
                        }
                      >
                        {currentFeed.ideas.length > 0 && index === 0 && (
                          <View style={styles.separator} />
                        )}

                        <TouchableHighlight
                          ref={ref => this.cardItemRefs[index] = ref}
                          style={{ marginHorizontal: 5, borderRadius: 5 }}
                          underlayColor={COLORS.LIGHT_GREY}
                          onPress={() => this.onSelectCard(item, index)}
                          onLongPress={() => this.onLongPressCard(index, item, currentFeed.invitees)}
                        >
                          <FeedCardComponent
                            idea={item}
                            invitees={currentFeed.invitees}
                            onLinkPress={() => this.onSelectCard(item, index)}
                            onLinkLongPress={() => this.onLongPressCard(index, item, currentFeed.invitees)}
                          />
                        </TouchableHighlight>

                        {currentFeed.ideas.length > 0 && (
                          <View style={styles.separator} />
                        )}
                      </Animated.View>
                    ))
                  : 
                    <View style={styles.emptyView}>
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
          </ScrollView>
        </View>

        {this.renderCreateTag}

        <DashboardActionBar 
          onAddFeed={this.onOpenNewCardModal.bind(this)}
          handleFilter={this.handleFilter}
          showType={this.state.filterShowType}
          sortType={this.state.filterSortType}
          notifications={false}
          feed={currentFeed}
        />

        {this.renderNewCardModal}
        {this.renderSelectHunt}

        <ActionSheet
          ref={ref => this.feedoActionSheet = ref}
          title={'Are you sure you want to delete this feed, everything will be gone ...'}
          options={['Delete feed', 'Cancel']}
          cancelButtonIndex={1}
          destructiveButtonIndex={0}
          tintColor={COLORS.PURPLE}
          onPress={(index) => this.onTapFeedoActionSheet(index)}
        />

        <ActionSheet
          ref={ref => this.cardActionSheet = ref}
          title={'This will permanentely delete your card'}
          options={['Delete card', 'Cancel']}
          cancelButtonIndex={1}
          destructiveButtonIndex={0}
          tintColor={COLORS.PURPLE}
          onPress={(index) => this.onTapCardActionSheet(index)}
        />

        {this.state.isShowToaster && (
          <ToasterComponent
            isVisible={this.state.isShowToaster}
            title={this.state.toasterTitle}
            onPressButton={() => this.undoAction()}
          />
        )}

        <Modal
          isVisible={this.state.isShowShare}
          style={styles.shareScreenContainer}
          backdropColor='#f5f5f5'
          backdropOpacity={0.9}
          animationIn="zoomInUp"
          animationOut="zoomOutDown"
          animationInTiming={500}
          onModalHide={() => {}}
          onBackdropPress={() => this.closeShareModal()}
        >
          <ShareScreen onClose={() => this.closeShareModal()} data={currentFeed} />
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
        >
          <Animated.View style={styles.settingMenuView}>
            <FeedControlMenuComponent handleSettingItem={item => this.handleSettingItem(item)} data={currentFeed} pinText={pinText} />
          </Animated.View>
        </Modal>

        <Modal 
          isVisible={this.state.isVisibleCardOpenMenu}
          style={styles.shareScreenContainer}
          backdropColor='#fff'
          backdropOpacity={0}
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInTiming={500}
          onModalHide={this.onHiddenLongHoldMenu.bind(this)}
          onBackdropPress={() => this.setState({ isVisibleCardOpenMenu: false })}
        >
          <Animated.View style={[styles.settingMenuView, { top: CONSTANTS.STATUSBAR_HEIGHT + 60 }]}>
            <CardControlMenuComponent 
              onMove={() => this.onMoveCard(this.state.selectedLongHoldIdea.id)}
              onDelete={() => this.onConfirmDeleteCard()}
            />
          </Animated.View>
        </Modal>

        <Modal 
          isVisible={this.state.isVisibleLongHoldMenu}
          style={styles.longHoldModalContainer}
          backdropColor='#e0e0e0'
          backdropOpacity={0.9}
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInTiming={1300}
          onModalHide={this.onHiddenLongHoldMenu.bind(this)}
          onBackdropPress={() => this.setState({isVisibleLongHoldMenu: false})}
        >
          <CardLongHoldMenuScreen
            idea={this.state.selectedLongHoldIdea}
            invitees={this.state.selectedLongHoldInvitees}
            onMove={this.onMoveCard.bind(this)}
            onEdit={this.onEditCard.bind(this)}
            onDelete={this.onDeleteCard.bind(this)}
            onClose={() => this.setState({isVisibleLongHoldMenu: false})}
          />
        </Modal>

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
  addDummyFeed: (data) => dispatch(addDummyFeed(data)),
  removeDummyFeed: (data) => dispatch(removeDummyFeed(data)),
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
})

FeedDetailScreen.defaultProps = {
  data: [],
  getFeedDetail: () => {},
  setFeedDetailAction: () => {}
}

FeedDetailScreen.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  feedo: PropTypes.objectOf(PropTypes.any),
  getFeedDetail: PropTypes.func,
  setFeedDetailAction: PropTypes.func,
  addDummyFeed: PropTypes.func.isRequired,
  removeDummyFeed: PropTypes.func.isRequired,
  pinFeed: PropTypes.func.isRequired,
  unpinFeed: PropTypes.func.isRequired,
  duplicateFeed: PropTypes.func.isRequired,
  deleteDuplicatedFeed: PropTypes.func.isRequired,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedDetailScreen)

