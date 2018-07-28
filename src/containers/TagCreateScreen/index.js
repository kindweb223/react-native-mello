import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Actions } from 'react-native-router-flux'
import { Ionicons } from '@expo/vector-icons';
import _ from 'lodash';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import styles from './styles'
import COLORS from '../../service/colors';
import CONSTANTS from '../../service/constants';
import Tags from '../../components/TagComponent';
import LoadingScreen from '../LoadingScreen';

import { 
  getUserTags,
  createUserTag,
  addTagToHunt,
  removeTagFromHunt,
} from '../../redux/feed/actions'
import * as types from '../../redux/feed/types'

const UserId = 'd742e568-37d1-4c87-b9bf-062faa59c058';


class TagCreateScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      // tags: this.props.feed.feed.tags,
      filteredUserTags: [],
      userTags: [],
      currentTagName: '',
    };
    this.newTagName = '';
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.getUserTags(UserId);
    }, CONSTANTS.ANIMATEION_MILLI_SECONDS + 50)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('TagCreateScreen UNSAFE_componentWillReceiveProps : ', nextProps.feed);
    let loading = false;
    if (this.props.feed.status !== types.GET_USER_TAGS_PENDING && nextProps.feed.status === types.GET_USER_TAGS_PENDING) {
      // getting user tags
      loading = true;
    } else if (this.props.feed.status !== types.GET_USER_TAGS_FULFILLED && nextProps.feed.status === types.GET_USER_TAGS_FULFILLED) {
      // success in getting user tags
      this.setState({
        userTags: nextProps.feed.userTags,
        // tags: nextProps.feed.feed.tags,
      }, () => {
        this.filterUnusedTags(nextProps.feed.feed.tags);
      });
    } else if (this.props.feed.status !== types.CREATE_USER_TAG_PENDING && nextProps.feed.status === types.CREATE_USER_TAG_PENDING) {
      // getting user tags
      loading = true;
    } else if (this.props.feed.status !== types.CREATE_USER_TAG_FULFILLED && nextProps.feed.status === types.CREATE_USER_TAG_FULFILLED) {
      // success in getting user tags
      loading = true;
      this.setState({
        userTags: nextProps.feed.userTags,
        // tags: nextProps.feed.feed.tags,
      }, () => {
        this.onCreateTag(this.newTagName);
      });
    } else if (this.props.feed.status !== types.ADD_HUNT_TAG_PENDING && nextProps.feed.status === types.ADD_HUNT_TAG_PENDING) {
      // getting user tags
      loading = true;
    } else if (this.props.feed.status !== types.ADD_HUNT_TAG_FULFILLED && nextProps.feed.status === types.ADD_HUNT_TAG_FULFILLED) {
      // success in getting user tags
      this.filterUnusedTags(nextProps.feed.feed.tags);
    } else if (this.props.feed.status !== types.REMOVE_HUNT_TAG_PENDING && nextProps.feed.status === types.REMOVE_HUNT_TAG_PENDING) {
      // getting user tags
      loading = true;
    } else if (this.props.feed.status !== types.REMOVE_HUNT_TAG_FULFILLED && nextProps.feed.status === types.REMOVE_HUNT_TAG_FULFILLED) {
      // success in getting user tags
      this.filterUnusedTags(nextProps.feed.feed.tags);
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
      return tag.text.indexOf(this.state.currentTagName) !== -1;
    });
    return tags;
  }

  onCreateTag(text) {
    const tag = _.find(this.state.userTags, (tag) => { 
      return tag.text == text; 
    });
    if (tag) { 
      this.newTagName = '';
      this.onSelectItem(tag);
      return;
    }
    this.newTagName = text;
    this.props.createUserTag(UserId, text);
  }

  onRemoveTag(tag) {
    this.props.removeTagFromHunt(this.props.feed.feed.id, tag.id);
  }

  onChangeText(text) {
    this.setState({
      currentTagName: text,
    });
  }

  onSelectItem(tag) {
    this.props.addTagToHunt(this.props.feed.feed.id, tag.id);
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
          <Text style={styles.textBack}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderTagItem({item, index}) {
    return (
      <TouchableOpacity
        style={styles.tagItemContainer}
        activeOpacity={0.6}
        onPress={() => this.onSelectItem(item)}
      >
        <Text style={styles.textTagItem}>{item.text}</Text>
      </TouchableOpacity>
    );
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          {this.renderTopContent}
          <KeyboardAwareScrollView>
            <View style={styles.mainContentContainer}>
              <Tags
                tags={this.props.feed.feed.tags}
                onCreateTag={(text) => this.onCreateTag(text)}
                onChangeText={(text) => this.onChangeText(text)}
                onRemoveTag={(tag) => this.onRemoveTag(tag)}
                inputStyle={{
                  backgroundColor: 'white',
                }}
                tagContainerStyle={{
                  backgroundColor: COLORS.LIGHT_ORANGE_BACKGROUND,
                }}
                tagTextStyle={{
                  color: COLORS.DARK_ORANGE,
                  fontSize: 16,
                }}
                activeTagContainerStyle={{
                  backgroundColor: COLORS.LIGHT_ORANGE_ACTIVE_BACKGROUND,
                }}
                activeTagTextStyle={{
                  color: '#fff',
                  fontSize: 16,
                }}
              />
              <FlatList
                style={{marginTop: 20}}
                data={this.filterTagNames()}
                renderItem={this.renderTagItem.bind(this)}
                keyExtractor={(item, index) => index.toString()}
                extraData={this.state}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
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


const mapStateToProps = ({ feed }) => ({
  feed,
})


const mapDispatchToProps = dispatch => ({
  getUserTags: (userId) => dispatch(getUserTags(userId)),
  createUserTag: (userId, tagName) => dispatch(createUserTag(userId, tagName)),
  addTagToHunt: (huntId, tagId) => dispatch(addTagToHunt(huntId, tagId)),
  removeTagFromHunt: (huntId, tagId) => dispatch(removeTagFromHunt(huntId, tagId)),
})


export default connect(mapStateToProps, mapDispatchToProps)(TagCreateScreen)