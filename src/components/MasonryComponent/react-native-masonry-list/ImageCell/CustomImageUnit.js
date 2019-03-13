import React from "react";
import PropTypes from "prop-types";

export default class CustomImageUnit extends React.Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		width: PropTypes.number.isRequired,
		height: PropTypes.number.isRequired,
		completeCustomComponent: PropTypes.func.isRequired,
	}

	render() {
		const { data, width, height, completeCustomComponent } = this.props;

		const params = {
			style: { width, height },
			data: data
		};
		return completeCustomComponent(params);
	}
}
