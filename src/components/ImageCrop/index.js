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
			isZooming: false,
			isMoving: false
		};
	}

	componentWillMount() {
		this.panResponder = this.getPanResponder();

		Image.getSize(this.props.source.uri, (originalImageWidth, originalImageHeight) => {
			this.setState({ originalImageWidth, originalImageHeight });
			this.setState({
				containerWidth: CONSTANTS.SCREEN_WIDTH,
				containerHeight: CONSTANTS.SCREEN_WIDTH,
				// containerHeight: CONSTANTS.SCREEN_WIDTH / originalImageWidth * originalImageHeight,
				containerRatio: originalImageWidth / CONSTANTS.SCREEN_WIDTH
			})
		});
	}

	calcDistance = (x1, y1, x2, y2) => {
    let dx = Math.abs(x1 - x2)
    let dy = Math.abs(y1 - y2)
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
	}

	middle = (p1, p2) => {
		return p1 > p2 ? p1 - (p1 - p2) / 2 : p2 - (p2 - p1) / 2;
	}

	calcCenter = (x1, y1, x2, y2) => {
		return {
				x: this.middle(x1, x2),
				y: this.middle(y1, y2),
		};
	}

	processPinch(x1, y1, x2, y2) {
		let distance = this.calcDistance(x1, y1, x2, y2);
		let center = this.calcCenter(x1, y1, x2, y2);

		console.log('DISTANCE: ', distance)
		console.log('CENTER: ', center)
		
	}

	processTouch(x, y) {
		console.log('TX: ', x)
		console.log('TY: ', y)
	}

	getPanResponder() {
		return PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: () => true,
			onPandResponderTerminationRequest: () => true,
			onMoveShouldSetPanResponderCapture: () => true,
			onPanResponderMove: (event, { dx, dy }) => {
				let { currentOffsetX, currentOffsetY } = this.state
				currentOffsetX += dx
				currentOffsetY += dy
				this.setState({ offsetX: currentOffsetX, offsetY: currentOffsetY })

				let touches = event.nativeEvent.touches
				if (touches.length === 2) {
					let touch1 = touches[0]
					let touch2 = touches[1]

					this.processPinch(touches[0].pageX, touches[0].pageY, touches[1].pageX, touches[1].pageY)
				} else if (touches.length === 1 && !this.state.isZooming) {
					this.processTouch(touches[0].pageX, touches[0].pageY)
				}
			},
			onPanResponderEnd: (event, { dx, dy }) => {
				let { offsetX, offsetY } = this.state
				this.setState({ currentOffsetX: offsetX, currentOffsetY: offsetY })
			},
			onPandResponderTerminate: () => {},
			onPanResponderRelease: (evt, gestureState) => {
				this.setState({
					isZooming: false,
					isMoving: false
				})
			},
			onShouldBlockNativeResponder: (evt, gestureState) => true
		});
	}

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
		const { containerWidth, containerHeight, offsetX, offsetY } = this.state
		console.log('X1: ', offsetX)
		console.log('Y1: ', offsetY)
		return (
			<View
				style={[styles.imageWrapper, {
					width: containerWidth,
					height: containerHeight,
					top: offsetY * 2,
					left: offsetX * 2,
					borderRadius: 0,
					backgroundColor: '#000'
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
		const { containerWidth, containerHeight, offsetX, offsetY, cropWidth, cropHeight } = this.state
		console.log('X2: ', offsetX)
		console.log('Y2: ', offsetY)
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
						top: offsetY * 2,
						left: offsetX * 2,
						opacity: 1
					}]}
				/>
			</View>
		)
	}

	render() {
		const { containerWidth, containerHeight, originalImageHeight, originalImageWidth } = this.state
		return (
			<View
				style={[styles.container, {
					width: containerWidth,
					height: containerHeight
				}]}
				{...this.panResponder.panHandlers}
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