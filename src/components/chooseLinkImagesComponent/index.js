import React from 'react'
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  BackHandler,
} from 'react-native'
import PropTypes from 'prop-types'

import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles'
import CONSTANTS from '../../service/constants'
import COLORS from '../../service/colors'
import FastImage from "react-native-fast-image";


export default class ChooseLinkImages extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedImages: [],
    };
  }
  
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    this.onBack.bind(this);
    return true;
  }

  onSelectItem(image) {
    let selectedImages = this.state.selectedImages;
    const index = selectedImages.indexOf(image)
    if (index === -1) {
      selectedImages.push(image);
    } else {
      selectedImages.splice(index, 1);
    }
    this.setState({
      selectedImages,
    });
  }

  onSave() {
    if (this.props.onSave && this.state.selectedImages.length > 0) {
      this.props.onSave(this.state.selectedImages);
    }
  }

  onBack() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  renderIcon(select) {
    if (select) {
      return (
        <View style={styles.selectedIcon}>
          <Ionicons style={styles.checkIcon} name='ios-checkmark-circle' /> 
        </View>
      );
    }
    return (
      <View style={styles.icon} />
    );
  }

  renderImage(item) {
    let select = true;
    if (this.state.selectedImages.indexOf(item.item) === -1) {
      select = false;
    }
    return (
      <TouchableOpacity 
        style={styles.imageContainer}
        activeOpacity={0.6}
        onPress={() => this.onSelectItem(item.item)}
      >
        <FastImage style={styles.imageItem} source={{ uri: item.item }} resizeMode={FastImage.resizeMode.cover}/>
        {this.renderIcon(select)}
      </TouchableOpacity>
    );
  }

  get renderHeader() {
    const { selectedImages } = this.state
    return (
      <View style={styles.topContainer}>
        <TouchableOpacity 
          style={styles.btnClose}
          activeOpacity={0.6}
          onPress={this.onBack.bind(this)}
        >
          <Text style={[styles.textButton, { color: COLORS.PURPLE }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.textButton}>Select images</Text>
        <TouchableOpacity 
          style={[styles.btnClose, { alignItems: 'flex-end' }]}
          activeOpacity={0.6}
          onPress={this.onSave.bind(this)}
        >
          <Text style={[styles.textButton, selectedImages.length > 0 ? { color: COLORS.PURPLE } : { color: COLORS.MEDIUM_GREY }]}>Done</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const {
      images,
    } = this.props;
    return (
      <View style={styles.container}>
        <SafeAreaView style={{ flex: 1 }}>
          {this.renderHeader}
          <FlatList
            keyboardShouldPersistTaps={'handled'}
            contentContainerStyle={styles.mainInnerContainer}
            data={images}
            renderItem={this.renderImage.bind(this)}
            keyExtractor={(item, index) => index}
            extraData={this.state}
            numColumns={3}
          />
        </SafeAreaView>
      </View>
    );
  }
}


ChooseLinkImages.defaultProps = {
  onClose: () => {},
  onSave: () => {},
  images: [],
}


ChooseLinkImages.propTypes = {
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  images: PropTypes.array,
}
