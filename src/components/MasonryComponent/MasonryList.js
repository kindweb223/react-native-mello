import React from "react";
import { View, FlatList, ScrollView } from "react-native";
import PropTypes from "prop-types";

import { resolveData } from "./model";
import {
	insertIntoColumn
} from "./utils";
import Column from "./Column";

export default class MasonryList extends React.Component {
	static propTypes = {
		data: PropTypes.array.isRequired,
		layoutDimensions: PropTypes.object.isRequired,
		containerWidth: PropTypes.number,

		columns: PropTypes.number,
		initialNumInColsToRender: PropTypes.number,

		completeCustomComponent: PropTypes.func,

		onEndReachedThreshold: PropTypes.number,
	};

	constructor(props) {
		super(props)

		this.state = {
			_sortedData: []
		}

		this._calculatedData = [];
	}

	componentWillMount() {
		if (this.props.containerWidth) {
			this.setColumnHeight(
				this.props.data,
				this.props.columns
			);
		}
	}

	componentWillReceiveProps = (nextProps) => {
		if (nextProps.data !== this.props.data) {
			this.setColumnHeight(
				nextProps.data,
				nextProps.columns
			);
		}
	}

	_getCalculatedDimensions(imgDimensions = { width: 0, height: 0 }) {
		const countDecimals = function (value) {
			if (Math.floor(value) === value) {
				return 0;
			}
			return value.toString().split(".")[1].length || 0;
		};

		const tempWidth = imgDimensions.width
		const tempHeight = imgDimensions.height

		const newWidth = countDecimals(tempWidth) > 10
			? parseFloat(tempWidth.toFixed(10))
			: tempWidth;
		const newHeight = countDecimals(tempHeight) > 10
			? parseFloat(tempHeight.toFixed(10))
			: tempHeight;

		return { width: newWidth, height: newHeight };
	}

	setColumnHeight(data, columns) {
		let unsortedIndex = 0;
		let renderIndex = 0;

		let columnHeightTotals = [];
		let columnCounting = 1;
		let columnHighestHeight = null;

		function _assignColumns(item, nColumns) {
			const columnIndex = columnCounting - 1;
			const { height } = item.masonryDimensions;

			if (!columnHeightTotals[columnCounting - 1]) {
				columnHeightTotals[columnCounting - 1] = height;
			} else {
				columnHeightTotals[columnCounting - 1] = columnHeightTotals[columnCounting - 1] + height;
			}

			if (!columnHighestHeight) {
				columnHighestHeight = columnHeightTotals[columnCounting - 1];
				columnCounting = columnCounting < nColumns ? columnCounting + 1 : 1;
			} else if (columnHighestHeight <= columnHeightTotals[columnCounting - 1]) {
				columnHighestHeight = columnHeightTotals[columnCounting - 1];
				columnCounting = columnCounting < nColumns ? columnCounting + 1 : 1;
			}

			return columnIndex;
		}

		if (data) {
			data.map((item) => {
				return resolveData(item);
			}).map((resolveTask, index) => {
				if (resolveTask && resolveTask.fork) {
					resolveTask.fork(
						// eslint-disable-next-line handle-callback-err, no-console
						(err) => console.warn("react-native-masonry-list", "Image failed to load."),
						(resolvedData) => {
							resolvedData.index = unsortedIndex;
							unsortedIndex++;

							resolvedData.masonryDimensions = this._getCalculatedDimensions(resolvedData.dimensions);

							resolvedData.column = _assignColumns(resolvedData, columns);

							if (renderIndex !== 0) {
								this.setState((state) => {
									const sortedData = insertIntoColumn(resolvedData, state._sortedData);
									this._calculatedData = this._calculatedData.concat(resolvedData);
									renderIndex++;
									return {
										_sortedData: sortedData
									};
								});
							} else {
								const sortedData = insertIntoColumn(resolvedData, []);
								this._calculatedData = [resolvedData];
								renderIndex++;
								this.setState({
									_sortedData: sortedData
								});
							}
						}
					);
				}
			});
		}
	}

	render() {
		const { _sortedData } = this.state

		return (
			<ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexDirection: 'row', justifyContent: 'space-between' }}>
				{_sortedData.map((item, index) => (
					<Column
						data={item}
						initialNumInColsToRender={this.props.initialNumInColsToRender}
						layoutDimensions={this.props.layoutDimensions}
						key={`MASONRY-COLUMN-${index}`}
						completeCustomComponent={this.props.completeCustomComponent}
					/>
				))}
			</ScrollView>
		)
	}
}
