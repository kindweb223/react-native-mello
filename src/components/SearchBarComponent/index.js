import React from "react";
import PropTypes from "prop-types";
import { View } from "react-native";

import Tag from "./Tag";
import styles from "./styles";

class SearchBarComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  filterTagNames() {
    
  }

  onCreateTag(text) {
    console.log('CREATE: ', text)
  }

  onRemoveTag(tag) {
    console.log('REMOVE: ', tag)
  }

  onChangeText(text) {
    this.setState({
      currentTagName: text,
    });
  }

  onSelectItem(tag) {
    this.setState({
      currentTagName: '',
    });
    console.log('SELECT_TAG: ', tag)
  }

  render() {
    return (
      <View
        style={[styles.container, this.props.containerStyle, this.props.style]}
      >
        {/* <Tag
            containerStyle={{marginTop: 20, paddingHorizontal: 20,}}
            tags={this.props.feedo.currentFeed.tags}
            tagText={this.state.currentTagName}
            onCreateTag={(text) => this.onCreateTag(text)}
            onChangeText={(text) => this.onChangeText(text)}
            onRemoveTag={(tag) => this.onRemoveTag(tag)}
            tagContainerStyle={{
              backgroundColor: COLORS.TAG_LIGHT_ORANGE_BACKGROUND,
            }}
            tagTextStyle={{
              color: COLORS.DARK_ORANGE,
              fontSize: 16,
            }}
            activeTagContainerStyle={{
              backgroundColor: COLORS.TAG_LIGHT_ORANGE_ACTIVE_BACKGROUND,
            }}
            activeTagTextStyle={{
              color: '#fff',
              fontSize: 16,
            }}
          /> */}

          {/* <KeyboardAwareScrollView
            keyboardShouldPersistTaps='always'
          >
            <FlatList
              style={{marginTop: 10, paddingHorizontal: 20,}}
              data={this.filterTagNames()}
              renderItem={this.renderTagItem.bind(this)}
              keyExtractor={(item, index) => index.toString()}
              extraData={this.state}
            />
          </KeyboardAwareScrollView> */}
      </View>
    );
  }
}

SearchBarComponent.defaultProps = {
  readonly: false
};

SearchBarComponent.propTypes = {
  readonly: PropTypes.bool
};

export default SearchBarComponent;
