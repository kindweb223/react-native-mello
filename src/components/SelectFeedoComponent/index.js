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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import _ from 'lodash'
import Search from 'react-native-search-box';

import { 
  getFeedoList,
} from '../../redux/feedo/actions'
import * as types from '../../redux/feedo/types'

import COLORS from '../../service/colors';
import CONSTANTS from '../../service/constants';
import styles from './styles';
import LoadingScreen from '../../containers/LoadingScreen';


const ScreenVerticalMinMargin = 80;


class SelectFeedoComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };

    this.isVisibleErrorDialog = false;
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
    this.props.getFeedoList(0)
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
        toValue: e.endCoordinates.height - ScreenVerticalMinMargin - 18, // border radius = 18
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
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  onSelectFeedo(item) {
    if (this.props.onSelectFeedo) {
      this.props.onSelectFeedo(item);
    }
  }

  get renderTopContent() {
    return (
      <View style={styles.topContainer}>
        <Text style={styles.textTitle}>Move Card</Text>
        <TouchableOpacity 
          style={styles.closeButtonWrapper}
          activeOpacity={0.6}
          onPress={this.onClose.bind(this)}
        >
          <MaterialCommunityIcons name="close" size={28} color={COLORS.PURPLE} />
        </TouchableOpacity>
      </View>
    );
  }

  renderItem({item, index}) {
    return (
      <TouchableOpacity 
        style={styles.itemContainer}
        activeOpacity={0.7}
        onPress={() => this.onSelectFeedo(item.id)}
      >
        <Text style={styles.textItemTitle} numberOfLines={1}>{item.headline}</Text>
      </TouchableOpacity>
    )
  }

  render () {
    let feedoList = this.props.feedo.feedoList;
    if (feedoList && feedoList.length > 0) {
      feedoList = _.filter(feedoList, feedo => feedo.id !== this.props.feedo.currentFeed.id);
    }

    if (feedoList && feedoList.length > 0 && this.state.filterText) {
      feedoList = _.filter(feedoList, feedo => feedo.headline.toLowerCase().indexOf(this.state.filterText.toLowerCase()) !== -1);
    }

    return (
      <View style={styles.container}>
        <Animated.View 
          style={[
            styles.contentContainer, 
            {
              paddingBottom: this.animatedKeyboardHeight,
              height: CONSTANTS.SCREEN_HEIGHT - ScreenVerticalMinMargin * 2,
            },
          ]}
        >
          {this.renderTopContent}
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
          <FlatList
            style={{marginTop: 11, marginBottom: 26}}
            contentContainerStyle={{paddingHorizontal: 20}}
            data={feedoList}
            renderItem={this.renderItem.bind(this)}
            keyExtractor={(item, index) => index.toString()}
            extraData={this.state}
          />
          {this.state.loading && <LoadingScreen />}
        </Animated.View>
      </View>
    );
  }
}


SelectFeedoComponent.defaultProps = {
  feedo: {},
  onClose: () => {},
  onSelectFeedo: () => {},
}


SelectFeedoComponent.propTypes = {
  feedo: PropTypes.object,
  onClose: PropTypes.func,
  onSelectFeedo: PropTypes.func,
}


const mapStateToProps = ({ feedo }) => ({
  feedo,
})


const mapDispatchToProps = dispatch => ({
  getFeedoList: (index) => dispatch(getFeedoList(index)),
})


export default connect(mapStateToProps, mapDispatchToProps)(SelectFeedoComponent)