import React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native'
import { connect } from 'react-redux'

import styles from './styles'
import FastImage from "react-native-fast-image";
import { 
  getOpenGraph,
} from '../../redux/card/actions'
import * as types from '../../redux/card/types'

import ShareExtension from '../shareExtension'
import LoadingScreen from '../../containers/LoadingScreen';


class ChooseLinkImageFromExtension extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      images: [],
    };
  }

  async componentDidMount() {
    try {
      const { type, value } = await ShareExtension.data()
      this.props.getOpenGraph(value.toLowerCase())
    } catch(e) {
      console.log('error : ', e)
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // console.log('NewCardScreen UNSAFE_componentWillReceiveProps : ', nextProps.card);
    let loading = false;
    if (this.props.card.loading !== types.GET_OPEN_GRAPH_PENDING && nextProps.card.loading === types.GET_OPEN_GRAPH_PENDING) {
      // getting open graph
      loading = true;
    } else if (this.props.card.loading !== types.GET_OPEN_GRAPH_FULFILLED && nextProps.card.loading === types.GET_OPEN_GRAPH_FULFILLED) {
      // success in getting open graph
      const images = nextProps.card.currentOpneGraph.images;
      console.log('nextProps.card.currentOpneGraph : ', images)
      if (images && images.length > 0) {
        this.setState({
          images,
        });
      }
    }

    this.setState({
      loading,
    });

    // showing error alert
    if (this.props.card.loading !== nextProps.card.loading) {
      if (nextProps.card.error) {
        let error = null;
        if (nextProps.card.error && nextProps.card.error.error) {
          error = nextProps.card.error && nextProps.card.error.error;
        } else {
          error = nextProps.card.error && nextProps.card.error.message;
        }
        if (error) {
          if (nextProps.card.loading === types.GET_OPEN_GRAPH_REJECTED) {
            if (this.parseErrorUrls(error)) {
              error = 'Sorry, this link cannot be read';
            } else {
              return;
            }
          }
          if (!this.isVisibleErrorDialog) {
            this.isVisibleErrorDialog = true;
            Alert.alert('Error', error, [
              {text: 'Close', onPress: () => this.isVisibleErrorDialog = false},
            ]);
          }
        }
        return;
      }
    }
  }

  onSelectItem(image) {
  }

  onCancel() {
    ShareExtension.close();
  }

  onSkip() {
  }

  renderImage(item) {
    return (
      <TouchableOpacity 
        style={styles.imageContainer}
        activeOpacity={0.6}
        onPress={() => this.onSelectItem(item.item)}
      >
        <FastImage style={styles.imageItem} source={{uri: item.item}} resizeMode={FastImage.resizeMode.cover}/>
      </TouchableOpacity>
    );
  }

  get renderHeader() {
    return (
      <View style={styles.topContainer}>
        <Text style={styles.textTitle}>Choose an image</Text>
        <TouchableOpacity 
          style={styles.cancelButtonWrapper}
          activeOpacity={0.6}
          onPress={this.onCancel.bind(this)}
        >
          <Text style={styles.textCancel}>Cancel</Text>
        </TouchableOpacity>
      </View>
    )
  }

  get renderFooter() {
    return (
      <TouchableOpacity 
        style={styles.bottomContainer}
        activeOpacity={0.8}
        onPress={this.onSkip.bind(this)}
      >
        <Text style={[styles.textCancel, {fontWeight: 'bold'}]}>Skip</Text>
      </TouchableOpacity>
    )
  }

  render() {
    const {
      images,
    } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          {this.renderHeader}
          <View style={styles.line} />
          <FlatList
            contentContainerStyle={styles.listContainer}
            data={images}
            renderItem={this.renderImage.bind(this)}
            keyExtractor={(item, index) => index}
            extraData={this.state}
            numColumns={3}
          />
        </View>
        {this.renderFooter}
        {this.state.loading && <LoadingScreen />}
      </View>
    );
  }
}


ChooseLinkImageFromExtension.defaultProps = {
}


ChooseLinkImageFromExtension.propTypes = {
}


const mapStateToProps = ({ card }) => ({
  card,
})


const mapDispatchToProps = dispatch => ({
  getOpenGraph: (url) => dispatch(getOpenGraph(url)),
})


export default connect(mapStateToProps, mapDispatchToProps)(ChooseLinkImageFromExtension)