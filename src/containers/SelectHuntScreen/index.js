import React from 'react'
import {
  Text,
  FlatList,
  View,
  TouchableOpacity,
  Alert,
  Animated,
  Keyboard,
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'

import Ionicons from 'react-native-vector-icons/Ionicons'
import _ from 'lodash'
import Search from 'react-native-search-box';
import UserAvatarComponent from '../../components/UserAvatarComponent';

import NewFeedScreen from '../NewFeedScreen'
import { 
  getFeedoList,
  setCurrentFeed,
} from '../../redux/feedo/actions'
import * as types from '../../redux/feedo/types'

import COLORS from '../../service/colors';
import CONSTANTS from '../../service/constants';
import styles from './styles';
import LoadingScreen from '../LoadingScreen';


class SelectHuntScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isVisibleNewFeedScreen: false,
    };
    this.isVisibleErrorDialog = false;
    this.animatedShow = new Animated.Value(0);
    this.animatedKeyboardHeight = new Animated.Value(0);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let loading = false;
    if (this.props.feedo.loading !== types.GET_FEEDO_LIST_PENDING && nextProps.feedo.loading === types.GET_FEEDO_LIST_PENDING) {
      loading = true;
    } else if (this.props.feedo.loading !== types.GET_FEEDO_LIST_FULFILLED && nextProps.feedo.loading === types.GET_FEEDO_LIST_FULFILLED) {
      loading = false;
    }
    this.setState({
      loading,
    });
    // showing error alert
    if (this.props.feedo.loading !== nextProps.feedo.loading) {
      if (nextProps.feedo.error) {
        let error = null;
        if (nextProps.feedo.error.error) {
          error = nextProps.feedo.error.error;
        } else {
          error = nextProps.feedo.error.message;
        }
        if (error) {
          if (!this.isVisibleErrorDialog) {
            this.isVisibleErrorDialog = true;
            Alert.alert('Error', error, [
              {text: 'Close', onPress: () => this.isVisibleErrorDialog = false},
            ]);
          }
        }
        return;
      }
    }
  }

  componentDidMount() {
    Animated.timing(this.animatedShow, {
      toValue: 1,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS * 1.5,
    }).start(() => {
      this.props.getFeedoList(0)
    });
    this.keyboardWillShowSubscription = Keyboard.addListener('keyboardWillShow', (e) => this.keyboardWillShow(e));
    this.keyboardWillHideSubscription = Keyboard.addListener('keyboardWillHide', (e) => this.keyboardWillHide(e));
  }

  componentWillUnmount() {
    this.keyboardWillShowSubscription.remove();
    this.keyboardWillHideSubscription.remove();
  }

  keyboardWillShow(e) {
    Animated.timing(
      this.animatedKeyboardHeight, {
        toValue: e.endCoordinates.height - CONSTANTS.SCREEN_VERTICAL_MIN_MARGIN,
        duration: e.duration,
      }
    ).start();
  }

  keyboardWillHide(e) {
    Animated.timing(
      this.animatedKeyboardHeight, {
        toValue: 0,
        duration: e.duration,
      }
    ).start();
  }

  onClose() {
    this.animatedShow.setValue(1);
    Animated.timing(this.animatedShow, {
      toValue: 0,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS * 1.5,
    }).start(() => {
      if (this.props.onClosed) {
        this.props.onClosed();
      }
    });
  }

  onBack() {
    this.onClose();
  }

  onSelectFeedo(item) {
    this.props.setCurrentFeed(item);
    if (this.props.selectMode === CONSTANTS.FEEDO_SELECT_FROM_SHARE_EXTENSION_FIRST) {
      const { imageUrl } = this.props;
      Actions.ShareCardScreen({imageUrl});
      return;
    }
    
    this.onClose();
  }

  onCreateNewFeed() {
    this.setState({
      isVisibleNewFeedScreen: true,
    })
  }

  onCloseNewFeed() {
    this.setState({
      isVisibleNewFeedScreen: false,
    }, () => {
      // this.props.getFeedoList(0)
      this.onClose();
    });
  }

  get renderHeaderFromMain() {
    return (
      <View style={styles.topContainer}>
        <TouchableOpacity 
          style={styles.backButtonContainer}
          activeOpacity={0.6}
          onPress={this.onBack.bind(this)}
        >
          <Ionicons name="ios-arrow-back" size={28} color={COLORS.PURPLE} />
          <Text style={styles.textBack}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  get renderHeaderFromExtension() {
    return (
      <View style={[styles.topContainer, styles.extensionTopContainer]}>
        <Text style={styles.textTitle}>Choose feed</Text>
        {
          this.props.selectMode === CONSTANTS.FEEDO_SELECT_FROM_SHARE_EXTENSION_LATER && 
          <TouchableOpacity 
            style={[styles.backButtonContainer, {paddingHorizontal: 16}]}
            activeOpacity={0.6}
            onPress={this.onBack.bind(this)}
          >
            <Ionicons name="ios-arrow-back" size={28} color={COLORS.PURPLE} />
            <Text style={styles.textBack}>Back</Text>
          </TouchableOpacity>
        }
      </View>
    )
  }

  get renderCreateNewFeed() {
    return (
      <TouchableOpacity 
        style={[styles.itemContainer, {paddingHorizontal: 13, paddingTop: 10,}]}
        activeOpacity={0.7}
        onPress={() => this.onCreateNewFeed()}
      >
        <View style={styles.avatarContainer}>
          <Ionicons name="md-add" size={32} color={COLORS.PURPLE} />
        </View>
        <Text style={[styles.textItemTitle, {color: COLORS.PURPLE}]}>Create new feed</Text>
      </TouchableOpacity>
    )
  }

  renderAvatar(feedo) {
    if (feedo.metadata.owner) {
      return;
    }
    return (
      <UserAvatarComponent
        size={32}
        user={feedo.owner}
        color={COLORS.LIGHT_GREY}
        textColor={COLORS.PURPLE}
      />
    );
  }

  renderItem({item, index}) {
    return (
      <TouchableOpacity 
        style={styles.itemContainer}
        activeOpacity={0.7}
        onPress={() => this.onSelectFeedo(item)}
      >
        <View style={styles.avatarContainer}>
          {this.renderAvatar(item)}
        </View>
        <Text style={styles.textItemTitle} numberOfLines={1}>{item.headline}</Text>
      </TouchableOpacity>
    )
  }

  render () {
    const animatedMove  = this.animatedShow.interpolate({
      inputRange: [0, 1],
      outputRange: [CONSTANTS.SCREEN_WIDTH, 0],
    });
    let feedoList = this.props.feedo.feedoList;
    if (feedoList && feedoList.length > 0 && this.state.filterText) {
      feedoList = _.filter(feedoList, feedo => feedo.headline.toLowerCase().indexOf(this.state.filterText.toLowerCase()) !== -1);
    }

    return (
      <View style={styles.container}>
        <Animated.View 
          style={[
            styles.feedContainer, {
              left: animatedMove,
              opacity: this.animatedShow,
            },
          ]}
        >
          <Animated.View 
            style={[
              styles.contentContainer, 
              {
                paddingBottom: this.animatedKeyboardHeight,
                height: CONSTANTS.SCREEN_HEIGHT - CONSTANTS.SCREEN_VERTICAL_MIN_MARGIN * 2,
                backgroundColor: this.props.selectMode === CONSTANTS.FEEDO_SELECT_FROM_MAIN ? '#fff' : 'rgba(255, 255, 255, .95)',
                marginHorizontal: this.props.selectMode === CONSTANTS.FEEDO_SELECT_FROM_MAIN ? 0 : 10,
              },
            ]}
          >
            {this.props.selectMode === CONSTANTS.FEEDO_SELECT_FROM_MAIN ? this.renderHeaderFromMain : this.renderHeaderFromExtension}
            {this.props.selectMode !== CONSTANTS.FEEDO_SELECT_FROM_MAIN && <View style={styles.line} /> }
            <View style={styles.searchContainer}>
              <Search
                inputStyle={{
                  backgroundColor: 'rgba(142,142,147,0.12)',
                  padding: 0,
                  height: 36,
                  borderRadius: 10,
                }}
                backgroundColor='transparent'
                titleCancelColor={COLORS.DARK_GREY}
                onChangeText={(text) => this.setState({filterText: text})}
                onCancel={() => this.setState({filterText: ''})}
                onDelete={() => this.setState({filterText: ''})}
              />
            </View>
            {this.renderCreateNewFeed}
            <FlatList
              style={{marginTop: 11, marginBottom: 26}}
              contentContainerStyle={{paddingHorizontal: 13}}
              data={feedoList}
              renderItem={this.renderItem.bind(this)}
              keyExtractor={(item, index) => index.toString()}
              extraData={this.state}
            />
            {this.state.loading && <LoadingScreen />}
          </Animated.View>
        </Animated.View>
        {
          this.state.isVisibleNewFeedScreen && 
            <View style={styles.newFeedContainer}>
              <NewFeedScreen
                feedoMode={CONSTANTS.FEEDO_FROM_CARD}
                onClose={() => this.onCloseNewFeed()}
              />
            </View>
        }
      </View>
    );
  }
}


SelectHuntScreen.defaultProps = {
  selectMode: CONSTANTS.FEEDO_SELECT_FROM_MAIN,
  imageUrl: '',
  onClosed: PropTypes.func,
}


SelectHuntScreen.propTypes = {
  selectMode: PropTypes.number,
  imageUrl: PropTypes.string,
  onClosed: PropTypes.func,
}


const mapStateToProps = ({ feedo }) => ({
  feedo,
})


const mapDispatchToProps = dispatch => ({
  getFeedoList: (index) => dispatch(getFeedoList(index)),
  setCurrentFeed: (data) => dispatch(setCurrentFeed(data)),
})


export default connect(mapStateToProps, mapDispatchToProps)(SelectHuntScreen)