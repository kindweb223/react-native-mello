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
  Alert
} from 'react-native'

import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import PropTypes from 'prop-types'
import Swipeout from 'react-native-swipeout'
import _ from 'lodash'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Modal from "react-native-modal"
import ActionSheet from 'react-native-actionsheet'

import LoadingScreen from '../LoadingScreen'
import Analytics from '../../lib/firebase'
import NotificationItemComponent from '../../components/NotificationItemComponent'
import ActivityFeedComponent from '../../components/ActivityFeedComponent'
import NewCardScreen from '../NewCardScreen'
import CardControlMenuComponent from '../../components/CardControlMenuComponent'
import SelectHuntScreen from '../SelectHuntScreen';
import ToasterComponent from '../../components/ToasterComponent'

import {
  getFeedDetail,
  getActivityFeed,
  readActivityFeed,
  deleteActivityFeed,
  readAllActivityFeed,
  setCurrentFeed
} from '../../redux/feedo/actions'
import {
  getCard,
  moveCard,
  deleteCard
} from '../../redux/card/actions'

import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import styles from './styles'

const CLOSE_ICON = require('../../../assets/images/Close/Blue.png')

const PAGE_COUNT = 10

const TOASTER_DURATION = 5000

const ACTION_NONE = 0;
const ACTION_FEEDO_PIN = 1;
const ACTION_FEEDO_UNPIN = 2;
const ACTION_FEEDO_DUPLICATE = 3;
const ACTION_CARD_MOVE = 4;
const ACTION_CARD_EDIT = 5;
const ACTION_CARD_DELETE = 6;

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
      isVisibleCardOpenMenu: false,
      selectedLongHoldIdea: {},
      isShowToaster: false,
      isVisibleSelectFeedo: false,
      apiLoading: false
    };
    this.animatedOpacity = new Animated.Value(0)
    this.userActions = []
    this.userActionTimer = null
    this.prevFeedo = null
  }

  componentDidMount() {
    Analytics.setCurrentScreen('NotificationScreen')

    const { feedo } = this.props
    let { invitedFeedList, activityFeedList } = feedo

    invitedFeedList = _.orderBy(invitedFeedList, ['publishedDate'], ['desc'])
    activityFeedList = _.orderBy(activityFeedList, ['activityTime'], ['desc'])

    this.setState({ invitedFeedList, activityFeedList })
    this.setActivityFeeds(activityFeedList, invitedFeedList)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { feedo, card } = nextProps
    const { selectedActivity } = this.state

    if ((this.props.feedo.loading !== 'GET_INVITED_FEEDO_LIST_FULFILLED' && feedo.loading === 'GET_INVITED_FEEDO_LIST_FULFILLED') ||
        (feedo.loading === 'PUBNUB_DELETE_FEED')) {
      const invitedFeedList = _.orderBy(feedo.invitedFeedList, ['publishedDate'], ['desc'])
      this.setState({ invitedFeedList })
      this.setActivityFeeds(this.state.activityFeedList, invitedFeedList)
    }

    if (this.props.feedo.loading !== 'READ_ACTIVITY_FEED_FULFILLED' && feedo.loading === 'READ_ACTIVITY_FEED_FULFILLED') {
      if (!_.isEmpty(selectedActivity)) {
        Analytics.logEvent('notification_read_activity', {})
        if (selectedActivity.activityTypeEnum === 'NEW_IDEA_ADDED' || selectedActivity.activityTypeEnum === 'USER_EDITED_IDEA') {
          this.props.getFeedDetail(selectedActivity.metadata.HUNT_ID)
        } else if (selectedActivity.activityTypeEnum === 'NEW_COMMENT_ON_IDEA') {
          this.onSelectNewComment(selectedActivity)
        }
      }
    }

    if (this.props.feedo.loading !== 'DEL_ACTIVITY_FEED_FULFILLED' && feedo.loading === 'DEL_ACTIVITY_FEED_FULFILLED') {
      Analytics.logEvent('notification_delete_activity', {})
    }

    if (this.props.feedo.loading !== 'GET_FEED_DETAIL_FULFILLED' && feedo.loading === 'GET_FEED_DETAIL_FULFILLED') {
      this.prevFeedo = feedo.currentFeed;
      if (!_.isEmpty(selectedActivity)) {
        const ideaIndex = _.findIndex(feedo.currentFeed.ideas, idea => idea.id === selectedActivity.metadata.IDEA_ID)
        if (ideaIndex !== -1) {
          this.props.getCard(selectedActivity.metadata.IDEA_ID)
        }
      }
    }

    if (this.props.card.loading !== 'GET_CARD_FULFILLED' && card.loading === 'GET_CARD_FULFILLED') {
      const { currentFeed } = feedo
      const invitee = _.find(currentFeed.invitees, (o) => {
        return (o.userProfile.id === selectedActivity.instigatorId)
      })

      this.setState({ selectedIdeaInvitee: invitee }, () => {
        this.onSelectNewCard()
      })
    }

    if (this.props.card.loading !== 'GET_CARD_REJECTED' && card.loading === 'GET_CARD_REJECTED') {
      if (card.error.code === 'error.idea.not.found') {
        Alert.alert('Error', card.error.message)
      }
    }

    if ((this.props.feedo.loading !== 'GET_ACTIVITY_FEED_FULFILLED' && feedo.loading === 'GET_ACTIVITY_FEED_FULFILLED') ||
        (this.props.feedo.loading !== 'READ_ACTIVITY_FEED_FULFILLED' && feedo.loading === 'READ_ACTIVITY_FEED_FULFILLED') ||
        (this.props.feedo.loading !== 'DEL_ACTIVITY_FEED_FULFILLED' && feedo.loading === 'DEL_ACTIVITY_FEED_FULFILLED'))
    {
      let activityFeedList = _.orderBy(feedo.activityFeedList, ['activityTime'], ['desc'])
      this.setState({ refreshing: false, loading: false, activityFeedList })
      this.setActivityFeeds(activityFeedList, this.state.invitedFeedList)
    }

    if (this.props.feedo.loading === 'UPDTE_FEED_INVITATION_PENDING' && feedo.loading === 'UPDTE_FEED_INVITATION_FULFILLED') {
        let invitedFeedList = _.orderBy(feedo.invitedFeedList, ['publishedDate'], ['desc'])
        this.setState({ invitedFeedList })
        this.setActivityFeeds(this.state.activityFeedList, invitedFeedList)
    }
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
        <NotificationItemComponent data={data} />
      </View>
    )
  }

  onDeleteActivity = (data) => {
    this.props.deleteActivityFeed(this.props.user.userInfo.id, data.id)
  }

  onReadActivity = (data) => {
    this.setState({ selectedActivity: data })
    this.props.readActivityFeed(this.props.user.userInfo.id, data.id)
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
      <View style={styles.activityItem}>
        <Swipeout
          style={styles.itemContainer}
          autoClose={true}
          right={swipeoutBtns}
        > 
          <ActivityFeedComponent data={data} onReadActivity={() => this.onReadActivity(data)} />
        </Swipeout>
      </View>
    );
  }

  // Move to comment screen
  onSelectNewComment(data) {
    Actions.ActivityCommentScreen({
      idea: { id: data.metadata.IDEA_ID },
      prevPage: 'activity',
      instigatorData: {
        id: data.instigatorId,
        firstName: data.instigatorFirstName,
        lastName: data.instigatorLastName,
        imageUrl: data.instigatorPic
      }
    });
  }

  // Move to idea detail screen
  onSelectNewCard() {
    let cardViewMode = CONSTANTS.CARD_EDIT

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
    const { notificationList } = this.state

    return (
      <View style={styles.container}>
        <SafeAreaView style={{ flex: 1 }}>
          {this.renderHeader}

          <FlatList
            style={styles.flatList}
            contentContainerStyle={styles.contentFlatList}
            data={notificationList}
            keyExtractor={item => item.id}
            automaticallyAdjustContentInsets={true}
            renderItem={this.renderItem.bind(this)}
            ItemSeparatorComponent={this.renderSeparator}
            ListFooterComponent={this.renderFooter}
            refreshControl={
              <RefreshControl 
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
                tintColor={COLORS.PURPLE}
                size="large"
              />
            }
            onEndReached={this.handleLoadMore}
            onEndReachedThreshold={0}
          />

          {this.renderCardDetailModal}

          {this.renderSelectHunt}

          <Modal 
            isVisible={this.state.isVisibleCardOpenMenu}
            style={{ margin: 0 }}
            backdropColor='#fff'
            backdropOpacity={0}
            animationIn="fadeIn"
            animationOut="fadeOut"
            animationInTiming={500}
            onModalHide={this.onHiddenLongHoldMenu.bind(this)}
            onBackdropPress={() => this.setState({ isVisibleCardOpenMenu: false })}
          >
            <Animated.View style={styles.settingMenuView}>
              <CardControlMenuComponent 
                onMove={() => this.onMoveCard(this.state.selectedActivity.metadata.IDEA_ID)}
                onDelete={() => this.onConfirmDeleteCard()}
              />
            </Animated.View>
          </Modal>

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

      this.setState((state) => { 
        let filterIdeas = this.props.feedo.currentFeed.ideas;
        for(let i = 0; i < this.userActions.length; i ++) {
          const cardInfo = this.userActions[i];
          filterIdeas = _.filter(filterIdeas, idea => idea.id !== cardInfo.ideaId)
        }
        state.currentFeed.ideas = filterIdeas;
        return state;
      })
  
      this.processCardActions();
      return;
    }

    this.setState({
      isShowToaster: false, 
      currentActionType: ACTION_NONE,
    })
  }

  onTapCardActionSheet(index) {
    if (index === 0) {
      this.onDeleteCard(this.state.selectedActivity.metadata.IDEA_ID)
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

  onDeleteCard(ideaId) {
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

  onMoveCard(ideaId) {
    this.setState({ 
      isVisibleCardOpenMenu: false,
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
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
    }).start(() => {
      this.setState({ 
        isVisibleCard: false,
        cardViewMode: CONSTANTS.CARD_NONE,
      });
    });
  }

  onOpenCardAction(idea) {
    this.setState({
      isVisibleCardOpenMenu: true,
      selectedLongHoldIdea: idea,
    })
  }

  get renderCardDetailModal() {
    if (!this.state.isVisibleCard) {
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
          <NewCardScreen
            prevPage="activity"
            viewMode={this.state.cardViewMode}
            invitee={this.state.selectedIdeaInvitee}
            shareUrl=""
            onClose={() => this.onCloseCardModal()}
            onOpenAction={(idea) => this.onOpenCardAction(idea)}
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
  deleteActivityFeed: (userId, activityId) => dispatch(deleteActivityFeed(userId, activityId)),
  getFeedDetail: (feedId) => dispatch(getFeedDetail(feedId)),
  getCard: (ideaId) => dispatch(getCard(ideaId)),
  moveCard: (ideaId, huntId) => dispatch(moveCard(ideaId, huntId)),
  deleteCard: (ideaId) => dispatch(deleteCard(ideaId)),
  setCurrentFeed: (data) => dispatch(setCurrentFeed(data))
})

NotificationScreen.propTypes = {
  feedo: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any),
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationScreen)

