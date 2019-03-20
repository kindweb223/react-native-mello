import React from "react";
import { View, Text, FlatList } from "react-native";
import PropTypes from "prop-types";

export default class Column extends React.Component {
	static propTypes = {
		data: PropTypes.array,
		initialNumInColsToRender: PropTypes.number,
		layoutDimensions: PropTypes.object.isRequired,
		columnKey: PropTypes.string,

		completeCustomComponent: PropTypes.func,
	};

	_renderItem = ({item, index}) => {
		return (
			<View style={{ width: item.width }}>
				{this.props.completeCustomComponent(item)}
			</View>
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
