import React from 'react'
import {
  TouchableOpacity,
  View,
  Animated,
  FlatList,
  Image,
  Text,
} from 'react-native'
import PropTypes from 'prop-types'

import { Actions } from 'react-native-router-flux'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import styles from './styles'
import CONSTANTS from '../../service/constants'
import COLORS from '../../service/colors'


export default class WebMetaList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      links: [...this.props.links],
      selectedIndex: -1,
    };
    this.animatedSelect = new Animated.Value(0);
    this.linksCount = this.props.links.length || 0;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.links.length > this.linksCount) {
      //add
      this.setState({
        links: nextProps.links,
      });
      this.linksCount = nextProps.links.length;
    }
  }

  onLongPressLink(index) {
    if (!this.props.editable) {
      return;
    }
    this.setState({
      selectedIndex: index,
    }, () => {
      Animated.sequence([
        Animated.timing(this.animatedSelect, {
          toValue: 0.9,
          duration: 100,
        }),
        Animated.timing(this.animatedSelect, {
          toValue: 1,
          duration: 100,
        }),
      ]).start(() => {
      });
    });
  }

  onRemove(index) {
    this.setState({
      selectedIndex: -1,
    });

    if (this.props.onRemove) {
      this.props.onRemove(index);
    }
  }

  onPressLink(index) {
  }

  renderItem({item, index}) {
    return (
      <Animated.View
        style={[
          styles.itemContainer,
          this.state.selectedIndex === index &&
          {
            transform: [
              { scale: this.animatedSelect },
            ],
          },
        ]}
      >
        <TouchableOpacity 
          style={styles.buttonContainer}
          activeOpacity={0.7}
          onLongPress={() => this.onLongPressLink(index)}
          onPress={() => this.onPressLink(index)}
        >
          <Image style={styles.imageCover} source={{uri: item.image}} resizeMode='cover' />
          <View style={styles.infoContainer}>
            <Text style={styles.textTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.textDescription} numberOfLines={1}>{item.description}</Text>
          </View>
        </TouchableOpacity>
        {
          this.state.selectedIndex === index && 
          <TouchableOpacity 
            style={styles.closeButtonContainer}
            activeOpacity={0.8}
            onPress={() => this.onRemove(index)}
          >
            <MaterialCommunityIcons name="close" size={18} color={'#fff'} />
          </TouchableOpacity>
    }
      </Animated.View>
    )
  }

  render () {
    return (
      <FlatList
        style={styles.container}
        showsHorizontalScrollIndicator={false}
        data={this.state.links}
        renderItem={this.renderItem.bind(this)}
        keyExtractor={(item, index) => index.toString()}
        extraData={this.state}
        bounces={false}
      />
    );
  }
}


WebMetaList.defaultProps = {
  links: [],
  editable: true,
  onRemove: () => {},
}


WebMetaList.propTypes = {
  links: PropTypes.array,
  editable: PropTypes.bool,
  onRemove: PropTypes.func,
}
