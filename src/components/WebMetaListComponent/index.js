import React from 'react'
import {
  TouchableOpacity,
  View,
  FlatList,
  Image,
  Text,
  Linking,
  Platform,
} from 'react-native'
import PropTypes from 'prop-types'

import SafariView from "react-native-safari-view";
import InAppBrowser from 'react-native-inappbrowser-reborn'
import * as mime from 'react-native-mime-types';
import SVGImage from 'react-native-remote-svg';
import SvgUri from 'react-native-svg-uri';


import styles from './styles'
import COLORS from '../../service/colors'
import FastImage from "react-native-fast-image";
import colors from '../../service/colors';


export default class WebMetaList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      links: [...this.props.links],
    };
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

  async onPressLink(index) {
    const url = this.props.links[index].originalUrl;
    if (Platform.OS === 'ios') {
      SafariView.isAvailable()
        .then(SafariView.show({
          url: url,
          tintColor: COLORS.PURPLE
        }))
        .catch(error => {
          // Fallback WebView code for iOS 8 and earlier
          Linking.canOpenURL(url)
            .then(supported => {
              if (!supported) {
                console.log('Can\'t handle url: ' + url);
              } else {
                return Linking.openURL(url);
              }
            })
            .catch(error => console.error('An error occurred', error));
        });
    } else {
      // Android 
      try {
        await InAppBrowser.isAvailable()
        InAppBrowser.open(url, {
          toolbarColor: COLORS.PURPLE,
        }).then((result) => {
          console.log(result);
        })
      } catch (error) {
        console.log(error);
      }
    }
  }

  onLongPressLink(index) {
    const url = this.props.links[index].originalUrl;
    this.props.longPressLink(url)
  }

  renderImage(item) {
    if (item.faviconUrl) {
      if (item.faviconUrl.indexOf('data:image/svg+xml;base64') !== -1) {
        return (
          <SvgUri
            width="24"
            height="24"
            source={{uri: item.faviconUrl}}
            style={styles.imageCover}
          />
        );
      }
      const mimeType = mime.lookup(item.faviconUrl);
      if (mimeType !== false && mimeType.indexOf('svg') !== -1) {
        return (
          <SVGImage
            style={styles.imageCover}
            source={{uri: item.faviconUrl}}
          />
        );
      }
      const ImageView = this.props.isFastImage ? FastImage : Image;
      return (
        <ImageView style={styles.imageCover} source={{uri: item.faviconUrl}} resizeMode='cover' />
      );
    }
  }

  renderItem({item, index}) {
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity 
          style={[styles.buttonContainer, {backgroundColor: '#ECECEC'}]}
          activeOpacity={0.7}
          onPress={() => this.onPressLink(index)}
          onLongPress={() => this.onLongPressLink(index)}
        >
          {this.renderImage(item)}
          <Text style={styles.textLink} numberOfLines={1}>{item.originalUrl}</Text>
        </TouchableOpacity>
      </View>
    );
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
  isFastImage: true,
  editable: true,
  onRemove: () => {},
}


WebMetaList.propTypes = {
  links: PropTypes.array,
  isFastImage: PropTypes.bool,
  editable: PropTypes.bool,
  onRemove: PropTypes.func,
}
