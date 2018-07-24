import React from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Animated,
  ActivityIndicator
} from 'react-native'

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
import FeedLongHoldMenuScreen from '../FeedLongHoldMenuScreen'
import ToasterComponent from '../../components/ToasterComponent'
import COLORS from '../../service/colors'
import styles from './styles'

import {
  getFeedoList,
  pinFeed,
  unpinFeed,
  deleteFeed,
  archiveFeed
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
      isModalVisible: false,
      isLongHoldMenuVisible: false,
      selectedFeedData: {},
      tabIndex: 0,
      emptyState: true,
      isShowToaster: false,
      scrollY: new Animated.Value(0)
    };
  }

  componentDidMount() {
    this.setState({ loading: true })
    this.props.getFeedoList(this.state.tabIndex)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { feedo } = nextProps
  
    if ((prevState.loading === true && (feedo.loading === 'GET_FEEDO_LIST_FULFILLED' || feedo.loading === 'GET_FEEDO_LIST_REJECTED')) ||
      (feedo.loading === 'FEED_FULFILLED') || (feedo.loading === 'DEL_FEED_FULFILLED') || (feedo.loading === 'ARCHIVE_FEED_FULFILLED')) {

      let feedoList = []

      if (feedo.feedoList) {
        feedoList = feedo.feedoList.map(item => {
          const filteredIdeas = filter(item.ideas, idea => idea.coverImage !== null && idea.coverImage !== '')

          return Object.assign(
            {},
            item,
            { coverImages: R.slice(0, filteredIdeas.length > 4 ? 4 : filteredIdeas.length, filteredIdeas) }
          )
        })
      }
      // feedoList = filter(feedoList, item => item.status === 'PUBLISHED')
      feedoList = orderBy(
        filter(feedoList, item => item.status === 'PUBLISHED'),
        ['pinned.pinned', 'pinned.pinnedDate', 'publishedDate'],
        ['desc', 'desc', 'desc']
      )

      return {
        feedoList,
        loading: false,
        emptyState: false,
        isArchive: false,
        isDelete: false,
        isPin: false,
        isUnPin: false
      }
    }

    return null
  }

  onChangeTab = ({ i }) => {
    this.setState({ tabIndex: i, loading: true })
    this.props.getFeedoList(i)
  }

  handleLongHoldMenu = (selectedFeedData) => {
    this.setState({ selectedFeedData })
    this.setState({ isLongHoldMenuVisible: true })
  }

  handleArchiveFeed = (feedId) => {
    this.setState({ isLongHoldMenuVisible: false })
    this.setState({ isArchive: true, toasterTitle: 'Feed archived' })
    setTimeout(() => {
      this.setState({ isShowToaster: false })
      this.archiveFeed(feedId)
    }, TOASTER_DURATION)
  }

  archiveFeed = (feedId) => {
    if (this.state.isArchive) {
      this.props.archiveFeed(feedId)
    }
  }

  handleDeleteFeed = (feedId) => {
    this.setState({ isLongHoldMenuVisible: false })
    this.setState({ isDelete: true, toasterTitle: 'Feed deleted' })
    setTimeout(() => {
      this.setState({ isShowToaster: false })
      this.deleteFeed(feedId)
    }, TOASTER_DURATION)
  }

  deleteFeed = (feedId) => {
    if (this.state.isDelete) {
      this.props.deleteFeed(feedId)
    }
  }

  handlePinFeed = (feedId) => {
    this.setState({ isLongHoldMenuVisible: false })
    this.setState({ isPin: true, toasterTitle: 'Feed pinned' })
    setTimeout(() => {
      this.setState({ isShowToaster: false })
      this.pinFeed(feedId)
    }, TOASTER_DURATION)
  }

  pinFeed = (feedId) => {
    if (this.state.isPin) {
      this.props.pinFeed(feedId)
    }
  }

  handleUnpinFeed = (feedId) => {
    this.setState({ isLongHoldMenuVisible: false })
    this.setState({ isUnPin: true, toasterTitle: 'Feed unpinned' })
    setTimeout(() => {
      this.setState({ isShowToaster: false })
      this.unpinFeed(feedId)
    }, TOASTER_DURATION)
  }

  unpinFeed = (feedId) => {
    if (this.state.isUnPin) {
      this.props.unpinFeed(feedId)
    }
  }
  onLongHoldMenuHide = () => {
    const { isArchive, isDelete, isPin, isUnPin } = this.state
    if (isArchive || isDelete || isPin || isUnPin) {
      this.setState({ isShowToaster: true })
    }
  }

  render () {
    const { loading, feedoList, emptyState, tabIndex } = this.state

    const miniHeaderHeight = this.state.scrollY.interpolate({
      inputRange: [40, 140],
      outputRange: [0, 60],
      extrapolate: 'clamp'
    })

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
            <Animated.View style={styles.miniHeader, { height: miniHeaderHeight }}>
              <DashboardNavigationBar mode="mini" />
            </Animated.View>


          <ScrollView
            scrollEventThrottle={16}
            onScroll={
              Animated.event(
                [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
              )
            }
          >
            <View style={styles.normalHeader}>
              <DashboardNavigationBar mode="normal" />
            </View>

            {emptyState > 0 && tabIndex === 0
            ? <View style={styles.emptyView}>
                {loading
                  ? <ActivityIndicator animating />
                  : <Text style={styles.emptyText}>Feedo is more fun with feeds</Text>
                }
              </View>
            : <ScrollableTabView
                tabBarActiveTextColor={COLORS.PURPLE}
                tabBarInactiveTextColor={COLORS.MEDIUM_GREY}
                onChangeTab={this.onChangeTab}
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
          <DashboardActionBar />
        )}

        <Modal 
          isVisible={this.state.isModalVisible}
          style={styles.newFeedModalContainer}
        >
          <NewFeedScreen 
            onClose={() => this.setState({ isModalVisible: false })}
          />
        </Modal>

        <Modal 
          isVisible={this.state.isLongHoldMenuVisible}
          style={styles.newFeedModalContainer}
          backdropColor='#e0e0e0'
          backdropOpacity={0.9}
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInTiming={1000}
          onModalHide={this.onLongHoldMenuHide}
          onBackdropPress={() => this.setState({ isLongHoldMenuVisible: false })}
        >
          <FeedLongHoldMenuScreen
            feedData={this.state.selectedFeedData}
            handleArchiveFeed={this.handleArchiveFeed}
            handleDeleteFeed={this.handleDeleteFeed}
            handlePinFeed={this.handlePinFeed}
            handleUnpinFeed={this.handleUnpinFeed}
          />
        </Modal>

        <ToasterComponent
          isVisible={this.state.isShowToaster}
          title={this.state.toasterTitle}
          onPressButton={() => {
            this.setState({ isShowToaster: false, isArchive: false, isDelete: false, isPin: false, isUnPin: false })}
          }
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
})

HomeScreen.propTypes = {
  getFeedoList: PropTypes.func.isRequired,
  feedo: PropTypes.objectOf(PropTypes.any),
  pinFeed: PropTypes.func.isRequired,
  unpinFeed: PropTypes.func.isRequired,
  deleteFeed: PropTypes.func.isRequired,
  archiveFeed: PropTypes.func.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen)

