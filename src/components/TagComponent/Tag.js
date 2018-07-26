import React from "react";
import PropTypes from "prop-types";
import { 
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import styles from "./styles";

export default class Tag extends React.Component {
  constructor(props) {
    super(props);
  }

  onPressTag() {
    if (this.props.onPress) {
      this.props.onPress();
    }
  }

  render() {
    const {
      active,
      label,
      tagTextStyle,
      tagContainerStyle,
      activeTagContainerStyle,
      activeTagTextStyle,
    } = this.props;
    return (
      <TouchableOpacity 
        style={[styles.tag, active ? activeTagContainerStyle : tagContainerStyle]}
        activeOpacity={0.6}
        onPress={this.onPressTag.bind(this)}
      >
        <Text style={[styles.tagLabel, active ? activeTagTextStyle : tagTextStyle]}>{label}</Text>
      </TouchableOpacity>
    )
  };
}

Tag.defaultProps = {
  active: false,
};

Tag.propTypes = {
  active: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  tagContainerStyle: View.propTypes.style,
  tagTextStyle: Text.propTypes.style,
  activeTagContainerStyle: View.propTypes.style,
  activeTagTextStyle: Text.propTypes.style,
}
