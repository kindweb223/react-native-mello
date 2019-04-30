import React from 'react'
import {
  Image,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  BackHandler,
} from 'react-native'
import PropTypes from 'prop-types'

import { Actions } from 'react-native-router-flux'

import styles from './styles'
import CONSTANTS from '../../service/constants'

const CreateItems = [
  {
    // Header
  },
  {
    title: 'Take a photo',
    icon: require('../../../assets/images/Camera/IconMediumCameraBlue.png'),
    type: 'TAKE_PHOTO'
  },
  {
    title: 'Upload photo',
    icon: require('../../../assets/images/Image/Blue.png'),
    type: 'UPLOAD_PHOTO'
  },
  {
    title: 'Add link',
    icon: require('../../../assets/images/Link/Blue.png'),
    type: 'ADD_LINK'
  },
  {
    title: 'Add text',
    icon: require('../../../assets/images/Text/IconMediumAaBlue.png'),
    type: 'ADD_TEXT'
  },
  {
    title: 'Attach files',
    icon: require('../../../assets/images/Attachment/Blue.png'),
    type: 'ATTACH_FILE'
  },
  {
    // Separator
  },
  {
    title: 'Create new flow',
    icon: require('../../../assets/images/IconFlow/IconMediumFlowBlue.png'),
    type: 'NEW_FLOW'
  },
]


export default class CreateNewFeedComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listHeight: 0,
      selectedIndex: -1,
    };
    this.animatedShow = new Animated.Value(0);
    this.animatedSelect = new Animated.Value(0);
  }
 
  componentDidMount() {
    Animated.spring(this.animatedShow, {
      toValue: 1,
    }).start();

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    this.onPressBackdrop();
    return true;
  }

  onPressBackdrop() {
    Animated.spring(this.animatedShow, {
      toValue: 0,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 10,
    }).start();

    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  onSelectItem(item, index) {
    this.setState({
      selectedIndex: index,
    }, () => {
      this.animatedSelect.setValue(0);
      Animated.timing(this.animatedSelect, {
        toValue: 1,
        duration: CONSTANTS.ANIMATEION_MILLI_SECONDS,
      }).start(() => {
        if (this.props.onSelect) {
          this.props.onSelect(item.type);
        }
      });
    });
  }

  renderItemBackground(index) {
    if (this.state.selectedIndex !== index) {
      return;
    }
    const animatedValue  = this.animatedSelect.interpolate({
      inputRange: [0, 1],
      outputRange: [0, CONSTANTS.SCREEN_WIDTH - 24],
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

  renderItem({item, index}) {
    if (index === 0) {
      return (
        <View style={styles.headerView}>
          <Text style={styles.headerText}>Add item</Text>
        </View>
      )
    } else if (index === 6) {
      return (
        <View style={styles.separator} />
      )
    }

    return (
      <TouchableOpacity
        onPressIn={() => this.onSelectItem(item, index)}
      >
        <View style={styles.itemContainer}>
          {/* {this.renderItemBackground(index)} */}
          <View style={styles.leftContentContainer}> 
            <Image source={item.icon} style={styles.image} resizeMode="contain" />
          </View>
          <View style={styles.rightContentContainer}>
            <Text style={styles.textTitle}>{item.title}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  onLayout(layout) {
    this.setState({
      listHeight: layout.height,
    });
  }

  render () {
    const animatedTranslateX  = this.animatedShow.interpolate({
      inputRange: [0, 1],
      outputRange: [CONSTANTS.SCREEN_WIDTH / 2 - CONSTANTS.PADDING, 0],
    });
    const animatedTranslateY  = this.animatedShow.interpolate({
      inputRange: [0, 1],
      outputRange: [this.state.listHeight / 2 - 40, 0],
    });

    return (
      <Animated.View style={[styles.container, {opacity: this.animatedShow}]}>
        <TouchableOpacity
          style={styles.backdropContainer}
          onPress={this.onPressBackdrop.bind(this)}
        />
        <Animated.View style={[
          {justifyContent: 'flex-end'},
          {
            transform: [
              { translateX: animatedTranslateX },
              { translateY: animatedTranslateY },
            ],
          },
        ]}>
          <Animated.View style={[
            {
              transform: [
                { scale: this.animatedShow },
              ],
            },
          ]}>
            <FlatList
              style={styles.mainContentContainer}
              onLayout={({nativeEvent}) => this.onLayout(nativeEvent.layout)}
              data={CreateItems}
              bounces={false}
              renderItem={this.renderItem.bind(this)}
              keyExtractor={(item, index) => index.toString()}
              extraData={this.state}
            />
          </Animated.View>
        </Animated.View>  
      </Animated.View>
    );
  }
}


CreateNewFeedComponent.defaultProps = {
  onSelect: () => {},
  onClose: () => {},
}


CreateNewFeedComponent.propTypes = {
  onSelect: PropTypes.func,
  onClose: PropTypes.func,
}