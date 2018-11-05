import React from 'react'
import {
  View,
  Image,
} from 'react-native'
import PropTypes from 'prop-types'
import UserAvatar from 'react-native-user-avatar'

import EvilIcons from 'react-native-vector-icons/EvilIcons'
import styles from './styles'
import FastImage from "react-native-fast-image";


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
    } = this.props;
    if (user.imageUrl || user.firstName || user.lastName) {
      const name = `${this.capitalizeFirstLetter(user.firstName)} ${this.capitalizeFirstLetter(user.lastName)}`;
      return (
        <UserAvatar
          size={size}
          name={name}
          color={color}
          textColor={textColor}
          component={isFastImage ? FastImage : Image}
          src={user.imageUrl}
        />
      );
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
        <EvilIcons name="envelope" size={size / 5 * 4} color={textColor} style={{marginTop: size / 10 }}/>
      </View>
    );
  }
}


UserAvatarComponent.defaultProps = {
  size: 24,
  color: '#000',
  textColor: '#fff',
  isFastImage: true,
}


UserAvatarComponent.propTypes = {
  user: PropTypes.object.isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
  textColor: PropTypes.string,
  isFastImage: PropTypes.bool,
}
