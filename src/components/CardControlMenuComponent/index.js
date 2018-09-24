import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList
} from 'react-native'
import PropTypes from 'prop-types'
import styles from './styles'

const MENU_ITEMS = ['Move', 'Delete']


class CardControlMenuComponent extends React.Component {

  onHandleAction(item) {
    if (item == 'Move') {
      if (this.props.onMove) {
        this.props.onMove();
      }
    } else if (item == 'Delete') {
      if (this.props.onDelete) {
        this.props.onDelete();
      }
    }
    
  }

  renderItem({item, index}) {
    return (
      <TouchableOpacity
        style={styles.settingItem}
        activeOpacity={0.6}
        onPress={() => this.onHandleAction(item)}
      >
        <Text style={item === 'Delete' ? styles.deleteButtonText : styles.settingButtonText}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  }
  
  render() {
    return (
      <View style={styles.menuContainer}>
        <FlatList
          data={MENU_ITEMS}
          keyExtractor={item => item}
          scrollEnabled={false}
          renderItem={this.renderItem.bind(this)}
          enableEmptySections
        />
      </View>
    )
  }
}

CardControlMenuComponent.propTypes = {
  onMove: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default CardControlMenuComponent
