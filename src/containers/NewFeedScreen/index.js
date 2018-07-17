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
import { MaterialCommunityIcons, Ionicons, Entypo } from '@expo/vector-icons';
import Tags from "react-native-tags";

import COLORS from '../../service/colors'
import styles from './styles'


class NewFeedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feedName: 'Feedo UX improvements',
      note: 'Please submit ideas for Toffee sugar plum jelly beans cheesecake soufflé muffin. Oat cake dragée bear claw candy canes pastry.',
      tags: ['UX', 'Solvers'],
    };
    YellowBox.ignoreWarnings(['Warning: Unsafe legacy lifecycles']);
  }

  onClose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  onCreate() {
  }

  get renderTopContent() {
    return (
      <View style={styles.topContainer}>
        <TouchableOpacity 
          style={styles.closeContainer}
          activeOpacity={0.6}
          onPress={this.onClose.bind(this)}
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

  render () {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity 
          style={styles.backgroundContainer}
          activeOpacity={1}
          onPress={this.onClose.bind(this)}
        />
        <View style={styles.contentContainer}>
          {this.renderTopContent}
          {this.renderCenterContent}
          {this.renderBottomContent}
        </View>
        <TouchableOpacity 
          style={styles.backgroundContainer}
          activeOpacity={1}
          onPress={this.onClose.bind(this)}
        />
      </SafeAreaView>
    )
  }
}


NewFeedScreen.defaultProps = {
  onClose: () => {},
  onCreate: () => {},
}


NewFeedScreen.propTypes = {
  onClose: PropTypes.func,
  onCreate: PropTypes.func,
}


export default NewFeedScreen
