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
import { connect } from 'react-redux'
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
      selectTags: props.initialTag,
      filteredTags: props.userTags,
      currentTagName: '',
      showFilterTags: false,
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { feedo } = nextProps
    const { selectTags } = this.state

    if (feedo.loading === 'ADD_FILTER_TAG') {
      if (_.findIndex(selectTags, item => item.text.toLowerCase() === feedo.filterTag.text.toLowerCase()) === -1) {
        this.onSelectFilterItem(feedo.filterTag)
      }
    }
  }

  onCreateTag(text) {
    const { userTags } = this.props
    let { selectTags, filteredTags } = this.state

    selectTags.push({ text })
    this.setState({ selectTags }, () => {
      this.filterFeedList()
    })

    let newFilteredTags = _.filter(filteredTags, tag => tag.text.toLowerCase() !== text.toLowerCase())

    this.setState({ filteredTags: newFilteredTags, currentTagName: '' })
    this.props.inputTag(false)
  }

  onRemoveTag(tag) {
    const { userTags } = this.props
    let { selectTags, filteredTags } = this.state

    selectTags = _.filter(selectTags, item => item.text !== tag.text)
    this.setState({ selectTags }, () => {
      this.filterFeedList()
    })

    const index = _.findIndex(userTags, o => o.text === tag.text)
    const filterIndex = _.findIndex(filteredTags, o => o.text === tag.text)

    if (index !== -1 && filterIndex === -1) {
      filteredTags.push({ text: tag.text })
    }

    this.setState({ filteredTags, currentTagName: '' })
    this.props.inputTag(false)
  }

  filterFeedList = () => {
    const { selectTags} = this.state
    this.props.changeTags(selectTags)
  }

  onChangeText = (text) => {
    this.setState({
      currentTagName: text,
    });
    this.filterTagsName(text)
    if (text.length > 0) {
      this.props.inputTag(true)
    } else {
      this.props.inputTag(false)
    }
  }

  filterTagsName = (text) => {
    const { userTags } = this.props
    const { selectTags } = this.state

    let restTags = [...userTags]
    for (let i = 0; i < selectTags.length; i ++) {
      _.remove(restTags, item => item.text.toLowerCase() === selectTags[i].text.toLowerCase())
    }

    let newFilteredTags = []

    for (let i = 0; i < restTags.length; i ++) {
      const tag = restTags[i].text.toLowerCase()

      if (tag.includes(text.toLowerCase()) && _.findIndex(selectTags, item => item.text.toLowerCase() === text.toLowerCase()) === -1) {
        newFilteredTags.push(restTags[i])
      }
    }

    this.setState({ filteredTags: newFilteredTags, showFilterTags: text.length > 0 ? true : false })
  }

  onSelectFilterItem = (item) => {
    const { filteredTags } = this.state

    this.onCreateTag(item.text)

    newFilterTags = _.filter(filteredTags, tag => tag.text !== item.text)
    this.setState({ filteredTags: newFilterTags, showFilterTags: false, currentTagName: '' })
  }

  renderFilterTagItem = ({ item, index }) => (
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
    const { selectTags, showFilterTags, filteredTags } = this.state

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
                  data={filteredTags}
                  renderItem={this.renderFilterTagItem}
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

const mapStateToProps = ({ feedo }) => ({
  feedo
})

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

export default connect(
  mapStateToProps,
  null
)(SearchBarComponent)
