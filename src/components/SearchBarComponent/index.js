import React from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity
} from "react-native";

import _ from 'lodash'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Tags from "../TagComponent";
import COLORS from '../../service/colors'
import styles from "./styles";

const SEARCH_ICON = require('../../../assets/images/Search/Grey.png')
const TAG_ICON = require('../../../assets/images/Tag/Grey.png')

class SearchBarComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectTags: this.props.initialTag,
      currentTagName: '',
      showFilterTags: false
    }
  }

  onCreateTag(text) {
    let { selectTags } = this.state
    selectTags = [
      ...selectTags,
      { text }
    ]
    this.setState({ selectTags }, () => {
      this.filterFeedList()
    })
  }

  onRemoveTag(tag) {
    let { selectTags } = this.state
    selectTags = _.filter(selectTags, item => item.text !== tag.text)
    this.setState({ selectTags }, () => {
      this.filterFeedList()
    })
    console.log('REMOVE: ', tag)
  }

  filterFeedList = () => {
    const { selectTags} = this.state
    this.props.changeTags(selectTags)
  }

  onChangeText(text) {
    this.setState({ showFilterTags: text.length > 0 ? true : false })
    this.setState({
      currentTagName: text,
    });
  }

  onSelectFilterItem = (item) => {
    this.onCreateTag(item.text)
    this.setState({
      currentTagName: '',
    });
  }

  filterTagItem = ({ item }) => (
    <TouchableOpacity onPress={() => this.onSelectFilterItem(item)}>
      <View style={styles.filterItem}>
        <Image source={TAG_ICON} />
        <Text style={styles.filterItemText}>
          {item.text}
        </Text>
      </View>
    </TouchableOpacity>
  )

  render() {
    const { userTags } = this.props
    const { selectTags, showFilterTags } = this.state
    console.log('userTags: ', userTags)

    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <View style={styles.searchIconView}>
            <Image source={SEARCH_ICON} />
          </View>

          <Tags
            containerStyle={{ paddingHorizontal: 5 }}
            tags={selectTags}
            tagText={this.state.currentTagName}
            placeHolder=""
            onCreateTag={(text) => this.onCreateTag(text)}
            onChangeText={(text) => this.onChangeText(text)}
            onRemoveTag={(tag) => this.onRemoveTag(tag)}
            tagContainerStyle={{
              backgroundColor: COLORS.TAG_LIGHT_ORANGE_BACKGROUND
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
          />
        </View>

        {showFilterTags && (
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps='always'
          >
            <View style={styles.filterContainer}>
              <View>
                <View style={styles.titleView}>
                  <Text style={styles.title}>Tags</Text>
                </View>
                <FlatList
                  style={{ marginTop: 10 }}
                  data={userTags}
                  renderItem={this.filterTagItem}
                  keyExtractor={(item, index) => index.toString()}
                  extraData={this.state}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        )}
      </View>
    );
  }
}

SearchBarComponent.defaultProps = {
  readonly: false,
  initialTag: [],
  userTags: [],
  changeTags: () => {}
};

SearchBarComponent.propTypes = {
  initialTag: PropTypes.arrayOf(PropTypes.any),
  userTags: PropTypes.arrayOf(PropTypes.any),
  readonly: PropTypes.bool,
  changeTags: PropTypes.func
};

export default SearchBarComponent;
