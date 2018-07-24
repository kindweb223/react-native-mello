import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";

import Tag from "./Tag";
import styles from "./styles";

class Tags extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: props.initialTags,
      text: props.initialText
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.initialTags === prevState.initialTags &&
      nextProps.initialText === prevState.initialText
    ) {
      return null;
    }
    return {
      tags: nextProps.initialTags,
      text: nextProps.initialText
    };
  }

  render() {
    return (
      <View
        style={[styles.container, this.props.containerStyle, this.props.style]}
      >
        {this.state.tags.map((tag, i) => (
          <Tag
            key={i}
            label={tag}
            onPress={() => {}}
            tagContainerStyle={this.props.tagContainerStyle}
            tagTextStyle={this.props.tagTextStyle}
          />
        ))}
      </View>
    );
  }
}

Tags.defaultProps = {
  initialTags: [],
  initialText: " ",
  readonly: false
};

Tags.propTypes = {
  initialText: PropTypes.string,
  initialTags: PropTypes.arrayOf(PropTypes.any),
  onChangeTags: PropTypes.func,
  onTagPress: PropTypes.func,
  containerStyle: PropTypes.object,
  style: PropTypes.object,
  inputStyle: PropTypes.object,
  tagContainerStyle: PropTypes.object,
  tagTextStyle: PropTypes.object,
  readonly: PropTypes.bool
};

export { Tag };
export default Tags;
