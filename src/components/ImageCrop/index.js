import React, { Component } from 'react';
import {
	View,
	Image,
	StyleSheet,
	ImageEditor,
	PanResponder,
	ImageStore
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
			containerWidth: null,
			containerHeight: null,
			offsetX: 0,
			offsetY: 0,
			currentOffsetX: 0, 
			currentOffsetY: 0,
			cropWidth: CONSTANTS.SCREEN_WIDTH,
			cropHeight: CONSTANTS.SCREEN_WIDTH,
			cropQuality: 10,

			scale: 1,
			maxScale: 4,
			minScale: 1,
			lastScale: 1
		};

		this.paddingWidth = 0
		this.paddingHeight = 0
	}

	componentWillMount() {
		this.panResponder = this.getPanResponder();

		Image.getSize(this.props.source.uri, (originalImageWidth, originalImageHeight) => {
			this.setState({ originalImageWidth, originalImageHeight });

			const ratio = originalImageWidth > originalImageHeight ? originalImageWidth / originalImageHeight : originalImageHeight / originalImageWidth
			const cropWidth = originalImageWidth > originalImageHeight ? CONSTANTS.SCREEN_WIDTH * ratio : CONSTANTS.SCREEN_WIDTH
			const cropHeight = originalImageWidth > originalImageHeight ? CONSTANTS.SCREEN_WIDTH : CONSTANTS.SCREEN_WIDTH * ratio

			this.setState({
				containerWidth: CONSTANTS.SCREEN_WIDTH,
				containerHeight: originalImageWidth > originalImageHeight ? CONSTANTS.SCREEN_WIDTH : CONSTANTS.SCREEN_WIDTH * ratio,
				cropWidth,
				cropHeight
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
		let { offsetX, offsetY, scale, cropWidth, cropHeight } = this.state

		let offsetX1 = offsetX
		let offsetY1 = offsetY

		if (scale === 1) {
			if (cropWidth > cropHeight) {
				const offset = cropWidth - cropHeight
				if (offsetX > offset / 2) {
					offsetX1 = offset / 2
				} else {
					if (Math.abs(offsetX) > offset / 2) {
						offsetX1 = -offset / 2
					}
				}
				offsetY1 = 0
			} else {
				const offset = cropHeight - cropWidth
				if (offsetY > offset / 2) {
					offsetY1 = offset / 2
				} else {
					if (Math.abs(offsetY) > offset / 2) {
						offsetY1 = -offset / 2
					}
				}
				offsetX1 = 0
			}
		} else {
			if (cropWidth > cropHeight) {
				const offset = cropWidth - cropHeight
				if (offsetX > this.paddingWidth) {
					offsetX1 = this.paddingWidth
				} else {
					if (Math.abs(offsetX) > offset / scale + this.paddingWidth) {
						offsetX1 = -(offset / scale + this.paddingWidth)
					} else {
						offsetX1 = offsetX
					}
				}

				if (offsetY > this.paddingHeight) {
					offsetY1 = this.paddingHeight
				} else {
					if (Math.abs(offsetY) > this.paddingHeight) {
						offsetY1 = -this.paddingHeight
					} else {
						offsetY1 = offsetY
					}
				}
			} else {
				const offset = cropHeight - cropWidth
				if (offsetY > this.paddingHeight) {
					offsetY1 = this.paddingHeight
				} else {
					if (Math.abs(offsetY) > offset / scale + this.paddingHeight) {
						offsetY1 = -(offset / scale + this.paddingHeight)
					} else {
						offsetY1 = offsetY
					}
				}

				if (offsetX > this.paddingWidth) {
					offsetX1 = this.paddingWidth
				} else {
					if (Math.abs(offsetX) > this.paddingWidth) {
						offsetX1 = -this.paddingWidth
					} else {
						offsetX1 = offsetX
					}
				}
			}
		}

		this.setState({
			lastScale: scale,
			currentOffsetX: offsetX1,
			currentOffsetY: offsetY1
    })
	}

	_handlePanResponderMove = (e, gestureState) => {
		let { cropWidth, cropHeight, currentOffsetX, currentOffsetY, scale, minScale, maxScale, lastScale } = this.state

		if (gestureState.numberActiveTouches === 2) {
			// let dx = Math.abs(
			// 	e.nativeEvent.touches[0].pageX - e.nativeEvent.touches[1].pageX
			// );
			// let dy = Math.abs(
			// 	e.nativeEvent.touches[0].pageY - e.nativeEvent.touches[1].pageY
			// );
			// let distant = Math.sqrt(dx * dx + dy * dy);
			// let scale = (distant / this.distant) * lastScale;

			// if (scale < maxScale && scale > minScale) {
			// 	this.paddingWidth = (scale - 1) * cropWidth / 2 / scale
			// 	this.paddingHeight = (scale - 1) * cropHeight / 2 / scale

			// 	this.setState({ scale });
			// }

		} else {
			this.setState({ offsetX: currentOffsetX +  gestureState.dx })
			this.setState({ offsetY: currentOffsetY + gestureState.dy })
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
		}
	};

	crop() {
		const {
			originalImageWidth, originalImageHeight,
			currentOffsetX, currentOffsetY,
			cropWidth, cropHeight,
			scale
		} = this.state

		let cropData = {}
		let ratio = cropWidth > cropHeight ? originalImageHeight / CONSTANTS.SCREEN_WIDTH : originalImageWidth / CONSTANTS.SCREEN_WIDTH
		let offset = cropWidth > cropHeight ? cropWidth - cropHeight : cropHeight - cropWidth

		if (scale === 1) {
			cropData = {
				offset: {
					y: cropWidth > cropHeight ? 0 : (offset / 2 - currentOffsetY) * ratio,
					x: cropWidth > cropHeight ? (offset / 2 - currentOffsetX) * ratio : 0
				},
				size: {
					width: cropWidth > cropHeight ? originalImageHeight : originalImageWidth,
					height: cropWidth > cropHeight ? originalImageHeight : originalImageWidth
				}
			};
		} else {
			cropData = {
				offset: {
					y: -(currentOffsetY - this.paddingHeight) * ratio,
					x: -(currentOffsetX - this.paddingWidth) * ratio
				},
				size: {
					width: cropWidth > cropHeight ? originalImageHeight / scale : originalImageWidth / scale,
					height: cropWidth > cropHeight ? originalImageHeight / scale : originalImageWidth / scale
				}
			};
		}

		return new Promise((resolve, reject) => {
			ImageEditor.cropImage(
				this.props.source.uri,
				cropData,
				(croppedUrl) => {
					// ImageStore.hasImageForTag(croppedUrl, () => {
						this.resize(
							croppedUrl,
							cropData
						).then((resizedUrl) => {
							// ImageStore.removeImageForTag(croppedUrl)
							return resolve(resizedUrl)
						}).catch((error) => {
							// ImageStore.removeImageForTag(croppedUrl)
							reject(error)
						})
					// })
				},
				(failure) => {
					reject(failure)
				});
			});
	}

	resize(uri, cropData) {
		let { cropQuality } = this.state;
		if (!Number.isInteger(cropQuality) || cropQuality < 0 || cropQuality > 100) {
			cropQuality = ImageCrop.defaultProps.cropQuality;
		}
		return ImageResizer.createResizedImage(uri, cropData.size.width, cropData.size.height, 'JPEG', cropQuality, 0, null);
	}

	renderContainerImage() {
		const { cropWidth, cropHeight, offsetX, offsetY, scale } = this.state

		let translateX = 0
		let translateY = 0

		const offset = cropHeight - cropWidth

		if (scale === 1) {
			if (cropWidth > cropHeight) {
				const offset = cropWidth - cropHeight
				if (offsetX > offset / 2) {
					translateX = 0
				} else {
					if (Math.abs(offsetX) > offset / 2) {
						translateX = -offset
					} else {
						translateX = -(offset / 2 - offsetX)
					}
				}
				translateY = 0
			} else {
				const offset = cropHeight - cropWidth
				if (offsetY > offset / 2) {
					translateY = 0
				} else {
					if (Math.abs(offsetY) > offset / 2) {
						translateY = -offset
					} else {
						translateY = -(offset / 2 - offsetY)
					}
				}
				translateX = 0
			}
		} else {
			if (cropWidth > cropHeight) {
				const offset = cropWidth - cropHeight
				if (offsetX > this.paddingWidth) {
					translateX = this.paddingWidth
				} else {
					if (Math.abs(offsetX) > offset / scale + this.paddingWidth) {
						translateX = -(offset / scale + this.paddingWidth)
					} else {
						translateX = offsetX
					}
				}

				if (offsetY > this.paddingHeight) {
					translateY = this.paddingHeight
				} else {
					if (Math.abs(offsetY) > this.paddingHeight) {
						translateY = -this.paddingHeight
					} else {
						translateY = offsetY
					}
				}
			} else {
				const offset = cropHeight - cropWidth
				if (offsetY > this.paddingHeight) {
					translateY = this.paddingHeight
				} else {
					if (Math.abs(offsetY) > offset / scale + this.paddingHeight) {
						translateY = -(offset / scale + this.paddingHeight)
					} else {
						translateY = offsetY
					}
				}
				
				if (offsetX > this.paddingWidth) {
					translateX = this.paddingWidth
				} else {
					if (Math.abs(offsetX) > this.paddingWidth) {
						translateX = -this.paddingWidth
					} else {
						translateX = offsetX
					}
				}
			}
		}

		return (
			<View
				style={[styles.imageWrapper, {
					width: cropWidth,
					height: cropHeight,
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
		const { offsetX, offsetY, cropWidth, cropHeight, scale } = this.state

		let translateX = offsetX
		let translateY = offsetY

		if (scale === 1) {
			if (cropWidth > cropHeight) {
				const offset = cropWidth - cropHeight
				if (offsetX > offset / 2) {
					translateX = 0
				} else {
					if (Math.abs(offsetX) > offset / 2) {
						translateX = -offset
					} else {
						translateX = -(offset / 2 - offsetX)
					}
				}
				translateY = 0
			} else {
				const offset = cropHeight - cropWidth
				if (offsetY > offset / 2) {
					translateY = 0
				} else {
					if (Math.abs(offsetY) > offset / 2) {
						translateY = -offset
					} else {
						translateY = -(offset / 2 - offsetY)
					}
				}
				translateX = 0
			}
		} else {
			if (cropWidth > cropHeight) {
				const offset = cropWidth - cropHeight
				if (offsetX > this.paddingWidth) {
					translateX = this.paddingWidth
				} else {
					if (Math.abs(offsetX) > offset / scale + this.paddingWidth) {
						translateX = -(offset / scale + this.paddingWidth)
					} else {
						translateX = offsetX
					}
				}

				if (offsetY > this.paddingHeight) {
					translateY = this.paddingHeight
				} else {
					if (Math.abs(offsetY) > this.paddingHeight) {
						translateY = -this.paddingHeight
					} else {
						translateY = offsetY
					}
				}
			} else {
				const offset = cropHeight - cropWidth
				if (offsetY > this.paddingHeight) {
					translateY = this.paddingHeight
				} else {
					if (Math.abs(offsetY) > offset / scale + this.paddingHeight) {
						translateY = -(offset / scale + this.paddingHeight)
					} else {
						translateY = offsetY
					}
				}

				if (offsetX > this.paddingWidth) {
					translateX = this.paddingWidth
				} else {
					if (Math.abs(offsetX) > this.paddingWidth) {
						translateX = -this.paddingWidth
					} else {
						translateX = offsetX
					}
				}
			}
		}

		return (
			<View
				style={{
					width: CONSTANTS.SCREEN_WIDTH,
					height: CONSTANTS.SCREEN_WIDTH,
					top: 0,
					left: 0,
					borderRadius: CONSTANTS.SCREEN_WIDTH / 2,
					overflow: 'hidden'
				}}
			>
				<Image
					source={this.props.source}
					style={[styles.image, {
						width: cropWidth,
						height: cropHeight,
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
		const { containerWidth, containerHeight, originalImageWidth, originalImageHeight } = this.state
		return (
			<View
				{...this.panResponder.panHandlers}
				style={[styles.container, {
					width: containerWidth,
					height: containerHeight,
					backgroundColor: 'transparent',
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