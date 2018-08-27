import { StyleSheet, Platform } from 'react-native'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		position: 'relative',
		overflow: 'hidden',
		width: '100%',
		height: '100%'
	},
	imageWrapper: {
		overflow: 'hidden',
	},
	image: {
		position: 'absolute',
	},
	cropContainer: {
		position: 'absolute',
		overflow: 'hidden'
	}
});