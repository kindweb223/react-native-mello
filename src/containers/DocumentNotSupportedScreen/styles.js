import { StyleSheet } from 'react-native'
import COLORS from '../../service/colors';

const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 45,
      top: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.LIGHT_GREY,
      zIndex: 999,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    }
  });
  
  export default styles
  