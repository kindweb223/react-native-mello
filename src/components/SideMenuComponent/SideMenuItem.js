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
          selected ? { backgroundColor: colors.DARK_GREY, borderRadius: 5 } : null
        ]}
        activeOpacity={0.7}
        onPress={onPress}
      >
        <Image source={icon} style={styles.icon} />
        <Text style={styles.text}>
          {text}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = {
  container: {
    marginBottom: 12,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontWeight: '500',
    fontSize: 16,
    color: 'white',
    paddingTop: 8,
    paddingBottom: 8
  },
  icon: {
    width: 20,
    height: 34,
    marginRight: 18
  }
}

SideMenuItem.propTypes = {
  icon: PropTypes.number,
  text: PropTypes.string,
  onPress: PropTypes.func
};

export default SideMenuItem