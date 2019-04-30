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


react-native unlink react-native-splash-screen

# Production Build
1. Comment in the prod urls in src/service/api.js
2. In `AppDelegate.m` comment in production for intercom
3. In `MainApplication.java` comment in production for intercom

# Intercom setting
Update native code for PROD and DEV config
- Android/app/src/main/java/io/solvers/feedo/MainApplication.java onCreate() line: 95
- ios/Mello/AppDelegate.m didFinishLaunchingWithOptions() line: 40

Bump versions
 - npm --no-git-tag-version version patch
 - iOS info.plist
 - Android build.gradle

run 
 - npm run generate-ios-bundle
 - npm run generate-android-bundle

bugsnag-sourcemaps upload \
    --api-key ff91b9f4357b0367f0fac2f9f70855c5 \
    --app-version 1.0.83 \
    --minified-file android-release.bundle \
    --source-map android-release.bundle.map \
    --minified-url index.android.bundle \
    --upload-sources

bugsnag-sourcemaps upload \
    --api-key ff91b9f4357b0367f0fac2f9f70855c5 \
    --app-version 1.0.83 \
    --minified-file ios-release.bundle \
    --source-map ios-release.bundle.map \
    --minified-url main.jsbundle \
    --upload-sources