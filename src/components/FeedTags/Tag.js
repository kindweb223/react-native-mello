import React from "react";
import PropTypes from "prop-types";
import { Text, TouchableOpacity } from "react-native";

import styles from "./styles";

const Tag = ({ label, onPress, tagContainerStyle, tagTextStyle }) => (
  <TouchableOpacity style={[styles.tag, tagContainerStyle]} onPress={onPress}>
    <Text style={[styles.tagLabel, tagTextStyle]}>{label.text}</Text>
  </TouchableOpacity>
);

Tag.propTypes = {
  label: PropTypes.objectOf(PropTypes.any).isRequired,
  onPress: PropTypes.func,
  tagContainerStyle: PropTypes.object,
  tagTextStyle: PropTypes.object,
};

export default Tag;
