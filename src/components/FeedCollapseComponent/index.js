/* global require */
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
import Modal from "react-native-modal"
import { isEmpty, filter } from 'lodash'
import PropTypes from 'prop-types'
import Carousel from '../../components/Carousel'
import Tags from '../FeedTags'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import styles from './styles'
const ATTACHMENT_ICON = require('../../../assets/images/Attachment/grey.png')

class FeedCollapseComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isCollapse: true,
      COLLAPSE_SECTIONS: {
        title: props.data.summary.substring(0, 30),
        content: props.data.summary.substring(30)
      },
      isPreview: false,
      images: []
    }
  }
  
  onImagePreview = (images) => {
    this.setState({ images, isPreview: true })
  }

  renderContent = (section, feedData) => {
    const images = filter(feedData.files, data => data.contentType.includes('image/'))
    const files = filter(feedData.files, data => !data.contentType.includes('image/'))

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
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
            >
              {images.map((item, key) => (
                <View key={key} style={key === (images.length - 1) ? styles.feedLastImage : styles.feedImage}>
                  <TouchableOpacity onPress={() => this.onImagePreview(images)}>
                    <Image style={styles.image} source={{ uri: item.accessUrl }} threshold={300} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>,

          <View key="2"  style={styles.attachView}>
            {files.map(item => (
              <TouchableOpacity key={item.id} onPress={() => {}}>
                <View style={styles.attachItem}>
                  <Image style={styles.attachIcon} source={ATTACHMENT_ICON} />
                  <Text style={styles.attachFileText}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
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
    const { COLLAPSE_SECTIONS, isCollapse, isPreview, images } = this.state
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

        <Modal 
          isVisible={isPreview}
          style={styles.previewModal}
          backdropColor="rgba(0, 0, 0, 0.9)"
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInTiming={1000}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => { this.setState({ isPreview: false }) }} style={styles.closeIconView}>
              <Ionicons name="ios-close" style={styles.closeIcon} />
            </TouchableOpacity>

            <Carousel
              width={CONSTANTS.SCREEN_WIDTH}
              height={350}
              backgroundColor="transparent"
            >
              {images.map(item => (
                <Image key={item.id} style={styles.previewImage} source={{ uri: item.accessUrl }} threshold={300} />
              ))}
            </Carousel>
          </View>
        </Modal>
      </View>
    )
  }
}

FeedCollapseComponent.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  feedData: PropTypes.objectOf(PropTypes.any).isRequired
}

export default FeedCollapseComponent
