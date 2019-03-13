import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";

import MasonryList from "./MasonryList";

export default class Masonry extends React.Component {
  _mounted = false;
  // masonryListRef;

  static propTypes = {
    images: PropTypes.array,
    containerWidth: PropTypes.number,

    columns: PropTypes.number,
    initialNumInColsToRender: PropTypes.number,
    sorted: PropTypes.bool,

    completeCustomComponent: PropTypes.func,

    onEndReachedThreshold: PropTypes.number,
  };

  static defaultProps = {
		images: [],
		columns: 2,
		initialNumInColsToRender: 1,
		sorted: false,
		onEndReachedThreshold: 25
	};

  constructor(props) {
    super(props);
    this.state = {
      layoutDimensions: {
        width: this.props.containerWidth,
        columnWidth: this.props.containerWidth / this.props.columns
      }
    }
  }

  componentWillMount() {
    this._mounted = true;
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      layoutDimensions: {
        width: nextProps.containerWidth,
        columnWidth: nextProps.containerWidth / nextProps.columns
      }
    });
	}

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
    return (
      <View style={{ flex: 1, width: this.props.containerWidth }}>
        <MasonryList
          layoutDimensions={this.state.layoutDimensions}
          containerWidth={this.props.containerWidth}

          images={this.props.images}
          columns={this.props.columns}
          initialNumInColsToRender={this.props.initialNumInColsToRender}
          sorted={this.props.sorted}
          masonryFlatListColProps={this.props.masonryFlatListColProps}

          completeCustomComponent={this.props.completeCustomComponent}

          onEndReachedThreshold={this.props.onEndReachedThreshold}
        />
      </View>
    );
  }
}
