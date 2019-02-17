/* global require */
import React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native'

import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import PropTypes from 'prop-types'
import _ from 'lodash'
import Ionicons from 'react-native-vector-icons/Ionicons'
import ToasterComponent from '../../components/ToasterComponent'
import ArchivedFeedoListContainer from '../ArchivedFeedoListContainer'

import Analytics from '../../lib/firebase'

import { 
  getArchivedFeedList,
  restoreArchiveFeed
} from '../../redux/feedo/actions'

import COLORS from '../../service/colors'
import styles from './styles'

const NOTIFICATION_EMPTY_ICON = require('../../../assets/images/empty_state/NotificationEmptyState.png')

class ArchivedFeedScreen extends React.Component {
  static renderLeftButton(props) {
    return (
      <TouchableOpacity 
        style={styles.buttonWrapper}
        activeOpacity={0.6}
        onPress={() => Actions.pop()}
      >
        <Ionicons name="ios-arrow-back" size={32} color={COLORS.PURPLE} />
      </TouchableOpacity>
    );
  }

  static renderTitle(props) {
    return (
      <Text style={styles.textTitle}>Archived flows</Text>
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      archivedFeedList: [],
      originalFeedList: [],
      loading: false
    };
  }

  componentDidMount() {
    Analytics.setCurrentScreen('ArchivedScreen')

    this.setState({ loading: true })
    this.props.getArchivedFeedList()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { feedo } = nextProps

    if (this.props.feedo.loading === 'GET_ARCHIVED_FEED_PENDING' && feedo.loading === 'GET_ARCHIVED_FEED_FULFILLED') {
      this.setState({
        loading: false,
        archivedFeedList: feedo.archivedFeedList,
        originalFeedList: feedo.archivedFeedList
      })
    }

    if (this.props.feedo.loading === 'GET_ARCHIVED_FEED_PENDING' && feedo.loading === 'GET_ARCHIVED_FEED_REJECTED') {
      this.setState({
        loading: false,
        archivedFeedList: [],
        originalFeedList: []
      })
    }

    if (this.props.feedo.loading === 'RESTORE_ARCHIVE_FEED_PENDING' && feedo.loading === 'RESTORE_ARCHIVE_FEED_FULFILLED') {
      this.setState({
        archivedFeedList: feedo.archivedFeedList,
        originalFeedList: feedo.archivedFeedList
      })
    }
  }

  showToaster = (data) => {
    const { archivedFeedList } = this.state
    const restFeedoList = _.filter(archivedFeedList, feed => feed.id !== data.feed.id)
    this.setState({ archivedFeedList: restFeedoList })
    this.setState({ isShowToaster: true }, () => this.restoreFeed(data))
  }

  restoreFeed = (data) => {
    setTimeout(() => {
      if (this.state.isShowToaster) {
        this.setState({ isShowToaster: false })
        this.props.restoreArchiveFeed(data.feed.id)
      }
    }, 5000)
  }

  undoAction = () => {
    this.setState({ isShowToaster: false }, () => {
      this.setState({ archivedFeedList: this.state.originalFeedList })
    })
  }

  render () {
    let { archivedFeedList, loading, isShowToaster } = this.state

    archivedFeedList = _.orderBy(archivedFeedList, ['metadata.myLastActivityDate'], ['desc'])

    return (
      <View style={styles.container}>
        <ArchivedFeedoListContainer
          loading={loading}
          feedoList={archivedFeedList}
          restoreFeed={this.showToaster}
        />

        {archivedFeedList.length === 0 && !loading && (
          <View style={styles.emptyView}>
            <Image
              source={NOTIFICATION_EMPTY_ICON}
            />
            <Text style={styles.title}>Nothing archived yet</Text>
            <Text style={styles.subTitle}>Archive old flows to clear space for new ones!</Text>
          </View>
        )}

        {isShowToaster && (
          <ToasterComponent
            isVisible={isShowToaster}
            title="Flow restored"
            onPressButton={this.undoAction}
          />
        )}
      </View>
    )
  }
}

const mapStateToProps = ({ feedo, user }) => ({
  feedo,
  user
})

ArchivedFeedScreen.propTypes = {
  feedo: PropTypes.objectOf(PropTypes.any),
  user: PropTypes.objectOf(PropTypes.any)
}

const mapDispatchToProps = dispatch => ({
  getArchivedFeedList: () => dispatch(getArchivedFeedList()),
  restoreArchiveFeed: (feedId) => dispatch(restoreArchiveFeed(feedId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArchivedFeedScreen)

