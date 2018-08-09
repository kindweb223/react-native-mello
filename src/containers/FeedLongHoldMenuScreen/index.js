import React from 'react'
import { Text } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import Modal from "react-native-modal"
import FeedActionBarComponent from '../../components/FeedActionBarComponent'
import FeedItemComponent from '../../components/FeedItemComponent'
import ShareScreen from '../ShareScreen'
import COLORS from '../../service/colors'
import styles from './styles'

import {
  getFeedDetail
} from '../../redux/feedo/actions';

const ACTIONSHEET_OPTIONS = [
  <Text key="0" style={styles.actionButtonText}>Delete feed</Text>,
  'Cancel'
]

class FeedLongHoldMenuScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pinFlag: props.feedData.pinned ? true : false,
      isShowShare: false,
      currentFeed: {}
    }
  }

  componentDidMount() {
    const { feedData } = this.props
    this.setState({ currentFeed: feedData })
    this.props.getFeedDetail(feedData.id)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.feedo.currentFeed !== prevState.currentFeed && (
        nextProps.feedo.loading === 'GET_FEED_DETAIL_FULFILLED' ||
        nextProps.feedo.loading === 'DELETE_INVITEE_FULFILLED' ||
        nextProps.feedo.loading === 'UPDATE_SHARING_PREFERENCES_FULFILLED' ||
        nextProps.feedo.loading === 'UPDATE_INVITEE_PERMISSION_FULFILLED')) {
      return {
        currentFeed: nextProps.feedo.currentFeed,
      }
    }
    return null
  }

  handleSetting = (item) => {
    switch(item) {
      case 'Delete':
        this.ActionSheet.show()
        return
      case 'Archive':
        this.props.handleArchiveFeed(this.props.feedData.id)
        return
      case 'Duplicate':
        this.props.handleDuplicateFeed(this.props.feedData.id)
        return
      case 'Edit':
        this.props.handleEditFeed(this.props.feedData.id)
        return;
    }
  }

  onTapActionSheet = (index) => {
    if (index === 0) {
      this.props.handleDeleteFeed(this.props.feedData.id)
    }
  }

  handlePin = () => {
    if (this.props.feedData.pinned) {
      this.props.handleUnpinFeed(this.props.feedData.id)
    } else {
      this.props.handlePinFeed(this.props.feedData.id)
    }
  }

  openShareModal = () => {
    this.setState({ isShowShare: true })
  }

  closeShareModal = () => {
    this.setState({ isShowShare: false })
  }

  render () {
    const { feedData } = this.props
    const { currentFeed } = this.state

    return [
      <FeedItemComponent key="1" item={feedData} pinFlag={this.state.pinFlag} />,
      <FeedActionBarComponent
        key="2"
        handlePin={this.handlePin}
        handleShare={this.openShareModal}
        handleSetting={this.handleSetting}
        data={feedData}
        pinFlag={this.state.pinFlag}
      />,
      <ActionSheet
        key="3"
        ref={ref => this.ActionSheet = ref}
        title={<Text style={styles.titleText}>Are you sure you want to delete this feed, everything will be gone ...</Text>}
        options={ACTIONSHEET_OPTIONS}
        cancelButtonIndex={1}
        destructiveButtonIndex={2}
        tintColor={COLORS.PURPLE}
        styles={styles}
        onPress={(index) => this.onTapActionSheet(index)}
      />,
      <Modal
        key="4"
        isVisible={this.state.isShowShare}
        style={{ margin: 0 }}
        backdropColor='#f5f5f5'
        backdropOpacity={0.9}
        animationIn="zoomInUp"
        animationOut="zoomOutDown"
        animationInTiming={500}
        onModalHide={() => {}}
      >
        <ShareScreen onClose={() => this.closeShareModal()} data={currentFeed} />
      </Modal>
    ]
  }
}

const mapStateToProps = ({ feedo }) => ({
  feedo
})

const mapDispatchToProps = dispatch => ({
  getFeedDetail: data => dispatch(getFeedDetail(data)),
})

FeedLongHoldMenuScreen.propTypes = {
  feedData: PropTypes.objectOf(PropTypes.any).isRequired,
  handleArchiveFeed: PropTypes.func.isRequired,
  handleDeleteFeed: PropTypes.func.isRequired,
  handlePinFeed: PropTypes.func.isRequired,
  handleUnpinFeed: PropTypes.func.isRequired,
  handleDuplicateFeed: PropTypes.func.isRequired,
  handleEditFeed: PropTypes.func.isRequired,
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedLongHoldMenuScreen)
