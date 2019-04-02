/* global require */
import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
  NetInfo
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import Collapsible from 'react-native-collapsible'
import Feather from 'react-native-vector-icons/Feather'
import Entypo from 'react-native-vector-icons/Entypo'
import FastImage from "react-native-fast-image"
import Modal from "react-native-modal"
import _ from 'lodash'
import PropTypes from 'prop-types'

import ImageSliderScreen from '../../containers/ImageSliderScreen'
import DocumentList from '../DocumentListComponent'
import ImageList from '../ImageListComponent'
import Tags from '../FeedTags'
import COLORS from '../../service/colors'
import CONSTANTS from '../../service/constants'
import styles from './styles'
import * as COMMON_FUNC from '../../service/commonFunc'
import { TAGS_FEATURE } from '../../service/api'
// const ATTACHMENT_ICON = require('../../../assets/images/Attachment/Blue.png')
// const IMAGE_ICON = require('../../../assets/images/Image/Blue.png')
const TAG_ICON = require('../../../assets/images/Tag/Blue.png')

class FeedCollapseComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      spinValue: new Animated.Value(0),
      hideArrow: false,
      isCollapse: true,
      feedData: {},
      isPreview: false,
      images: [],
      position: 0,
      offline: false,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { feedData } = nextProps
    if (prevState.feedData !== feedData && !_.isEmpty(feedData)) {
      return {
        feedData,
        images: _.filter(feedData.files, data => data.contentType.includes('image/')),
      }
    }
    return null
  }

  componentDidUpdate(){
    this.checkOffline()
  }

  onImagePreview = (key) => {
    this.setState({
      position: key,
      isPreview: true
    })
  }

  onRemoveFile(fileId) {
    const { feedData } = this.state
    this.props.deleteFile(feedData.id, fileId);
  }

  onTagPress = (initialTag) => {
    if (COMMON_FUNC.isFeedOwnerEditor(this.state.feedData)) {
      Actions.FeedFilterScreen({
        initialTag: [{ text: initialTag.text }]
      })
    }
  }

  checkOffline = () => {
    return new Promise ((resolve, reject) => {
      const offlineStatus = this.state.offline
      NetInfo.getConnectionInfo().then((connectionInfo) => {
        if(connectionInfo.type === 'none'){
          if(!offlineStatus){
            this.setState({ offline: true})
          }
          resolve(true)
        }else{
          if(offlineStatus){
            this.setState({ offline: false})
          }
          resolve(false)
        }
      })

    })
  }

  onPressText = () => {
    const { feedData } =  this.state 
    this.checkOffline()
    .then(offline => {
      if(!offline){
        if(COMMON_FUNC.isFeedOwnerEditor(feedData) && !offline){
          this.props.onEditFeed()
        }
        
      }
    })
  }

  renderContent = (feedData) => {
    const images = _.filter(feedData.files, data => data.contentType.includes('image/'))
    const files = _.filter(feedData.files, data => !data.contentType.includes('image/'))

    return (
      <View style={styles.contentView}>
        {feedData.summary && feedData.summary.length > 0
          ? <TouchableOpacity
              activeOpacity={0.9}
              style={styles.summaryView}
              onPress={() => this.onPressText()}
            >
              <Text style={styles.summaryText}>{feedData.summary}</Text>
            </TouchableOpacity>
          : <TouchableOpacity
              activeOpacity={0.9}
              style={styles.summaryView}
              onPress={() => this.onPressText()}
            >
              <Text style={styles.summaryPlaceHolderText}>Tap to give this flow a description</Text>
            </TouchableOpacity>
        }

        {COMMON_FUNC.isFeedOwnerEditor(feedData)
          ? <View>
              <ImageList 
                files={images}
                onRemove={(fileId) => this.onRemoveFile(fileId)}
              />
            </View>
          : images.length > 0 && (
              <View style={styles.imageView}>
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                >
                  {images.map((item, key) => (
                    <View key={key} style={key === (images.length - 1) ? styles.feedLastImage : styles.feedImage}>
                      <TouchableOpacity onPress={() => this.onImagePreview(key)}>
                        <FastImage style={styles.image} source={{ uri: item.accessUrl }} threshold={300} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>)
        }

        {files.length > 0 && (
          <View style={styles.attachView}>
            <DocumentList 
              editable={COMMON_FUNC.isFeedOwnerEditor(feedData)}
              files={files}
              onRemove={(fileId) => this.onRemoveFile(fileId)}
            />
          </View>
        )}

        {TAGS_FEATURE && feedData.tags.length > 0 && (
          <View style={[styles.tagView, files.length === 0 ? { marginTop: 20 } : { marginTop: 10 }]}>
            <Tags
              initialTags={feedData.tags}
              onChangeTags={() => {}}
              onTagPress={(tag) => this.onTagPress(tag)}
              inputStyle={{
                backgroundColor: 'white',
              }}
              tagContainerStyle={{
                backgroundColor: COLORS.TAG_LIGHT_ORANGE_BACKGROUND,
              }}
              tagTextStyle={{
                color: COLORS.DARK_ORANGE,
                fontSize: 14,
              }}
            />
          </View>
        )}

        <View style={styles.footerView}>
          <View>
            {COMMON_FUNC.isFeedOwnerEditor(feedData) && (
              <View style={styles.footerLeftBtnView}>
                {TAGS_FEATURE && (
                <TouchableOpacity
                  style={styles.btnView}
                  activeOpacity={0.6}
                  onPress={this.props.onOpenCreationTag}
                >
                  <Image source={TAG_ICON} />
                </TouchableOpacity>
                )}
                {/* <TouchableOpacity
                  style={styles.btnView}
                  activeOpacity={0.6}
                  onPress={this.props.onAddMedia}
                >
                  <Image source={IMAGE_ICON} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.btnView}
                  activeOpacity={0.6}
                  onPress={this.props.onAddDocument}
                >
                  <Image source={ATTACHMENT_ICON} />
                </TouchableOpacity> */}
              </View>
            )}
          </View>
          <TouchableOpacity onPress={this.closeCollapse}>
            <View style={styles.collapseIconView}>
              <Feather name="chevron-up" size={25} color={COLORS.MEDIUM_GREY} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  handleCollapse = () => {
    const { isCollapse } = this.state

    if (isCollapse) {
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
    const { feedData, isCollapse, isPreview, images } = this.state
    const { longHold } = this.props

    const spin = this.state.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    })

    return (
      <View style={styles.collapseView}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => longHold ? {} : this.handleCollapse()}>
          <View style={styles.collpaseHeader}>
            {isCollapse
              ? <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">{feedData.headline}</Text>
              : <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => this.onPressText() }
                >
                  <Text style={styles.headerTitle}>{feedData.headline}</Text>
                </TouchableOpacity>
            }

            {isCollapse && !longHold && (
              <Animated.View style={{ marginLeft: 10, transform: [{ rotate: spin }] }}>
                {!this.state.hideArrow && (
                  <Feather name="chevron-down" size={25} color={COLORS.MEDIUM_GREY} />
                )}
              </Animated.View>
            )}
          </View>
        </TouchableOpacity>

        <Collapsible collapsed={isCollapse} align="top" duration={500}>
          {this.renderContent(feedData)}
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
            mediaFiles={images}
            removal={false}
            onClose={() => this.setState({ isPreview: false })}
          />
        </Modal>

      </View>
    )
  }
}

FeedCollapseComponent.defaultProps = {
  longHold: false
}

FeedCollapseComponent.propTypes = {
  longHold: PropTypes.bool,
  feedData: PropTypes.objectOf(PropTypes.any).isRequired
}

export default FeedCollapseComponent
