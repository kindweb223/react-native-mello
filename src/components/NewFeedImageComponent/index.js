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
import CONSTANTS from '../../service/constants'

const AnimationMilliSeconds = 300;


export default class NewFeedImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImageIndex: -1,
      removeImageIndex: -1,
      actionImageIndex: -1,
      files: [...this.props.files],
    };
    this.animatedSelect = new Animated.Value(1);
    this.animatedRemoving = new Animated.Value(1);
    this.fileCount = this.props.files.length || 0;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.files.length > this.fileCount) {
      //add
      this.setState({
        actionImageIndex: 0,
        files: [...nextProps.files],
      }, () => {
        this.animatedRemoving.setValue(0);
        Animated.timing(this.animatedRemoving, {
          toValue: 1,
          duration: AnimationMilliSeconds,
        }).start(() => {
          this.setState({
            actionImageIndex: -1,
          });
        });
      });
      this.fileCount = nextProps.files.length;
    } else if (nextProps.files.length < this.fileCount) {
      //delete
      this.animatedRemoving.setValue(1);
      Animated.timing(this.animatedRemoving, {
        toValue: 0,
        duration: AnimationMilliSeconds,
      }).start(() => {
        this.setState({
          actionImageIndex: -1,
          files: [...nextProps.files],
        });
      });
      this.fileCount = nextProps.files.length;
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
      ]).start(() => {
      });
    });
  }

  onRemove(index) {
    if (this.props.onRemove) {
      this.props.onRemove(index);
    }
    this.setState({
      selectedImageIndex: -1,
      removeImageIndex: -1,
      actionImageIndex: index,
    });
  }

  onPressImage(index) {
    Actions.ImageSliderScreen({position: index})
  }

  renderImageFile({item, index}) {
    let containerWidth  = this.animatedRemoving.interpolate({
      inputRange: [0, 1],
      outputRange: [0, CONSTANTS.SCREEN_WIDTH * 0.28 + 15]
    });

    return (
      <Animated.View
        style={[
          this.state.actionImageIndex === index &&
          {width: containerWidth},
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
    } = this.state;

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
      // <ScrollView 
      //   style={styles.container}
      //   horizontal={true}
      //   showsHorizontalScrollIndicator={false}
      // >
      // {
      //   files.map((item, index) => {
      //     return this.renderImageFile({item, index});
      //   })
      // }
      // </ScrollView>
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