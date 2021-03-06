import React from 'react'
import {
  View,
  Text,
  Image
} from 'react-native'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import FastImage from 'react-native-fast-image'
import _ from 'lodash'

import AvatarPileComponent from '../../AvatarPileComponent'
import Tags from "../../../components/FeedTags"
import styles from './styles'
import COLORS from '../../../service/colors'
import { TAGS_FEATURE, PIN_FEATURE } from '../../../service/api'

const CARD_ICON_GREY = require('../../../../assets/images/Card/Grey.png')
const CARD_ICON_PURPLE = require('../../../../assets/images/Card/Purple.png')
const PROFILE_ICON_GREY = require('../../../../assets/images/Users/Grey.png')
const PROFILE_ICON_PURPLE = require('../../../../assets/images/Users/Blue.png')
const PIN_ICON_GREY = require('../../../../assets/images/Pin/Grey.png')
const PIN_ICON_PURPLE = require('../../../../assets/images/Pin/Blue.png')


import { 
  addFilterTag
} from '../../../redux/feedo/actions'
import ExFastImage from '../../ExFastImage';

class FeedMiniItemContentComponent extends React.Component {
  onTagPress = (initialTag, page, clickEvent) => {
    if (page === 'search') {
      this.props.addFilterTag(initialTag)
    }

    if (page === 'home' && clickEvent === 'normal') {
      Actions.FeedFilterScreen({
        initialTag: [{ text: initialTag.text }]
      })
    }
  }

  render() {
    const { data, avatars, pinFlag, page, clickEvent, thumbnailImage } = this.props

    return (
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          {thumbnailImage
            ? <ExFastImage source={{ uri: thumbnailImage.coverImage }} resizeMode="cover" style={styles.thumbnailImage} />
            : <View style={styles.thumbnailImage} />
          }
        </View>
        <View style={styles.rightContainer}>
          <View style={styles.titleView}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{data.headline}</Text>
          </View>

          <View style={styles.statsView}>
            <View style={styles.statsItemView}>
              <Image source={CARD_ICON_GREY} style={styles.cardIcon} />
              <Text style={[styles.feedText, styles.inActive]}>
                {data.metadata.ideasSubmitted}
              </Text>
            </View>
            <View style={styles.rightView}>
              {PIN_FEATURE && pinFlag && (
                <Image source={PIN_ICON_PURPLE} />
              )}
              {avatars.length > 0 && (
                <View style={styles.avatarView}>
                  <AvatarPileComponent avatars={avatars} size={29} numFaces={2} showPlus={false} showStroke />
                </View>
              )}
            </View>
          </View>

          {TAGS_FEATURE && data.tags.length > 0 && page !== 'archived' && (
            <View style={styles.tagsView}>
              <Tags
                initialTags={data.tags}
                onChangeTags={() => {}}
                onTagPress={(tag) => this.onTagPress(tag, page, clickEvent)}
                inputStyle={{
                  backgroundColor: 'white',
                }}
                tagContainerStyle={{
                  backgroundColor: COLORS.TAG_LIGHT_ORANGE_BACKGROUND
                }}
                tagTextStyle={{
                  color: COLORS.DARK_ORANGE,
                  fontSize: 14,
                }}
              />
            </View>
          )}
        </View>
      </View>
    )
  }
}

FeedMiniItemContentComponent.defaultProps = {
  addFilterTag: () => {}
}

FeedMiniItemContentComponent.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
  pinFlag: PropTypes.bool.isRequired,
  addFilterTag: PropTypes.func
}

const mapDispatchToProps = dispatch => ({
  addFilterTag: (data) => dispatch(addFilterTag(data))
})

export default connect(
  null,
  mapDispatchToProps
)(FeedMiniItemContentComponent)