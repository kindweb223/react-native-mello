import React from 'react'
import {
  View,
  TouchableOpacity,
  Animated,
  Image
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styles from './styles'
import SideMenuItem from './SideMenuItem'
import { images } from '../../themes'

class SideMenuComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { onItemSelected, selectedItem } = this.props;
    return (
      <View style={styles.container}>
        <Image source={images.iconMello} style={styles.melloIcon} />
        <SideMenuItem
          text='All flows'
          selected={selectedItem === 'all'}
          onPress={() => onItemSelected('all', 'All flows')}
          icon={images.iconFlow}
        />
        <SideMenuItem
          text='My flows'
          selected={selectedItem === 'owned'}
          onPress={() => onItemSelected('owned', 'My flows')}
          icon={images.iconPerson}
        />
        <SideMenuItem
          text='Shared with me'
          selected={selectedItem === 'shared'}
          onPress={() => onItemSelected('shared', 'Shared with me')}
          icon={images.iconPeople}
        />
      </View>
    )
  }
}

SideMenuComponent.propTypes = {
  onItemSelected: PropTypes.func
};

export default SideMenuComponent