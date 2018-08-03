import React from 'react'
import { Text } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import FeedActionBarComponent from '../../components/FeedActionBarComponent'
import FeedItemComponent from '../../components/FeedItemComponent'
import COLORS from '../../service/colors'
import styles from './styles'

const ACTIONSHEET_OPTIONS = [
  <Text key="0" style={styles.actionButtonText}>Delete feed</Text>,
  'Cancel'
]

class FeedLongHoldMenuScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pinFlag: props.feedData.pinned ? true : false,
    }
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

  handleShare = () => {
    
  }

  render () {
    const { feedData } = this.props

    return [
      <FeedItemComponent key="1" item={feedData} pinFlag={this.state.pinFlag} />,
      <FeedActionBarComponent
        key="2"
        handlePin={this.handlePin}
        handleShare={this.handleShare}
        handleSetting={this.handleSetting}
        data={feedData}
        pinFlag={this.state.pinFlag}
      />,
      <ActionSheet
        key="3"
        ref={o => this.ActionSheet = o}
        title={<Text style={styles.titleText}>Are you sure you want to delete this feed, everything will be gone ...</Text>}
        options={ACTIONSHEET_OPTIONS}
        cancelButtonIndex={1}
        destructiveButtonIndex={2}
        tintColor={COLORS.PURPLE}
        styles={styles}
        onPress={(index) => this.onTapActionSheet(index)}
      />
    ]
  }
}

const mapStateToProps = ({ feedo }) => ({
  feedo
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
  null
)(FeedLongHoldMenuScreen)
