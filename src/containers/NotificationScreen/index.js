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
  Animated
} from 'react-native'

import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import PropTypes from 'prop-types'
import Swipeout from 'react-native-swipeout'
import _ from 'lodash'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import LoadingScreen from '../LoadingScreen'

import Analytics from '../../lib/firebase'
import NotificationItemComponent from '../../components/NotificationItemComponent'
import ActivityFeedComponent from '../../components/ActivityFeedComponent'
import NewCardScreen from '../NewCardScreen'

import {
  getFeedDetail,
  getActivityFeed,
  readActivityFeed,
  deleteActivityFeed,
  readAllActivityFeed
} from '../../redux/feedo/actions'
import {
  getCard
} from '../../redux/card/actions'

import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import styles from './styles'

const CLOSE_ICON = require('../../../assets/images/Close/Blue.png')

const PAGE_COUNT = 5

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
      initialLoading: false,
      loading: false,
      invitedFeedList: [],
      activityFeedList: [],
      notificationList: [],
      selectedActivity: {},
      isVisibleCard: false,
      cardViewMode: CONSTANTS.CARD_NONE
    };
    this.animatedOpacity = new Animated.Value(0)
  }

  componentDidMount() {
    Analytics.setCurrentScreen('NotificationScreen')

    const { feedo } = this.props

    this.setState({ initialLoading: true })
    this.getActivityFeedList(0, PAGE_COUNT)

    let { invitedFeedList } = feedo
    invitedFeedList = _.orderBy(
      invitedFeedList,
      ['publishedDate'],
      ['desc']
    )
    this.setState({ invitedFeedList, notificationList: invitedFeedList })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { feedo, card } = nextProps
    const { selectedActivity } = this.state

    if (this.props.feedo.loading !== 'READ_ACTIVITY_FEED_FULFILLED' && feedo.loading === 'READ_ACTIVITY_FEED_FULFILLED') {
      if (!_.isEmpty(selectedActivity)) {
        console.log('SELECTED_ACTIVITY: ', selectedActivity)
        if (selectedActivity.activityTypeEnum === 'NEW_IDEA_ADDED' || selectedActivity.activityTypeEnum === 'USER_EDITED_IDEA') {
          this.props.getFeedDetail(selectedActivity.metadata.HUNT_ID)
        } else if (selectedActivity.activityTypeEnum === 'NEW_COMMENT_ON_IDEA') {
          this.onSelectNewComment(selectedActivity)
        }
      }
    }

    if (this.props.feedo.loading !== 'GET_FEED_DETAIL_FULFILLED' && feedo.loading === 'GET_FEED_DETAIL_FULFILLED') {
      this.props.getCard(selectedActivity.metadata.IDEA_ID)
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

    if ((this.props.feedo.loading !== 'GET_ACTIVITY_FEED_FULFILLED' && feedo.loading === 'GET_ACTIVITY_FEED_FULFILLED') ||
        (this.props.feedo.loading !== 'READ_ACTIVITY_FEED_FULFILLED' && feedo.loading === 'READ_ACTIVITY_FEED_FULFILLED') ||
        (this.props.feedo.loading !== 'DEL_ACTIVITY_FEED_FULFILLED' && feedo.loading === 'DEL_ACTIVITY_FEED_FULFILLED')) {
      if (this.state.initialLoading) {
        this.setState({ initialLoading: false })
      }
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

  handleRefresh = () => {
    this.setState({ refreshing: true }, () => {
      this.getActivityFeedList(0, PAGE_COUNT)
    })
  }

  handleLoadMore = () => {
    const { activityData } = this.props.feedo

    if (activityData.last === false && (!this.state.loading && !this.state.initalLoading)) {
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
    const { notificationList, initialLoading } = this.state

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
            onEndReached={() => this.handleLoadMore()}
            onEndReachedThreshold={0}
          />

          {initialLoading && <LoadingScreen />}

          {this.renderCardDetailModal}
        </SafeAreaView>
      </View>
    )
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
            onOpenAction={(idea) => {}}
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
  getCard: (ideaId) => dispatch(getCard(ideaId))
})

NotificationScreen.propTypes = {
  feedo: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any),
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationScreen)

