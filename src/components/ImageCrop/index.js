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

		this.pointOffsetX = 0
		this.pointOffsetY = 0
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

		let offsetX1 = Math.abs(offsetX) < this.paddingWidth ? offsetX : (offsetX < 0 ? -this.paddingWidth * 2 : this.paddingWidth * 2)
		let offsetY1 = Math.abs(offsetY) < this.paddingHeight ? offsetY : (offsetY < 0 ? -this.paddingHeight * 2 : this.paddingHeight * 2)

		this.setState({
			lastScale: scale,
			currentOffsetX: offsetX1,
			currentOffsetY: offsetY1
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
			console.log('SCALE: ', scale)

			this.paddingWidth = (scale - 1) * cropWidth / 2
			this.paddingHeight = (scale - 1) * cropHeight / 2

			if (scale < maxScale && scale > minScale) {
				this.setState({ scale });
			}
		} else {
			this.setState({ offsetX: currentOffsetX +  gestureState.dx })
			this.setState({ offsetY: currentOffsetY + gestureState.dy })
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
    }
  };

	crop() {
		const { originalImageWidth, originalImageHeight, offsetX, offsetY, containerRatio, currentOffsetX, currentOffsetY, cropWidth, cropHeight, scale } = this.state

		console.log('OFFSET: ', this.paddingWidth, ' : ', currentOffsetX)
		const cropData = {
			offset: {
				y: (this.paddingHeight * scale - currentOffsetY),
				x: (this.paddingWidth * scale - currentOffsetX)
			},
			size: {
				width: cropWidth * containerRatio / scale,
				height: cropHeight * containerRatio / scale
			}
		};
		console.log('CROPDATA: ', cropData)

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

		console.log('==============================================')
		console.log('PAN: ', this.paddingWidth, ' : ', this.paddingHeight)
		console.log('OFFSET: ', offsetX, ' : ', offsetY)

		const translateX = Math.abs(offsetX) < this.paddingWidth ? offsetX : (offsetX < 0 ? -this.paddingWidth : this.paddingWidth)
		const translateY = Math.abs(offsetY) < this.paddingHeight ? offsetY : (offsetY < 0 ? -this.paddingHeight : this.paddingHeight)

		return (
			<View
				style={[styles.imageWrapper, {
					width: containerWidth,
					height: containerWidth,
					top: 0,
					left: 0,
					borderRadius: 0,
					backgroundColor: '#000',
					transform: [
						{ scaleX: scale },
						{ scaleY: scale },
						{ translateX },
						{ translateY }
					]
				}]}
			>
				<Image
					source={this.props.source}
					style={[styles.image, {
						width: '100%',
						height: '100%',
						top: 0,
						left: 0,
						opacity: 0.4
					}]}
				/>
			</View>
		)
	}

	renderImage() {
		const { containerWidth, containerHeight, offsetX, offsetY, cropWidth, cropHeight, scale } = this.state

		const translateX = Math.abs(offsetX) < this.paddingWidth ? offsetX : (offsetX < 0 ? -this.paddingWidth : this.paddingWidth)
		const translateY = Math.abs(offsetY) < this.paddingHeight ? offsetY : (offsetY < 0 ? -this.paddingHeight : this.paddingHeight)

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
							{ translateX },
							{ translateY }
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
					height: containerHeight,
					backgroundColor: 'transparent'
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