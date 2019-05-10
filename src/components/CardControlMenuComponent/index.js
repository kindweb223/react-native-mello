import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList
} from 'react-native'
import PropTypes from 'prop-types'
import styles from './styles'
import CONSTANTS from '../../service/constants'

const MENU_ITEMS = ['Edit note', 'Add image', 'Add file', 'Move', 'Delete']

class CardControlMenuComponent extends React.Component {
  onHandleAction(item) {
    if (item == 'Edit note') {
      if (this.props.onEditIdea) {
        this.props.onEditIdea();
      }
    } else if (item == 'Add image') {
      if (this.props.onAddImage) {
        this.props.onAddImage();
      }
    } else if (item == 'Add file') {
      if (this.props.onAddFile) {
        this.props.onAddFile();
      }
    } else if (item == 'Move') {
      if (this.props.onMove) {
        this.props.onMove();
      }
    } else if (item == 'Delete') {
      if (this.props.onDelete) {
        this.props.onDelete();
      }
    } else if (item == 'Report') {
      if (this.props.onReport) {
        this.props.onReport();
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
        <Text style={(item === 'Delete' || item === 'Report') ? styles.deleteButtonText : styles.settingButtonText}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  }
  
  render() {
    const { viewMode } = this.props

    let menuItems = []
    if (viewMode === CONSTANTS.CARD_EDIT) {
      menuItems = MENU_ITEMS
    } else {
      menuItems = ['Report']
    }

    return (
      <View style={styles.menuContainer}>
        <FlatList
          data={menuItems}
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
  onEditIdea: PropTypes.func.isRequired,
  onAddImage: PropTypes.func.isRequired,
  onAddFile: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onReport: PropTypes.func.isRequired
}

export default CardControlMenuComponent
