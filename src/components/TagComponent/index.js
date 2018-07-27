import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import Tag from './Tag';
import styles from './styles';


class Tags extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: props.initialText,
      activeTagName: props.activeTagName,
      selectedTagIndex: -1,
    };
    this.prevKey = '';
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
    console.log('PrevKey : ', this.prevKey);
    console.log('EventKey : ', event.nativeEvent);
    if ((this.prevKey === '' || this.prevKey === 'Backspace' || this.prevKey === ' ' || this.prevKey === ',') && event.nativeEvent.key === 'Backspace') {
      let index = this.props.tags.length - 1;
      if (this.state.selectedTagIndex !== -1) {
        index = this.state.selectedTagIndex;
      }
      // let tags = this.props.tags;
      // tags.splice(index, 1);
      this.setState({
        selectedTagIndex: -1,
        activeTagName: '',
      }, () => {
        // this.props.onChangeTags && this.props.onChangeTags(tags)
        if (this.props.onRemoveTag) {
          this.props.onRemoveTag(this.props.tags[index]);
        }
      });
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
            ref={o => this.tagInputRef = o}
            value={this.state.text}
            placeholder='Tags'
            style={[styles.textInput, this.props.inputStyle]}
            onChangeText={this.onChangeText.bind(this)}
            onKeyPress={this.onKeyPress.bind(this)}
            onSubmitEditing={() => {this.onCreateTag()}}
            underlineColorAndroid='transparent'
          />
        </View>
      );
    } else {
      return (
        <TouchableOpacity 
          style={styles.textInputContainer}
          activeOpacity={0.6}
          onPress={() => this.props.onPressTag(-1, '')}
          >
          <Text style={styles.textLabel}>Tags</Text>
        </TouchableOpacity>
      );
    }
  }

  onPressTag (index, tag) {
    let activeTagName = '';
    if (this.state.activeTagName !== tag.text) {
      activeTagName = tag.text;
    }
    this.setState({
      activeTagName,
    }, () => {
      if (activeTagName !== '') {
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
        {this.props.tags.map((tag, index) => (
          <Tag
            key={index}
            active={tag.text === this.state.activeTagName}
            label={tag.text}
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
  tags: [],
  initialText: '',
  readonly: false,
  activeTagName: '',
};

Tags.propTypes = {
  initialText: PropTypes.string,
  activeTagName: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.object),
  containerStyle: PropTypes.object,
  style: PropTypes.object,
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
};

export { Tag };
export default Tags;
