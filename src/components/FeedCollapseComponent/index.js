import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import Collapsible from 'react-native-collapsible'
import { Ionicons } from 'react-native-vector-icons'
import Image from 'react-native-image-progress'
import { isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import Tags from '../FeedTags'
import COLORS from '../../service/colors'
import styles from './styles'

class FeedCollapseComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isCollapse: true,
      COLLAPSE_SECTIONS: {
        title: props.data.summary.substring(0, 30),
        content: props.data.summary.substring(30)
      }
    }
  }

  renderContent = (section, feedData) => {
    return (
      <View style={styles.contentView}>
        <Text style={styles.contentText}>{section.content}</Text>

        {!isEmpty(feedData) && (
          [<View key="0" style={styles.tagView}>
            <Tags
              initialTags={feedData.tags}
              onChangeTags={() => {}}
              onTagPress={() => {}}
              inputStyle={{
                backgroundColor: 'white',
              }}
              tagContainerStyle={{
                backgroundColor: COLORS.LIGHT_ORANGE_BACKGROUND,
              }}
              tagTextStyle={{
                color: COLORS.DARK_ORANGE,
                fontSize: 16,
              }}
            />
          </View>,

          <View key="1" style={styles.imageView}>
            {feedData.files && (
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={true}
              >
                {feedData.files.map((item, key) => (
                  <View key={key} style={key === (feedData.files.length - 1) ? styles.feedLastImage : styles.feedImage}>
                    <Image style={styles.image} source={{ uri: item }} threshold={300}/>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>]
        )}

        <View style={styles.footerView}>
          <TouchableOpacity onPress={this.handleCollapse}>
            <Ionicons name="ios-arrow-up" style={styles.arrowUpIcon} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  handleCollapse = () => {
    const { isCollapse } = this.state
    this.setState({ isCollapse: !isCollapse })
  }

  render() {
    const { COLLAPSE_SECTIONS, isCollapse } = this.state
    const { feedData } = this.props
    // console.log('FEED_DETAIL_DATA: ', feedData)

    return (
      <View style={styles.collapseView}>
        <TouchableOpacity onPress={this.handleCollapse}>
          <View style={[styles.collapseHeader, { borderBottomWidth: isCollapse ? 1 : 0 }]}>
            <Text style={styles.collapseHeaderText} numberOfLines={1} ellipsizeMode="tail">{COLLAPSE_SECTIONS.title}</Text>
            {isCollapse && (
              <Ionicons name="ios-arrow-down" style={styles.arrowDownIcon} />
            )}
          </View>
        </TouchableOpacity>

        <Collapsible collapsed={isCollapse} align="center">
          {this.renderContent(COLLAPSE_SECTIONS, feedData)}
        </Collapsible>
      </View>
    )
  }
}

FeedCollapseComponent.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  feedData: PropTypes.objectOf(PropTypes.any).isRequired
}

export default FeedCollapseComponent
