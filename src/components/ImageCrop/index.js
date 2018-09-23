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
			cropWidth: 200,
			cropHeight: 200,
			cropQuality: 100
		};
	}

	componentWillMount() {
		this.panResponder = this.getPanResponder();

		Image.getSize(this.props.source.uri, (originalImageWidth, originalImageHeight) => {
			this.setState({ originalImageWidth, originalImageHeight });
			this.setState({
				containerWidth: CONSTANTS.SCREEN_WIDTH,
				containerHeight: CONSTANTS.SCREEN_WIDTH / originalImageWidth * originalImageHeight,
				containerRatio: originalImageWidth / CONSTANTS.SCREEN_WIDTH,
				cropWidth: originalImageWidth > originalImageHeight ? originalImageHeight / (originalImageWidth / CONSTANTS.SCREEN_WIDTH) : CONSTANTS.SCREEN_WIDTH,
				cropHeight: originalImageWidth > originalImageHeight ? originalImageHeight / (originalImageWidth / CONSTANTS.SCREEN_WIDTH) : CONSTANTS.SCREEN_WIDTH,
			})
		});
	}

	getPanResponder() {
		return PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: () => true,
			onPanResponderMove: (event, { dx, dy }) => {
				let { containerWidth, containerHeight, offsetX, offsetY, cropWidth, cropHeight } = this.state

				offsetX = dx
				offsetY = dy
				if (Math.abs(offsetX) < containerWidth / 2 - cropWidth / 2) {
					this.setState({ offsetX })
				}
				if (Math.abs(offsetY) < containerHeight / 2 - cropWidth / 2) {
					this.setState({ offsetY })
				}
			},
			onPanResponderEnd: (event, { dx, dy }) => {
			},
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
		return ImageResizer.createResizedImage(uri, 200, 200, 'JPEG', cropQuality, 0, null);
	}

	renderContainerImage() {
		return (
			<View
				style={[styles.imageWrapper, {
					width: this.state.containerWidth,
					height: this.state.containerHeight,
					top: 0,
					left: 0,
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
		return (
			<View
				style={{
					width: cropWidth,
					height: cropHeight,
					top: containerHeight / 2 - cropWidth / 2 + offsetY,
					left: containerWidth / 2 - cropWidth / 2 + offsetX,
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
						top: -(containerHeight / 2 - cropWidth / 2 + offsetY),
						left: -(containerWidth / 2 - cropWidth / 2 + offsetX),
						opacity: 1
					}]}
				/>
			</View>
		)
	}

	render() {
		const { continerWidth, containerHeight, originalImageHeight, originalImageWidth } = this.state
		return (
			<View
				style={[styles.container, {
					width: continerWidth,
					height: containerHeight
				}]}
				{...this.panResponder.panHandlers}
			>
				{ this.renderContainerImage(true) }
				<View
					style={[styles.cropContainer, {
						top: -this.state.containerHeight,
						bottom: 0,
						left: 0,
						right: 0,
						width: this.state.containerWidth,
						height: this.state.containerHeight,
					}]}
				>
					{ this.renderImage() }
				</View>
			</View>
		);
	}
}

export default ImageCrop;