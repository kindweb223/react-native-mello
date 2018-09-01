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
import COLORS from '../../service/colors';


class Tags extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tagText: this.props.tagText,
      activeTagName: props.activeTagName,
      selectedTagIndex: -1,
      isHideCursor: false,
    };
    this.prevKey = '';
  }

  componentDidMount() {
    if (!this.props.readonly) {
      this.tagInputRef.focus();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.tags.length === 0) {
      this.setState({
        isHideCursor: false,
      });
    }
    if (nextProps.tagText !== this.state.tagText) {
      this.setState({
        tagText: nextProps.tagText,
      });
    }
  }

  onChangeText(text) {
    if (this.state.isHideCursor) {
      this.setState({
        tagText: text,
      });
      return;
    }
    this.setState({
      selectedTagIndex: -1,
      activeTagName: '',
    });
    if (text.length > 1 && (text.slice(-1) === ' ' || text.slice(-1) === ',')) {
      this.onCreateTag();
    } else {
      if (this.props.onChangeText) {
        this.props.onChangeText(text);
      }
    }
  }

  onKeyPress(event) {
    if (this.state.tagText) {
      this.prevKey = event.nativeEvent.key;
      return;
    }
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
          isHideCursor: true,
        });
      }
    }
    this.prevKey = event.nativeEvent.key;
  }

  onCreateTag() {
    if (this.props.onCreateTag) {
      this.props.onCreateTag(this.state.tagText)
    }
    if (this.props.onChangeText) {
      this.props.onChangeText('');
    }
  }

  onPressTagInputCover() {
    this.setState({
      isHideCursor: false,
      tagText: '',
    });
  }

  onSubmitEditing() {
    this.onCreateTag();
  }

  renderEdit() {
    if (!this.props.readonly) {
      return (
        <View style={styles.textInputContainer}>
          <TextInput
            ref={ref => this.tagInputRef = ref}
            style={[styles.textInput, this.props.inputStyle, this.state.isHideCursor && {maxWidth: 50}]}
            maxLength={40}
            autoCapitalize='none'
            blurOnSubmit={false}
            autoCorrect={false} 
            underlineColorAndroid='transparent'
            placeholder={this.props.placeHolder}
            placeholderTextColor={COLORS.MEDIUM_GREY}
            value={this.state.tagText}
            onChangeText={this.onChangeText.bind(this)}
            onKeyPress={this.onKeyPress.bind(this)}
            onSubmitEditing={() => this.onSubmitEditing()}
          />
          {
            this.state.isHideCursor &&
              <TouchableOpacity 
                style={styles.tagInputCoverContainer}
                activeOpacity={1}
                onPress={() => this.onPressTagInputCover()}
              >
                <Text
                  style={[styles.textInput, this.props.inputStyle, {color: COLORS.MEDIUM_GREY, marginBottom: 1}]}
                >
                  {this.props.placeHolder}
                </Text>
              </TouchableOpacity>
          }
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
      this.tagInputRef.focus();
      let activeTagName = '';
      if (this.state.activeTagName !== tag.text) {
        activeTagName = tag.text;
      }
      this.onChangeText('');
      this.prevKey = '';
      this.setState({
        activeTagName,
      }, () => {
        if (activeTagName !== '') {
          this.setState({
            selectedTagIndex: index,
            isHideCursor: true,
          });
        } else {
          this.setState({
            selectedTagIndex: -1,
            isHideCursor: false,
          });
        }
      });
    }

    if (this.props.onPressTag) {
      this.props.onPressTag(index, tag)
    }
  }

  render() {
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
  tagText: '',
  readonly: false,
  activeTagName: '',
  placeHolder: 'Tags'
};

Tags.propTypes = {
  tagText: PropTypes.string,
  activeTagName: PropTypes.string,
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

export { Tag };
export default Tags;
