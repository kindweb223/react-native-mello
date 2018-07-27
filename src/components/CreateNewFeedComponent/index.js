import React from 'react'
import {
  Image,
  FlatList,
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import PropTypes from 'prop-types'

import { Actions } from 'react-native-router-flux'

import styles from './styles'
import CONSTANTS from '../../service/constants'

const CreateItems = [
  {
    title: 'New Card',
    description: 'Quickly add card to feed',
    icon: require('../../../assets/images/Add/Blue.png')
  },
  {
    title: 'New Feed',
    description: 'Start new feed and collect ideas',
    icon: require('../../../assets/images/Feed/Blue.png')
  },
]


export default class CreateNewFeedComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  onSelectItem(item) {
    if (this.props.onSelect) {
      this.props.onSelect(item.title);
    }
  }

  renderItem({item, index}) {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        activeOpacity={0.6}
        onPress={() => this.onSelectItem(item)}
      >
        <View style={styles.leftContentContainer}> 
          <Image source={item.icon} resizeMode='contain' />
        </View>
        <View style={styles.rightContentContainer}>
          <Text style={styles.textTitle}>{item.title}</Text>
          <Text style={styles.textDescription}>{item.description}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.mainContentContainer}>
          <FlatList
            data={CreateItems}
            bounces={false}
            renderItem={this.renderItem.bind(this)}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    );
  }
}


CreateNewFeedComponent.defaultProps = {
  onSelect: () => {},
}


CreateNewFeedComponent.propTypes = {
  onSelect: PropTypes.func,
}