import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import _ from 'lodash'
import Tag from './Tag';
import styles from './styles';

import COLORS from '../../../service/colors';
import * as COMMON_FUNC from '../../../service/commonFunc'

class InviteeTag extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: props.initialText,
      activeTagName: props.activeTagName,
      selectedTagIndex: -1,
    };
    this.prevKey = '';
  }

  componentDidMount() {
    if (!this.props.readonly) {
      this.tagInputRef.focus();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tags !== this.props.tags) {
      this.setState({ text: '' })
    }
  }
  
  onChangeText(text) {
    if (
      text.length > 1 &&
      (text.slice(-1) === ' ' || text.slice(-1) === ',')
    ) {
      // this.setState({
      //   tags: [
      //     ...this.state.tags, 
      //     {
      //       text: text.slice(0, -1).trim(),
      //       id: '',
      //     },
      //   ],
      //   text: ''
      // }, () => {
      //   this.props.onChangeTags && this.props.onChangeTags(this.state.tags)
      // });
      this.onCreateTag();
    } else {
      this.setState({ text });
      if (this.props.onChangeText) {
        this.props.onChangeText(text);
      }
    }
  }

  onKeyPress(event) {
    if ((this.prevKey === '' || this.prevKey === 'Backspace' || this.prevKey === ' ' || this.prevKey === ',') && event.nativeEvent.key === 'Backspace') {
      let index = this.props.tags.length - 1;
      if (this.state.selectedTagIndex !== -1) {
        index = this.state.selectedTagIndex;
        // this.props.onChangeTags && this.props.onChangeTags(tags)
        if (index !== -1) {
          if (this.props.onRemoveTag) {
            this.props.onRemoveTag(this.props.tags[index]);
          }
        }
        this.setState({
          selectedTagIndex: -1,
          activeTagName: '',
        });
        
      } else if (index !== -1) {
        this.setState({
          selectedTagIndex: index,
          activeTagName: this.props.tags[index].text,
        });  
      }
    }
    this.prevKey = event.nativeEvent.key;
  }

  onCreateTag() {
    if (this.props.onCreateTag) {
      this.props.onCreateTag(this.state.text)
    }
    if (this.props.onChangeText) {
      this.props.onChangeText('');
    }
    this.setState({
      text: '',
    });
    
  }

  renderEdit() {
    if (!this.props.readonly) {
      return (
        <View style={styles.textInputContainer}>
          <TextInput
            ref={ref => this.tagInputRef = ref}
            value={this.state.text}
            placeholder={this.props.placeHolder}
            style={[styles.textInput, this.props.inputStyle]}
            onChangeText={this.onChangeText.bind(this)}
            onKeyPress={this.onKeyPress.bind(this)}
            onSubmitEditing={() => {this.onCreateTag()}}
            keyboardType="email-address"
            returnKeyType="done"
            autoCorrect={false}
            textContentType='emailAddress'
            autoCapitalize="none"
            underlineColorAndroid='transparent'
            selectionColor={COLORS.PURPLE}
          />
        </View>
      );
    } else if (this.props.tags.length === 0) {
      return (
        <TouchableOpacity 
          style={styles.textInputContainer}
          activeOpacity={0.6}
          onPress={() => this.props.onPressTag(-1, '')}
          >
          <Text style={styles.textLabel}>{this.props.placeHolder}</Text>
        </TouchableOpacity>
      );
    }
  }

  onPressTag (index, tag) {
    if (!this.props.readonly) {
      let activeTagName = '';
      this.tagInputRef.blur()
      if (this.state.activeTagName !== tag.text) {
        activeTagName = tag.text;
      }
      this.setState({
        activeTagName,
      }, () => {
        if (activeTagName !== '') {
          this.setState({
            selectedTagIndex: index,
          });
        }
      });
    }

    if (this.props.onPressTag) {
      this.props.onPressTag(index, tag)
    }
  }

  checkInvalidEmail = text => {
    const { invalidEmail } = this.props
    if (_.filter(invalidEmail, item => item.email === text).length > 0 && !COMMON_FUNC.validateEmail(text)) {
      return true
    }
    return false
  }

  render() {
    const { invalidEmail } = this.props

    return (
      <View
        style={[styles.container, this.props.containerStyle]}
      >
        {this.props.tags.map((tag, index) => (
          <Tag
            key={index}
            active={tag.text === this.state.activeTagName}
            label={tag.text}
            onPress={() => this.onPressTag(index, tag)}
            tagContainerStyle={this.checkInvalidEmail(tag.text) ? { backgroundColor: COLORS.LIGHT_RED } : this.props.tagContainerStyle}
            tagTextStyle={this.checkInvalidEmail(tag.text) ? { color: COLORS.MEDIUM_RED } : this.props.tagTextStyle }
            activeTagContainerStyle={this.checkInvalidEmail(tag.text) ? { backgroundColor: 'rgba(245, 43, 101, .4)' } : { backgroundColor: 'rgba(74, 0, 205, .3)' }}
            activeTagTextStyle={[this.props.activeTagTextStyle, this.checkInvalidEmail(tag.text) ? { color: '#FF3626' } : { color: '#4A00CD' }]}
          />
        ))}
        {this.renderEdit()}
      </View>
    );
  }
}

InviteeTag.defaultProps = {
  tags: [],
  invalidEmail: [],
  initialText: '',
  readonly: false,
  activeTagName: '',
  placeHolder: 'Email or name'
};

InviteeTag.propTypes = {
  initialText: PropTypes.string,
  activeTagName: PropTypes.string,
  invalidEmail: PropTypes.arrayOf(PropTypes.any),
  tags: PropTypes.arrayOf(PropTypes.object),
  containerStyle: PropTypes.object,
  inputStyle: PropTypes.object,
  tagContainerStyle: PropTypes.object,
  tagTextStyle: PropTypes.object,
  activeTagContainerStyle: PropTypes.object,
  activeTagTextStyle: PropTypes.object,
  readonly: PropTypes.bool,
  onChangeTags: PropTypes.func,
  onPressTag: PropTypes.func,
  onCreateTag: PropTypes.func,
  onChangeText: PropTypes.func,
  onAddTag: PropTypes.func,
  onRemoveTag: PropTypes.func,
  placeHolder: PropTypes.string
};

export { InviteeTag };
export default InviteeTag;
