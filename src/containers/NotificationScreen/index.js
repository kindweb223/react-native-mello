/* global require */
import React from 'react'
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native'

import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import PropTypes from 'prop-types'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import TabBar from 'react-native-underline-tabbar'
import Swipeout from 'react-native-swipeout'
import _ from 'lodash'
import Feather from 'react-native-vector-icons/Feather'

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
      activityFeedList: [],
      invitedFeedList: [],
      tabIndex: 0
    };
  }

  componentDidMount() {
    Analytics.setCurrentScreen('NotificationScreen')

    this.props.getActivityFeed(this.props.user.userInfo.id)

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
      this.setState({ activityFeedList })
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

  onChangeTab(value) {
    this.setState({ 
      tabIndex: value.i,
    })
  }

  renderInvitedFeedItem({ item }) {
    return (
      <View style={styles.itemView}>
        <NotificationItemComponent item={item} />

        {this.state.invitedFeedList.length > 0 && (
          <View style={[styles.separator, { marginTop: 14 }]} />
        )}
      </View>
    )
  }

  get renderReadTickComponent() {
    return (
      <View style={styles.swipeItemContainer}>
        <Feather name='check' size={25} color="#fff" />
      </View>
    );
  }

  onSelectActivity = () => {

  }

  onReadActivity = (data) => {
    this.props.readActivityFeed(this.props.user.userInfo.id, data.id)
  }

  renderActivityFeedItem({ item, index }) {
    let swipeoutBtns = []

    swipeoutBtns = [
      {
        component: this.renderReadTickComponent,
        backgroundColor: COLORS.DARK_RED,
        onPress: () => this.onReadActivity(item),
      }
    ];

    return (
      <Swipeout
        style={styles.itemContainer}
        autoClose={true}
        right={swipeoutBtns}
      > 
        <ActivityFeedComponent data={item} onSelectActivity={() => this.onSelectActivity()} />
      </Swipeout>
    );
  }
  
  render () {
    const { activityFeedList, invitedFeedList } = this.state

    return (
      <View style={styles.container}>
        <ScrollableTabView
          content
          locked
          onChangeTab={this.onChangeTab.bind(this)}
          prerenderingSiblingsNumber={0}
          renderTabBar={() => <TabBar
                                underlineHeight={0}
                                underlineBottomPosition={0}
                                underlineColor="transparent"
                                tabBarStyle={styles.tabBarStyle}
                                tabBarTextStyle={styles.tabBarTextStyle}
                                activeTabTextStyle={styles.activeTabBarTextStyle}
                                tabStyles={{ tab: styles.tabStyle }}
                                tabMargin={1}
                              />}
        >
          <View
            style={styles.tabView}
            ref={ref => this.scrollTabAll = ref} 
            tabLabel={{ label: 'Activity' }}
          >
            <FlatList
              style={styles.flatList}
              contentContainerStyle={styles.contentFlatList}
              data={activityFeedList}
              keyExtractor={item => item.id}
              automaticallyAdjustContentInsets={true}
              renderItem={this.renderActivityFeedItem.bind(this)}
              keyboardShouldPersistTaps="handled"
            />
          </View>

          <View
            style={styles.tabView}
            ref={ref => this.scrollTabAll = ref} 
            tabLabel={{ label: 'Invites' }}
          >
            <FlatList
              style={styles.flatList}
              contentContainerStyle={styles.contentFlatList}
              data={invitedFeedList}
              keyExtractor={item => item.id}
              automaticallyAdjustContentInsets={true}
              renderItem={this.renderInvitedFeedItem.bind(this)}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </ScrollableTabView>

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

