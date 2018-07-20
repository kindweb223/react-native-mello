import React from 'react'
import {
  SafeAreaView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  YellowBox,
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { MaterialCommunityIcons, Ionicons, Entypo } from '@expo/vector-icons';
import Tags from "react-native-tags";
import ActionSheet from 'react-native-actionsheet'
import { Actions } from 'react-native-router-flux'

import { 
  createFeed,
  updateFeed,
  deleteFeed,
} from '../../redux/feed/actions'
import * as types from '../../redux/feed/types'

import COLORS from '../../service/colors'
import styles from './styles'
import LoadingScreen from '../LoadingScreen';


class NewFeedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feedName: 'Feedo UX improvements',
      note: 'Please submit ideas for Toffee sugar plum jelly beans cheesecake soufflé muffin. Oat cake dragée bear claw candy canes pastry.',
      tags: ['UX', 'Solvers'],
      loading: false,
    };
    YellowBox.ignoreWarnings(['Warning: Unsafe legacy lifecycles']);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { feed } = nextProps;
    console.log('feed : ', feed);
    let loading = false;
    if (feed.status == types.CREATE_FEED_PENDING) {
      loading = true;
    } else if (feed.status == types.UPDATE_FEED_PENDING) {
      loading = true;
    } else if (feed.status == types.DELETE_FEED_PENDING) {
      loading = true;
    } else if (feed.status == types.DELETE_FEED_FULFILLED) {
      // this.onClose();
    }

    return {
      loading,
    }
  }

  componentDidMount() {
    // this.props.createFeed();
  }

  onClose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  onCreate() {
    this.props.createFeed();
  }

  get renderTopContent() {
    return (
      <View style={styles.topContainer}>
        <TouchableOpacity 
          style={styles.closeContainer}
          activeOpacity={0.6}
          onPress={this.onOpenActionSheet.bind(this)}
        >
          <MaterialCommunityIcons name="close" size={32} color={COLORS.PURPLE} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.createContainer}
          activeOpacity={0.6}
          onPress={this.onCreate.bind(this)}
        >
          <Text style={styles.textButton}>Create</Text>
        </TouchableOpacity>
      </View>
    );
  }

  get renderCenterContent() {
    return (
      <View style={styles.mainContentContainer}>
        <TextInput 
          style={styles.textInputFeedName}
          placeholder='Name your feed'
          underlineColorAndroid='transparent'
          value={this.state.feedName}
          onChangeText={(value) => this.setState({feedName: value})}
        />
        <TextInput 
          style={styles.textInputNote}
          placeholder='Note'
          multiline={true}
          underlineColorAndroid='transparent'
          value={this.state.note}
          onChangeText={(value) => this.setState({note: value})}
        />
        <Tags
          initialTags={this.state.tags}
          onChangeTags={tags => this.setState({ tags })}
          onTagPress={(index, tagLabel, event) => console.log(index, tagLabel)}
          containerStyle={{
            marginHorizontal: 20,
            marginVertical: 15,
          }}
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
        />
      </View>
    );
  }

  onInsertLink() {
  }

  onInsertImage() {
  }

  onInsertAttachment() {
  }
  
  onOpenActionSheet() {
    this.ActionSheet.show();
    return;
  };

  get renderBottomContent() {
    return (
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.bottomItemContainer}
          activeOpacity={0.6}
          onPress={this.onInsertLink.bind(this)}
        >
          <Ionicons name="ios-flash" size={28} color={COLORS.PURPLE} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.bottomItemContainer}
          activeOpacity={0.6}
          onPress={this.onInsertImage.bind(this)}
        >
          <Entypo name="image" size={19} color={COLORS.PURPLE} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.bottomItemContainer}
          activeOpacity={0.6}
          onPress={this.onInsertAttachment.bind(this)}
        >
          <Ionicons name="md-attach" style={styles.attachment} size={22} color={COLORS.PURPLE} />
        </TouchableOpacity>
      </View>
    );
  }

  onTapActionSheet(index) {
    if (index === 1) {
      this.props.deleteFeed('020675a4-2ad8-490d-8816-ff12e5049a43')
    }
  }

  render () {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity 
          style={styles.backgroundContainer}
          activeOpacity={1}
          onPress={this.onOpenActionSheet.bind(this)}
        />
        <View style={styles.contentContainer}>
          {this.renderTopContent}
          {this.renderCenterContent}
          {this.renderBottomContent}
        </View>
        <TouchableOpacity 
          style={styles.backgroundContainer}
          activeOpacity={1}
          onPress={this.onOpenActionSheet.bind(this)}
        />
        <ActionSheet
          ref={o => this.ActionSheet = o}
          title='Are you sure that you wish to leave?'
          options={['Continue editing', 'Leave and discard', 'Cancel']}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          tintColor={COLORS.PURPLE}
          onPress={(index) => this.onTapActionSheet(index)}
        />
        {this.state.loading && <LoadingScreen />}
      </SafeAreaView>
    )
  }
}


NewFeedScreen.defaultProps = {
  feed: {},
  onClose: () => {},
}


NewFeedScreen.propTypes = {
  feed: PropTypes.object,
  onClose: PropTypes.func,
  createFeed: PropTypes.func,
  updateFeed: PropTypes.func,
  deleteFeed: PropTypes.func,
}


const mapStateToProps = ({ feed }) => ({
  feed,
})


const mapDispatchToProps = dispatch => ({
  createFeed: () => dispatch(createFeed()),
  updateFeed: (id, name, note, tags, files) => dispatch(updateFeed(id, name, note, tags, files)),
  deleteFeed: (id) => dispatch(deleteFeed(id)),
})


export default connect(mapStateToProps, mapDispatchToProps)(NewFeedScreen)