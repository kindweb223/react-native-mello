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

# Production Build
Comment in the prod urls in src/service/api.js

Bump versions
 - npm --no-git-tag-version version patch
 - iOS info.plist
 - Android build.gradle

run 
 - npm run generate-ios-bundle
 - npm run generate-android-bundle

bugsnag-sourcemaps upload \
    --api-key ff91b9f4357b0367f0fac2f9f70855c5 \
    --app-version 1.0.60 \
    --minified-file android-release.bundle \
    --source-map android-release.bundle.map \
    --minified-url index.android.bundle \
    --upload-sources

bugsnag-sourcemaps upload \
    --api-key ff91b9f4357b0367f0fac2f9f70855c5 \
    --app-version 1.0.60 \
    --minified-file ios-release.bundle \
    --source-map ios-release.bundle.map \
    --minified-url main.jsbundle \
    --upload-sources