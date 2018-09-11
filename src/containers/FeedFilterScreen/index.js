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
import LoadingScreen from '../LoadingScreen'

import { 
  getUserTags
} from '../../redux/feedo/actions'

import COLORS from '../../service/colors'
import styles from './styles'

class FeedFilterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      feedoList: [],
      filterFeedoList: [],
      userTags: [],
      loading: false
    };
  }

  componentDidMount() {
    const { feedo, initialTag, user } = this.props

    this.setState({ loading: true })
    this.props.getUserTags(user.userInfo.id)

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
      this.filterByTags(feedoList, initialTag)
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.feedo.loading === 'GET_USER_TAGS_PENDING' && nextProps.feedo.loading === 'GET_USER_TAGS_FULFILLED') {
      this.setState({
        loading: false,
        userTags: nextProps.feedo.userTags
      })
    }

    if (this.props.feedo.loading === 'GET_USER_TAGS_PENDING' && nextProps.feedo.loading === 'GET_USER_TAGS_REJECTED') {
      this.setState({
        loading: false,
        userTags: []
      })
    }
  }

  filterByTags = (feedoList, tagList) => {
    filterFeedoList = []
    if (tagList.length > 0) {
      _.forEach(feedoList, feedo => {
        let tags = []

        _.forEach(feedo.tags, tag => {
          let ft = _.filter(tagList, item => item.text === tag.text)
          if (ft.length > 0) {
            tags = _.concat(tags, tag)
          }
        })

        if (tags.length > 0) {
          filterFeedoList = _.concat(filterFeedoList, feedo)
        }
      })
    }

    this.setState({ filterFeedoList })
  }

  changeTags = (tags) => {
    const { feedoList } = this.state
    this.filterByTags(feedoList, tags)
  }

  render () {
    const { filterFeedoList, userTags } = this.state

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
            
            <View style={styles.detailView}>
              {!this.state.loading && (
                <SearchBarComponent
                  initialTag={this.props.initialTag}
                  userTags={userTags}
                  changeTags={this.changeTags}
                />
              )}

              {filterFeedoList.length > 0
                ? <FeedoListContainer
                    loading={false}
                    feedoList={filterFeedoList}
                  />
                : <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No Results Found</Text>
                  </View>
              }
            </View>
          </ScrollView>
        </View>

        {this.state.loading && <LoadingScreen />}
      </SafeAreaView>
    )
  }
}

const mapStateToProps = ({ feedo, user }) => ({
  feedo,
  user
})

FeedFilterScreen.defaultProps = {
  initialTag: []
}

FeedFilterScreen.propTypes = {
  initialTag: PropTypes.arrayOf(PropTypes.any),
  feedo: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any),
}

const mapDispatchToProps = dispatch => ({
  getUserTags: (userId) => dispatch(getUserTags(userId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedFilterScreen)

