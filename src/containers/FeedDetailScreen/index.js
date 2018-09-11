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
} from 'react-native'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Actions } from 'react-native-router-flux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import Modal from "react-native-modal"
import ReactNativeHaptic from 'react-native-haptic'

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
import CardFilterComponent from '../../components/CardFilterComponent'
import CardLongHoldMenuScreen from '../CardLongHoldMenuScreen'

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
  deleteCard,
} from '../../redux/card/actions'
import COLORS from '../../service/colors'
import * as COMMON_FUNC from '../../service/commonFunc'
import styles from './styles'

const EMPTY_ICON = require('../../../assets/images/empty_state/asset-emptystate.png')
const TOASTER_DURATION = 5000

import CONSTANTS from '../../service/constants'
import NewCardScreen from '../NewCardScreen' 

const CARD_ACTION_NONE = 0;
const CARD_ACTION_MOVE = 1;
const CARD_ACTION_EDIT = 2;
const CARD_ACTION_DELETE = 3;


class FeedDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      currentBackFeed: {},
      currentFeed: {},
      loading: false,
      
      isVisibleCard: false,
      cardViewMode: CONSTANTS.CARD_NONE,

      isVisibleEditFeed: false,
      isVisibleLongHoldMenu: false,
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
      totalCardCount: 0
    };
    this.animatedOpacity = new Animated.Value(0)
    this.menuOpacity = new Animated.Value(0)
    this.menuZIndex = new Animated.Value(0)
    this.animatedSelectCard = new Animated.Value(1);

    this.cardItemRefs = [];
  }

  componentDidMount() {
    this.setState({ loading: true })
    this.props.getFeedDetail(this.props.data.id)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { feedo, card } = nextProps

    if ((this.props.feedo.loading === 'GET_FEED_DETAIL_PENDING' && feedo.loading === 'GET_FEED_DETAIL_FULFILLED') ||
        (this.props.feedo.loading === 'DELETE_INVITEE_PENDING' && feedo.loading === 'DELETE_INVITEE_FULFILLED') ||
        (this.props.feedo.loading === 'UPDATE_SHARING_PREFERENCES_PENDING' && feedo.loading === 'UPDATE_SHARING_PREFERENCES_FULFILLED') ||
        (this.props.feedo.loading === 'UPDATE_INVITEE_PERMISSION_PENDING' && feedo.loading === 'UPDATE_INVITEE_PERMISSION_FULFILLED') ||
        (this.props.feedo.loading === 'INVITE_HUNT_PENDING' && feedo.loading === 'INVITE_HUNT_FULFILLED') || 
        (this.props.card.loading === 'UPDATE_CARD_PENDING' && card.loading === 'UPDATE_CARD_FULFILLED') || 
        (this.props.card.loading === 'DELETE_CARD_PENDING' && card.loading === 'DELETE_CARD_FULFILLED')) {
      
      const currentFeed = feedo.currentFeed

      this.setState({
        loading: false,
        totalCardCount: currentFeed.ideas.length,
        pinText: !currentFeed.pinned ? 'Pin' : 'Unpin'
      })

      this.setState({ currentBackFeed: currentFeed }, () => {
        this.filterCards(currentFeed)
      })
    }

    if (feedo.loading === 'GET_FEED_DETAIL_PENDING') {
      this.setState({ currentFeed: {} })
    }
  }

  filterCards = (currentFeed) => {
    const { currentBackFeed, filterShowType, filterSortType } = this.state
    const { ideas } = currentFeed
    let filterIdeas = {}, sortIdeas = {}

    if (filterShowType === 'all') {
      filterIdeas = currentBackFeed.ideas
    }

    if (filterShowType === 'like') {
      filterIdeas = _.filter(ideas, idea => idea.metadata.likes > 0)
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
    if (currentFeed.metadata.owner) {
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
          selectedLongHoldCardIndex: -1,
        });
      });
    });
  }

  onMoveCard() {
    this.setState({ isVisibleLongHoldMenu: false });
  }
  
  onEditCard() {
    this.setState({ isVisibleLongHoldMenu: false })
  }

  onDeleteCard(ideaId) {
    this.setState({ 
      isVisibleLongHoldMenu: false,
      isShowToaster: true,
      toasterTitle: 'Card deleted'
    });
    setTimeout(() => {
      this.setState({ isShowToaster: false })
      this.props.deleteCard(ideaId)
    }, TOASTER_DURATION + 5)

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
  
  handleFilter = () => {
    this.setState({ showFilterModal: true })
  }

  render () {
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
    if (!_.isEmpty(currentFeed)) {
      currentFeed.invitees.forEach((item, key) => {
        avatars = [
          ...avatars,
          item.userProfile
        ]
      })
    }

    console.log('CUR_FEED_IDEAS: ', currentFeed.ideas)

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
                <TouchableOpacity onPress={() => this.handleShare()}>
                  <AvatarPileComponent avatars={avatars} />
                </TouchableOpacity>
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
                {!_.isEmpty(currentFeed) && 
                  (currentFeed.summary.length > 0 ||
                  (currentFeed.files && currentFeed.files.length > 0) ||
                  (currentFeed.tags && currentFeed.tags.length > 0)) && (
                  <FeedCollapseComponent feedData={currentFeed} />
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
                        <TouchableHighlight
                          ref={ref => this.cardItemRefs[index] = ref}
                          style={{ marginHorizontal: 5, borderRadius: 5 }}
                          underlayColor={COLORS.LIGHT_GREY}
                          onPress={() => this.onSelectCard(item, index)}
                          onLongPress={() => this.onLongPressCard(index, item, currentFeed.invitees)}
                        >
                          <FeedCardComponent idea={item} invitees={currentFeed.invitees} />
                        </TouchableHighlight>
                      </Animated.View>
                    ))
                  : 
                    <View style={styles.emptyView}>
                      {loading
                        ? <FeedLoadingStateComponent />
                        : <View style={styles.emptyInnerView}>
                            <Image source={EMPTY_ICON} />
                            <Text style={styles.emptyText}>It is lonely here</Text>
                          </View>
                        }
                    </View>
                }
              </View>
          </ScrollView>

        </View>

        <DashboardActionBar 
          onAddFeed={this.onOpenNewCardModal.bind(this)}
          handleFilter={this.handleFilter}
          showType={this.state.filterShowType}
          sortType={this.state.filterSortType}
        />

        {this.renderNewCardModal}

        <ActionSheet
          ref={ref => this.ActionSheet = ref}
          title={'Are you sure you want to delete this feed, everything will be gone ...'}
          options={['Delete feed', 'Cancel']}
          cancelButtonIndex={1}
          destructiveButtonIndex={0}
          tintColor={COLORS.PURPLE}
          onPress={(index) => this.onTapActionSheet(index)}
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

        <Modal 
          isVisible={this.state.isVisibleLongHoldMenu}
          style={styles.longHoldModalContainer}
          backdropColor='#e0e0e0'
          backdropOpacity={0.9}
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInTiming={1300}
          onModalHide={this.onLongHoldMenuHide}
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

      </SafeAreaView>
    )
  }
}

const mapStateToProps = ({ feedo, card }) => ({
  feedo,
  card,
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
  deleteCard: (data) => dispatch(deleteCard(data)),
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

