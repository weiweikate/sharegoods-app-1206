#!/bin/bash
#执行此脚本前，应该安装jq命令。 安装请使用brew install jq
#jq命令用于解析修改json文件。将配置参数替换到项目中config.json文件


#获取workspace名称
projectName=jure
#编译条件 Release Debug 两种
configuration=Release
#打包方式
method=adHoc
#当前时间
nowtime=`date +"%F日%H:%M:%S"`
#文件导出目录
exportPath=~/Documents/app/android-${method}/${nowtime}
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

#创建文件夹
createDir(){

    if [ ! -d "${exportPath}" ]; then
        mkdir -p ${exportPath}
    fi
    echo 文件夹创建成功，打包中间产物将全部导出到:${exportPath}目录下
}

#打印git commit信息
echoGitCommitId(){
    echo 即将开始打包~
    cd ..
    echo 当前编译包使用的Git分支为：`git describe --contains --all HEAD|tr -s '\n'`
    echo 当前编译包使用的Git commit短id为：`git rev-parse --short HEAD`
    echo 当前编译包使用的Git commit完整id为：`git rev-parse HEAD`
    echo 当前config.json基础配置信息如下
    cat ./config.json
    cd PackageShellFiles
}

#导出apk包到指定的文件路径
buildApk(){

    #currentPath=`pwd`
#    cd ../android #进入ios文件目录


    #version.properties文件所在的目录
    #path='../android'
    #content=$(cat ${path}/version.properties)
    #echo "读取内容:$content"
    #读取文件的VERSION_CODE对应的value，保存versionCode变量
    #versionCode=`grep VERSION_CODE ${path}version.properties|cut -d'=' -f2`
    #将versionCode+1，得到累加后的addVersionCode
    #addVersionCode=`expr $versionCode + 1`
    #echo "versionCode====$versionCode"
    # 将addVersionCode重新累加赋值给文件的VERSION_CODE
    #sed -i "s#^VERSION_CODE=.*#VERSION_CODE=${addVersionCode}#g"  ${path}version.properties
    #content=$(cat ${path}version.properties)
    #addVersionCode=`grep VERSION_CODE ${path}version.properties|cut -d'=' -f2`
    #echo "替换之后====$content"
    #echo "addVersionCode====$addVersionCode"
    #判断versionCode是否累加成功， -gt标识大于返回true
    #if [ $addVersionCode -gt $versionCode ]
    #then
    # 打包apk
    #gradlew 对应目录
    BUILD_TOOL_PATH='../android'
    echo "开始打包..."
    cd ../
    react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
    rm -rf android/app/src/main/res/drawable-xxxhdpi android/app/src/main/res/drawable-xxhdpi android/app/src/main/res/drawable-xhdpi android/app/src/main/res/drawable-mdpi android/app/src/main/res/drawable-hdpi
    #chmod -R 777 dev_crm_app2
    #cd $BUILD_TOOL_PATH && ./gradlew assembleinsectRelease
     #cd $BUILD_TOOL_PATH && ./gradlew assembleRelease
     #cd android && ./gradlew assembleRelease
    #openRootPath='../android/app'
    #打包完成打开包所在的目录，当然，程序里面的这面绝对路径请替换成你对应的路径，不然程序运行不会成功
#    explorer $openRootPath'\build\outputs\apk'

    #移动打包相关文件
    #mv ${path}/app/build/outputs/apk/debug/app-debug.apk ${exportPath}/${projectName}.app.apk
    #mv ${path}/app/build/outputs/apk/debug/output.json ${exportPath}/${projectName}.output.json
    #还原路径
    #cd ${currentPath}

    # todo 上传至蒲公英
    #sh uploadPackage.sh ${path}/app/build/outputs/apk/release/app-release.apk
    #else
    #echo "error : versionCode未加1"
    #fi
}

#1.先打印编译时的基础信息. 2.再创建文件目录以及安装描述文件 3.打包apk并自动上传包管理平台
#resetConfigJsonFile
#echoGitCommitId
#createDir
buildApk
