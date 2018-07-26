import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { Actions } from 'react-native-router-flux'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { filter } from 'lodash'

import styles from './styles'
import COLORS from '../../service/colors'
import Tags from '../../components/TagComponent';

import { 
} from '../../redux/feed/actions'
import * as types from '../../redux/feed/types'

const AllTags = [
  'Designers',
  'Family',
  'HR',
  'Solvers',
  'Team',
  'Travel',
  'UX',
];


class TagCreateScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      tags: ['UX', 'Solvers'],
      tagList: [...AllTags],
    };
  }

  componentDidMount() {
    this.filterUnusedTags();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('UNSAFE_componentWillReceiveProps : ', nextProps.feed);
    let loading = false;
    if (this.props.feed.status !== types.DELETE_FILE_PENDING && nextProps.feed.status === types.DELETE_FILE_PENDING) {
      // deleting a file
      loading = true;
    } else if (this.props.feed.status !== types.DELETE_FILE_FULFILLED && nextProps.feed.status === types.DELETE_FILE_FULFILLED) {
      // fullfilled in deleting a file
    }

    this.setState({
      loading,
    });

    // showing error alert
    if (nextProps.feed.error) {
      let error = null;
      if (nextProps.feed.error.error) {
        error = nextProps.feed.error.error;
      } else {
        error = nextProps.feed.error.message;
      }
      if (error) {
        Alert.alert('Error', error, [
          {text: 'Close'},
        ]);
      }
      return;
    }
  }

  onBack() {
    if (this.props.onBack) {
      this.props.onBack();
    }
  }

  onSave() {
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
        <TouchableOpacity 
          style={styles.saveButtonContainer}
          activeOpacity={0.6}
          onPress={this.onSave.bind(this)}
        >
          <Text style={styles.textButton}>Save</Text>
        </TouchableOpacity>
      </View>
    );
  }

  filterUnusedTags() {
    const filteredTags = AllTags;
    AllTags.map((item, index) => {
      this.state.tags.forEach((tag) => {
        if (item === tag) {
          filteredTags.splice(index, 1);
        }
      })
    });
    this.setState({
      tagList: filteredTags,
    });
  }

  onSelectItem(item) {
    this.setState((state) => {
      state.tags.push(item);
      return state;
    }, () => {
      this.filterUnusedTags();
    });
  }

  renderTagItem({item, index}) {
    return (
      <TouchableOpacity
        style={styles.tagItemContainer}
        activeOpacity={0.6}
        onPress={() => this.onSelectItem(item)}
      >
        <Text style={styles.textTagItem}>{item}</Text>
      </TouchableOpacity>
    );
  }

  render () {
    return (
      <View style={styles.container}>
        {this.renderTopContent}
        <ScrollView style={styles.mainContentContainer}>
          <Tags
            initialTags={this.state.tags}
            onPressTag={(index, tag, active) => console.log(index, tag, active)}
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
            data={this.state.tagList}
            renderItem={this.renderTagItem.bind(this)}
            keyExtractor={(item, index) => index.toString()}
            extraData={this.state}
          />
        </ScrollView>
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
  deleteFile: (feedId, fileId) => dispatch(deleteFile(feedId, fileId)),
})


export default connect(mapStateToProps, mapDispatchToProps)(TagCreateScreen)