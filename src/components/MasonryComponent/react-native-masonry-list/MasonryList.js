import React from "react";
import { FlatList } from "react-native";
import PropTypes from "prop-types";

import { resolveImage } from "./model";
import {
	insertIntoColumn
} from "./utils";
import Column from "./Column";

export default class MasonryList extends React.Component {
	static propTypes = {
		images: PropTypes.array.isRequired,
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
			this.resolveImages(
				this.props.images,
				this.props.layoutDimensions,
				this.props.columns
			);
		}
	}

	componentWillReceiveProps = (nextProps) => {
		if (nextProps.images !== this.props.images) {
			this.resolveImages(
				nextProps.images,
				nextProps.layoutDimensions,
				nextProps.columns
			);
		}
	}

	_getCalculatedDimensions(imgDimensions = { width: 0, height: 0 }, columnWidth = 0) {
		const countDecimals = function (value) {
			if (Math.floor(value) === value) {
				return 0;
			}
			return value.toString().split(".")[1].length || 0;
		};

		const divider = imgDimensions.width / columnWidth;

		const tempWidth = (imgDimensions.width / divider);
		const tempHeight = (imgDimensions.height / divider);

		const newWidth = countDecimals(tempWidth) > 10
			? parseFloat(tempWidth.toFixed(10))
			: tempWidth;
		const newHeight = countDecimals(tempHeight) > 10
			? parseFloat(tempHeight.toFixed(10))
			: tempHeight;

		return { width: newWidth, height: newHeight };
	}

	resolveImages(images, layoutDimensions, columns) {
		let unsortedIndex = 0;
		let renderIndex = 0;

		let columnHeightTotals = [];
		let columnCounting = 1;
		let columnHighestHeight = null;

		function _assignColumns(image, nColumns) {
			const columnIndex = columnCounting - 1;
			const { height } = image.masonryDimensions;

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

		if (images) {
			images.map((image) => {
				return resolveImage(image);
			}).map((resolveTask, index) => {
				if (resolveTask && resolveTask.fork) {
					resolveTask.fork(
						// eslint-disable-next-line handle-callback-err, no-console
						(err) => console.warn("react-native-masonry-list", "Image failed to load."),
						(resolvedImage) => {
							resolvedImage.index = unsortedIndex;
							unsortedIndex++;

							resolvedImage.masonryDimensions =
								this._getCalculatedDimensions(
									resolvedImage.dimensions,
									layoutDimensions.columnWidth
								);

							resolvedImage.column = _assignColumns(resolvedImage, columns);

							if (renderIndex !== 0) {
								this.setState((state) => {
									const sortedData = insertIntoColumn(resolvedImage, state._sortedData);
									this._calculatedData = this._calculatedData.concat(resolvedImage);
									renderIndex++;
									return {
										_sortedData: sortedData
									};
								});
							} else {
								const sortedData = insertIntoColumn(resolvedImage, []);
								this._calculatedData = [resolvedImage];
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

	_onCallEndReach = () => {
		this.props.masonryFlatListColProps &&
		this.props.masonryFlatListColProps.onEndReached &&
		this.props.masonryFlatListColProps.onEndReached();
	}

	render() {
		return (
			<FlatList
				style={{
					flex: 1
				}}
				contentContainerStyle={{
					justifyContent: "space-between",
					flexDirection: "row",
					width: "100%"
				}}
				removeClippedSubviews={true}
				onEndReachedThreshold={this.props.onEndReachedThreshold}
				// {...this.props.masonryFlatListColProps}
				// onEndReached={this._onCallEndReach}
				initialNumToRender={this.props.columns}
				keyExtractor={(item, index) => {
					return "COLUMN-" + index.toString() + "/"; // + (this.props.columns - 1);
				}}
				data={this.state._sortedData}
				renderItem={({item, index}) => {
					return (
						<Column
							data={item}
							initialNumInColsToRender={this.props.initialNumInColsToRender}
							layoutDimensions={this.props.layoutDimensions}
							key={`MASONRY-COLUMN-${index}`}
							completeCustomComponent={this.props.completeCustomComponent}
						/>
					);
				}}
			/>
		);
	}
}
