import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';

import Tag from './Tag';
import styles from './styles';


class Tags extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: props.initialTags,
      text: props.initialText,
      activeTag: props.activeTag,
      selectedTagIndex: -1,
    };
  }

  componentWillReceiveProps(props) {
    const { initialTags = [], initialText = '' } = props;

    this.setState({
      tags: initialTags,
      text: initialText
    });
  }

  onChangeText(text) {
    if (text.length === 0) {
      // `onKeyPress` isn't currently supported on Android; I've placed an extra
      //  space character at the start of `TextInput` which is used to determine if the
      //  user is erasing.
      // this.setState(
      //   {
      //     tags: this.state.tags.slice(0, -1),
      //     // text: this.state.tags.slice(-1)[0] || ''
      //   },
      //   () =>
      //     this.props.onChangeTags && this.props.onChangeTags(this.state.tags)
      // );
    } else if (
      text.length > 1 &&
      (text.slice(-1) === ' ' || text.slice(-1) === ',')
    ) {
      this.setState(
        {
          tags: [...this.state.tags, text.slice(0, -1).trim()],
          text: ''
        },
        () =>
          this.props.onChangeTags && this.props.onChangeTags(this.state.tags)
      );
    } else {
      this.setState({ text });
    }
  };

  onKeyPress(event) {
    console.log('onKeyPress : ', event.nativeEvent.key);
    if (this.state.text === '' && event.nativeEvent.key === 'Backspace') {
      let index = 0;
      // if (this.state.selectedTagIndex !== -1) {
      //   index = this.state.selectedTagIndex;
      // }
      this.setState({
        tags: this.state.tags.slice(index, -1),
        selectedTagIndex: -1,
        activeTag: '',
      }, () => {
        this.props.onChangeTags && this.props.onChangeTags(this.state.tags)
      });
    }
  }

  renderEdit() {
    if (!this.props.readonly) {
      return (
        <View style={styles.textInputContainer}>
          <TextInput
            ref={o => this.tagInputRef = o}
            value={this.state.text}
            placeholder='Tags'
            style={[styles.textInput, this.props.inputStyle]}
            onChangeText={this.onChangeText.bind(this)}
            onKeyPress={this.onKeyPress.bind(this)}
            underlineColorAndroid='transparent'
          />
        </View>
      );
    } else {
      return (
        <TouchableOpacity 
          style={styles.textInputContainer}
          activeOpacity={0.6}
          onPress={e => this.props.onPressTag(-1, '', e)}
          >
          <Text style={styles.textLabel}>Tags</Text>
        </TouchableOpacity>
      );
    }
  }

  onPressTag (index, tag) {
    let activeTag = '';
    if (this.state.activeTag !== tag) {
      activeTag = tag;
    }
    this.setState({
      activeTag,
    }, () => {
      if (activeTag !== '') {
        this.tagInputRef.focus();
        this.setState({
          selectedTagIndex: index,
        });
      }
    });

    if (this.props.onPressTag) {
      this.props.onPressTag(index, tag)
    }
  }

  render() {
    return (
      <View
        style={[styles.container, this.props.containerStyle, this.props.style]}
      >
        {this.state.tags.map((tag, index) => (
          <Tag
            key={index}
            active={tag === this.state.activeTag}
            label={tag}
            onPress={() => this.onPressTag(index, tag)}
            tagContainerStyle={this.props.tagContainerStyle}
            tagTextStyle={this.props.tagTextStyle}
            activeTagContainerStyle={this.props.activeTagContainerStyle}
            activeTagTextStyle={this.props.activeTagTextStyle}
          />
        ))}
        {this.renderEdit()}
      </View>
    );
  }
}

Tags.defaultProps = {
  initialTags: [],
  initialText: '',
  readonly: false,
  activeTag: '',
};

Tags.propTypes = {
  initialText: PropTypes.string,
  activeTag: PropTypes.string,
  initialTags: PropTypes.arrayOf(PropTypes.string),
  onChangeTags: PropTypes.func,
  onPressTag: PropTypes.func,
  containerStyle: PropTypes.object,
  style: PropTypes.object,
  inputStyle: PropTypes.object,
  tagContainerStyle: PropTypes.object,
  tagTextStyle: PropTypes.object,
  activeTagContainerStyle: PropTypes.object,
  activeTagTextStyle: PropTypes.object,
  readonly: PropTypes.bool,
};

export { Tag };
export default Tags;
