import React from 'react'
import {
  ScrollView,
  View,
  Text,
  ActivityIndicator,
} from 'react-native'

import PropTypes from 'prop-types'

class FeedoListContainer extends React.Component {
  render () {
    const { loading, data } = this.props
    
    if (loading) return <ActivityIndicator />

    return (
      <ScrollView>
        <View>
          <Text>Feeo List</Text>
        </View>
      </ScrollView>
    )
  }
}

FeedoListContainer.defaultProps = {
  loading: false
}

FeedoListContainer.propTypes = {
  data: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.bool
}

export default FeedoListContainer