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

			scale: 1
		};
	}

	componentWillMount() {
		this.panResponder = this.getPanResponder();

		Image.getSize(this.props.source.uri, (originalImageWidth, originalImageHeight) => {
			this.setState({ originalImageWidth, originalImageHeight });
			this.setState({
				containerWidth: CONSTANTS.SCREEN_WIDTH,
				containerHeight: CONSTANTS.SCREEN_WIDTH,
				containerRatio: originalImageWidth / CONSTANTS.SCREEN_WIDTH
			})
		});
	}

	getPanResponder() {
		return PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: () => true,
			onPanResponderGrant: this._handlePanResponderGrant,
			onMoveShouldSetPanResponderCapture: () => true,
			onPanResponderMove: this._handlePanResponderMove,
			onPanResponderEnd: (event, { dx, dy }) => {
				let { offsetX, offsetY } = this.state
				this.setState({ currentOffsetX: offsetX, currentOffsetY: offsetY })
			},
			onPanResponderTerminationRequest: evt => true,
      onShouldBlockNativeResponder: evt => false
		});
	}

	_handlePanResponderMove = (e, gestureState) => {
		let { currentOffsetX, currentOffsetY } = this.state

		console.log('MOVE: ', gestureState.numberActiveTouches)
		if (gestureState.numberActiveTouches === 2) {
			// let dx = Math.abs(
			// 	e.nativeEvent.touches[0].pageX - e.nativeEvent.touches[1].pageX
			// );
			// let dy = Math.abs(
			// 	e.nativeEvent.touches[0].pageY - e.nativeEvent.touches[1].pageY
			// );
			// let distant = Math.sqrt(dx * dx + dy * dy);
			// let scale = (distant / this.distant) * this.state.lastScale;
			// //check scale min to max hello
			// if (scale < this.props.maxScale && scale > this.props.minScale) {
			// 	this.setState({ scale, lastMovePinch: true });
			// }
		} else {
			currentOffsetX += gestureState.dx
			currentOffsetY += gestureState.dy
			this.setState({ offsetX: currentOffsetX, offsetY: currentOffsetY })
		}
	}

	_handlePanResponderGrant = (e, gestureState) => {
    if (gestureState.numberActiveTouches === 2) {
      let dx = Math.abs(
        e.nativeEvent.touches[0].pageX - e.nativeEvent.touches[1].pageX
      );
      let dy = Math.abs(
        e.nativeEvent.touches[0].pageY - e.nativeEvent.touches[1].pageY
      );
			let distant = Math.sqrt(dx * dx + dy * dy);
			this.distant = distant;
			console.log('DISTANT: ', distant)
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