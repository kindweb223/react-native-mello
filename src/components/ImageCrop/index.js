import React, { Component } from 'react';
import {
	View,
	Image,
	StyleSheet,
	ImageEditor,
	PanResponder,
} from 'react-native';
import PropTypes from 'prop-types';
import ImageResizer from 'react-native-image-resizer';
import styles from './styles'
import CONSTANTS from '../../service/constants'

class ImageCrop extends Component {
	static propTypes = {
		source: PropTypes.any.isRequired
	}

	constructor(props) {
		super(props);

		this.state = {
			originalImageWidth: null,
			originalImageHeight: null,
			imageWidth: null,
			imageHeight: null,
			containerWidth: null,
			containerHeight: null,
			containerRatio: null,
			offsetX: 0,
			offsetY: 0,
			currentOffsetX: 0, 
			currentOffsetY: 0,
			cropWidth: CONSTANTS.SCREEN_WIDTH,
			cropHeight: CONSTANTS.SCREEN_WIDTH,
			cropQuality: 100,

			scale: 1,
			maxScale: 2,
			minScale: 1,
			lastScale: 1
		};

		this.pointX = 0
		this.pointY = 0
		this.paddingWidth = 0
		this.paddingHeight = 0
	}

	componentWillMount() {
		this.panResponder = this.getPanResponder();

		Image.getSize(this.props.source.uri, (originalImageWidth, originalImageHeight) => {
			this.setState({ originalImageWidth, originalImageHeight });
			this.setState({
				containerWidth: CONSTANTS.SCREEN_WIDTH,
				containerHeight: originalImageWidth > originalImageHeight ? CONSTANTS.SCREEN_WIDTH : CONSTANTS.SCREEN_WIDTH * originalImageHeight / originalImageWidth,
				containerRatio: originalImageWidth / CONSTANTS.SCREEN_WIDTH
			})
		});
	}

	getPanResponder() {
		return PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponderCapture: () => true,
			onPanResponderGrant: this._handlePanResponderGrant,
			onPanResponderMove: this._handlePanResponderMove,
			onPanResponderRelease: this._handlePanResponderEnd,
			onPanResponderTerminationRequest: evt => true,
      onShouldBlockNativeResponder: evt => true
		});
	}

	_handlePanResponderEnd = (e, gestureState) => {
		let { offsetX, offsetY, scale } = this.state

		this.setState({
			lastScale: scale,
			currentOffsetX: offsetX,
			currentOffsetY: offsetY
    })
	}

	_handlePanResponderMove = (e, gestureState) => {
		let { cropWidth, cropHeight, currentOffsetX, currentOffsetY, scale, minScale, maxScale, lastScale } = this.state

		if (gestureState.numberActiveTouches === 2) {
			let dx = Math.abs(
				e.nativeEvent.touches[0].pageX - e.nativeEvent.touches[1].pageX
			);
			let dy = Math.abs(
				e.nativeEvent.touches[0].pageY - e.nativeEvent.touches[1].pageY
			);
			let distant = Math.sqrt(dx * dx + dy * dy);
			let scale = (distant / this.distant) * lastScale;

			this.paddingWidth = (scale - 1) * this.state.cropWidth / 2
			this.paddingHeight = (scale - 1) * this.state.cropHeight / 2
			console.log('AAA: ', this.paddingWidth)
			console.log('BBB: ', this.paddingHeight)

			if (scale < maxScale && scale > minScale) {
				this.setState({ scale });
			}
		} else {
			if (scale > 1) {
				this.pointOffsetX =  e.nativeEvent.touches[0].pageX - this.pointX
				this.pointOffsetY =  e.nativeEvent.touches[0].pageY - this.pointY

				this.paddingWidth -= this.pointOffsetX
				this.paddingHeight -= this.pointOffsetY
				console.log('PADDING: ', this.paddingWidth, ' : ', this.paddingHeight)
				// console.log('POINT_OFFSET: ', this.pointOffsetX, ' : ', this.pointOffsetY)
			
				currentOffsetX += gestureState.dx
				currentOffsetY += gestureState.dy
				this.setState({ offsetX: currentOffsetX })
				this.setState({ offsetY: currentOffsetY })

				// if (this.paddingWidth > 0 && this.paddingWidth < (scale - 1) * cropWidth) {
				// 	currentOffsetX += gestureState.dx			
				// 	this.setState({ offsetX: currentOffsetX })
				// } else {
				// 	this.paddingWidth = 0
				// }

				// if (this.paddingHeight > 0 && this.paddingHeight < (scale - 1) * cropHeight) {	
				// 	currentOffsetY += gestureState.dy
				// 	this.setState({ offsetY: currentOffsetY })
				// } else {
				// 	this.paddingHeight = 0
				// }
			} else {
				if (Math.abs(gestureState.dx) < currentOffsetX && Math.abs(gestureState.dy) < currentOffsetY) {
					currentOffsetX += gestureState.dx			
					currentOffsetY += gestureState.dy
					this.setState({ offsetX: currentOffsetX, offsetY: currentOffsetY })
				}
			}
		}
	}

	_handlePanResponderGrant = (e, gestureState) => {
		this.setState({ isMoving: true })

    if (gestureState.numberActiveTouches === 2) {
      let dx = Math.abs(
        e.nativeEvent.touches[0].pageX - e.nativeEvent.touches[1].pageX
      );
      let dy = Math.abs(
        e.nativeEvent.touches[0].pageY - e.nativeEvent.touches[1].pageY
      );
			let distant = Math.sqrt(dx * dx + dy * dy);
			this.distant = distant;
    } else {
			this.pointX = e.nativeEvent.touches[0].pageX
			this.pointY = e.nativeEvent.touches[0].pageY
		}
  };

	crop() {
		const { containerWidth, containerHeight, containerRatio, offsetX, offsetY, cropWidth, cropHeight } = this.state
		const cropData = {
			offset: {
				y: containerRatio * (containerHeight / 2 - cropWidth / 2 + offsetY),
				x: containerRatio * (containerWidth / 2 - cropWidth / 2 + offsetX),
			},
			size: {
				width: cropWidth * containerRatio,
				height: cropHeight * containerRatio
			}
		};

		return new Promise((resolve, reject) => {
			ImageEditor.cropImage(
				this.props.source.uri,
				cropData,
				(croppedUrl) => {
					this.resize(
						croppedUrl,
						cropData.size.width,
						cropData.size.height
					).then((resizedUrl) => {
						return resolve(resizedUrl)
					});
				},
				(failure) => reject(failure)
			);
		});
	}

	resize(uri, width, height) {
		let { cropQuality } = this.state;
		if (!Number.isInteger(cropQuality) || cropQuality < 0 || cropQuality > 100) {
			cropQuality = ImageCrop.defaultProps.cropQuality;
		}
		return ImageResizer.createResizedImage(uri, width, height, 'JPEG', cropQuality, 0, null);
	}

	renderContainerImage() {
		const { containerWidth, containerHeight, offsetX, offsetY, scale } = this.state

		return (
			<View
				style={[styles.imageWrapper, {
					width: containerWidth,
					height: containerHeight,
					top: 0,
					left: 0,
					borderRadius: 0,
					backgroundColor: '#000',
					transform: [
						{ scaleX: scale },
						{ scaleY: scale },
						{ translateX: offsetX },
						{ translateY: offsetY }
					]
				}]}
			>
				<Image
					resizeMode="cover"
					source={this.props.source}
					style={[styles.image, {
						width: '100%',
						height: '100%',
						top: 0,
						left: 0,
						opacity: 0.2
					}]}
				/>
			</View>
		)
	}

	renderImage() {
		const { containerWidth, containerHeight, offsetX, offsetY, cropWidth, cropHeight, scale } = this.state

		return (
			<View
				style={{
					width: cropWidth,
					height: cropHeight,
					top: 0,
					left: 0,
					borderRadius: cropWidth / 2,
					overflow: 'hidden'
				}}
			>
				<Image
					resizeMode="cover"
					source={this.props.source}
					style={[styles.image, {
						width: containerWidth,
						height: containerHeight,
						top: 0,
						left: 0,
						opacity: 1,
						transform: [
              { scaleX: scale },
							{ scaleY: scale },
							{ translateX: offsetX },
							{ translateY: offsetY }
						]
					}]}
				/>
			</View>
		)
	}

	render() {
		const { containerWidth, containerHeight, originalImageHeight, originalImageWidth } = this.state
		return (
			<View
				{...this.panResponder.panHandlers}
				style={[styles.container, {
					width: containerWidth,
					height: containerHeight
				}]}
			>
				{ this.renderContainerImage() }
				<View
					style={[styles.cropContainer, {
						top: -containerHeight,
						left: 0,
						width: containerWidth,
						height: containerHeight,
					}]}
				>
					{ this.renderImage() }
				</View>
			</View>
		);
	}
}

export default ImageCrop;