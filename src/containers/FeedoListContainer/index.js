import React from 'react'
import {
  ScrollView,
  View,
} from 'react-native'

import PropTypes from 'prop-types'

class FeedoListContainer extends React.Component {
  render () {
    return (
      <ScrollView>
        <View />
      </ScrollView>
    )
  }
}

FeedoListContainer.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
}

export default FeedoListContainer
