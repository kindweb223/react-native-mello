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
          <View>
            {feedData.tags && (
              <View style={styles.tagView}>
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
              </View>
            )}
            
            {images && (
              <View style={styles.imageView}>
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
              </View>
            )}

            {files && (
              <View style={styles.attachView}>
                {files.map(item => (
                  <TouchableOpacity key={item.id} onPress={() => {}}>
                    <View style={styles.attachItem}>
                      <Image style={styles.attachIcon} source={ATTACHMENT_ICON} />
                      <Text style={styles.attachFileText}>{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        <View style={styles.footerView}>
          <TouchableOpacity onPress={this.closeCollapse}>
            <View style={styles.collapseIconView}>
              <Ionicons name="ios-arrow-up" style={styles.arrowUpIcon} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  handleCollapse = () => {
    const { isCollapse } = this.state
    if (isCollapse) {
      this.setState({ isCollapse: false })
    }
  }

  closeCollapse = () => {
    this.setState({ isCollapse: true })
  }

  render() {
    const { COLLAPSE_SECTIONS, isCollapse, isPreview, images } = this.state
    const { feedData } = this.props

    return (
      <View style={styles.collapseView}>
        <TouchableOpacity onPress={this.handleCollapse}>
          <View style={isCollapse ? styles.collapseHeader : styles.noncollapseHeader}>
            <Text style={isCollapse ? styles.collapseHeaderText : styles.headerText} numberOfLines={1} ellipsizeMode="tail">
              {COLLAPSE_SECTIONS.title}
            </Text>
            {isCollapse && (
              <Ionicons name="ios-arrow-down" style={styles.arrowDownIcon} />
            )}
          </View>
        </TouchableOpacity>

        <Collapsible collapsed={isCollapse} align="center" duration={500}>
          {this.renderContent(COLLAPSE_SECTIONS, feedData)}
        </Collapsible>

        <Modal 
          isVisible={isPreview}
          style={styles.previewModal}
          backdropColor="rgba(0, 0, 0, 0.9)"
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInTiming={1500}
          animationOutTiming={1500}
        >
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => { this.setState({ isPreview: false }) }} style={styles.closeIconView}>
              <Ionicons name="ios-close" style={styles.closeIcon} />
            </TouchableOpacity>

            <Carousel
              width={CONSTANTS.SCREEN_WIDTH}
              height={250}
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
