/* global require */
import React from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  Animated,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { Actions } from 'react-native-router-flux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import DashboardActionBar from '../../navigations/DashboardActionBar'
import FeedCardComponent from '../../components/FeedCardComponent'
import FeedCollapseComponent from '../../components/FeedCollapseComponent'
import AvatarPileComponent from '../../components/AvatarPileComponent'
import FeedNavbarSettingComponent from '../../components/FeedNavbarSettingComponent'
import { getFeedDetailData } from '../../redux/feedo/actions'
import styles from './styles'
const EMPTY_ICON = require('../../../assets/images/empty_state/asset-emptystate.png')

import CONSTANTS from '../../service/constants'
import NewCardScreen from '../NewCardScreen'
 

class FeedDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      feedDetailData: {},
      loading: false,
      isVisibleNewCard: false,
    };
    this.animatedOpacity = new Animated.Value(0);
  }

  componentDidMount() {
    this.setState({ loading: true })
    this.props.getFeedDetailData(this.props.data.id)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.feedo.loading === 'GET_FEED_DETAIL_FULFILLED' && nextProps.feedo.feedDetailData !== prevState.feedDetailData) {
      return {
        loading: false,
        feedDetailData: nextProps.feedo.feedDetailData
      }
    }
    if (nextProps.feedo.loading !== 'GET_FEED_DETAIL_FULFILLED') {
      return {
        feedDetailData: {}
      }
    }
    return null
  }

  backToDashboard = () => {
    Actions.pop()
  }

  checkOwner = (data) =>{
    if (data.invitees.length === 1 && data.owner.id === data.invitees[0].userProfile.id) {
      return true
    }
    return false
  }

  onOpenNewCardModal() {
    this.setState({
      isVisibleNewCard: true,
    }, () => {
      this.animatedOpacity.setValue(0);
      Animated.timing(this.animatedOpacity, {
        toValue: 1,
        duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
      }).start();
    });

  }

  onCloseNewFeedModal() {
    this.animatedOpacity.setValue(1);
    Animated.timing(this.animatedOpacity, {
      toValue: 0,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
    }).start(() => {
      this.setState({ 
        isVisibleNewCard: false,
      });
    });
  }

  get renderNewCardModal() {
    if (!this.state.isVisibleNewCard) {
      return;
    }

    return (
      <Animated.View 
        style={[
          styles.modalContainer,
          {opacity: this.animatedOpacity}
        ]}
      >
        <NewCardScreen 
          onClose={() => this.onCloseNewFeedModal()}
        />  
      </Animated.View>
    );
  }

  render () {
    const { data } = this.props
    const { feedDetailData, loading } = this.state

    const navbarBackground = this.state.scrollY.interpolate({
      inputRange: [40, 41],
      outputRange: ['transparent', '#fff'],
      extrapolate: 'clamp'
    })

    const settingViewOpacity = this.state.scrollY.interpolate({
      inputRange: [60, 90],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    })

    const avatarPosition = this.state.scrollY.interpolate({
      inputRange: [30, 90],
      outputRange: [0, 100],
      extrapolate: 'clamp'
    })

    const normalHeaderOpacity = this.state.scrollY.interpolate({
      inputRange: [20, 35],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    })

    let avatars = []
    if (!isEmpty(feedDetailData)) {
      const isOwner = this.checkOwner(feedDetailData)

      if (isOwner) {
        avatars = [
          {
            id: 1,
            imageUrl: feedDetailData.owner.imageUrl,
            userName: `${feedDetailData.owner.firstName} ${feedDetailData.owner.lastName}`
          }
        ]
      } else {
        feedDetailData.invitees.forEach((item, key) => {
          avatars = [
            ...avatars,
            {
              id: key,
              imageUrl: item.userProfile.imageUrl,
              userName: `${item.userProfile.firstName} ${item.userProfile.lastName}`
            }
          ]
        })
      }
    }

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Animated.View style={[styles.miniNavView, { backgroundColor: navbarBackground }]}>
            <TouchableOpacity onPress={this.backToDashboard}>
              <View style={styles.backView}>
                <Ionicons name="ios-arrow-back" style={styles.backIcon} />
              </View>
            </TouchableOpacity>
            <View style={styles.rightHeader}>
              <Animated.View style={[styles.avatarView, { right: avatarPosition }]}>
                <AvatarPileComponent avatars={avatars} />
              </Animated.View>
              <Animated.View style={[styles.settingView, { opacity: settingViewOpacity }]}>
                <FeedNavbarSettingComponent />
              </Animated.View>
            </View>
          </Animated.View>

          <ScrollView
            scrollEventThrottle={16}
            style={styles.scrollView}
            onScroll={
              Animated.event(
                [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
              )
            }
          >
            <Animated.View style={[styles.normalHeader, { opacity: normalHeaderOpacity }]}>
              <View key="2" style={styles.headerTitleView}>
                <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">{data.headline}</Text>
                <View>
                  <FeedNavbarSettingComponent />
                </View>
              </View>
            </Animated.View>
            
              <View style={styles.detailView}>
                <FeedCollapseComponent data={data} feedData={feedDetailData} />

                {!isEmpty(feedDetailData) && feedDetailData && feedDetailData.ideas.length > 0
                  ? feedDetailData.ideas.map(item => (
                      <FeedCardComponent key={item.id} data={item} invitees={feedDetailData.invitees} />
                    ))
                  : <View style={styles.emptyView}>
                      {loading
                        ? <ActivityIndicator animating />
                        : [
                            <Image key="0" source={EMPTY_ICON} />,
                            <Text key="1" style={styles.emptyText}>It is lonely here</Text>
                          ]
                        }
                    </View>
                }
              </View>
          </ScrollView>

        </View>

        <DashboardActionBar 
          onAddFeed={this.onOpenNewCardModal.bind(this)}
        />
        {this.renderNewCardModal}
      </SafeAreaView>
    )
  }
}

const mapStateToProps = ({ feedo }) => ({
  feedo
})

const mapDispatchToProps = dispatch => ({
  getFeedDetailData: data => dispatch(getFeedDetailData(data)),
})

FeedDetailScreen.defaultProps = {
  data: [],
  getFeedDetailData: () => {}
}

FeedDetailScreen.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  feedo: PropTypes.objectOf(PropTypes.any),
  getFeedDetailData: PropTypes.func
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedDetailScreen)

