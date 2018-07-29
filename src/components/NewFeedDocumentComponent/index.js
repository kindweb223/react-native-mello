import React from 'react'
import {
  TouchableOpacity,
  View,
  Animated,
  FlatList,
  Text,
  LayoutAnimation,
} from 'react-native'
import PropTypes from 'prop-types'

import { Actions } from 'react-native-router-flux'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'

import styles from './styles'
import CONSTANTS from '../../service/constants'
import COLORS from '../../service/colors'

const AnimationMilliSeconds = 300;


export default class NewFeedDocument extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [...this.props.files],
      selectedImageIndex: -1,
    };
    this.fileCount = this.props.files.length || 0;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.files.length > this.fileCount) {
      //add
      this.setState({
        files: [...nextProps.files],
        removeFileIndex: -1,
      }, () => {
      });
      this.fileCount = nextProps.files.length;
    } else if (nextProps.files.length < this.fileCount) {
      //delete
      this.fileCount = nextProps.files.length;
      this.setState({
        files: [...nextProps.files],
        removeFileIndex: -1,
      }, () => {
      });
    }
  }

  onLongPressDocumnet(index) {
    LayoutAnimation.linear();
    if (this.state.removeFileIndex === index) {
      this.setState({
        removeFileIndex: -1,
      });
    } else {
      this.setState({
        removeFileIndex: index,
      });
    }
  }

  onRemove(index) {
    if (this.props.onRemove) {
      this.props.onRemove(this.state.files[index].id);
    }
  }

  onPressDocument(index) {
  }

  renderDocumentFile({item, index}) {
    console.log('Document Files : ', item);
    return (
      <View
        style={[styles.itemContainer, {backgroundColor: this.state.removeFileIndex === index ? COLORS.BLUE : 'transparent'}]}
      >
        <TouchableOpacity 
          style={styles.buttonContainer}
          activeOpacity={0.7}
          onLongPress={() => this.onLongPressDocumnet(index)}
          onPress={() => this.onPressDocument(index)}
        >
          <Ionicons 
            name="md-attach"
            style={styles.attachment} size={18}
            color={this.state.removeFileIndex === index ? '#fff' : COLORS.MEDIUM_GREY}
          />
          <Text 
            style={[styles.textFileName, {color: this.state.removeFileIndex === index ? '#fff' : '#000'}]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
        {
          this.state.removeFileIndex === index && 
            <TouchableOpacity 
              style={styles.closeButtonContainer}
              activeOpacity={0.7}
              onPress={() => this.onRemove(index)}
            >
              <MaterialCommunityIcons name="close" size={18} color={'#fff'} />
            </TouchableOpacity>
        }
      </View>
    )
  }

  render () {
    const {
      files,
    } = this.state;

    return (
      <FlatList
        style={styles.container}
        showsHorizontalScrollIndicator={false}
        data={files}
        renderItem={this.renderDocumentFile.bind(this)}
        keyExtractor={(item, index) => index.toString()}
        extraData={this.state}
        bounces={false}
      />
    );
  }
}


NewFeedDocument.defaultProps = {
  files: [],
  onRemove: () => {},
}


NewFeedDocument.propTypes = {
  files: PropTypes.array,
  onRemove: PropTypes.func,
}
