import React from 'react'
import { Text, View, Platform } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ActionSheet, { ActionSheetCustom } from 'react-native-actionsheet'
import Modal from "react-native-modal"
import FeedActionBarComponent from '../../components/FeedActionBarComponent'
import ShareScreen from '../ShareScreen'
import COLORS from '../../service/colors'
import COMMON_STYLES from '../../themes/styles'

import {
  getFeedDetail
} from '../../redux/feedo/actions';

class FeedLongHoldMenuScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isShowShare: false
    }
  }

  handleSetting = (item) => {
    const { selectedFeedList } = this.props

    switch(item) {
      case 'Delete':
        setTimeout(() => {
          this.ActionSheet.show()
        }, 200)
        return
      case 'Archive':
        this.props.handleArchiveFeed(selectedFeedList)
        return
      case 'Duplicate':
        this.props.handleDuplicateFeed(selectedFeedList)
        return
      case 'Edit':
        this.props.handleEditFeed(selectedFeedList)
        return;
      case 'Leave Flow':
        this.props.handleLeaveFeed(selectedFeedList)
        return;
    }
  }

  onTapActionSheet = (index) => {
    if (index === 0) {
      this.props.handleDeleteFeed(this.props.selectedFeedList)
    }
  }

  handlePin = () => {
    const { selectedFeedList } = this.props

    if (selectedFeedList[0].feed.pinned) {
      this.props.handleUnpinFeed(selectedFeedList)
    } else {
      this.props.handlePinFeed(selectedFeedList)
    }
  }

  openShareModal = () => {
    this.setState({ isShowShare: true })
  }

  closeShareModal = () => {
    setTimeout(() => {
      this.setState({ isShowShare: false })
    }, 250)
  }

  render () {
    const { selectedFeedList, showLongHoldActionBar } = this.props

    if (!showLongHoldActionBar) {
      return null
    }

    return [
      <FeedActionBarComponent
        key="2"
        handlePin={this.handlePin}
        handleShare={this.openShareModal}
        handleSetting={this.handleSetting}
        selectedFeedList={selectedFeedList}
      />,
      <ActionSheet
        key="3"
        ref={ref => this.ActionSheet = ref}
        title={
          Platform.OS === 'ios'
          ? 'Are you sure you want to delete this flow, everything will be gone ...'
          : <Text style={COMMON_STYLES.actionSheetTitleText}>Are you sure you want to delete this flow, everything will be gone ...</Text>
        }
        options={['Delete flow', 'Cancel']}
        cancelButtonIndex={1}
        destructiveButtonIndex={0}
        tintColor={COLORS.PURPLE}
        onPress={(index) => this.onTapActionSheet(index)}
      />,
      <Modal
        key="4"
        isVisible={this.state.isShowShare}
        style={{ margin: 0 }}
        backdropColor={COLORS.MODAL_BACKDROP}
        backdropOpacity={0.4}
        animationIn="zoomInUp"
        animationOut="zoomOutDown"
        animationInTiming={500}
        onModalHide={() => {}}
        onBackdropPress={() => this.closeShareModal()}
        onBackButtonPress={() => this.closeShareModal()}
      >
        <ShareScreen onClose={() => this.closeShareModal()} data={selectedFeedList.length > 0 ? selectedFeedList[0].feed : {}} />
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
  selectedFeedList: PropTypes.arrayOf(PropTypes.any).isRequired,
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
