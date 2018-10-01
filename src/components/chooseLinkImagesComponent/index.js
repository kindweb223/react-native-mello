import React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
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
    if (this.props.onSave) {
      this.props.onSave(this.state.selectedImages);
    }
  }

  onBack() {
    if (this.props.onClose) {
      this.props.onClose();
    }
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
        <FastImage style={styles.imageItem} source={{uri: item.item}} resizeMode={FastImage.resizeMode.cover}/>
        { 
          select && 
          <Ionicons style={styles.icon} name="ios-checkmark-circle" size={20} color={COLORS.BLUE} /> 
        }
      </TouchableOpacity>
    );
  }

  get renderHeader() {
    return (
      <View style={styles.topContainer}>
        <TouchableOpacity 
          style={styles.backButtonWrapper}
          activeOpacity={0.6}
          onPress={this.onBack.bind(this)}
        >
          <Ionicons name="ios-arrow-back" size={30} color={COLORS.PURPLE} />
          <Text style={styles.textBack}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.saveButtonWapper}
          activeOpacity={0.6}
          onPress={this.onSave.bind(this)}
        >
          <Text style={styles.textSave}>Save</Text>
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
        {this.renderHeader}
        <Text style={styles.textTitle}>Choose images you want to add</Text>
        <FlatList
          style={styles.mainContainer}
          data={images}
          renderItem={this.renderImage.bind(this)}
          keyExtractor={(item, index) => index}
          extraData={this.state}
          numColumns={3}
        />
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
