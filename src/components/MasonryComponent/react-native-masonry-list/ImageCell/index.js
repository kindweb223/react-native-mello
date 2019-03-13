import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import CustomImageUnit from "./CustomImageUnit";

export default class ImageCell extends React.Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		masonryDimensions: PropTypes.object,
		completeCustomComponent: PropTypes.func,
	}

	_renderCustomImage = () => {
		const {
			data, completeCustomComponent, masonryDimensions
		} = this.props;
		const { width, height } = masonryDimensions;

		return (
			<CustomImageUnit
				data={data}
				width={width}
				height={height}
				completeCustomComponent={completeCustomComponent}
			/>
		);
	}

	render() {
		return (
			<View>
				{this._renderCustomImage()}
			</View>
		);
	}
}
