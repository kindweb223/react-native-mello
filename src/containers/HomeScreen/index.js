import React from 'react'
import {
  SafeAreaView,
  View,
} from 'react-native'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import TabBar from 'react-native-underline-tabbar'
import Modal from "react-native-modal"
import DashboardNavigationBar from '../../navigations/DashboardNavigationBar'
// import FeedNavigationBar from '../../navigations/FeedNavigationBar'
import DashboardActionBar from '../../navigations/DashboardActionBar'
import FeedoListContainer from '../FeedoListContainer'
import NewFeedScreen from '../NewFeedScreen'
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
      isModalVisible: false,
      tabIndex: 0
    };
  }

  componentDidMount() {
    this.setState({ loading: true })
    this.props.getFeedoList(this.state.tabIndex)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { feedo } = nextProps
  
    if (prevState.loading === true && feedo.loading === 'GET_FEEDO_LIST_FULFILLED') {
      return {
        feedoList: feedo.feedoList,
        loading: false
      }
    }

    return {
      loading: true
    }
  }

  onChangeTab = ({ i }) => {
    this.setState({ tabIndex: i, loading: true })
    this.props.getFeedoList(i)
  }

  render () {
    const { loading, feedoList } = this.state

    return (
      <SafeAreaView style={styles.safeArea}>
        <DashboardNavigationBar />
        
        <View style={styles.container}>
          <ScrollableTabView
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
            <FeedoListContainer loading={loading} feedoList={feedoList} tabLabel={{ label: 'All' }} />
            <FeedoListContainer loading={loading} feedoList={feedoList} tabLabel={{ label: 'Pinned' }} />
            <FeedoListContainer loading={loading} feedoList={feedoList} tabLabel={{ label: 'Shared with me' }} />
          </ScrollableTabView>
        </View>

        <DashboardActionBar />
        <Modal 
          isVisible={this.state.isModalVisible}
          style={styles.newFeedModalContainer}
        >
          <NewFeedScreen 
            onClose={() => this.setState({isModalVisible: false})}
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

