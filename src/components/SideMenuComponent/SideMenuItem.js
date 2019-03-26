import React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Image
} from 'react-native'
import PropTypes from 'prop-types'
import colors from '../../service/colors';
import { images } from '../../themes'

class SideMenuItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { icon, text, onPress, selected } = this.props
    return (
      <TouchableOpacity
        style={[
          styles.container,
          selected ? { backgroundColor: '#565656', borderRadius: 5 } : null
        ]}
        activeOpacity={0.7}
        onPress={onPress}
      >
        <Image source={icon} style={styles.icon} />
        <Text style={[styles.text, { color: selected ? 'white' : '#B5B5B5' }]}>
          {text}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = {
  container: {
    marginBottom: 4,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontWeight: '500',
    fontSize: 16,
    color: 'white',
    paddingTop: 4,
    paddingBottom: 4
  },
  icon: {
    width: 19,
    height: 32,
    marginRight: 18
  }
}

SideMenuItem.propTypes = {
  icon: PropTypes.number,
  text: PropTypes.string,
  onPress: PropTypes.func
};

export default SideMenuItem