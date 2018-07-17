import React from 'react'
import {
  ScrollView,
  FlatList,
  View,
  ActivityIndicator,
} from 'react-native'

import PropTypes from 'prop-types'
import styles from './styles'
import FeedItemComponent from '../../components/FeedItemComponent'

class FeedoListContainer extends React.Component {
  render () {
    const { loading, data } = this.props

    const listData = [
      {title: 'Feed title1'},
      {title: 'Feed title2'},
    ]

    if (loading) return <ActivityIndicator animating />

    return (
      <ScrollView>
        <View style={styles.feedContainer}>
          <FlatList
            data={listData}
            keyExtractor={item => item.title}
            renderItem={({ item }) => (
              <FeedItemComponent
                item={item}
              />
            )}
            ListHeaderComponent={this.renderHeader}
          />
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