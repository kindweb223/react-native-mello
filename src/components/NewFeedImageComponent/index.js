import React from 'react'
import {
  TouchableOpacity,
  Image,
  Animated,
  FlatList,
  LayoutAnimation,
} from 'react-native'
import PropTypes from 'prop-types'

import { Actions } from 'react-native-router-flux'
import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from './styles'


export default class NewFeedImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImageIndex: -1,
      removeImageIndex: -1,
    };
    this.animatedSelect = new Animated.Value(1);
    this.fileCount = this.props.files.length || 0;
  }

  componentDidMount() {
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.files.length > this.fileCount) {
      this.fileCount = nextProps.files.length;
      setTimeout(() => {
        this.flatList.scrollToEnd();
      }, 0);
    }
  }

  onLongPressImage(index) {
    if (this.state.removeImageIndex === index) {
      this.setState({
        removeImageIndex: -1,
      });
    } else {
      this.setState({
        removeImageIndex: index,
      });
    }

    this.setState({
      selectedImageIndex: index,
    }, () => {
      Animated.sequence([
        Animated.timing(this.animatedSelect, {
          toValue: 0.9,
          duration: 100,
        }),
        Animated.timing(this.animatedSelect, {
          toValue: 1,
          duration: 100,
        }),
      ]).start((finished) => {
      });
    });
  }

  onRemove(index) {
    LayoutAnimation.linear();
    if (this.props.onRemove) {
      this.props.onRemove(index);
    }
    this.setState({
      selectedImageIndex: -1,
      removeImageIndex: -1,
    });
  }

  onPressImage(index) {
    Actions.ImageSliderScreen({position: index})
  }

  renderImageFile({item, index}) {
    return (
      <Animated.View
        style={[
          this.state.selectedImageIndex === index &&
          {
            transform: [
              { scale: this.animatedSelect },
            ],
          },
        ]}
      >
        <TouchableOpacity 
          style={styles.imageContainer}
          activeOpacity={0.8}
          onLongPress={() => this.onLongPressImage(index)}
          onPress={() => this.onPressImage(index)}
        >
          <Image source={{uri: item.accessUrl}} style={styles.imageFeed} resizeMode='cover' />
        </TouchableOpacity>
        {
          this.state.removeImageIndex === index && 
            <TouchableOpacity 
              style={styles.imageRemoveContainer}
              activeOpacity={0.8}
              onPress={() => this.onRemove(index)}
            >
              <MaterialCommunityIcons name="close" size={18} color={'#fff'} />
            </TouchableOpacity>
        }
      </Animated.View>
    )
  }

  render () {
    const {
      files,
    } = this.props;

    return (
      <FlatList
        ref={o => this.flatList = o}
        style={styles.container}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={files}
        renderItem={this.renderImageFile.bind(this)}
        keyExtractor={(item, index) => index.toString()}
        extraData={this.state}
      />
    );
  }
}


NewFeedImage.defaultProps = {
  files: [],
  onRemove: () => {},
}


NewFeedImage.propTypes = {
  files: PropTypes.array,
  onRemove: PropTypes.func,
}
