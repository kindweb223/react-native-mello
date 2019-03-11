import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";

import MasonryList from "./MasonryList";

export default class Masonry extends React.PureComponent {
  _mounted = false;
  // masonryListRef;

  static propTypes = {
    itemSource: PropTypes.array,
		images: PropTypes.array,
    containerWidth: PropTypes.number,

		columns: PropTypes.number,
		sorted: PropTypes.bool,
		renderMasonryItem: PropTypes.func,
		masonryFlatListColProps: PropTypes.object,

    onImageResolved: PropTypes.func,

		onEndReachedThreshold: PropTypes.number,
  };

  static defaultProps = {
    itemSource: [],
		images: [],
		columns: 2,
		sorted: false,
		onEndReachedThreshold: 25
	};

  constructor(props) {
      super(props);
      this.state = {
        orientation: "portrait",
        layoutDimensions: {
                            width: this.props.containerWidth,
                            gutterSize: 0,
                            columnWidth: this.props.containerWidth / this.props.columns
                          }
      }
  }

  componentWillMount() {
      this._mounted = true;
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.containerWidth || this.props.containerWidth) {
      if (nextProps.containerWidth !== this.props.containerWidth || nextProps.columns !== this.props.columns) {
        this.setState({
          layoutDimensions: {
              width: nextProps.containerWidth,
              gutterSize: (nextProps.containerWidth / 100),
              columnWidth: nextProps.containerWidth / nextProps.columns - 8
          }
        });
      }
    }
  }

  _layoutChange = (ev) => {
    const { columns } = this.props;
    this._setParentDimensions(ev, columns);
  }

  _setColumnDimensions = (parentDimensions, nColumns = 2) => {
    const {
      height,
      width
    } = parentDimensions;

    const gutterSize = width / 100;

    const columnWidth = Math.floor(width / nColumns) - 8;

    this.setState({
      layoutDimensions: {
          width,
          height,
          columnWidth,
          gutterSize
      }
    });
}

  _setParentDimensions = (event, nColumns = 2) => {
    const { width, height } = event.nativeEvent.layout;

    if (this._mounted && width && height) {
      return this._setColumnDimensions({ width, height }, nColumns);
    }
  }

  componentWillUnmount() {
      this._mounted = false;
  }

  render() {
      return (
        <View
          style={{ flex: 1, width: this.props.containerWidth }}
          onLayout={(event) => this._layoutChange(event)}
        >
          <MasonryList
            layoutDimensions={this.state.layoutDimensions}
            containerWidth={this.props.containerWidth}
            itemSource={this.props.itemSource}
            orientation={this.state.orientation}
            images={this.props.images}
            columns={this.props.columns}
            sorted={this.props.sorted}
            renderMasonryItem={this.props.renderMasonryItem}
            masonryFlatListColProps={this.props.masonryFlatListColProps}

            onImageResolved={this.props.onImageResolved}

            onEndReachedThreshold={this.props.onEndReachedThreshold}
          />
        </View>
      );
  }
}
