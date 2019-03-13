import React from "react";
import { FlatList } from "react-native";
import PropTypes from "prop-types";

import ImageCell from "./ImageCell";

export default class Column extends React.Component {
	static propTypes = {
		data: PropTypes.array,
		initialNumInColsToRender: PropTypes.number,
		layoutDimensions: PropTypes.object.isRequired,
		columnKey: PropTypes.string,

		completeCustomComponent: PropTypes.func,
	};

	_renderItem = ({item, index}) => {
		const { completeCustomComponent } = this.props;

		const image = item;

		return (
			<ImageCell
				key={image.uri}
				data={item}
				masonryDimensions={image.masonryDimensions}
				completeCustomComponent={completeCustomComponent}
			/>
		);
	}

	_keyExtractor = (item, index) => ("IMAGE-CELL-" + index.toString() + "---" + (item.id ? item.id : "0"));

	render() {
		return (
			<FlatList
				style={{ flex: 1 }}
				contentContainerStyle={{
					width: this.props.layoutDimensions.columnWidth,
					overflow: "hidden",
				}}
				key={this.props.columnKey}
				data={this.props.data}
				keyExtractor={this._keyExtractor}
				initialNumToRender={this.props.initialNumInColsToRender}
				removeClippedSubviews={true}
				renderItem={this._renderItem}
			/>
		);
	}
}
