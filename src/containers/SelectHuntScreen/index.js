import React from 'react'
import {
  Text,
  FlatList,
  View,
  TouchableOpacity,
  Animated,
  Keyboard,
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as feedoTypes from '../../redux/feedo/types'

import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as Animatable from 'react-native-animatable'

import _ from 'lodash'
import Search from 'react-native-search-box';
import UserAvatarComponent from '../../components/UserAvatarComponent';

import NewFeedScreen from '../NewFeedScreen'
import { 
  setCurrentFeed,
  getFeedoList,
} from '../../redux/feedo/actions'

import COLORS from '../../service/colors';
import CONSTANTS from '../../service/constants';
import styles from './styles';
import LoadingScreen from '../LoadingScreen';

import Analytics from '../../lib/firebase'


class SelectHuntScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isVisibleNewFeedScreen: false,
      isKeyboardShow: false,
      filterText: '',
      cachedFeedList: props.cachedFeedList,
      animationType: 'slideInRight'
    };
    this.animatedShow = new Animated.Value(0);
    this.animatedMove = new Animated.Value(0);
    this.animatedKeyboardHeight = new Animated.Value(0);
  }

  componentDidMount() {
    const { cachedFeedList } = this.state
    Analytics.setCurrentScreen('SelectHuntScreen')

    if (cachedFeedList.length == 0) {
      this.props.getFeedoList(3, true);
      console.log('OD - first get feeds')
    }

    const animationType = this.props.direction === 'left' ? 'slideInRight' : 'slideInUp'
    this.setState({ animationType })

    Animated.timing(this.animatedShow, {
      toValue: 1,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS * 1.5,
    }).start();
    Animated.timing(this.animatedMove, {
      toValue: 1,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS * 1.5,
    }).start();
    this.keyboardWillShowSubscription = Keyboard.addListener('keyboardWillShow', (e) => this.keyboardWillShow(e));
    this.keyboardWillHideSubscription = Keyboard.addListener('keyboardWillHide', (e) => this.keyboardWillHide(e));
  }

  componentWillUnmount() {
    this.keyboardWillShowSubscription.remove();
    this.keyboardWillHideSubscription.remove();
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.feedo.loading !== feedoTypes.GET_FEEDO_LIST_FULFILLED && nextProps.feedo.loading === feedoTypes.GET_FEEDO_LIST_FULFILLED) {
      this.setState({cachedFeedList: nextProps.feedo.feedoListForCardMove})      
    }
  }
  
  keyboardWillShow(e) {
    this.setState({ isKeyboardShow: true })
    Animated.timing(
      this.animatedKeyboardHeight, {
        toValue: e.endCoordinates.height,
        duration: e.duration,
      }
    ).start();
  }

  keyboardWillHide(e) {
    this.setState({ isKeyboardShow: false })
    Animated.timing(
      this.animatedKeyboardHeight, {
        toValue: 0,
        duration: e.duration,
      }
    ).start();
  }

  onClose(isAnimatedShow=true) {
    this.animatedMove.setValue(1);
    Animated.timing(this.animatedMove, {
      toValue: 0,
      duration: CONSTANTS.ANIMATEION_MILLI_SECONDS * 1.5,
    }).start(() => {
      if (this.props.onClosed) {
        this.props.onClosed();
      }
    });
    if (isAnimatedShow) {
      this.animatedShow.setValue(1);
      Animated.timing(this.animatedShow, {
        toValue: 0,
        duration: CONSTANTS.ANIMATEION_MILLI_SECONDS * 1.5,
      }).start();
    } else {
      this.animatedShow.setValue(0);
    }

    const animationType = this.props.direction === 'left' ? 'slideOutRight' : 'slideOutDown'
    this.setState({ animationType })
  }

  onBack() {
    this.onClose();
  }

  onSelectFeedo(item) {
    this.props.setCurrentFeed(item);
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
      this.onClose(false);
    });
  }

  get renderHeader() {
    const { selectMode } = this.props;
    if (selectMode === CONSTANTS.FEEDO_SELECT_FROM_MAIN) {
      return this.renderHeaderFromMain;
    } else if (selectMode === CONSTANTS.FEEDO_SELECT_FROM_MOVE_CARD) {
      return this.renderHeaderFromMoveCard;
    }
    return this.renderHeaderFromExtension;
  }

  get renderHeaderFromMoveCard() {
    return (
      <View style={styles.topContainer}>
        <Text style={styles.textTitle}>Move Card</Text>
        <TouchableOpacity 
          style={styles.backButtonContainer}
          activeOpacity={0.6}
          onPress={this.onBack.bind(this)}
        >
          <MaterialCommunityIcons name="close" size={32} color={COLORS.PURPLE} />
        </TouchableOpacity>
      </View>
    );
  }

  get renderHeaderFromMain() {
    return (
      <View style={styles.topContainer}>
        <TouchableOpacity 
          style={styles.backButtonContainer}
          activeOpacity={0.6}
          onPress={this.onBack.bind(this)}
        >
          <Ionicons name="ios-arrow-back" size={32} color={COLORS.PURPLE} />
        </TouchableOpacity>
      </View>
    );
  }

  get renderHeaderFromExtension() {
    return (
      <View style={[styles.topContainer, styles.extensionTopContainer]}>
        <Text style={styles.textTitle}>Choose flow</Text>
        <TouchableOpacity 
          style={styles.backButtonContainer}
          activeOpacity={0.6}
          onPress={this.onBack.bind(this)}
        >
          <Ionicons name="ios-arrow-back" size={28} color={COLORS.PURPLE} />
        </TouchableOpacity>
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
        <Text style={[styles.textItemTitle, {color: COLORS.PURPLE}]}>Create new flow</Text>
      </TouchableOpacity>
    )
  }

  renderAvatar(feedo) {
    if (feedo.metadata.owner) {
      return;
    }
    const { selectMode } = this.props;
    return (
      <UserAvatarComponent
        size={32}
        user={feedo.owner}
        color={COLORS.LIGHT_GREY}
        textColor={COLORS.PURPLE}
        isFastImage={selectMode !== CONSTANTS.FEEDO_SELECT_FROM_SHARE_EXTENSION}
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
    const { cachedFeedList, animationType } = this.state

    const animatedMove  = this.animatedMove.interpolate({
      inputRange: [0, 1],
      outputRange: [CONSTANTS.SCREEN_WIDTH, 0],
    });

    let feedoList = cachedFeedList;
    if (this.props.hiddenFeedoId) {
      feedoList = _.filter(feedoList, feedo => feedo.id !== this.props.hiddenFeedoId);
    }
    feedoList = _.filter(feedoList, feedo => feedo.status === 'PUBLISHED');
    if (feedoList && feedoList.length > 0 && this.state.filterText) {
      feedoList = _.filter(feedoList, feedo => feedo.headline && feedo.headline.toLowerCase().indexOf(this.state.filterText.toLowerCase()) !== -1);
    }
    feedoList = _.filter(feedoList, feedo => feedo.status === 'PUBLISHED' && feedo.metadata.myInviteStatus === 'ACCEPTED');
    feedoList = _.orderBy(feedoList, [feedo => feedo.headline.toLowerCase()], 'asc')

    const { selectMode } = this.props;
    let bottomMargin = CONSTANTS.SCREEN_VERTICAL_MIN_MARGIN;
    if (this.state.isKeyboardShow) {
      bottomMargin = CONSTANTS.SCREEN_VERTICAL_MIN_MARGIN / 2;
    }

    return (
      <View style={[styles.container, selectMode !== CONSTANTS.FEEDO_SELECT_FROM_SHARE_EXTENSION && {backgroundColor: COLORS.MODAL_BACKGROUND}]}>
        <View style={styles.feedContainer}>
          <Animatable.View
            animation={animationType}
            duration={300}
            style={[
              styles.contentContainer, 
              {
                height: Animated.subtract(CONSTANTS.SCREEN_HEIGHT - CONSTANTS.SCREEN_VERTICAL_MIN_MARGIN - bottomMargin, this.animatedKeyboardHeight),
                marginTop: CONSTANTS.SCREEN_VERTICAL_MIN_MARGIN,
                marginBottom: Animated.add(bottomMargin, this.animatedKeyboardHeight),
                marginHorizontal: selectMode !== CONSTANTS.FEEDO_SELECT_FROM_SHARE_EXTENSION ? 0 : 16,
              },
            ]}
          >
            {this.renderHeader}
            {selectMode === CONSTANTS.FEEDO_SELECT_FROM_SHARE_EXTENSION && <View style={styles.line} /> }
            <View style={styles.searchContainer}>
              <Search
                inputStyle={{
                  padding: 0,
                  paddingRight: 30,
                  marginRight: 10,
                  height: 36,
                  borderRadius: 10,
                  fontSize: 16,
                  backgroundColor: '#f1f1f2',
                }}
                cancelButtonStyle={{
                  alignItems: 'flex-start',
                  justifyContent: 'center'
                }}
                cancelButtonWidth={80}
                cancelButtonTextStyle={{
                  color: COLORS.PURPLE,
                  fontSize: 16,
                  padding: 0
                }}
                positionRightDelete={90}
                searchIconCollapsedMargin={35}
                searchIconExpandedMargin={20}
                placeholderExpandedMargin={40}
                backgroundColor='transparent'
                titleCancelColor={COLORS.DARK_GREY}
                onChangeText={(text) => this.setState({filterText: text})}
                onCancel={() => this.setState({filterText: ''})}
                onDelete={() => this.setState({filterText: ''})}
              />
            </View>
            {this.renderCreateNewFeed}
            <FlatList
              style={{marginTop: 11}}
              keyboardShouldPersistTaps='handled'
              contentContainerStyle={{ paddingHorizontal: 13, paddingBottom: 26 }}
              data={feedoList}
              renderItem={this.renderItem.bind(this)}
              keyExtractor={(item, index) => index.toString()}
              extraData={this.state}
            />
            {this.state.loading && <LoadingScreen />}
          </Animatable.View>
        </View>
        {
          this.state.isVisibleNewFeedScreen && 
            <View style={styles.newFeedContainer}>
              <NewFeedScreen
                initFeedName={this.state.filterText}
                viewMode={CONSTANTS.FEEDO_FROM_CARD}
                feedoMode={selectMode !== CONSTANTS.FEEDO_SELECT_FROM_SHARE_EXTENSION ? CONSTANTS.MAIN_APP_FEEDO : CONSTANTS.SHARE_EXTENTION_FEEDO}
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
  hiddenFeedoId: null,
  direction: 'left',
  onClosed: () => {},
  cachedFeedList: []
}


SelectHuntScreen.propTypes = {
  selectMode: PropTypes.number,
  hiddenFeedoId: PropTypes.string,
  direction: PropTypes.string,
  onClosed: PropTypes.func,
  cachedFeedList: PropTypes.array,
}


const mapStateToProps = ({ feedo }) => ({
  feedo,
})


const mapDispatchToProps = dispatch => ({
  setCurrentFeed: (data) => dispatch(setCurrentFeed(data)),
  getFeedoList: (index, isForCardMove) => dispatch(getFeedoList(index, isForCardMove)),
})


export default connect(mapStateToProps, mapDispatchToProps)(SelectHuntScreen)