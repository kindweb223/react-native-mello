/* global require */
import React from 'react'
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Alert,
  BackHandler
} from 'react-native'

import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import PropTypes from 'prop-types'
import Swipeout from 'react-native-swipeout'
import _ from 'lodash'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import Analytics from '../../lib/firebase'
import NotificationItemComponent from '../../components/NotificationItemComponent'
import ActivityFeedComponent from '../../components/ActivityFeedComponent'
import CardDetailScreen from '../CardDetailScreen'
import SelectHuntScreen from '../SelectHuntScreen'
import ToasterComponent from '../../components/ToasterComponent'
import AlertController from '../../components/AlertController'
import LoadingScreen from '../LoadingScreen';

import {
  getFeedDetail,
  getActivityFeed,
  readActivityFeed,
  alreadyReadActivityFeed,
  deleteActivityFeed,
  readAllActivityFeed,
  setCurrentFeed,
  getInvitedFeedList,
  getActivityFeedVisited
} from '../../redux/feedo/actions'
import {
  getCard,
  moveCard,
  deleteCard
} from '../../redux/card/actions'

import * as COMMON_FUNC from '../../service/commonFunc'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import styles from './styles'

const CLOSE_ICON = require('../../../assets/images/Close/Blue.png')
const NOTIFICATION_EMPTY_ICON = require('../../../assets/images/empty_state/NotificationEmptyState.png')

const PAGE_COUNT = 50

const TOASTER_DURATION = 3000

const ACTION_NONE = 0;
const ACTION_FEEDO_PIN = 1;
const ACTION_FEEDO_UNPIN = 2;
const ACTION_FEEDO_DUPLICATE = 3;
const ACTION_CARD_MOVE = 4;
const ACTION_CARD_EDIT = 5;
const ACTION_CARD_DELETE = 6;

/**
 * 'IDEA_LIKED' - open the card that was like
 * 'COMMENT_ADDED' - open the comment screen
 * 'USER_ACCESS_CHANGED' - open the flow
 * 'USER_INVITED_TO_HUNT' - open the flow
 * 'USER_JOINED_HUNT' - open the flow
 * 'IDEA_ADDED' - open the card
 * 'HUNT_UPDATED' - open the flow
 * 'IDEA_MOVED' - open the card
 * 'IDEA_UPDATED' - open the card
 * 'HUNT_DELETED' - alert the flow is no longer available
 * 'IDEA_DELETED' - alert the card is not longer available
 * 'USER_MENTIONED' - open the comment screen
 */
class NotificationScreen extends React.Component {
  get renderHeader() {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity activeOpacity={0.6} onPress={() => Actions.pop()} style={styles.buttonWrapper}>
          <Image source={CLOSE_ICON} />
        </TouchableOpacity>
        <Text style={styles.textTitle}>Notifications</Text>
        <View style={styles.buttonWrapper} />
      </View>
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      loading: false,
      invitedFeedList: [],
      activityFeedList: [],
      notificationList: [],
      selectedActivity: {},
      isVisibleCard: false,
      cardViewMode: CONSTANTS.CARD_NONE,
      selectedLongHoldIdea: {},
      isShowToaster: false,
      isVisibleSelectFeedo: false,
      isShowInviteToaster: false,
      inviteToasterTitle: '',
      apiLoading: false
    };
    this.animatedOpacity = new Animated.Value(0)
    this.userActions = []
    this.userActionTimer = null
    this.prevFeedo = null
  }

  componentDidMount() {
    Analytics.setCurrentScreen('NotificationScreen')

    this.props.getActivityFeedVisited(this.props.user.userInfo.id)

    const { feedo } = this.props
    let { invitedFeedList, activityFeedList } = feedo

    invitedFeedList = _.orderBy(invitedFeedList, ['metadata.myLastActivityDate'], ['desc'])
    activityFeedList = _.orderBy(activityFeedList, ['activityTime'], ['desc'])

    this.setState({ invitedFeedList, activityFeedList })
    this.setActivityFeeds(activityFeedList, invitedFeedList)

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    Actions.pop()
    return true;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { feedo, card } = nextProps
    const { selectedActivity } = this.state

    if (this.props.feedo.loading !== 'DEL_ACTIVITY_FEED_FULFILLED' && feedo.loading === 'DEL_ACTIVITY_FEED_FULFILLED') {
      Analytics.logEvent('notification_delete_activity', {})
    }

    if ((this.props.feedo.loading !== 'GET_ACTIVITY_FEED_FULFILLED' && feedo.loading === 'GET_ACTIVITY_FEED_FULFILLED') ||
        (this.props.feedo.loading !== 'READ_ACTIVITY_FEED_FULFILLED' && feedo.loading === 'READ_ACTIVITY_FEED_FULFILLED') ||
        (this.props.feedo.loading !== 'DEL_ACTIVITY_FEED_FULFILLED' && feedo.loading === 'DEL_ACTIVITY_FEED_FULFILLED'))
    {
      let activityFeedList = _.orderBy(feedo.activityFeedList, ['activityTime'], ['desc'])
      this.setState({ refreshing: false, activityFeedList })
      this.setActivityFeeds(activityFeedList, this.state.invitedFeedList)
    }

    // If current scene is not NotificationScreen then bugger off
    // If !selectedActivity handles pubnub updates and other users making updates
    if(Actions.currentScene !== 'NotificationScreen' || _.isEmpty(selectedActivity)) {
        return;
    }

    // Set loading indicator when pending
    if(feedo.loading === 'GET_FEED_DETAIL_PENDING' || card.loading === 'GET_CARD_PENDING') {
      this.setState({loading: true})
    }

    if (feedo.loading === 'PUBNUB_GET_FEED_DETAIL_FULFILLED' && Actions.currentScene !== 'FeedDetailScreen' ||
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
      this.getActivityFeedList(0, feedo.activityData.page * PAGE_COUNT + feedo.activityData.numberOfElements)
    }

    if ((this.props.feedo.loading !== 'GET_INVITED_FEEDO_LIST_FULFILLED' && feedo.loading === 'GET_INVITED_FEEDO_LIST_FULFILLED') ||
        (this.props.feedo.loading !== 'SAVE_FLOW_PREFERENCE_FULFILLED' && feedo.loading === 'SAVE_FLOW_PREFERENCE_FULFILLED') ||
        (feedo.loading === 'GET_FEED_DETAIL_FULFILLED') ||
        (feedo.loading === 'PUBNUB_DELETE_FEED' &&
        Actions.currentScene !== 'FeedDetailScreen' && 
        Actions.currentScene !== 'CommentScreen' && Actions.currentScene !== 'ActivityCommentScreen' &&
        Actions.currentScene !== 'LikesListScreen' && Actions.currentScene !== 'ActivityLikesListScreen')
    ) {
      const invitedFeedList = _.orderBy(feedo.invitedFeedList, ['metadata.myLastActivityDate'], ['desc'])
      this.setState({ invitedFeedList })
      this.setActivityFeeds(this.state.activityFeedList, invitedFeedList)
    }

    if (feedo.loading === 'READ_ACTIVITY_FEED_FULFILLED') {
      if (!_.isEmpty(selectedActivity)) {
        Analytics.logEvent('notification_read_activity', {})
        switch (selectedActivity.activityTypeEnum) {
          case 'IDEA_LIKED':
          case 'COMMENT_ADDED':
          case 'USER_ACCESS_CHANGED':
          case 'USER_INVITED_TO_HUNT':
          case 'USER_JOINED_HUNT':
          case 'IDEA_ADDED':
          case 'HUNT_UPDATED':
          case 'IDEA_MOVED':
          case 'IDEA_UPDATED':
          case 'USER_MENTIONED':
            // We call get feed detail first as it might be deleted and we have to show an alert
            this.props.getFeedDetail(selectedActivity.metadata.HUNT_ID);
            break;
          case 'HUNT_DELETED':
            // Alert the flow has been deleted
            this.finishLoading()
            AlertController.shared.showAlert('Error', 'This flow no longer exists')
            break;
          case 'IDEA_DELETED':
            // Alert the card has been deleted
            this.finishLoading()
            AlertController.shared.showAlert('Error', 'This card no longer exists')
            break;
          default:
            this.finishLoading()
            break;
        }
      }
    }

    if (this.props.feedo.loading !== 'GET_FEED_DETAIL_FULFILLED' && feedo.loading === 'GET_FEED_DETAIL_FULFILLED') {
      this.prevFeedo = feedo.currentFeed;
      if (!_.isEmpty(selectedActivity)) {
        switch (selectedActivity.activityTypeEnum) {
          // Go to the flow
          case 'USER_ACCESS_CHANGED':
          case 'USER_INVITED_TO_HUNT':
          case 'USER_JOINED_HUNT':
          case 'HUNT_UPDATED':
            Actions.FeedDetailScreen({ data: { id: selectedActivity.metadata.HUNT_ID }, prevPage: 'activity' })
            this.finishLoading()
            break;
          // Get the card
          case 'IDEA_LIKED':
          case 'COMMENT_ADDED':
          case 'IDEA_ADDED':
          case 'IDEA_MOVED':
          case 'IDEA_UPDATED':
          case 'USER_MENTIONED':
            // Check the card is in this Flow, it may no longer exist or have been moved
            const cardExists = _.find(feedo.currentFeed.ideas, (i) => {
              return (i.id === selectedActivity.metadata.IDEA_ID)
            })

            if (!cardExists) {
              this.finishLoading()
              AlertController.shared.showAlert('Error', 'This card no longer exists')
            }
            else {
              this.props.getCard(selectedActivity.metadata.IDEA_ID);
            }

            break;
          default:
            this.finishLoading()
            break;
        }
      }
    }

    if (this.props.card.loading !== 'GET_CARD_FULFILLED' && card.loading === 'GET_CARD_FULFILLED') {
      switch (selectedActivity.activityTypeEnum) {
        case 'COMMENT_ADDED':
        case 'USER_MENTIONED':
          this.onSelectNewComment(selectedActivity)
          this.finishLoading()
          break;
        // Get the card
        case 'IDEA_LIKED':
        case 'IDEA_ADDED':
        case 'IDEA_MOVED':
        case 'IDEA_UPDATED':
          this.finishLoading()

          const { currentFeed } = feedo

          if (!this.state.isVisibleCard) {
            const invitee = _.find(currentFeed.invitees, (o) => {
              return (o.id === card.currentCard.inviteeId)
            })

            if(invitee) {
              this.setState({ selectedIdeaInvitee: invitee }, () => {
                this.onSelectNewCard(card.currentCard)
              })
            }
            else {
              AlertController.shared.showAlert('Error', 'This card no longer exists')
            }
          }
          break;
      }
    }

    if (this.props.feedo.loading !== 'UPDATE_FEED_INVITATION_FULFILLED' && feedo.loading === 'UPDATE_FEED_INVITATION_FULFILLED') {
        let invitedFeedList = _.orderBy(feedo.invitedFeedList, ['metadata.myLastActivityDate'], ['desc'])
        this.setState({ invitedFeedList, isShowInviteToaster: true })
        this.setActivityFeeds(this.state.activityFeedList, invitedFeedList)
        
        if (feedo.inviteUpdateType) {
          this.setState({ inviteToasterTitle: 'Invitation accepted' })
        } else {
          this.setState({ inviteToasterTitle: 'Invitation ignored' })
        }
        setTimeout(() => {
          this.setState({ isShowInviteToaster: false })
        }, TOASTER_DURATION)
    }

    // Handle rejections
    if(feedo.loading === 'READ_ACTIVITY_FEED_REJECTED') {
      this.finishLoading()
    }

    if (feedo.loading === 'GET_FEED_DETAIL_REJECTED') {
      // Error alert handled in HomeScreen
      this.finishLoading()
    }

    if (this.props.card.loading !== 'GET_CARD_REJECTED' && card.loading === 'GET_CARD_REJECTED') {
      this.finishLoading()

      if (card.error.code === 'error.idea.not.found') {
        AlertController.shared.showAlert('Error', 'This card no longer exists')
      }
    }

  }

  startLoading() {
    this.setState({loading: true})
  }

  finishLoading() {
    this.setState({loading: false, selectedActivity: {}})
  }

  getActivityFeedList = (page, size) => {
    const param = { page, size }
    this.props.getActivityFeed(this.props.user.userInfo.id, param)
  }

  setActivityFeeds = (activityFeedList, invitedFeedList) => {
    let notificationList = [
      ...invitedFeedList,
      ...activityFeedList
    ]
    this.setState({ notificationList })
  }

  renderInvitedFeedItem = (data) => {
    return (
      <View style={styles.itemView}>
        <NotificationItemComponent data={data} avatarSize={58} />
      </View>
    )
  }

  onDeleteActivity = (data) => {
    this.props.deleteActivityFeed(this.props.user.userInfo.id, data.id)
  }

  onReadActivity = (data) => {
    this.setState({
      selectedActivity: data
    }, () => {
    // If not read then call API, otherwise dummy call
      if (!data.read) {
        this.setState({loading: true})
        this.props.readActivityFeed(this.props.user.userInfo.id, data.id)
      } else {
        this.props.alreadyReadActivityFeed(data.id)
      }
    })
  }

  get renderDeleteComponent() {
    return (
      <View style={styles.swipeItemContainer}>
        <FontAwesome name='trash' size={25} color='#fff' />
      </View>
    );
  }

  renderActivityFeedItem = (data) => {
    let swipeoutBtns = []

    swipeoutBtns = [
      {
        component: this.renderDeleteComponent,
        backgroundColor: COLORS.DARK_RED,
        onPress: () => this.onDeleteActivity(data),
      }
    ];

    return (
      <View style={[styles.activityItem, data.read === true && { backgroundColor: '#fff' }]}>
        <Swipeout
          style={styles.itemContainer}
          autoClose={true}
          right={swipeoutBtns}
        > 
          <ActivityFeedComponent user={this.props.user} data={data} onReadActivity={() => this.onReadActivity(data)} />
        </Swipeout>
      </View>
    );
  }

  // Move to comment screen
  onSelectNewComment(data) {
    Actions.ActivityCommentScreen({
      idea: { id: data.metadata.IDEA_ID },
      prevPage: 'activity'
    });
  }

  // Move to idea detail screen
  onSelectNewCard(idea) {
    const { feedo } = this.props

    let cardViewMode = CONSTANTS.CARD_VIEW;
    if (COMMON_FUNC.isFeedOwner(feedo.currentFeed) || COMMON_FUNC.isFeedEditor(feedo.currentFeed)) {
      cardViewMode = CONSTANTS.CARD_EDIT;
    }

    // Contributor can just edit own cards
    if (COMMON_FUNC.isFeedContributor(feedo.currentFeed) && COMMON_FUNC.isCardOwner(idea)) {
      cardViewMode = CONSTANTS.CARD_EDIT;
    }

    this.setState({
      isVisibleCard: true,
      cardViewMode
    }, () => {
      this.animatedOpacity.setValue(0);
      Animated.timing(this.animatedOpacity, {
        toValue: 1,
        duration: CONSTANTS.ANIMATEION_MILLI_SECONDS
      }).start();
    })
  }

  handleRefresh = () => {
    this.setState({ refreshing: true }, () => {
      this.props.getInvitedFeedList()
      this.getActivityFeedList(0, PAGE_COUNT)
    })
  }

  handleLoadMore = () => {
    const { activityData } = this.props.feedo

    if (activityData.last === false && !this.state.loading) {
      this.setState({ loading: true }, () => {
        setTimeout(() => {
          this.getActivityFeedList(activityData.page + 1, PAGE_COUNT)
        }, 1000)
      })
    }
  }

  renderItem({ item }) {
    if (item.hasOwnProperty('activityTypeEnum')) {
      return this.renderActivityFeedItem(item)
    } else {
      return this.renderInvitedFeedItem(item)
    }
  }

  renderFooter = () => {
    if (!this.state.loading) return null

    return (
      <View style={styles.footerView}>
        <ActivityIndicator animating size='large' color={COLORS.PURPLE} />
      </View>
    )
  }

  renderSeparator = () => (
    <View style={styles.separator} /> 
  )
  
  render () {
    const { notificationList, loading } = this.state

    return (
      <View style={styles.container}>
        <SafeAreaView style={{ flex: 1 }}>
          {this.renderHeader}

          {notificationList.length > 0
          ? <FlatList
              style={styles.flatList}
              contentContainerStyle={styles.contentFlatList}
              data={notificationList}
              keyExtractor={item => item.id}
              automaticallyAdjustContentInsets={true}
              renderItem={this.renderItem.bind(this)}
              // ItemSeparatorComponent={this.renderSeparator}
              ListFooterComponent={this.renderFooter}
              refreshControl={
                <RefreshControl 
                  refreshing={this.state.refreshing}
                  onRefresh={this.handleRefresh}
                  tintColor={COLORS.PURPLE}
                />
              }
              onEndReached={this.handleLoadMore}
              onEndReachedThreshold={0}
            />
          : <View style={styles.emptyView}>
              <Image
                source={NOTIFICATION_EMPTY_ICON}
              />
              <Text style={styles.title}>It's pretty lonely here</Text>
              <Text style={styles.subTitle}>Invite a friend to your flows and </Text>
              <Text style={styles.subTitle}>you'll see their activity here 👇.</Text>
            </View>
          }

          {loading && <LoadingScreen />}

          {this.renderCardDetailModal}

          {this.renderSelectHunt}

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

        </SafeAreaView>
      </View>
    )
  }

  processCardActions() {
    if (this.userActionTimer) {
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
        Analytics.logEvent('notification_delete_card', {})
        this.props.deleteCard(currentCardInfo.ideaId)
      } else if (this.state.currentActionType === ACTION_CARD_MOVE) {
        Analytics.logEvent('notification_move_card', {})
        this.props.moveCard(currentCardInfo.ideaId, currentCardInfo.feedoId);
      }
      this.userActionTimer = null;
      this.userActions.shift();
      this.processCardActions();
    }, TOASTER_DURATION + 5);
  }

  undoAction = () => {
    if (this.state.currentActionType === ACTION_CARD_DELETE || this.state.currentActionType === ACTION_CARD_MOVE) {
      clearTimeout(this.userActionTimer);
      this.userActionTimer = null;
      this.userActions.shift();
  
      this.processCardActions();
      return;
    }

    this.setState({
      isShowToaster: false, 
      currentActionType: ACTION_NONE,
    })
  }

  onDeleteCard = (ideaId) => {
    this.onCloseCardModal();
    this.setState({
      isShowToaster: true
    });

    const cardInfo = {};
    cardInfo.currentActionType = ACTION_CARD_DELETE;
    cardInfo.toasterTitle = 'Card deleted';
    cardInfo.ideaId = ideaId;
    this.userActions.push(cardInfo);

    this.processCardActions();
  }

  onMoveCard = (ideaId) => {
    this.setState({ 
      currentActionType: ACTION_CARD_MOVE,
    });
    this.moveCardId = ideaId;
  }

  onSelectFeedoToMoveCard(feedoId) {
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

  get renderSelectHunt() {
    if (this.state.isVisibleSelectFeedo) {
      return (
        <View style={[styles.modalContainer, {backgroundColor: 'transparent'}]}>
          <SelectHuntScreen
            selectMode={CONSTANTS.FEEDO_SELECT_FROM_MOVE_CARD}
            hiddenFeedoId={this.prevFeedo.id}
            direction='top'
            onClosed={() => this.onCloseSelectFeedoModal()}
          />
        </View>
      );
    }
  }

  onHiddenLongHoldMenu() {
    if (this.state.currentActionType === ACTION_CARD_MOVE) {
      this.setState({
        isVisibleSelectFeedo: true,
      });
    }
  }

  onCloseCardModal() {
    this.animatedOpacity.setValue(1);
    Animated.timing(this.animatedOpacity, {
      toValue: 0,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS + 300,
    }).start(() => {
      this.setState({ 
        isVisibleCard: false,
        cardViewMode: CONSTANTS.CARD_NONE,
      });
    });
  }

  get renderCardDetailModal() {
    if (!this.state.isVisibleCard) {
      return;
    }

    const cardTextLayout = {textPointX: 0, textPointY: CONSTANTS.SCREEN_HEIGHT, textWidth: CONSTANTS.SCREEN_WIDTH, textHeight: CONSTANTS.SCREEN_WIDTH}
    const cardImageLayout = {px: 0, py: CONSTANTS.SCREEN_HEIGHT, imgWidth: CONSTANTS.SCREEN_WIDTH, imgHeight: CONSTANTS.SCREEN_WIDTH}

    const transformY = this.animatedOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: [CONSTANTS.SCREEN_HEIGHT, 0]
    })

    return (
      <Animated.View 
        style={[
          styles.modalContainer,
          { top: transformY }
        ]}
      >
        {
          <CardDetailScreen
            prevPage="activity"
            viewMode={this.state.cardViewMode}
            invitee={this.state.selectedIdeaInvitee}
            shareUrl=""
            onClose={() => this.onCloseCardModal()}
            onMoveCard={this.onMoveCard}
            onDeleteCard={this.onDeleteCard}
            cardImageLayout={cardImageLayout}
            cardTextLayout={cardTextLayout}
            isFromNotification
          />
        }
      </Animated.View>
    );
  }
}

const mapStateToProps = ({ feedo, user, card }) => ({
  feedo,
  user,
  card
})

const mapDispatchToProps = dispatch => ({
  getActivityFeed: (userId, param) => dispatch(getActivityFeed(userId, param)),
  readAllActivityFeed: (userId) => dispatch(readAllActivityFeed(userId)),
  readActivityFeed: (userId, activityId) => dispatch(readActivityFeed(userId, activityId)),
  alreadyReadActivityFeed: (activityId) => dispatch(alreadyReadActivityFeed(activityId)),
  deleteActivityFeed: (userId, activityId) => dispatch(deleteActivityFeed(userId, activityId)),
  getFeedDetail: (feedId) => dispatch(getFeedDetail(feedId)),
  getCard: (ideaId) => dispatch(getCard(ideaId)),
  moveCard: (ideaId, huntId) => dispatch(moveCard(ideaId, huntId)),
  deleteCard: (ideaId) => dispatch(deleteCard(ideaId)),
  setCurrentFeed: (data) => dispatch(setCurrentFeed(data)),
  getInvitedFeedList: () => dispatch(getInvitedFeedList()),
  getActivityFeedVisited: (userId) => dispatch(getActivityFeedVisited(userId)),
})

NotificationScreen.propTypes = {
  feedo: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any),
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationScreen)

