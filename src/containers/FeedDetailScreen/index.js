import React from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Animated,
  TouchableOpacity
} from 'react-native'

import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Accordion from 'react-native-collapsible/Accordion'
import { Ionicons } from '@expo/vector-icons'
import FeedNavigationBar from '../../navigations/FeedNavigationBar'
import DashboardActionBar from '../../navigations/DashboardActionBar'
import FeedCardComponent from '../../components/FeedCardComponent'
import { getFeedDetailData } from '../../redux/feedo/actions'
import styles from './styles'

class FeedDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      feedDetailData: {}
    };
  }

  componentDidMount() {
    const { feedData } = this.props
    this.props.getFeedDetailData(feedData.id)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.feedo.feedDetailData === prevState.feedDetailData) {
      return null;
    }
    console.log('FEED_DATA: ', nextProps.feedo.feedDetailData)
    return {
      feedDetailData: nextProps.feedo.feedDetailData
    };
  }

  renderHeader = (section) => {
    return (
      <View style={styles.collapseHeader}>
        <Text style={styles.collapseHeaderText} numberOfLines={1} ellipsizeMode="tail">{section.title}</Text>
        <Ionicons name="ios-arrow-down" style={styles.arrowDownIcon} />
      </View>
    )
  }

  renderContent = (section) => {
    return (
      <View>
        <Text style={styles.contentText}>{section.content}</Text>
      </View>
    )
  }

  render () {
    const { feedData } = this.props
    const { feedDetailData } = this.state

    const miniHeaderHeight = this.state.scrollY.interpolate({
      inputRange: [80, 140],
      outputRange: [0, 60],
      extrapolate: 'clamp'
    })

    const ACCORDION_SECTIONS = [
      {
        title: feedData.summary,
        content: feedData.summary
      }
    ]

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Animated.View style={styles.miniHeader, { height: miniHeaderHeight }}>
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
            <View style={styles.normalHeader}>
              <FeedNavigationBar mode="normal" title={feedData.headline} data={feedDetailData} />
            </View>
            
              <View style={styles.detailView}>
                <Accordion
                  sections={ACCORDION_SECTIONS}
                  renderHeader={this.renderHeader}
                  renderContent={this.renderContent}
                  touchableComponent={TouchableOpacity}
                />

                {feedDetailData && feedDetailData.ideas.length > 0
                  ? feedDetailData.ideas.map(data => (
                      <FeedCardComponent key={data.id} data={data} />
                    ))
                  : <View style={styles.emptyView}>
                      <Text style={styles.emptyText}>It is lonely here</Text>
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
  feedData: [],
  getFeedDetailData: () => {}
}

FeedDetailScreen.propTypes = {
  feedData: PropTypes.objectOf(PropTypes.any),
  feedo: PropTypes.objectOf(PropTypes.any),
  getFeedDetailData: PropTypes.func
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedDetailScreen)

