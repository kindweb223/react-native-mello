import React from 'react'
import {
  Text,
  FlatList,
  View,
  TouchableOpacity,
  Animated,
  Image,
  Keyboard,
  BackHandler,
} from 'react-native'
import { connect } from 'react-redux'
import * as Animatable from 'react-native-animatable'
import _ from 'lodash'
import Search from 'react-native-search-box';
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'

import COLORS from '../../service/colors';
import CONSTANTS from '../../service/constants';
import styles from './styles';
import LoadingScreen from '../LoadingScreen';

const FEED_ICON = require('../../../assets/images/IconFlow/IconsMediumFlowGrey.png')

class SearchScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          keyboardHeight: 0,
          cachedFeedList: props.cachedFeedList,
          animationType: 'slideInUp'
        };
        this.animatedMove = new Animated.Value(0);
    }
  
    componentDidMount() {
        this.keyboardWillShowSubscription = Keyboard.addListener('keyboardWillShow', (keyboard) => this.keyboardWillShow(keyboard));
        this.keyboardWillHideSubscription = Keyboard.addListener('keyboardWillHide', (keyboard) => this.keyboardWillHide(keyboard));
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
      this.onClose();
      return true;
    }
  
    keyboardWillShow(keyboard) {
      this.setState({ keyboardHeight: keyboard.endCoordinates.height })
    }
    
    keyboardWillHide(keyboard) {
      this.setState({ keyboardHeight: 0 })
    }

    renderItem({item, index}) {
        return (
        <TouchableOpacity 
            style={styles.itemContainer}
            activeOpacity={0.7}
            onPress={() => this.onSelectFeed(item)}
        >
            <Image source={FEED_ICON} />
            <Text style={styles.textItemTitle} numberOfLines={1}>{item.headline}</Text>
        </TouchableOpacity>
        )
    }

    onClose() {
        this.props.onClosed()
    }

    onSelectFeed(item) {
        Keyboard.dismiss()
        Actions.FeedDetailScreen({
            data: item
        })
    }

    render () {
        const { animationType, cachedFeedList, keyboardHeight } = this.state
    
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
    
        return (
          <View style={[styles.container]}>
            <View style={styles.feedContainer}>
                <Animatable.View
                    animation={animationType}
                    duration={300}
                    style={ styles.container }
                >
                {this.renderHeader}
                <View style={styles.searchContainer}>
                  <Search
                    autoFocus={true}
                    ref={ (search) => this.search = search }
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
                    onCancel={ this.onClose.bind(this) }
                    onDelete={() => this.setState({filterText: ''})}
                  />
                </View>
                <FlatList
                  style={{marginTop: 11 }}
                  keyboardShouldPersistTaps='handled'
                  contentContainerStyle={{ paddingHorizontal: 13, paddingBottom: 26 + keyboardHeight }}
                  data={feedoList}
                  renderItem={this.renderItem.bind(this)}
                  keyExtractor={(item, index) => index.toString()}
                  extraData={this.state}
                />
                {this.state.loading && <LoadingScreen />}
              </Animatable.View>
            </View>
          </View>
        );
    }
}

SearchScreen.defaultProps = {
    keyboardHeight: 0,
    selectMode: CONSTANTS.FEEDO_SELECT_FROM_MAIN,
    onClosed: () => {},
    cachedFeedList: []
}
  
  
SearchScreen.propTypes = {
    keyboardHeight: PropTypes.number,
    selectMode: PropTypes.number,
    onClosed: PropTypes.func,
    cachedFeedList: PropTypes.array,
}
  

const mapStateToProps = ({ feedo }) => ({
    feedo,
})

export default connect()(SearchScreen)