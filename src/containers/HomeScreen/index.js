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
import { filter, sortBy } from 'lodash'
import DashboardNavigationBar from '../../navigations/DashboardNavigationBar'
// import FeedNavigationBar from '../../navigations/FeedNavigationBar'

import DashboardActionBar from '../../navigations/DashboardActionBar'
import FeedoListContainer from '../FeedoListContainer'
import NewFeedScreen from '../NewFeedScreen'
import FeedMenuScreen from '../FeedMenuScreen'
import COLORS from '../../service/colors'
import styles from './styles'

import { getFeedoList } from '../../redux/feedo/actions'

const TAB_STYLES = {
  height: '100%',
  paddingTop: 10,
  paddingHorizontal: 10,
}


class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feedoList: [],
      loading: false,
      isModalVisible: true,
      isFeedMenuVisible: false,
      selectedFeedData: {},
      tabIndex: 0,
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

      feedoList = sortBy(filter(feedoList, item => item.status === 'PUBLISHED'), item => item.dateCreated)

      return {
        feedoList,
        loading: false
      }
    }

    return null
  }

  onChangeTab = ({ i }) => {
    this.setState({ tabIndex: i, loading: true })
    this.props.getFeedoList(i)
  }

  handleFeedMenu = (selectedFeedData) => {
    this.setState({ selectedFeedData })
    this.setState({ isFeedMenuVisible: true })
  }

  render () {
    const { loading, feedoList } = this.state

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

            {feedoList.length > 0 && !loading
            ? <ScrollableTabView
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
                  handleFeedMenu={this.handleFeedMenu}
                />
                <FeedoListContainer
                  loading={loading}
                  feedoList={feedoList}
                  tabLabel={{ label: 'Pinned' }}
                  handleFeedMenu={this.handleFeedMenu}
                />
                <FeedoListContainer
                  loading={loading}
                  feedoList={feedoList}
                  tabLabel={{ label: 'Shared with me' }}
                  handleFeedMenu={this.handleFeedMenu}
                />
              </ScrollableTabView>
            : <View style={styles.emptyView}>
                {loading
                  ? <ActivityIndicator animating />
                  : <Text style={styles.emptyText}>Feedo is more fun with feeds</Text>
                }
              </View>
            }
          </ScrollView>

        </View>

        <DashboardActionBar />

        {/* <Modal 
          isVisible={this.state.isModalVisible}
          style={styles.newFeedModalContainer}
        >
          <NewFeedScreen 
            onClose={() => this.setState({ isModalVisible: false })}
          />
        </Modal> */}
        {
          this.state.isModalVisible && 
          <View style={styles.newFeedContainer}>
            <NewFeedScreen 
              onClose={() => this.setState({ isModalVisible: false })}
            />
          </View>
        }

        <Modal 
          isVisible={this.state.isFeedMenuVisible}
          style={styles.newFeedModalContainer}
          backdropColor='#c0c0c0'
          backdropOpacity={0.9}
          onBackdropPress={() => this.setState({ isFeedMenuVisible: false })}
        >
          <FeedMenuScreen
            feedData={this.state.selectedFeedData}
            closeFeedMenu={() => this.setState({ isFeedMenuVisible: false })}
          />
        </Modal>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = ({ feedo }) => ({
  feedo
})

const mapDispatchToProps = dispatch => ({
  getFeedoList: (index) => dispatch(getFeedoList(index)),
})

HomeScreen.propTypes = {
  getFeedoList: PropTypes.func.isRequired,
  feedo: PropTypes.objectOf(PropTypes.any)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen)

