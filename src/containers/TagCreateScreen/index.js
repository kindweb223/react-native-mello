import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Ionicons from 'react-native-vector-icons/Ionicons'
import _ from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import styles from './styles'
import COLORS from '../../service/colors';
import CONSTANTS from '../../service/constants';
import Tags from '../../components/TagComponent';
import LoadingScreen from '../LoadingScreen';
import Analytics from '../../lib/firebase'

import { 
  getUserTags,
  createUserTag,
  addTagToHunt,
  removeTagFromHunt,
} from '../../redux/feedo/actions'
import * as types from '../../redux/feedo/types'

class TagCreateScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      filteredUserTags: [],
      userTags: [],
      currentTagName: '',
    };
    this.newTagName = '';
  }

  componentDidMount() {
    Analytics.setCurrentScreen('TagCreateScreen')

    const { userInfo } = this.props.user

    setTimeout(() => {
      this.props.getUserTags(userInfo.id);
    }, CONSTANTS.ANIMATEION_MILLI_SECONDS + 50)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // console.log('TagCreateScreen UNSAFE_componentWillReceiveProps : ', nextProps.feedo);
    let loading = false;
    if (this.props.feedo.loading !== types.GET_USER_TAGS_PENDING && nextProps.feedo.loading === types.GET_USER_TAGS_PENDING) {
      // getting user tags
      loading = true;
    } else if (this.props.feedo.loading !== types.GET_USER_TAGS_FULFILLED && nextProps.feedo.loading === types.GET_USER_TAGS_FULFILLED) {
      // success in getting user tags
      this.setState({
        userTags: nextProps.feedo.userTags,
      }, () => {
        this.filterUnusedTags(nextProps.feedo.currentFeed.tags);
      });
    } else if (this.props.feedo.loading !== types.ADD_HUNT_TAG_PENDING && nextProps.feedo.loading === types.ADD_HUNT_TAG_PENDING) {
      // getting user tags
      loading = true;
    } else if (this.props.feedo.loading !== types.ADD_HUNT_TAG_FULFILLED && nextProps.feedo.loading === types.ADD_HUNT_TAG_FULFILLED) {
      // success in add a user tag to a hunt
      this.setState({
        userTags: nextProps.feedo.userTags,
      })
      this.filterUnusedTags(nextProps.feedo.currentFeed.tags);
    } else if (this.props.feedo.loading !== types.REMOVE_HUNT_TAG_PENDING && nextProps.feedo.loading === types.REMOVE_HUNT_TAG_PENDING) {
      // getting user tags
      loading = true;
    } else if (this.props.feedo.loading !== types.REMOVE_HUNT_TAG_FULFILLED && nextProps.feedo.loading === types.REMOVE_HUNT_TAG_FULFILLED) {
      // success in getting user tags
      this.filterUnusedTags(nextProps.feedo.currentFeed.tags);
    }

    this.setState({
      loading,
    });
  }

  onBack() {
    if (this.props.onBack) {
      this.props.onBack();
    }
  }

  filterUnusedTags(tags) {
    const filteredTags = [];
    this.state.userTags.map((item) => {
      let isIncludeItem = false;
      tags.map((tag) => {
        if (item.text === tag.text) {
          isIncludeItem = true;
        }
      });
      if (!isIncludeItem) {
        filteredTags.push(item);
      }
    });
    this.setState({
      filteredUserTags: filteredTags,
    });
  }

  filterTagNames() {
    if (this.state.currentTagName === '') {
      return this.state.filteredUserTags;
    }
    const tags = _.filter(this.state.filteredUserTags, (tag) => { 
      return tag.text.toLowerCase().indexOf(this.state.currentTagName.toLowerCase()) !== -1;
    });
    return tags;
  }

  onAddTag(tag) {
    this.props.addTagToHunt(this.props.feedo.currentFeed.id, tag);
  }

  onCreateTag(text) {
    const tag = {text: text}
    this.onAddTag(tag)
  }

  onRemoveTag(tag) {
    if(tag) {
      this.props.removeTagFromHunt(this.props.feedo.currentFeed.id, tag.id);
    }
  }

  onChangeText(text) {
    this.setState({
      currentTagName: text,
    });
  }

  get renderTopContent() {
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

  renderTagItem({item, index}) {
    return (
      <TouchableOpacity
        style={styles.tagItemContainer}
        activeOpacity={0.6}
        onPress={() => this.onAddTag(item)}
      >
        <Text style={styles.textTagItem}>{item.text}</Text>
      </TouchableOpacity>
    );
  }

  render () {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.contentContainer}>
          <KeyboardAwareScrollView
            style={styles.contentContainer}
            keyboardShouldPersistTaps='handled'
          >
            {this.renderTopContent}
            <Tags
              containerStyle={{marginTop: 20, paddingHorizontal: 20,}}
              tags={this.props.feedo.currentFeed.tags}
              tagText={this.state.currentTagName}
              onCreateTag={(text) => this.onCreateTag(text)}
              onChangeText={(text) => this.onChangeText(text)}
              onRemoveTag={(tag) => this.onRemoveTag(tag)}
              tagContainerStyle={{
                backgroundColor: COLORS.TAG_LIGHT_ORANGE_BACKGROUND,
              }}
              tagTextStyle={{
                color: COLORS.DARK_ORANGE,
                fontSize: 16,
              }}
              activeTagContainerStyle={{
                backgroundColor: COLORS.TAG_LIGHT_ORANGE_ACTIVE_BACKGROUND,
              }}
              activeTagTextStyle={{
                color: '#fff',
                fontSize: 16,
              }}
            />

            <FlatList
              keyboardShouldPersistTaps='always'
              style={{ marginTop: 10, paddingHorizontal: 20 }}
              data={this.filterTagNames()}
              renderItem={this.renderTagItem.bind(this)}
              keyExtractor={(item, index) => index.toString()}
              extraData={this.state}
            />
          </KeyboardAwareScrollView>
        </SafeAreaView>

        {this.state.loading && <LoadingScreen />}
      </View>
    );
  }
}


TagCreateScreen.defaultProps = {
  onBack: () => {}
}


TagCreateScreen.propTypes = {
  onBack: PropTypes.func,
}


const mapStateToProps = ({ feedo, user}) => ({
  feedo,
  user,
})


const mapDispatchToProps = dispatch => ({
  getUserTags: (userId) => dispatch(getUserTags(userId)),
  createUserTag: (userId, tagName) => dispatch(createUserTag(userId, tagName)),
  addTagToHunt: (huntId, tag) => dispatch(addTagToHunt(huntId, tag)),
  removeTagFromHunt: (huntId, tagId) => dispatch(removeTagFromHunt(huntId, tagId)),
})


export default connect(mapStateToProps, mapDispatchToProps)(TagCreateScreen)