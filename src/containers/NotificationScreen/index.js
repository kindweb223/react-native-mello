/* global require */
import React from 'react'
import {
  ScrollView,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Image
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

import {
  getActivityFeed,
  readActivityFeed,
  readAllActivityFeed
} from '../../redux/feedo/actions'

import COLORS from '../../service/colors'
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
      invitedFeedList: [],
      activityFeedList: [
        {
          "id": "1743b262d-3b0f-4385-a0fb-0887622e37f7",
          "activityTypeEnum": "USER_ACCESS_CHANGED",
          "instigatorId": "0080d859-fb9c-495d-a05a-8ca3899c0601",
          "instigatorName": "Kirk",
          "instigatorPic": "/url/for/profilePic.jpg",
          "activityTime": "2018-11-19T12:11:30.643Z",
          "read": "true",
          "metadata": {
            "HUNT_ID": "0080d859-fb9c-495d-a05a-8ca3899c0603",
            "HUNT_HEADLINE": "Your Favourites",
            "INVITEE_USER_PROFILE_ID": "0080d859-fb9c-495d-a05a-8ca3899c0605",
            "INVITEE_NAME": "Eamon Doyle",
            "NEW_PERMISSIONS": "EDIT"
          }
        },
        {
          "id": "2743b262d-3b0f-4385-a0fb-0887622e37f7",
          "activityTypeEnum": "USER_JOINED_HUNT",
          "instigatorId": "0080d859-fb9c-495d-a05a-8ca3899c0601",
          "instigatorName": "Kirk",
          "instigatorPic": "/url/for/profilePic.jpg",
          "activityTime": "2018-11-19T12:11:29.643Z",
          "read": "true",
          "metadata": {
            "HUNT_ID": "0080d859-fb9c-495d-a05a-8ca3899c0603",
            "HUNT_HEADLINE": "Your Favourites"
          }
        },
        {
          "id": "3743b262d-3b0f-4385-a0fb-0887622e37f7",
          "activityTypeEnum": "NEW_IDEA_ADDED",
          "instigatorId": "0080d859-fb9c-495d-a05a-8ca3899c0601",
          "instigatorName": "Kirk",
          "instigatorPic": "/url/for/profilePic.jpg",
          "activityTime": "2018-11-19T12:11:27.643Z",
          "read": "false",
          "metadata": {
            "HUNT_ID": "0080d859-fb9c-495d-a05a-8ca3899c0603",
            "HUNT_HEADLINE": "Your Favourites",
            "IDEA_ID": "36058fdc-666c-4fdc-be2b-c74e4f60a361",
            "IDEA_PREVIEW": "This is my favourite..."
          }
        },
        {
          "id": "4743b262d-3b0f-4385-a0fb-0887622e37f7",
          "activityTypeEnum": "USER_EDITED_HUNT",
          "instigatorId": "0080d859-fb9c-495d-a05a-8ca3899c0601",
          "instigatorName": "Kirk",
          "instigatorPic": "/url/for/profilePic.jpg",
          "activityTime": "2018-11-19T12:11:26.643Z",
          "read": "false",
          "metadata": {
            "HUNT_ID": "0080d859-fb9c-495d-a05a-8ca3899c0603",
            "HUNT_HEADLINE": "Your Favourites"
          }
        },
        {
          "id": "5743b262d-3b0f-4385-a0fb-0887622e37f7",
          "activityTypeEnum": "USER_INVITED_TO_HUNT",
          "instigatorId": "0080d859-fb9c-495d-a05a-8ca3899c0601",
          "instigatorName": "Kirk",
          "instigatorPic": "/url/for/profilePic.jpg",
          "activityTime": "2018-11-19T12:11:25.643Z",
          "read": "false",
          "metadata": {
            "HUNT_ID": "0080d859-fb9c-495d-a05a-8ca3899c0603",
            "HUNT_HEADLINE": "Your Favourites",
            "INVITEE_USER_PROFILE_ID": "0080d859-fb9c-495d-a05a-8ca3899c0609",
            "INVITEE_NAME": "Eamon Doyle"
          }
        },
        {
          "id": "6743b262d-3b0f-4385-a0fb-0887622e37f7",
          "activityTypeEnum": "HUNT_DELETED",
          "instigatorId": "0080d859-fb9c-495d-a05a-8ca3899c0601",
          "instigatorName": "Kirk",
          "instigatorPic": "/url/for/profilePic.jpg",
          "activityTime": "2018-11-19T12:11:24.643Z",
          "read": "false",
          "metadata": {
            "HUNT_ID": "0080d859-fb9c-495d-a05a-8ca3899c0603",
            "HUNT_HEADLINE": "Your Favourites"
          }
        },
        {
          "id": "7743b262d-3b0f-4385-a0fb-0887622e37f7",
          "activityTypeEnum": "IDEA_DELETED",
          "instigatorId": "0080d859-fb9c-495d-a05a-8ca3899c0601",
          "instigatorName": "Kirk",
          "instigatorPic": "/url/for/profilePic.jpg",
          "activityTime": "2018-11-19T12:11:24.643Z",
          "read": "false",
          "metadata": {
            "IDEA_ID": "0080d859-fb9c-495d-a05a-8ca3899c0603",
            "IDEA_PREVIEW": "This is my favourite..."
          }
        }
      ],
      tabIndex: 0
    };
  }

  componentDidMount() {
    Analytics.setCurrentScreen('NotificationScreen')

    // this.props.getActivityFeed(this.props.user.userInfo.id)

    let { invitedFeedList } = this.props.feedo
    invitedFeedList = _.orderBy(
      invitedFeedList,
      ['publishedDate'],
      ['desc']
    )
    this.setState({ invitedFeedList })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { feedo } = nextProps

    if (this.props.feedo.loading === 'GET_ACTIVITY_FEED_PENDING' && feedo.loading === 'GET_ACTIVITY_FEED_FULFILLED') {
      let { activityFeedList } = feedo
      this.setState({ activityFeedList: activityFeedList.content })
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

  onSelectActivity = () => {

  }

  onReadActivity = (data) => {
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
        onPress: () => this.onReadActivity(data),
      }
    ];

    return (
      <View style={styles.activityItem}>
        <Swipeout
          style={styles.itemContainer}
          autoClose={true}
          right={swipeoutBtns}
        > 
          <ActivityFeedComponent data={data} onSelectActivity={() => this.onSelectActivity()} />
        </Swipeout>
      </View>
    );
  }

  renderItem({ item, index }) {
    if (item.hasOwnProperty('activityTypeEnum')) {
      return this.renderActivityFeedItem(item)
    } else {
      return this.renderInvitedFeedItem(item)
    }
  }
  
  render () {
    const { activityFeedList, invitedFeedList } = this.state
    let notificationList = [
      ...invitedFeedList,
      ...activityFeedList
    ]

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.flatList}
          contentContainerStyle={styles.contentFlatList}
          data={notificationList}
          keyExtractor={item => item.id}
          automaticallyAdjustContentInsets={true}
          renderItem={this.renderItem.bind(this)}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    )
  }
}

const mapStateToProps = ({ feedo, user }) => ({
  feedo,
  user
})

const mapDispatchToProps = dispatch => ({
  getActivityFeed: (userId) => dispatch(getActivityFeed(userId)),
  readAllActivityFeed: (userId) => dispatch(readAllActivityFeed(userId)),
  readActivityFeed: (userId, activityId) => dispatch(readActivityFeed(userId, activityId))
})

NotificationScreen.propTypes = {
  feedo: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any),
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationScreen)

