import React from 'react'
import {
  View,
  Image,
} from 'react-native'
import PropTypes from 'prop-types'
import UserAvatar from './CustomAvatar'

import EvilIcons from 'react-native-vector-icons/EvilIcons'
import styles from './styles'
import ExFastImage from '../ExFastImage';


export default class UserAvatarComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  capitalizeFirstLetter(string) {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return string;
  }

  render() {
    const {
      user,
      size,
      color,
      textColor,
      isFastImage,
      showStroke
    } = this.props;
    if (user && (user.imageUrl || user.firstName || user.lastName)) {
      const name = `${this.capitalizeFirstLetter(user.firstName)} ${this.capitalizeFirstLetter(user.lastName)}`;
      const avatarSize = showStroke ? size - 5 : size
      if (user.imageUrl) {
        return (
          <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
            <UserAvatar
              size={avatarSize}
              name={name}
              color={color}
              textColor={textColor}
              component={isFastImage ? ExFastImage : Image}
              src={user.imageUrl}
            />
          </View>
        );
      } else {
        return (
          <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
            <UserAvatar
              size={avatarSize}
              name={name}
              color={color}
              textColor={textColor}
              component={isFastImage ? ExFastImage : Image}
              src={user.imageUrl}
            />
          </View>
        );
      }
    }
    return (
      <View 
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <EvilIcons name="envelope" size={size / 5 * 4} color={textColor} style={{ marginTop: size / 10 }}/>
      </View>
    );
  }
}


UserAvatarComponent.defaultProps = {
  size: 24,
  color: '#000',
  textColor: '#fff',
  isFastImage: true,
  showStroke: false
}


UserAvatarComponent.propTypes = {
  user: PropTypes.object.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
  textColor: PropTypes.string,
  isFastImage: PropTypes.bool,
  showStroke: PropTypes.bool
}
