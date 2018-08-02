import React from 'react'
import {
  TouchableOpacity,
  View,
  Animated,
  FlatList,
  Text,
} from 'react-native'
import PropTypes from 'prop-types'

import { Actions } from 'react-native-router-flux'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'

import styles from './styles'
import CONSTANTS from '../../service/constants'
import COLORS from '../../service/colors'


export default class DocumentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [...this.props.files],
      selectedIndex: -1,
      itemLayouts: [],
      isVisibleSelectedColors: false,
    };
    this.fileCount = this.props.files.length || 0;
    this.animatedSelect = new Animated.Value(0);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.files.length > this.fileCount) {
      //add
      this.setState({
        files: [...nextProps.files],
        selectedIndex: -1,
      });
      this.fileCount = nextProps.files.length;
    } else if (nextProps.files.length < this.fileCount) {
      //delete
      this.fileCount = nextProps.files.length;
      this.setState({
        isVisibleSelectedColors: false,
      });
      this.animatedSelect.setValue(1);
      Animated.timing(this.animatedSelect, {
        toValue: 0,
        duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
      }).start(() => {
        this.setState({
          files: [...nextProps.files],
          selectedIndex: -1,
        });
      });
    }
  }

  onLongPressDocumnet(index) {
    // LayoutAnimation.linear();
    if (this.state.selectedIndex === index) {
      this.setState({
        isVisibleSelectedColors: false,
      });
      this.animatedSelect.setValue(1);
      Animated.timing(this.animatedSelect, {
        toValue: 0,
        duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
      }).start(() => {
        this.setState({
          selectedIndex: -1,
        });
      });
    } else {
      this.setState({
        selectedIndex: index,
      }, () => {
        this.animatedSelect.setValue(0);
        Animated.timing(this.animatedSelect, {
          toValue: 1,
          duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
        }).start(() => {
          this.setState({
            isVisibleSelectedColors: true,
          });
        });
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

  renderItemBackground(index) {
    if (this.state.selectedIndex !== index) {
      return;
    }
    const animatedValue  = this.animatedSelect.interpolate({
      inputRange: [0, 1],
      outputRange: [0, this.state.itemLayouts[this.state.selectedIndex]],
    });
    return (
      <Animated.View
        style={[
          styles.itemSelectBackgroundContainer,
          {opacity: this.animatedSelect},
          {width: animatedValue}
        ]}
      />
    );
  }

  onLayout(layout, index) {
    this.setState((state) => {
      state.itemLayouts[index] = layout.width;
      return state;
    });
  }

  renderDocumentFile({item, index}) {
    return (
      <View 
        style={styles.itemContainer}
        onLayout={({nativeEvent}) => this.onLayout(nativeEvent.layout, index)}
      >
        {this.renderItemBackground(index)}
        <TouchableOpacity 
          style={styles.buttonContainer}
          activeOpacity={0.7}
          onLongPress={() => this.onLongPressDocumnet(index)}
          onPress={() => this.onPressDocument(index)}
        >
          <Ionicons 
            name="md-attach"
            style={styles.attachment} size={18}
            color={this.state.selectedIndex === index && this.state.isVisibleSelectedColors ? '#fff' : COLORS.MEDIUM_GREY}
          />
          <Text 
            style={[styles.textFileName, {color: this.state.selectedIndex === index && this.state.isVisibleSelectedColors ? '#fff' : '#000'}]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
        {
          this.state.selectedIndex === index && 
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


DocumentList.defaultProps = {
  files: [],
  onRemove: () => {},
}


DocumentList.propTypes = {
  files: PropTypes.array,
  onRemove: PropTypes.func,
}
