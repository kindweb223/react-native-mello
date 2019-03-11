import React from "react";
import { TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import ImageComponent from "./ImageComponent";

export default class TouchableImageComponent extends React.PureComponent {
	static propTypes = {
		data: PropTypes.object.isRequired,
		width: PropTypes.number.isRequired,
		height: PropTypes.number.isRequired,
		gutter: PropTypes.number.isRequired,
		source: PropTypes.any.isRequired
	}

	render() {
		const {
			data, width, height, gutter, source
		} = this.props;

		return (
			<TouchableOpacity
				onPress={() => onPressImage && onPressImage(data, data.index)}
				onLongPress={() => onLongPressImage && onLongPressImage(data, data.index)}
			>
				<ImageComponent
					width={width}
					height={height}
					gutter={gutter}
					source={source}
				/>
			</TouchableOpacity>
		);
	}
}
