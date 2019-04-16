import React from 'react'
import { ScrollView, View, Image, TouchableOpacity, Animated, ActivityIndicator, Platform } from 'react-native'
import GestureRecognizer from 'react-native-swipe-gestures'
import styles from './styles'
import FastImage from "react-native-fast-image";
import Video from 'react-native-video'
import COLORS from '../../service/colors'
import CONSANTS from '../../service/constants'

export default class SlideShow extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      currentIndex: this.props.currentImageIndex,
      isTouch: false,
      opacity: 0
    }
    this.buttonOpacity = new Animated.Value(1)
  }

  componentDidMount() {
    const {
      width,
      position,
    } = this.props

    setTimeout(() => {
      this.scrollViewRef.scrollTo({ x: width * position, y: 0 });
    }, 0)

  }

  componentWillReceiveProps(nextProps) {
    const {
      width,
      currentImageIndex,
      isFileDeleted
    } = this.props

    if (Platform.OS === 'android' && isFileDeleted) {
      setTimeout(() => {
        this.scrollViewRef.scrollTo({ x: width * currentImageIndex, y: 0 });
        this.props.updateStatus()
      }, 0)
    }
  }

  renderBubbles = () => {
    const { mediaFiles } = this.props

    const { currentIndex } =  this.state
    let bubbles = []

    for (let i = 0; i < mediaFiles.length; i++) {
      bubbles.push(<View style={[ styles.bubbles, styles.emptyBubble ]} key={i} />)
    }

    bubbles.map(v => {
      if (v.key == currentIndex) {
        bubbles[v.key] = <View style={[ styles.bubbles, styles.filledBubble ]} key={v.key} />
      }
    })

    return (
      <View style={styles.bubbleView}>
        {bubbles}
      </View>
    )
  }

  handleImage = () => {
    if (this.state.isTouch) {
      this.buttonOpacity.setValue(0);
      Animated.timing(this.buttonOpacity, {
        toValue: 1,
        duration: 200,
      }).start();
    } else {
      this.buttonOpacity.setValue(1);
      Animated.timing(this.buttonOpacity, {
        toValue: 0,
        duration: 200
      }).start();
    }
    this.setState({ isTouch: !this.state.isTouch })
    this.props.handleImage()
  }

  onLoadStart = () => {
    this.setState({ opacity: 1 })
  }

  onLoad = () => {
    this.setState({ opacity: 0 })
  }

  onBuffer = ({ isBuffering }) => {
    this.setState({ opacity: isBuffering ? 1 : 0 })
  }

  renderItem(item, index) {
    const {
      width,
      isFastImage,
    } = this.props;

    const isImage = item.contentType.toLowerCase().indexOf('image') !== -1;

    if (isImage) {
      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => this.handleImage()}
        >
          {
            isFastImage ? 
              <FastImage source={{uri: item.accessUrl}} resizeMode="contain" style={{ width, height: '100%' }} />
            : 
              <Image source={{uri: item.accessUrl}} resizeMode="contain" style={{ width, height: '100%' }} />
          }
        </TouchableOpacity>
      );
    }

    const height = Math.round(width * 0.666);

    return (
      <View style={{ width, height, backgroundColor: '#CCC' }}>
        <Video
          style={{ width, height }}
          source={{ uri: item.accessUrl }}
          controls={true}
          resizeMode='contain'
          paused={this.state.currentIndex !== index}
          onBuffer={this.onBuffer}
          onLoad={this.onLoad}
          onLoadStart={this.onLoadStart}
        />
        <ActivityIndicator
          animating
          size="small"
          color={COLORS.PURPLE}
          style={{
            opacity: this.state.opacity,
            position: 'absolute',
            top: height / 2 - 10,
            left: CONSANTS.SCREEN_WIDTH / 2 - 10,
          }}
        />
      </View>
    );
  }

  render () {
    const {
      mediaFiles,
      height,
      width,
      position,
    } = this.props
    
    return (
      <View style={[styles.container, { width, height }]}>
        <ScrollView
          ref={(ref) => { this.scrollViewRef = ref; }}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          contentOffset={{ x: width * position, y: 0 }}
          scrollEventThrottle={10}
          
          onScroll={e => {
            const offset = e.nativeEvent.contentOffset.x
            const currentIndex = parseInt(offset / width + 0.5);
            this.setState({ currentIndex })
            this.props.setPosition({ pos: currentIndex })
          }}
          contentContainerStyle={{ height }}
        >
          {
            mediaFiles.map((item, index) => (
              <GestureRecognizer
                key={index}
                style={[styles.mainContentContainer, {width, height}]}
                onSwipeDown={() => this.props.onSwipeDown()}
                config={{
                  velocityThreshold: 0.3,
                  directionalOffsetThreshold: 80
                }}
              >
                {this.renderItem(item, index)}
              </GestureRecognizer>
            ))
          }
        </ScrollView>        
        <Animated.View style={[styles.renderButtonWrapper, { opacity: this.buttonOpacity }]}>
          {this.renderBubbles()}
        </Animated.View>
      </View>
    )
  }
}
