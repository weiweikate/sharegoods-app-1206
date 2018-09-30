#!/bin/sh
#执行此脚本前，应该安装jq命令。 安装请使用brew install jq
#jq命令用于解析修改json文件。将配置参数替换到项目中config.json文件


#打包方式
method=adHoc
#当前时间
nowtime=`date +"%F日%H:%M:%S"`
#文件导出目录
exportPath=~/Documents/app/ios-${method}/${nowtime}
#打包api默认使用的环境
envType='qa'
#是否发布应用市场
Publish_Market=$2

if [ $# -eq 2 ]
then
    envType=$1
    if [ $Publish_Market = true ]
    then
        envType='online'
        method='appstore'
    fi
else
    Publish_Market=false
fi


echo '------编译参数-----'
echo envType: $envType  method:$method


#重置项目根目录下config.json配置文件
resetConfigJsonFile(){
    configFilePath="../config.json"
    cat $configFilePath | jq ".envType=\"${envType}\"" > tmpConfig.json && mv tmpConfig.json $configFilePath
    if [ $Publish_Market = true ]; then
        #发布应用市场的时候，一定要关闭调试面板
        cat $configFilePath | jq ".showDebugPanel=false" > tmpConfig.json && mv tmpConfig.json $configFilePath
    else
        cat $configFilePath | jq ".showDebugPanel=true" > tmpConfig.json && mv tmpConfig.json $configFilePath

    fi
}

#1.先打印编译时的基础信息. 2.再创建文件目录以及安装描述文件 3.打包ipa并自动上传包管理平台
resetConfigJsonFile
fastlane to_pgyer
