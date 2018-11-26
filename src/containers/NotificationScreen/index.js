/* global require */
import React from 'react'
import {
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

import Analytics from '../../lib/firebase'
import NotificationItemComponent from '../../components/NotificationItemComponent'
import ActivityFeedComponent from '../../components/ActivityFeedComponent'
import NewCardScreen from '../NewCardScreen'

import {
  getActivityFeed,
  readActivityFeed,
  deleteActivityFeed,
  readAllActivityFeed
} from '../../redux/feedo/actions'

import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import styles from './styles'

const CLOSE_ICON = require('../../../assets/images/Close/Blue.png')

class NotificationScreen extends React.Component {
  static renderLeftButton(props) {
    return (
      <TouchableOpacity activeOpacity={0.6} onPress={() => Actions.pop()} style={styles.buttonWrapper}>
        <Image source={CLOSE_ICON} />
      </TouchableOpacity>
    );
  }

  static renderTitle() {
    return (
      <Text style={styles.textTitle}>Notifications</Text>
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      loading: false,
      invitedFeedList: [],
      notificationList: [],
      selectedActivity: {},
      count: 10,
      isVisibleCard: false,
      cardViewMode: CONSTANTS.CARD_NONE
    };
    this.animatedOpacity = new Animated.Value(0)
  }

  componentDidMount() {
    Analytics.setCurrentScreen('NotificationScreen')

    const { feedo } = this.props

    this.getActivityFeedList(0, this.state.count)

    let { invitedFeedList } = feedo
    invitedFeedList = _.orderBy(
      invitedFeedList,
      ['publishedDate'],
      ['desc']
    )
    this.setState({ invitedFeedList, notificationList: invitedFeedList })
  }

  getActivityFeedList = (page, size) => {
    const param = { page, size }
    this.props.getActivityFeed(this.props.user.userInfo.id, param)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { feedo } = nextProps
    const { invitedFeedList, selectedActivity } = this.state

    if (this.props.feedo.loading !== 'READ_ACTIVITY_FEED_FULFILLED' && feedo.loading === 'READ_ACTIVITY_FEED_FULFILLED') {
      if (!_.isEmpty(selectedActivity)) {
        console.log('selectedActivity.activityTypeEnum: ', selectedActivity.activityTypeEnum)
        if(selectedActivity.activityTypeEnum === 'NEW_IDEA_ADDED') {
          // this.onSelectNewCard(selectedActivity)
        } else if (selectedActivity.activityTypeEnum === 'NEW_COMMENT_ON_IDEA') {
          this.onSelectNewComment(selectedActivity)
        }
      }
    }

    if ((this.props.feedo.loading !== 'GET_ACTIVITY_FEED_FULFILLED' && feedo.loading === 'GET_ACTIVITY_FEED_FULFILLED') ||
        (this.props.feedo.loading !== 'READ_ACTIVITY_FEED_FULFILLED' && feedo.loading === 'READ_ACTIVITY_FEED_FULFILLED') ||
        (this.props.feedo.loading !== 'DEL_ACTIVITY_FEED_FULFILLED' && feedo.loading === 'DEL_ACTIVITY_FEED_FULFILLED')) {
      let { activityFeedList } = feedo
      activityFeedList = _.orderBy(activityFeedList, ['activityTime'], ['asc'])

      let notificationList = [
        ...invitedFeedList,
        ...activityFeedList
      ]
      this.setState({ refreshing: false, loading: false, notificationList })
    }

    if (this.props.feedo.loading === 'UPDTE_FEED_INVITATION_PENDING' && feedo.loading === 'UPDTE_FEED_INVITATION_FULFILLED') {
        let { invitedFeedList } = feedo
        invitedFeedList = _.orderBy(
          invitedFeedList,
          ['publishedDate'],
          ['desc']
        )
        this.setState({ invitedFeedList })
    }
  }

  renderInvitedFeedItem = (data) => {
    return (
      <View style={styles.itemView}>
        <NotificationItemComponent data={data} />

        {this.state.invitedFeedList.length > 0 && (
          <View style={[styles.separator, { marginTop: 14 }]} />
        )}
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
    console.log('handleRefresh !!!!')
    this.setState({ refreshing: true }, () => {
      this.getActivityFeedList(0, this.state.count)
    })
  }

  handleLoadMore = () => {
    const { feedo } = this.props
    if (!this.state.loading) {
      console.log('handleLoadMore !!!!')
      this.setState({ loading: true }, () => {
        setTimeout(() => {
          this.getActivityFeedList(feedo.activityData.page, this.state.count)
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
  
  render () {
    const { notificationList } = this.state

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.flatList}
          contentContainerStyle={styles.contentFlatList}
          data={notificationList}
          keyExtractor={item => item.id}
          automaticallyAdjustContentInsets={true}
          renderItem={this.renderItem.bind(this)}
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
      </View>
    )
  }

  // Move to comment screen
  onSelectNewCommnet(data) {
    // Actions.CommentScreen({
    //   idea
    // });
  }

  // Move to idea detail screen
  onSelectNewCard(data) {
    // let cardViewMode = CONSTANTS.CARD_EDIT

    // this.setState({
    //   isVisibleCard: true,
    //   cardViewMode
    // }, () => {
    //   this.animatedOpacity.setValue(0);
    //   Animated.timing(this.animatedOpacity, {
    //     toValue: 1,
    //     duration: CONSTANTS.ANIMATEION_MILLI_SECONDS
    //   }).start();
    // })
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
            viewMode={this.state.cardViewMode}
            shareUrl=""
            onClose={() => this.onCloseCardModal()}
            onOpenAction={(idea) => {}}
          />
        }
      </Animated.View>
    );
  }
}

const mapStateToProps = ({ feedo, user }) => ({
  feedo,
  user
})

const mapDispatchToProps = dispatch => ({
  getActivityFeed: (userId, param) => dispatch(getActivityFeed(userId, param)),
  readAllActivityFeed: (userId) => dispatch(readAllActivityFeed(userId)),
  readActivityFeed: (userId, activityId) => dispatch(readActivityFeed(userId, activityId)),
  deleteActivityFeed: (userId, activityId) => dispatch(deleteActivityFeed(userId, activityId))
})

NotificationScreen.propTypes = {
  feedo: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any),
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationScreen)

