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
import styles from './styles'

class FeedDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0)
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

    const miniHeaderHeight = this.state.scrollY.interpolate({
      inputRange: [40, 140],
      outputRange: [0, 60],
      extrapolate: 'clamp'
    })

    const ACCORDION_SECTIONS = [
      {
        title: feedData.summary,
        content: feedData.summary
      }
    ]

    console.log('DAT: ',feedData.ideas);

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Animated.View style={styles.miniHeader, { height: miniHeaderHeight }}>
            <FeedNavigationBar mode="mini" />
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
              <FeedNavigationBar mode="normal" title={feedData.headline} />
            </View>
            
            <View style={styles.detailView}>
              <Accordion
                sections={ACCORDION_SECTIONS}
                renderHeader={this.renderHeader}
                renderContent={this.renderContent}
                touchableComponent={TouchableOpacity}
              />

              {feedData.ideas.length > 0
                ? feedData.ideas.map(data => (
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

FeedDetailScreen.defaultProps = {
  feedData: []
}

FeedDetailScreen.propTypes = {
  feedData: PropTypes.objectOf(PropTypes.any),
  feedo: PropTypes.objectOf(PropTypes.any)
}

export default connect(
  mapStateToProps,
)(FeedDetailScreen)

