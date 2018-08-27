#!/bin/sh

#   本脚本仅仅用于打包ios的离线jsbundle包,提供给生成纯粹的热更新安装包使用。
#   react-native bundle 命令是打包离线包的命令，下面介绍一些参数
#   --entry-file <path>          Path to the root JS file, either absolute or relative to JS root
#   --platform [string]          Either "ios" or "android"
#   --transformer [string]       Specify a custom transformer to be used
#   -dev [boolean]               If false, warnings are disabled and the bundle is minified
#   --bundle-output <string>     File name where to store the resulting bundle, ex. /tmp/groups.bundle
#   --bundle-encoding [string]   Encoding the bundle should be written in (https://nodejs.org/api/buffer.html#buffer_buffer).
#   --sourcemap-output [string]  File name where to store the sourcemap file for resulting bundle, ex. /tmp/groups.map
#   --assets-dest [string]       Directory name where to store assets referenced in the bundle
#   --verbose                    Enables logging
#   --reset-cache                Removes cached files
#   --read-global-cache          Try to fetch transformed JS code from the global cache, if configured.
#   --config [string]            Path to the CLI configuration file



#一定要先退出到跟node_modules同级的目录下，否则会找不到打包命令
#即在工程根目录下执行打包命令
#cd ..

#项目工程名字
projectChineseName=tokoonderdil
#jsbunlde包的路径
exportPathDir=~/Documents/${projectChineseName}iosJsbundle包历史管理
if [ ! -d "${exportPathDir}" ]; then
  mkdir ${exportPathDir}
fi

fileName=$(date "+%Y年%m月%d日%H时%M分%S")
exportPath=${exportPathDir}/${fileName}
if [ ! -d "${exportPath}" ]; then
  mkdir ${exportPath}
fi

bundlePath=${exportPath}/jsbundle
if [ ! -d "${bundlePath}" ]; then
  mkdir ${bundlePath}
fi

#打包jsbundle
react-native bundle --platform ios \
--assets-dest ${bundlePath} \
--dev false \
--entry-file index.js \
--bundle-output ${bundlePath}/main.jsbundle

#进行zip
cd ${exportPath}
zipFile=ToboboSJ_iOSJsBundle.zip
zip -r ${zipFile}  jsbundle
mv ${zipFile} ${exportPath}
echo 'jsbunlde包打包结束~'
open ${exportPath}

eg:
react-native bundle --entry-file index.js --platform ios --dev false --bundle-output ${bundlePath}/main.jsbundle --assets-dest ${bundlePath}
react-native bundle --entry-file index.js --platform ios --dev false --bundle-output /Users/zhanglei/WebstormProjects/crm_app/ios/bundle/main.jsbundle --assets-dest /Users/zhanglei/WebstormProjects/crm_app/ios/bundle

npm install -g yarn react-native-cli
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
