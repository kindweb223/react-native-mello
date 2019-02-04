# Setup
npm install
react-native link
cd ios
pod install

# If build issues encountered with Google Signin
watchman watch-del-all
rm -rf node_modules
rm -fr $TMPDIR/react-*
rm -rf ios/build
rm -rf ios/Pods
npm cache clean
npm install
react-native link
cd ios
pod install
cd ..
npm start -- --reset-cache