import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import ImageComponent from "./ImageComponent";
import TouchableImageComponent from "./TouchableImageComponent";
import CustomImageUnit from "./CustomImageUnit";

export default class ImageCell extends React.PureComponent {
	static propTypes = {
		data: PropTypes.object.isRequired,
		source: PropTypes.any.isRequired,
		masonryDimensions: PropTypes.object,
		renderMasonryItem: PropTypes.func
	}

	_renderImage = () => {
		const {
			data, source, masonryDimensions
		} = this.props;
		const { width, height, gutter } = masonryDimensions;

		return onPressImage || onLongPressImage
			? <TouchableImageComponent
					data={data}
					width={width}
					height={height}
					gutter={gutter}
					source={source}
				/>
			: <ImageComponent
					width={width}
					height={height}
					gutter={gutter}
					source={source}
				/>;
	}

	_renderCustomImage = () => {
		const {
			data, source, masonryDimensions
		} = this.props;
		const { width, height, gutter } = masonryDimensions;

		return (
			<CustomImageUnit
				data={data}
				width={width}
				height={height}
				gutter={gutter}
				source={source}
			/>
		);
	}

	render() {
		const {
			data,
			renderMasonryItem
		} = this.props;

		const renderItem = renderMasonryItem &&renderMasonryItem(data, data.index);

		return (
			<View>
				{/* {renderHeader} */}
				{/* {data.uri && (
					completeCustomComponent
						? this._renderCustomImage()
						: this._renderImage()
				)} */}
				{renderItem}
			</View>
		);
	}
}
