import React from 'react'
import {
  TouchableOpacity,
  Animated,
  View,
  FlatList,
  Image,
} from 'react-native'
import PropTypes from 'prop-types'

import Ionicons from 'react-native-vector-icons/Ionicons'
import Modal from 'react-native-modal'
import FastImage from 'react-native-fast-image'
import ImageSliderScreen from '../../containers/ImageSliderScreen'
import styles from './styles'
import CONSTANTS from '../../service/constants'


export default class ImageList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedImageIndex: -1,
      removeImageIndex: -1,
      actionImageIndex: -1,
      files: this.props.files,
      isPreview: false,
      position: 0
    };
    
    this.animatedSelect = new Animated.Value(1);
    this.animatedRemoving = new Animated.Value(1);
    this.fileCount = this.props.files.length || 0;
    this.fileAction = '';
    this.loadedFiles = 0;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.files.length > this.fileCount) {
      //add
      this.loadedFiles = 0;
      this.fileAction = 'add';
      this.setState({
        actionImageIndex: 0,
        files: nextProps.files,
      }, () => {
        this.animatedRemoving.setValue(0);        
        // Animated.timing(this.animatedRemoving, {
        //   toValue: 1,
        //   duration: CONSTANTS.ANIMATEION_MILLI_SECONDS + 100,
        // }).start(() => {
        //   this.setState({
        //     actionImageIndex: -1,
        //   });
        // });
      });
      this.fileCount = nextProps.files.length;
    } else if (nextProps.files.length < this.fileCount) {
      //delete
      this.loadedFiles = 0;
      this.fileAction = 'delete';
      this.animatedRemoving.setValue(1);
      Animated.timing(this.animatedRemoving, {
        toValue: 0,
        duration: CONSTANTS.ANIMATEION_MILLI_SECONDS + 100,
      }).start(() => {
        this.setState({
          actionImageIndex: -1,
          files: nextProps.files,
        });
      });
      this.fileCount = nextProps.files.length;
    }
  }

  onLongPressImage(index) {
    if (!this.props.editable) {
      return;
    }
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
      this.props.onRemove(this.state.files[index].id);
    }
    this.setState({
      selectedImageIndex: -1,
      removeImageIndex: -1,
      actionImageIndex: index,
    });
  }

  onPressImage(index) {
    this.setState({ isPreview: true, position: index })
  }

  onLoadEnd() {
    this.loadedFiles ++;
    if (this.loadedFiles === this.fileCount) {
      if (this.fileAction === 'add') {
        //add
        this.animatedRemoving.setValue(0);
        Animated.timing(this.animatedRemoving, {
          toValue: 1,
          duration: CONSTANTS.ANIMATEION_MILLI_SECONDS + 100,
        }).start(() => {
          this.setState({
            actionImageIndex: -1,
          });
        });
      }
    }
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
          <Image 
            style={styles.imageFeed}
            source={{uri: item.accessUrl}} 
            onLoadEnd={() => this.onLoadEnd()}
          />
        </TouchableOpacity>
        {
          this.state.removeImageIndex === index && 
            <TouchableOpacity 
              style={styles.imageRemoveContainer}
              activeOpacity={0.8}
              onPress={() => this.onRemove(index)}
            >
              <View style={styles.closeSubButtonContainer}>
                <Ionicons name="md-close" size={18} color={'#fff'} style={{marginTop: 2, marginLeft: 1}} />
              </View>
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
      <View>
        <FlatList
          style={styles.container}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={files}
          renderItem={this.renderImageFile.bind(this)}
          keyExtractor={(item, index) => index.toString()}
          extraData={this.state}
        />
        <Modal 
          isVisible={this.state.isPreview}
          style={styles.previewModal}
          backdropColor='rgba(0, 0, 0, 0.9)'
          animationIn='fadeIn'
          animationOut='fadeOut'
          animationInTiming={100}
          animationOutTiming={100}
        >
          <ImageSliderScreen 
            mediaFiles={this.props.files}
            position={this.state.position}
            removal={this.props.editable}
            isSetCoverImage={this.props.isSetCoverImage}
            onRemove={(id) => this.props.onRemove(id)}
            onSetCoverImage={(id) => this.props.onSetCoverImage(id)}
            onClose={() => this.setState({ isPreview: false })}
          />
        </Modal>
      </View>
    );
  }
}


ImageList.defaultProps = {
  files: [],
  editable: true,
  isSetCoverImage: false,
  onRemove: () => {},
  onSetCoverImage: () => {},
}


ImageList.propTypes = {
  files: PropTypes.array,
  editable: PropTypes.bool,
  isSetCoverImage: PropTypes.bool,
  onRemove: PropTypes.func,
  onSetCoverImage: PropTypes.func,
}
