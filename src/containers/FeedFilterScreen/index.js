/* global require */
import React from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Animated,
  TouchableOpacity,
} from 'react-native'

import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import PropTypes from 'prop-types'
import * as R from 'ramda'
import _ from 'lodash'
import Ionicons from 'react-native-vector-icons/Ionicons'

import FeedoListContainer from '../FeedoListContainer'
import SearchBarComponent from '../../components/SearchBarComponent'

import COLORS from '../../service/colors'
import styles from './styles'

class FeedFilterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      feedoList: []
    };
  }

  componentDidMount() {
    const { feedo } = this.props

    if (feedo.feedoList && feedo.feedoList.length > 0) {
      feedoList = feedo.feedoList.map(item => {
        const filteredIdeas = _.filter(item.ideas, idea => idea.coverImage !== null && idea.coverImage !== '')

        return Object.assign(
          {},
          item,
          { coverImages: R.slice(0, filteredIdeas.length > 4 ? 4 : filteredIdeas.length, filteredIdeas) }
        )
      })

      feedoList = _.orderBy(
        _.filter(feedoList, item => item.status === 'PUBLISHED'),
        ['pinned.pinned', 'pinned.pinnedDate', 'publishedDate'],
        ['asc', 'desc', 'desc']
      )

      this.setState({ feedoList })
    }
  }

  render () {
    const { feedoList } = this.state

    const navbarBackground = this.state.scrollY.interpolate({
      inputRange: [40, 41],
      outputRange: ['transparent', '#fff'],
      extrapolate: 'clamp'
    })

    const normalHeaderOpacity = this.state.scrollY.interpolate({
      inputRange: [20, 35],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    })

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Animated.View style={[styles.miniNavView, { backgroundColor: navbarBackground }]}>
            <TouchableOpacity onPress={() => Actions.pop()}>
              <View style={styles.backView}>
                <Ionicons name="ios-arrow-back" style={styles.backIcon} />
                <Text style={styles.backTitle}>My feeds</Text>
              </View>
            </TouchableOpacity>
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
              <View style={styles.headerTitleView}>
                <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">Search</Text>
              </View>
            </Animated.View>

            <SearchBarComponent />
            
            <View style={styles.detailView}>
              {feedoList.length > 0 && (
                <FeedoListContainer
                  loading={false}
                  feedoList={feedoList}
                />
              )}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = ({ feedo }) => ({
  feedo
})

FeedFilterScreen.propTypes = {
  feedo: PropTypes.objectOf(PropTypes.any),
}

export default connect(
  mapStateToProps,
  null
)(FeedFilterScreen)

