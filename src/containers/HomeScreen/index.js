import React from 'react'
import {
  SafeAreaView,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import TabBar from 'react-native-underline-tabbar'
import Modal from "react-native-modal"
import PropTypes from 'prop-types'
import { getFeedoList } from '../../redux/feedo/actions'
import DashboardNavigationBar from '../../navigations/DashboardNavigationBar'
import DashboardActionBar from '../../navigations/DashboardActionBar'
import FeedoListContainer from '../FeedoListContainer'
import NewFeedScreen from '../NewFeedScreen'
import COLORS from '../../service/colors'
import styles from './styles'

const TAB_STYLES = {
  height: '100%',
  paddingTop: 10,
  paddingHorizontal: 10,
}


class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      feedoList: {},
      loading: false
    };
  }

  componentDidMount() {
    this.setState({ loading: true })
    this.props.getFeedoList()
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { feedo } = nextProps
    if (prevState.loading === true && feedo.loading === 'GET_FEEDO_LIST_FULFILLED') {
      return {
        feedoList: nextProps.feedo.feedoList,
        loading: false
      }
    }

    return {
      loading: true
    }
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
            renderTabBar={() => <TabBar
                                  underlineHeight={0}
                                  underlineBottomPosition={0}
                                  tabBarStyle={styles.tabBarStyle}
                                  tabBarTextStyle={styles.tabBarTextStyle}
                                  tabMargin={10}
                                  tabStyles={{ 'tab': TAB_STYLES }}
                                />}
          >
            <FeedoListContainer tabLabel={{label: 'All'}} data={feedoList} loading={loading} />
            <FeedoListContainer tabLabel={{label: 'Pinned'}} data={feedoList} loading={loading} />
            <FeedoListContainer tabLabel={{label: 'Shared with me'}} data={feedoList} loading={loading} />
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
  getFeedoList: () => dispatch(getFeedoList()),
})

HomeScreen.propTypes = {
  feedo: PropTypes.objectOf(PropTypes.any),
  getFeedoList: PropTypes.func.isRequired
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeScreen)
