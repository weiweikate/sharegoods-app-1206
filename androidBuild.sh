#!/bin/bash
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
echo "-----jsbundle完成-----"
cd android
./gradlew assembleRelease
echo "-----apk完成-----"
