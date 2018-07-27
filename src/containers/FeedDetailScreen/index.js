/* global require */
import React from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  Animated,
  ActivityIndicator
} from 'react-native'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import FeedNavigationBar from '../../navigations/FeedNavigationBar'
import DashboardActionBar from '../../navigations/DashboardActionBar'
import FeedCardComponent from '../../components/FeedCardComponent'
import FeedCollapseComponent from '../../components/FeedCollapseComponent'
import { getFeedDetailData } from '../../redux/feedo/actions'
import styles from './styles'
const EMPTY_ICON = require('../../../assets/images/empty_state/asset-emptystate.png')

class FeedDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      feedDetailData: {},
      loading: false,
    };
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

  render () {
    const { data } = this.props
    const { feedDetailData, loading } = this.state

    const miniHeaderOpacity = this.state.scrollY.interpolate({
      inputRange: [70, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    })

    const normalHeaderOpacity = this.state.scrollY.interpolate({
      inputRange: [40, 70],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    })

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Animated.View style={[styles.miniHeader, { opacity: miniHeaderOpacity }]}>
            <FeedNavigationBar mode="mini" data={feedDetailData}/>
          </Animated.View>

          <ScrollView
            scrollEventThrottle={16}
            onScroll={
              Animated.event(
                [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
              )
            }
          >
            <Animated.View style={[styles.normalHeader, {opacity: normalHeaderOpacity}]}>
              <FeedNavigationBar mode="normal" title={data.headline} data={feedDetailData} />
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

        <DashboardActionBar />
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

