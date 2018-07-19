import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import FeedActionBarComponent from '../../components/FeedActionBarComponent'
import FeedItemComponent from '../../components/FeedItemComponent'
import { pinFeed } from '../../redux/feedo/actions'
// import styles from './styles'

class FeedMenuScreen extends React.Component {
  handleSetting = (item) => {
    console.log('ITEM: ', item)
  }

  handlePin = () => {
    this.props.pinFeed(this.props.feedData.id)
  }

  handleShare = () => {
    
  }

  render () {
    const { feedData } = this.props
    return [
      <FeedItemComponent key="1" item={feedData} />,
      <FeedActionBarComponent
        key="2"
        handlePin={this.handlePin}
        handleShare={this.handleShare}
        handleSetting={this.handleSetting}
      />
    ]
  }
}

const mapStateToProps = ({ feedo }) => ({
  feedo
})

const mapDispatchToProps = dispatch => ({
  pinFeed: (data) => dispatch(pinFeed(data)),
})

FeedMenuScreen.propTypes = {
  feedData: PropTypes.objectOf(PropTypes.any).isRequired,
  pinFeed: PropTypes.func.isRequired
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeedMenuScreen)
