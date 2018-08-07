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
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isEmpty, find } from 'lodash'
import { Actions } from 'react-native-router-flux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import Modal from "react-native-modal"
import DashboardActionBar from '../../navigations/DashboardActionBar'
import FeedCardComponent from '../../components/FeedCardComponent'
import FeedCollapseComponent from '../../components/FeedCollapseComponent'
import AvatarPileComponent from '../../components/AvatarPileComponent'
import FeedNavbarSettingComponent from '../../components/FeedNavbarSettingComponent'
import FeedControlMenuComponent from '../../components/FeedControlMenuComponent'
import ToasterComponent from '../../components/ToasterComponent'
import FeedLoadingStateComponent from '../../components/FeedLoadingStateComponent'
import ShareScreen from '../ShareScreen'
import NewFeedScreen from '../NewFeedScreen'

import {
  getFeedDetail,
  setFeedDetailAction,
  addDummyFeed,
  removeDummyFeed,
  pinFeed,
  unpinFeed,
  duplicateFeed,
  deleteDuplicatedFeed,
} from '../../redux/feedo/actions';
import {
  setCurrentCard,
} from '../../redux/card/actions'
import {
  UserId,
} from '../../service/api'
import COLORS from '../../service/colors'
import styles from './styles'
import actionSheetStyles from '../FeedLongHoldMenuScreen/styles'

const EMPTY_ICON = require('../../../assets/images/empty_state/asset-emptystate.png')
const ACTIONSHEET_OPTIONS = [
  <Text key="0" style={actionSheetStyles.actionButtonText}>Delete feed</Text>,
  'Cancel'
]
const TOASTER_DURATION = 5000

import CONSTANTS from '../../service/constants'
import NewCardScreen from '../NewCardScreen' 

class FeedDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      currentFeed: {},
      loading: false,
      
      isVisibleCard: false,
      cardViewMode: CONSTANTS.CARD_NONE,

      isVisibleEditFeed: false,
      openMenu: false,
      isShowToaster: false,
      isShowShare: false,
      pinText: 'Pin',
      selectedIdeaInvitee: null,
      selectedIdeaLayout: {},
    };
    this.animatedOpacity = new Animated.Value(0)
    this.menuOpacity = new Animated.Value(0)
    this.menuZIndex = new Animated.Value(0)

    this.cardItemRefs = [];
  }

  componentDidMount() {
    this.setState({ loading: true })
    this.props.getFeedDetail(this.props.data.id)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if ((nextProps.feedo.loading === 'GET_FEED_DETAIL_FULFILLED' ||
      nextProps.feedo.loading === 'DELETE_INVITEE_FULFILLED' ||
      nextProps.feedo.loading === 'UPDATE_INVITEE_PERMISSION_FULFILLED') &&
      nextProps.feedo.currentFeed !== prevState.currentFeed) {
        console.log('CURRENT_FEED: ', nextProps.feedo.currentFeed)
      return {
        loading: false,
        currentFeed: nextProps.feedo.currentFeed,
        pinText: !nextProps.feedo.currentFeed.pinned ? 'Pin' : 'Unpin'
      }
    }
    return null
  }

  backToDashboard = () => {
    Actions.pop()
  }

  handleSetting = () => {
    const { openMenu } = this.state
    this.setState({ openMenu: !openMenu, settingItem: null })
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
        this.ActionSheet.show()
        return
      case 'Archive':
        this.props.setFeedDetailAction({
          action: 'Archive',
          feedId
        })
        Actions.pop()
        return
      case 'Edit':
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
    this.setState({ isShowToaster: true, isPin: true, toasterTitle: 'Feed pinned', feedId, pinText: 'Unpin' })
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
    this.setState({ isShowToaster: true, isUnPin: true, toasterTitle: 'Feed un-pinned', feedId, pinText: 'Pin' })
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
    this.setState({ isShowToaster: true, isDuplicate: true, toasterTitle: 'Feed duplicated', feedId })
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

  undoAction = () => {
    if (this.state.isPin) {
      this.setState({ pinText: 'Pin' })
      this.props.removeDummyFeed({ feedId: this.state.feedId, flag: 'pin' })
    } else if (this.state.isUnPin) {
      this.setState({ pinText: 'Unpin' })
      this.props.removeDummyFeed({ feedId: this.state.feedId, flag: 'unpin' })
    } else if (this.state.isDuplicate) {
      if (this.props.feedo.duplicatedId) {
        this.props.deleteDuplicatedFeed(this.props.feedo.duplicatedId)
      }
    }

    this.setState({
      isShowToaster: false, isPin: false, isUnPin: false, isDuplicate: false
    })
  }

  onTapActionSheet = (index) => {
    if (index === 0) {
      this.props.setFeedDetailAction({
        action: 'Delete',
        feedId: this.props.data.id
      })

      Actions.pop()
    }
  }

  checkOwner = (data) =>{
    if (data.invitees.length === 1 && data.owner.id === data.invitees[0].userProfile.id) {
      return true
    }
    return false
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
    const invitee = find(currentFeed.invitees, (o) => {
      return (o.id == idea.inviteeId)
    });
    let cardViewMode = CONSTANTS.CARD_VIEW;
    if (invitee.userProfile.id === UserId) {
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
            />
        }
        {  
          this.state.isVisibleEditFeed && 
            <NewFeedScreen 
              onClose={() => this.onCloseEditFeedModal()}
              selectedFeedId={this.props.data.id}
            />  
        }
      </Animated.View>
    );
  }

  render () {
    const { data } = this.props
    const { currentFeed, loading, pinText } = this.state

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

    const settingMenuY = this.state.scrollY.interpolate({
      inputRange: [0, 35],
      outputRange: [140, 80],
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
    if (!isEmpty(currentFeed)) {
      const isOwner = this.checkOwner(currentFeed)

      if (isOwner) {
        avatars = [
          {
            id: 1,
            imageUrl: currentFeed.owner.imageUrl,
            userName: `${currentFeed.owner.firstName} ${currentFeed.owner.lastName}`
          }
        ]
      } else {
        currentFeed.invitees.forEach((item, key) => {
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
              <Animated.View style={[styles.settingView, { opacity: settingViewOpacity }]}>
                <FeedNavbarSettingComponent handleSetting={() => this.handleSetting()} />
              </Animated.View>
              <Animated.View style={[styles.avatarView, { right: avatarPosition }]}>
                <AvatarPileComponent avatars={avatars} />
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
                <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">{currentFeed.headline}</Text>
                <View>
                  <FeedNavbarSettingComponent handleSetting={this.handleSetting} />
                </View>
              </View>
            </Animated.View>
            
              <View style={styles.detailView}>
                <FeedCollapseComponent feedData={currentFeed} />

                {
                  !isEmpty(currentFeed) && currentFeed && currentFeed.ideas.length > 0 ?
                    currentFeed.ideas.map((item, index) => (
                      <TouchableHighlight
                        key={index}
                        ref={ref => this.cardItemRefs[index] = ref}
                        style={{ marginHorizontal: 5, borderRadius: 5 }}
                        underlayColor={COLORS.LIGHT_GREY}
                        onPress={() => this.onSelectCard(item, index)}
                      >
                        <FeedCardComponent data={item} invitees={currentFeed.invitees} />
                      </TouchableHighlight>
                    ))
                  : 
                    <View style={styles.emptyView}>
                      {loading
                        ? <FeedLoadingStateComponent />
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

        <ActionSheet
          ref={ref => this.ActionSheet = ref}
          title={<Text style={actionSheetStyles.titleText}>Are you sure you want to delete this feed, everything will be gone ...</Text>}
          options={ACTIONSHEET_OPTIONS}
          cancelButtonIndex={1}
          destructiveButtonIndex={2}
          tintColor={COLORS.PURPLE}
          styles={actionSheetStyles}
          onPress={(index) => this.onTapActionSheet(index)}
        />

        <ToasterComponent
          isVisible={this.state.isShowToaster}
          title={this.state.toasterTitle}
          onPressButton={() => this.undoAction()}
        />

        <Modal 
          isVisible={this.state.isShowShare}
          style={styles.shareScreenContainer}
          backdropColor='#f5f5f5'
          backdropOpacity={0.9}
          animationIn="zoomInUp"
          animationOut="zoomOutDown"
          animationInTiming={500}
          onModalHide={() => {}}
        >
          <ShareScreen onClose={() => this.setState({ isShowShare: false })} data={currentFeed} />
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
          <Animated.View style={[styles.settingMenuView, { top: settingMenuY }]}>
            <FeedControlMenuComponent handleSettingItem={item => this.handleSettingItem(item)} data={currentFeed} pinText={pinText} />
          </Animated.View>
        </Modal>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = ({ feedo }) => ({
  feedo
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

