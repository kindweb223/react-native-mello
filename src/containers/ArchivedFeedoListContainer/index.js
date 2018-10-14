import React from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity
} from 'react-native'

import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import ActionSheet from 'react-native-actionsheet'

import FeedItemContentComponent from '../../components/FeedItemComponent/FeedItemContentComponent'
import FeedLoadingStateComponent from '../../components/FeedLoadingStateComponent'
import CONSTANTS from '../../service/constants'
import COLORS from '../../service/colors'
import styles from './styles'

class ArchivedFeedoListContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentFeed: {}
    }
  }

  onRestoreFeed = (index) => {
    if (index === 0) {
      this.props.restoreFeed({
        feed: this.state.currentFeed
      })
    }
  }

  onShowModal = (item) => {
    this.setState({ currentFeed: item }, () => {
      this.ActionSheet.show()
    })
  }

  renderItem = ({ item, index }) => {
    return (
      <View style={styles.listItem}>
        <FeedItemContentComponent data={item} pinFlag={item.pinned ? true : false} page="archived" />
        <TouchableOpacity activeOpacity={0.8} onPress={() => this.onShowModal(item)}>
          <View style={styles.btnView}>
            <Text style={styles.btnText}>Restore</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { loading, feedoList } = this.props

    if (loading) return <FeedLoadingStateComponent animating />

    return [
      <FlatList
        key="0"
        style={styles.listView}
        contentContainerStyle={styles.listContentView}
        data={feedoList}
        keyExtractor={item => item.id}
        automaticallyAdjustContentInsets={false}
        renderItem={this.renderItem}
      />,
      <ActionSheet
        key="1"
        ref={ref => this.ActionSheet = ref}
        title={'Are you sure you want to restore this feed?'}
        options={['Restore', 'Cancel']}
        cancelButtonIndex={1}
        tintColor={COLORS.PURPLE}
        onPress={(index) => this.onRestoreFeed(index)}
      />
    ]
  }
}

ArchivedFeedoListContainer.propTypes = {
  loading: PropTypes.bool.isRequired,
  feedoList: PropTypes.arrayOf(PropTypes.any).isRequired,
}

export default ArchivedFeedoListContainer