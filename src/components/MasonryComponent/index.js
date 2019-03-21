import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";

import MasonryList from "./MasonryList";

export default class Masonry extends React.Component {
  _mounted = false;
  // masonryListRef;

  static propTypes = {
    data: PropTypes.array,
    containerWidth: PropTypes.number,

    columns: PropTypes.number,
    initialNumInColsToRender: PropTypes.number,

    completeCustomComponent: PropTypes.func,

    onEndReachedThreshold: PropTypes.number,
  };

  static defaultProps = {
		data: [],
		columns: 2,
		initialNumInColsToRender: 1,
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

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
    return (
      <View style={{ flex: 1, width: this.props.containerWidth }}>
        <MasonryList
          layoutDimensions={this.state.layoutDimensions}
          containerWidth={this.props.containerWidth}

          data={this.props.data}
          columns={this.props.columns}
          initialNumInColsToRender={this.props.initialNumInColsToRender}

          completeCustomComponent={this.props.completeCustomComponent}

          onEndReachedThreshold={this.props.onEndReachedThreshold}
        />
      </View>
    );
  }
}
