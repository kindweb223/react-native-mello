/* global require */
import React from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Animated,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Platform,
  StatusBar,
  YellowBox,
} from 'react-native'

import ReactNativeHaptic from 'react-native-haptic'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import TabBar from 'react-native-underline-tabbar'
import Modal from "react-native-modal"
import * as R from 'ramda'
import { filter, orderBy } from 'lodash'
import DashboardNavigationBar from '../../navigations/DashboardNavigationBar'
import DashboardActionBar from '../../navigations/DashboardActionBar'
import FeedoListContainer from '../FeedoListContainer'
import NewFeedScreen from '../NewFeedScreen'
import CreateNewFeedComponent from '../../components/CreateNewFeedComponent'
import FeedLongHoldMenuScreen from '../FeedLongHoldMenuScreen'
import ToasterComponent from '../../components/ToasterComponent'
import COLORS from '../../service/colors'
import styles from './styles'
import CONSTANTS from '../../service/constants';

const EMPTY_ICON = require('../../../assets/images/empty_state/asset-emptystate.png')
const SEARCH_ICON = require('../../../assets/images/Search/Grey.png')
const SETTING_ICON = require('../../../assets/images/Settings/Grey.png')

import {
  getFeedoList,
  pinFeed,
  unpinFeed,
  deleteFeed,
  archiveFeed,
  duplicateFeed,
  deleteDuplicatedFeed,
  addDummyFeed,
  removeDummyFeed,
  setFeedDetailAction
} from '../../redux/feedo/actions'

const TAB_STYLES = {
  height: '100%',
  paddingTop: 10,
  paddingHorizontal: 10,
}

const TOASTER_DURATION = 5000


class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feedoList: [],
      loading: false,
      isVisibleNewFeed: false,
      isVisibleCreateNewFeedModal: false,
      isLongHoldMenuVisible: false,
      selectedFeedData: {},
      tabIndex: 0,
      emptyState: true,
      isShowToaster: false,
      scrollY: new Animated.Value(0)
    };

    this.animatedOpacity = new Animated.Value(0);
  }

  componentDidMount() {
    this.setState({ loading: true })
    this.props.getFeedoList(this.state.tabIndex)
    YellowBox.ignoreWarnings(['Module RNDocumentPicker'])
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { feedo } = nextProps

    if ((prevState.loading === true && (feedo.loading === 'GET_FEEDO_LIST_FULFILLED' || feedo.loading === 'GET_FEEDO_LIST_REJECTED')) ||
      (feedo.loading === 'FEED_FULFILLED') || (feedo.loading === 'DEL_FEED_FULFILLED') || (feedo.loading === 'ARCHIVE_FEED_FULFILLED') ||
      (feedo.loading === 'DUPLICATE_FEED_FULFILLED')) {

      let feedoList = []
      let emptyState = true

      if (feedo.feedoList && feedo.feedoList.length > 0) {
        feedoList = feedo.feedoList.map(item => {
          const filteredIdeas = filter(item.ideas, idea => idea.coverImage !== null && idea.coverImage !== '')

          return Object.assign(
            {},
            item,
            { coverImages: R.slice(0, filteredIdeas.length > 4 ? 4 : filteredIdeas.length, filteredIdeas) }
          )
        })

        feedoList = orderBy(
          filter(feedoList, item => item.status === 'PUBLISHED'),
          ['pinned.pinned', 'pinned.pinnedDate', 'publishedDate'],
          ['asc', 'desc', 'desc']
        )
        
        if (prevState.tabIndex === 1) {
          feedoList = filter(feedoList, item => item.pinned !== null)
        }

        emptyState = false
      }

      return {
        feedoList,
        loading: false,
        emptyState
      }
    }

    if (feedo.loading === 'ADD_DUMMY_FEED') {
      return {
        feedoList: feedo.feedoList
      }
    }

    return null
  }

  componentDidUpdate(prevProps) {
    if (this.props.feedo.loading === 'SET_FEED_DETAIL_ACTION' && prevProps.feedo.feedDetailAction !== this.props.feedo.feedDetailAction) {
      if (this.props.feedo.feedDetailAction.action === 'Delete') {
        this.setState({ isShowToaster: true })
        this.handleDeleteFeed(this.props.feedo.feedDetailAction.feedId)
      }

      if (this.props.feedo.feedDetailAction.action === 'Archive') {
        this.setState({ isShowToaster: true })
        this.handleArchiveFeed(this.props.feedo.feedDetailAction.feedId)
      }
    }
  }

  onChangeTab = ({ i }) => {
    this.setState({ tabIndex: i, loading: true })
    this.props.getFeedoList(i)
  }

  handleLongHoldMenu = (selectedFeedData) => {
    this.setState({ selectedFeedData })
    this.setState({ isLongHoldMenuVisible: true })
    ReactNativeHaptic.generate('impactHeavy')
  }

  handleArchiveFeed = (feedId) => {
    this.setState({ isLongHoldMenuVisible: false })
    this.setState({ isArchive: true, toasterTitle: 'Feedo archived', feedId })
    this.props.addDummyFeed({ feedId, flag: 'archive' })

    setTimeout(() => {
      this.setState({ isShowToaster: false })
      this.archiveFeed(feedId)
    }, TOASTER_DURATION)
  }

  archiveFeed = (feedId) => {
    if (this.state.isArchive) {
      this.props.archiveFeed(feedId)
      this.setState({ isArchive: false })
    }
  }

  handleDeleteFeed = (feedId) => {
    this.setState({ isLongHoldMenuVisible: false })
    this.setState({ isDelete: true, toasterTitle: 'Feedo deleted', feedId })
    this.props.addDummyFeed({ feedId, flag: 'delete' })

    setTimeout(() => {
      this.setState({ isShowToaster: false })
      this.deleteFeed(feedId)
    }, TOASTER_DURATION)
  }

  deleteFeed = (feedId) => {
    if (this.state.isDelete) {
      this.props.deleteFeed(feedId)
      this.setState({ isDelete: false })
    }
  }

  handlePinFeed = (feedId) => {
    this.setState({ isLongHoldMenuVisible: false })
    this.setState({ isPin: true, toasterTitle: 'Feed pinned', feedId })

    this.props.addDummyFeed({ feedId, flag: 'pin' })
    this.scrollView.scrollTo({ x:0, y: 0, animated: true })
  }

  pinFeed = (feedId) => {
    if (this.state.isPin) {
      this.props.pinFeed(feedId)
      this.setState({ isPin: false })
    }
  }

  handleUnpinFeed = (feedId) => {
    this.setState({ isLongHoldMenuVisible: false })
    this.setState({ isUnPin: true, toasterTitle: 'Feed un-pinned', feedId })
    this.props.addDummyFeed({ feedId, flag: 'unpin' })
  }

  unpinFeed = (feedId) => {
    if (this.state.isUnPin) {
      this.props.unpinFeed(feedId)
      this.setState({ isUnPin: false })
    }
  }

  handleDuplicateFeed = (feedId) => {
    this.setState({ isLongHoldMenuVisible: false })
    this.setState({ isDuplicate: true, toasterTitle: 'Feed duplicated', feedId })
    this.props.duplicateFeed(feedId)
  }
  
  duplicateFeed = () => {
    if (this.state.isDuplicate) {
      this.setState({ isDuplicate: false })
    }
  }

  undoAction = () => {
    if (this.state.isPin) {
      this.props.removeDummyFeed({ feedId: this.state.feedId, flag: 'pin' })
    } else if (this.state.isUnPin) {
      this.props.removeDummyFeed({ feedId: this.state.feedId, flag: 'unpin' })
    } else if (this.state.isDelete) {
      this.props.removeDummyFeed({ feedId: this.state.feedId, flag: 'delete' })
    } else if (this.state.isArchive) {
      this.props.removeDummyFeed({ feedId: this.state.feedId, flag: 'archive' })
    } else if (this.state.isDuplicate) {
      if (this.props.feedo.duplicatedId) {
        this.props.deleteDuplicatedFeed(this.props.feedo.duplicatedId)
      }
    }

    this.setState({
      isShowToaster: false, isArchive: false, isDelete: false, isPin: false, isUnPin: false, isDuplicate: false
    })
  }

  onLongHoldMenuHide = () => {
    const { isArchive, isDelete, isPin, isUnPin, isDuplicate, feedId } = this.state

    if (isArchive || isDelete || isPin || isUnPin || isDuplicate) {
      this.setState({ isShowToaster: true })
    }

    if (isDuplicate) {
      setTimeout(() => {
        this.setState({ isShowToaster: false })
        this.duplicateFeed()
      }, TOASTER_DURATION + 3)
    }

    if (isPin) {
      setTimeout(() => {
        this.setState({ isShowToaster: false })
        this.pinFeed(feedId)
      }, TOASTER_DURATION)
    }

    if (isUnPin) {
      setTimeout(() => {
        this.setState({ isShowToaster: false })
        this.unpinFeed(feedId)
      }, TOASTER_DURATION)
    }
  }

  onOpenCreateNewFeedModal() {
    this.setState({
      isVisibleCreateNewFeedModal: true,
    }, () => {
      this.animatedOpacity.setValue(0);
      Animated.timing(this.animatedOpacity, {
        toValue: 1,
        duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
      }).start();
    });
  }

  onSelectNewFeedType(type) {
    if (type === 'New Card') {
    } else if (type === 'New Feed') {
      this.setState({ 
        isVisibleCreateNewFeedModal: false,
        isVisibleNewFeed: true,
      });
    }
  }

  onCloseCreateNewFeedModal() {
    this.animatedOpacity.setValue(1);
    Animated.timing(this.animatedOpacity, {
      toValue: 0,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
    }).start(() => {
      this.setState({ 
        isVisibleCreateNewFeedModal: false,
      });
    });
  }
  
  onCloseNewFeedModal() {
    this.animatedOpacity.setValue(1);
    Animated.timing(this.animatedOpacity, {
      toValue: 0,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
    }).start(() => {
      this.setState({ 
        isVisibleNewFeed: false,
      });
    });
  }

  get renderNewFeedModals() {
    if (!this.state.isVisibleNewFeed && !this.state.isVisibleCreateNewFeedModal) {
      return;
    }
    return (
      <Animated.View style={[
        styles.modalContainer,
        {opacity: this.animatedOpacity}
      ]}>
        {
          this.state.isVisibleCreateNewFeedModal && 
          <CreateNewFeedComponent 
            onSelect={(type) => this.onSelectNewFeedType(type)}
            onClose={() => this.onCloseCreateNewFeedModal()}
          />
        }
        {
          this.state.isVisibleNewFeed && 
          <NewFeedScreen 
            onClose={() => this.onCloseNewFeedModal()}
          />  
        }
      </Animated.View>
    );
  }

  render () {
    const { loading, feedoList, emptyState, tabIndex } = this.state

    const normalHeaderOpacity = this.state.scrollY.interpolate({
      inputRange: [20, 60],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    })

    const miniHeaderOpacity = this.state.scrollY.interpolate({
      inputRange: [60, 120],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    })

    const miniHeaderZIndex = this.state.scrollY.interpolate({
      inputRange: [40, 80],
      outputRange: [9, 11],
      extrapolate: 'clamp'
    })

    return (
      <SafeAreaView style={styles.safeArea}>
        <View feedAction="null" />
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" backgroundColor="blue" />}
          {Platform.OS === 'android' && (
            <View style={styles.statusBarUnderlay} />
          )}

          <Animated.View style={[styles.navbarView, { zIndex: miniHeaderZIndex }]}>
            <View style={styles.searchIconView}>
              <TouchableOpacity>
                <Image source={SEARCH_ICON} />
              </TouchableOpacity>
            </View>
            <Animated.View style={[styles.minHeader, { opacity: miniHeaderOpacity }]}>
              <View style={styles.minTitleView}>
                <Text style={styles.minTitle}>My feeds</Text>
              </View>
              <View style={styles.settingIconView}>
                <TouchableOpacity>
                  <Image source={SETTING_ICON} />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>          

          <ScrollView
            ref={ref => this.scrollView = ref}
            scrollEventThrottle={16}
            scrollEnabled={emptyState > 0 && tabIndex === 0 ? false : true}
            style={styles.feedListView }
            onScroll={
              Animated.event(
                [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
              )
            }
          >
            <Animated.View style={[styles.normalHeader, { opacity: normalHeaderOpacity }]}>
              <DashboardNavigationBar />
            </Animated.View>

            {emptyState > 0 && tabIndex === 0
            ? <View style={styles.emptyView}>
                {loading
                  ? <ActivityIndicator animating />
                  : [
                      <Image key="0" source={EMPTY_ICON} />,
                      <Text key="1" style={styles.emptyText}>Feedo is more fun with feeds</Text>
                    ]
                }
              </View>
            : <ScrollableTabView
                tabBarActiveTextColor={COLORS.PURPLE}
                tabBarInactiveTextColor={COLORS.MEDIUM_GREY}
                onChangeTab={this.onChangeTab}
                prerenderingSiblingsNumber={0}
                renderTabBar={() => <TabBar
                                      underlineHeight={0}
                                      underlineBottomPosition={0}
                                      tabBarStyle={styles.tabBarStyle}
                                      tabBarTextStyle={styles.tabBarTextStyle}
                                      tabMargin={10}
                                      tabStyles={{ 'tab': TAB_STYLES }}
                                    />}
              >
                <FeedoListContainer
                  loading={loading}
                  feedoList={feedoList}
                  tabLabel={{ label: 'All' }}
                  handleFeedMenu={this.handleLongHoldMenu}
                />
                <FeedoListContainer
                  loading={loading}
                  feedoList={feedoList}
                  tabLabel={{ label: 'Pinned' }}
                  handleFeedMenu={this.handleLongHoldMenu}
                />
                <FeedoListContainer
                  loading={loading}
                  feedoList={feedoList}
                  tabLabel={{ label: 'Shared with me' }}
                  handleFeedMenu={this.handleLongHoldMenu}
                />
              </ScrollableTabView>
            }
          </ScrollView>

        </View>

        {!this.state.isLongHoldMenuVisible && (
          <DashboardActionBar 
            filtering={!emptyState} 
            onAddFeed={this.onOpenCreateNewFeedModal.bind(this)}
          />
        )}

        {this.renderNewFeedModals}
        <Modal 
          isVisible={this.state.isLongHoldMenuVisible}
          style={styles.longHoldModalContainer}
          backdropColor='#e0e0e0'
          backdropOpacity={0.9}
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInTiming={1300}
          onModalHide={this.onLongHoldMenuHide}
          onBackdropPress={() => this.setState({ isLongHoldMenuVisible: false })}
        >
          <FeedLongHoldMenuScreen
            feedData={this.state.selectedFeedData}
            handleArchiveFeed={this.handleArchiveFeed}
            handleDeleteFeed={this.handleDeleteFeed}
            handlePinFeed={this.handlePinFeed}
            handleUnpinFeed={this.handleUnpinFeed}
            handleDuplicateFeed={this.handleDuplicateFeed}
          />
        </Modal>

        <ToasterComponent
          isVisible={this.state.isShowToaster}
          title={this.state.toasterTitle}
          onPressButton={this.undoAction}
        />
      </SafeAreaView>
    )
  }
}

const mapStateToProps = ({ feedo }) => ({
  feedo
})

const mapDispatchToProps = dispatch => ({
  getFeedoList: (index) => dispatch(getFeedoList(index)),
  pinFeed: (data) => dispatch(pinFeed(data)),
  unpinFeed: (data) => dispatch(unpinFeed(data)),
  deleteFeed: (data) => dispatch(deleteFeed(data)),
  archiveFeed: (data) => dispatch(archiveFeed(data)),
  duplicateFeed: (data) => dispatch(duplicateFeed(data)),
  deleteDuplicatedFeed: (data) => dispatch(deleteDuplicatedFeed(data)),
  addDummyFeed: (data) => dispatch(addDummyFeed(data)),
  removeDummyFeed: (data) => dispatch(removeDummyFeed(data)),
  setFeedDetailAction: (data) => dispatch(setFeedDetailAction(data))
})

HomeScreen.propTypes = {
  getFeedoList: PropTypes.func.isRequired,
  feedo: PropTypes.objectOf(PropTypes.any),
  pinFeed: PropTypes.func.isRequired,
  unpinFeed: PropTypes.func.isRequired,
  deleteFeed: PropTypes.func.isRequired,
  archiveFeed: PropTypes.func.isRequired,
  duplicateFeed: PropTypes.func.isRequired,
  deleteDuplicatedFeed: PropTypes.func.isRequired,
  addDummyFeed: PropTypes.func.isRequired,
  removeDummyFeed: PropTypes.func.isRequired,
  setFeedDetailAction: PropTypes.func.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen)

