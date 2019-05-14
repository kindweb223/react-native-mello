import React from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import PropTypes from 'prop-types'

import { Actions } from 'react-native-router-flux'
import Feather from 'react-native-vector-icons/Feather'
import MentionsTextInput from 'react-native-mentions'
import _ from 'lodash'

import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import styles from './styles'
import UserAvatarComponent from '../../components/UserAvatarComponent'

export default class InputToolbarComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      keyword: '',
      data: []
    }
  }

  onSend() {
    if (this.props.comment) {
      if (this.props.onSend) {
        this.props.onSend()
      }
    }
  }

  onChangeText(value) {
    this.setState({ value })
    if (this.props.onChangeText) {
      this.props.onChangeText(value)
    }
  }

  focus() {
    // this.textInputRef.focus();
  }

  callback(keyword) {
    const key = keyword.slice(1, keyword.length)
    const data = _.filter(this.props.dataList, item => {
      const displayName = `${item.userProfile.firstName} ${item.userProfile.lastName}`
      return displayName.toLowerCase().includes(key.toLowerCase())
    })
    this.setState({ data, keyword })
  }

  onSuggestionTap(username, hidePanel) {
    hidePanel();
    const comment = this.state.value.slice(0, - this.state.keyword.length)
    this.setState({
      data: [],
      value: comment + '@' + username
    })
    this.onChangeText(comment + '@' + username)
  }

  renderSuggestionsRow({ item }, hidePanel) {
    const displayName = `${item.userProfile.firstName} ${item.userProfile.lastName}`
    return (
      <TouchableOpacity onPress={() => this.onSuggestionTap(displayName, hidePanel)}>
        <View style={styles.suggestionsRowContainer}>
          <UserAvatarComponent
            user={item.userProfile}
            size={32}
          />
          <View style={styles.userDetailsBox}>
            <Text style={styles.displayNameText}>{displayName}</Text>
            <Text style={styles.userNameText}>{item.userProfile.email}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const {
      showKeyboard,
      comment
    } = this.props;
    const textInputStyle = showKeyboard ? styles.activeTextInput : styles.textInput;

    return (
      <View style={[styles.container, showKeyboard && styles.shadowContainer]}>
        <View style={styles.rowContainer}>
          <MentionsTextInput
            ref={ref => this.textInputRef = ref}
            textInputStyle={textInputStyle}
            loadingComponent={() => <View style={{ flex: 1 }}></View>}
            suggestionsPanelStyle={{ backgroundColor: 'white' }}
            textInputMinHeight={45}
            textInputMaxHeight={100}
            autoCorrect={false}
            placeholder='Type comment...'
            trigger={'@'}
            triggerLocation={'anywhere'} // 'new-word-only', 'anywhere'
            value={comment}
            onChangeText={(value) => this.onChangeText(value)}
            triggerCallback={this.callback.bind(this)}
            renderSuggestionsRow={this.renderSuggestionsRow.bind(this)}
            suggestionsData={this.state.data} // array of objects
            keyExtractor={(item, index) => item.id}
            suggestionRowHeight={75}
            horizontal={false} // defaut is true, change the orientation of the list
            MaxVisibleRowCount={3} // this is required if horizontal={false}
          />
          <TouchableOpacity
            style={[styles.buttonContainer, {backgroundColor: this.props.comment ? COLORS.PURPLE : COLORS.MEDIUM_GREY}]}
            activeOpacity={0.6}
            onPress={() => this.onSend()}
          >
            <Feather name='arrow-right' size={20} color='#fff' />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}


InputToolbarComponent.defaultProps = {
  showKeyboard: false,
  comment: '',
  dataList: [],
  onChangeText: () => {},
  onSend: () => {},
};


InputToolbarComponent.propTypes = {
  showKeyboard: PropTypes.bool,
  comment: PropTypes.string,
  dataList: PropTypes.array,
  onChangeText: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
};
