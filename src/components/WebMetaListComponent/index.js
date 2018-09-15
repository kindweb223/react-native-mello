import React from 'react'
import {
  TouchableOpacity,
  View,
  Animated,
  FlatList,
  Image,
  Text,
  Linking,
} from 'react-native'
import PropTypes from 'prop-types'

import { Actions } from 'react-native-router-flux'
import Ionicons from 'react-native-vector-icons/Ionicons'

import styles from './styles'
import CONSTANTS from '../../service/constants'
import COLORS from '../../service/colors'


export default class WebMetaList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      links: [...this.props.links],
    };
    this.animatedSelect = new Animated.Value(0);
    this.linksCount = this.props.links.length || 0;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.links.length !== this.linksCount) {
      //add / remove
      this.setState({
        links: nextProps.links,
      });
      this.linksCount = nextProps.links.length;
    }
  }

  onRemove(index) {
    if (this.props.onRemove) {
      this.props.onRemove(this.state.links[index].id);
    }
  }

  onPressLink(index) {
    const url = this.props.links[index].originalUrl;
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL(url);
      }
    }).catch(error => console.error('An error occurred', error));
  }

  renderItem({item, index}) {
    return (
      <Animated.View style={styles.itemContainer}>
        <TouchableOpacity 
          style={styles.buttonContainer}
          activeOpacity={0.7}
          onPress={() => this.onPressLink(index)}
        >
          <Image style={styles.imageCover} source={{uri: item.imageUrl, cache: 'force-cache'}} resizeMode='cover' />
          <View style={styles.infoContainer}>
            <Text style={styles.textTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.textDescription} numberOfLines={1}>{item.description}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.closeButtonContainer}
          activeOpacity={0.8}
          onPress={() => this.onRemove(index)}
        >
          <View style={styles.closeSubButtonContainer}>
            <Ionicons name="md-close" size={18} color={'#fff'} style={{marginTop: 2, marginLeft: 1}} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  render () {
    return (
      <FlatList
        style={styles.container}
        showsHorizontalScrollIndicator={false}
        data={this.state.links}
        renderItem={this.renderItem.bind(this)}
        keyExtractor={(item, index) => index.toString()}
        extraData={this.state}
        bounces={false}
      />
    );
  }
}


WebMetaList.defaultProps = {
  links: [],
  editable: true,
  onRemove: () => {},
}


WebMetaList.propTypes = {
  links: PropTypes.array,
  editable: PropTypes.bool,
  onRemove: PropTypes.func,
}
