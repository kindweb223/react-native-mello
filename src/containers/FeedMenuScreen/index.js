import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ActionSheet from 'react-native-actionsheet'
import FeedActionBarComponent from '../../components/FeedActionBarComponent'
import FeedItemComponent from '../../components/FeedItemComponent'
import {
  pinFeed,
  unpinFeed,
  deleteFeed,
} from '../../redux/feedo/actions'
import COLORS from '../../service/colors'

class FeedMenuScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pinFlag: props.feedData.pinned ? true : false
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { feedo } = nextProps
  
    if (feedo.loading === 'FEED_FULFILLED') {
      return {
        pinFlag : !prevState.pinFlag
      }
    }
    return null
  }

  handleSetting = (item) => {
    switch(item) {
      case 'Delete':
        this.ActionSheet.show();
        return;
    }
  }

  onTapActionSheet = (index) => {
    if (index === 0) {
      this.props.deleteFeed(this.props.feedData.id)
      this.props.closeFeedMenu()
    }
  }

  handlePin = () => {
    const { feedData } = this.props
    if (feedData.pinned) {
      this.props.unpinFeed(feedData.id)
    } else {
      this.props.pinFeed(feedData.id)
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
        title='Are you sure you want to delete this feed, everything will be gone ...'
        options={['Delete feed', 'Cancel']}
        cancelButtonIndex={1}
        destructiveButtonIndex={1}
        tintColor={COLORS.PURPLE}
        onPress={(index) => this.onTapActionSheet(index)}
      />
    ]
  }
}

const mapStateToProps = ({ feedo }) => ({
  feedo
})

const mapDispatchToProps = dispatch => ({
  pinFeed: (data) => dispatch(pinFeed(data)),
  unpinFeed: (data) => dispatch(unpinFeed(data)),
  deleteFeed: (data) => dispatch(deleteFeed(data)),
  
})

FeedMenuScreen.propTypes = {
  feedData: PropTypes.objectOf(PropTypes.any).isRequired,
  closeFeedMenu: PropTypes.func.isRequired,
  pinFeed: PropTypes.func.isRequired,
  unpinFeed: PropTypes.func.isRequired,
  deleteFeed: PropTypes.func.isRequired
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedMenuScreen)
