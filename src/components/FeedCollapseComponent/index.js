/* global require */
import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated
} from 'react-native'
import Collapsible from 'react-native-collapsible'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import Image from 'react-native-image-progress'
import Modal from "react-native-modal"
import ImageSliderScreen from '../../containers/ImageSliderScreen'
import { isEmpty, filter } from 'lodash'
import PropTypes from 'prop-types'
import Tags from '../FeedTags'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import styles from './styles'
const ATTACHMENT_ICON = require('../../../assets/images/Attachment/grey.png')

class FeedCollapseComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      spinValue: new Animated.Value(0),
      hideArrow: false,
      isCollapse: true,
      COLLAPSE_SECTIONS: {
        titleOrigin: props.data.summary,
        title: props.data.summary.substring(0, 40),
        content: props.data.summary.substring(40)
      },
      isPreview: false,
      position: 0,
    }
  }

  onImagePreview = (key) => {
    this.setState({
      position: key,
      isPreview: true
    })
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
                    backgroundColor: COLORS.TAG_LIGHT_ORANGE_BACKGROUND,
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
                      <TouchableOpacity onPress={() => this.onImagePreview(key)}>
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
              <Feather name="chevron-up" style={styles.arrowUpIcon} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  handleCollapse = () => {
    const { isCollapse, COLLAPSE_SECTIONS } = this.state
    if (isCollapse && COLLAPSE_SECTIONS.content.length > 0) {
      Animated.timing(
        this.state.spinValue,
        {
          toValue: 1,
          duration: 500,
        }
      ).start((animation) => {
        if (animation.finished) {
          this.setState({ hideArrow: true })
        }
      })
      this.setState({ isCollapse: false })
    }
  }

  closeCollapse = () => {
    this.setState({ isCollapse: true, hideArrow: false })
    Animated.timing(
      this.state.spinValue,
      {
        toValue: 0,
        duration: 500,
      }
    ).start()
  }

  render() {
    const { COLLAPSE_SECTIONS, isCollapse, isPreview, images } = this.state
    const { feedData } = this.props

    const spin = this.state.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    })

    return (
      <View style={styles.collapseView}>
        <TouchableOpacity onPress={this.handleCollapse}>
          <View style={isCollapse ? styles.collapseHeader : styles.noncollapseHeader}>
            {isCollapse
              ? <Text style={styles.collapseHeaderText} numberOfLines={1} ellipsizeMode="tail">
                  {COLLAPSE_SECTIONS.titleOrigin}
                </Text>
              : <Text style={styles.headerText}>
                  {COLLAPSE_SECTIONS.title}
                </Text>
            }
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              {!this.state.hideArrow && (
                <Feather name="chevron-down" style={styles.arrowUpIcon} />
              )}
            </Animated.View>
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
          animationInTiming={300}
          animationOutTiming={300}
        >
          <ImageSliderScreen
            position={this.state.position}
            removal={true}
            onClose={() => this.setState({ isPreview: false })}
          />
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
