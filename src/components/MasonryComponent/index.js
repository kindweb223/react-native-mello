import React from "react";
import { FlatList, ScrollView, View, ViewPropTypes } from "react-native";
import PropTypes from "prop-types";

const Item = ({ item, renderItem, onLayout }) => (
  <View style={{ flex: 1 }} onLayout={onLayout}>
    {renderItem(item)}
  </View>
)

class Column extends React.Component {
	static propTypes = {
		keyExtractor: PropTypes.func
	};

	constructor( props ) {
		super( props );
		this.state = {
			height: 0,
			data: []
		};
	}

	clear() {
    this.setState( { data: [], height: 0 } );
	}

	getHeight() {
		return this.state.height;
	}

	addItems(items) {
		this.setState( { data: [ ...this.state.data, ...items ] } );
  }

	renderItem( { item } ) {
		return (
      <Item
        renderItem={this.props.renderItem}
        item={item}
        onLayout={( event ) => {
          const { height } = event.nativeEvent.layout;
					const newHeight = this.state.height + height;
          this.setState({ height: newHeight }, () => {
						item.onLayout && item.onLayout();
					});
        }}
      />
    )
  }
  
  render() {
		return (
      <View style={{ flex: 1, overflow: "hidden" }}>
        <FlatList
          style={{ flex: 1 }}
          data={this.state.data}
          keyExtractor={this.props.keyExtractor}
          renderItem={this.renderItem.bind( this )}
        />
      </View>
    )
	}
}

export default class Masonry extends React.Component {

	static propTypes = {
		columns: PropTypes.number,
		containerStyle: ViewPropTypes.style,
		style: ViewPropTypes.style,
		renderItem: PropTypes.func,
		keyExtractor: PropTypes.func,
	};

	static defaultProps = {
		columns: 2
	};

	constructor( props ) {
		super( props );

		this.state = {
			columns: []
		};
		this.itemQueue = [];
  }
  
  componentWillMount() {
    let columns = [];
    for ( let i = 0; i < this.props.columns; i++ ) {
			columns.push( null );
    }
    this.setState({ columns })
  }

	clear() {
    this.state.columns.forEach( col => {
      col.clear()
    });
	}

	addItems( items ) {
		if ( items ) {
			if ( this.itemQueue.length > 0 ) {
				this.itemQueue = this.itemQueue.concat( items );
			} else {
				this.itemQueue = this.itemQueue.concat( items );
				this.addItems();
			}
		} else {
			if ( this.itemQueue.length > 0 ) {
				const item = this.itemQueue.shift();
				this.addItem( item, () => this.addItems() );
			}
		}
	}

	sortColumns() {
		return this.state.columns.sort( ( a, b ) => a.getHeight() - b.getHeight() );

	}

	addItem( item, callback ) {
		setTimeout(() => {
			const minCol = this.sortColumns()[ 0 ];
			item.onLayout = callback;
			minCol.addItems( [ item ] );
		}, 100)
	}

	render() {
		return (
      <ScrollView {...this.props}>
        <View style={[ { flexDirection: "row" }, this.props.containerStyle ]}>
          {this.state.columns.map(( col, index ) => 
            <Column
              key={index}
              ref={( ref ) => this.state.columns[ index ] = ref}
              keyExtractor={this.props.keyExtractor}
              renderItem={this.props.renderItem.bind( this )}
            />
          )}
        </View>
		  </ScrollView>
    )
	}
}