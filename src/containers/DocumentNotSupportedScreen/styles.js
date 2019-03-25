import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors';

const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      zIndex: 999,
    },
    topText: {
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      margin: 10
    },
    bottomText: {
      fontSize: 14,
      fontWeight: 'normal',
      textAlign: 'center',
      marginBottom: 5
    }
  });
  
  export default styles
  