/* global require */
import React from 'react'
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
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
const SETTING_ICON = require('../../../assets/images/Settings/Grey.png')

class FeedFilterScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      feedoList: [],
      filterFeedoList: [],
      userTags: [],
      currentTags: [],
      loading: false,
      inputTag: false
    };
  }

  componentDidMount() {
    const { feedo, initialTag, user } = this.props

    this.setState({ loading: true, currentTags: initialTag })
    this.props.getUserTags(user.userInfo.id)

    if (feedo.feedoList && feedo.feedoList.length > 0) {
      const feedoList = this.sortFeedoList(feedo)
      this.filterByTags(feedoList, initialTag)
    }
  }

  sortFeedoList = feedo => {
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
      ['publishedDate'],
      ['desc']
    )
    
    this.setState({ feedoList })
    return feedoList
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { feedo } = nextProps

    if ((feedo.loading === 'GET_FEEDO_LIST_FULFILLED') || (feedo.loading === 'GET_FEEDO_LIST_REJECTED') ||
      (feedo.loading === 'FEED_FULFILLED') || (feedo.loading === 'DEL_FEED_FULFILLED') || (feedo.loading === 'ARCHIVE_FEED_FULFILLED') ||
      (feedo.loading === 'DUPLICATE_FEED_FULFILLED') || (feedo.loading === 'UPDATE_FEED_FULFILLED') ||
      (feedo.loading === 'DELETE_CARD_FULFILLED') || (feedo.loading === 'MOVE_CARD_FULFILLED') ||
      (feedo.loading === 'UPDATE_CARD_FULFILLED') || (feedo.loading === 'INVITE_HUNT_FULFILLED') ||
      (feedo.loading === 'RESTORE_ARCHIVE_FEED_FULFILLED') || (feedo.loading === 'ADD_DUMMY_FEED')) {
      const feedoList = this.sortFeedoList(feedo)
      this.filterByTags(feedoList, this.state.currentTags)
    }

    if (this.props.feedo.loading === 'GET_USER_TAGS_PENDING' && feedo.loading === 'GET_USER_TAGS_FULFILLED') {
      this.setState({
        loading: false,
        userTags: feedo.userTags
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
          let ft = _.filter(tagList, item => item.text.toLowerCase() === tag.text.toLowerCase())
          if (ft.length > 0) {
            tags.push(tag)
          }
        })

        if (tags.length > 0) {
          filterFeedoList.push(feedo)
        }
      })
    }

    this.setState({ filterFeedoList })
  }

  changeTags = (tags) => {
    const { feedoList } = this.state
    this.setState({ currentTags: tags })
    this.filterByTags(feedoList, tags)
  }

  inputTag = (flag) => {
    this.setState({ inputTag: flag })
  }

  render () {
    const { filterFeedoList, userTags, inputTag } = this.state

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
                <Ionicons name="ios-arrow-back" size={30} color={COLORS.PURPLE} />
                <Text style={styles.backTitle}>My feeds</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
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
              {/*<TouchableOpacity onPress={() => {}}>*/}
                {/*<Image source={SETTING_ICON} />*/}
              {/*</TouchableOpacity>*/}
            </Animated.View>
            
            <View style={styles.detailView}>
              {!this.state.loading && (
                <View style={styles.searchView}>
                  <SearchBarComponent
                    initialTag={this.props.initialTag}
                    userTags={userTags}
                    changeTags={this.changeTags}
                    inputTag={this.inputTag}
                  />
                </View>
              )}

              {filterFeedoList.length > 0
                ? <FeedoListContainer
                    loading={false}
                    feedoList={filterFeedoList}
                  />
                : !inputTag && this.props.initialTag.length > 0 && (
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>No Results Found</Text>
                    </View>
                  )
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

