import React from 'react'
import FeedCardListComponent from './FeedCardListComponent'
import FeedCardExtendComponent from './FeedCardExtendComponent'

class FeedCardComponent extends React.Component {
  render() {
    if (this.props.listType === 'list') {
      return (
        <FeedCardListComponent {...this.props} />
      )
    } else {
      return (
        <FeedCardExtendComponent {...this.props} />
      )
    }
  }
}

export default FeedCardComponent
