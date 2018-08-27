#!/bin/sh

#获取workspace名称
projectName=jure
#编译条件 Release Debug 两种
configuration=Release
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

#创建文件夹以及安装ios描述文件
createDirAndInstallProvision(){
    #安装描述文件
    sh ./ios/installMobileProvisionFile.sh ./iosCertificate/adhoc.mobileprovision
    sh ./ios/installMobileProvisionFile.sh ./iosCertificate/appstore.mobileprovision
    echo 重新安装描述文件成功

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



#导出ipa包到指定的文件路径
buildIpa(){

    currentPath=`pwd`
    cd ../ios #进入ios文件目录


    #clean当前工程
    xcodebuild clean \
    -workspace ${projectName}.xcworkspace \
    -scheme ${projectName} \
    -configuration ${configuration}

    #例如：生成xcarchive
    xcodebuild archive \
    -workspace ${projectName}.xcworkspace \
    -scheme ${projectName} \
    -configuration ${configuration} \
    -archivePath ${exportPath}/${projectName}.xcarchive


    if [ $? -ne 0 ]; then
        #脚本不正常结束
        echo '-------------------------------------------Error------------------------------------------------------'
        echo 'ipa-archive失败'
        exit 1
    fi

    plistFileName='AdHocOptions'
    if [ ${method} = "adHoc" ]; then
      plistFileName='AdHocOptions'
    else
      plistFileName='AppStoreOptions'
    fi


    echo 使用${plistFileName}配置文件进行打包
    echo `pwd`

    xcodebuild -exportArchive \
        -archivePath ${exportPath}/${projectName}.xcarchive \
        -exportOptionsPlist ../PackageShellFiles/ios/${plistFileName}.plist \
        -exportPath "${exportPath}"

    if [ $? -ne 0 ]; then
        #脚本不正常结束
        echo '-------------------------------------------Error------------------------------------------------------'
        echo '生成ipa包失败'${$?}
        exit -1
    fi

    #仅保留符号表
    mv ${exportPath}/${projectName}.xcarchive/dSYMs/${projectName}.app.dSYM ${exportPath}/${projectName}.app.dSYM
    rm -rf ${exportPath}/${projectName}.xcarchive
    rm ${exportPath}/Packaging.log
    rm ${exportPath}/DistributionSummary.plist
    #还原路径
    cd ${currentPath}

    #adhoc上传到fir appstore上传到苹果官网
    if [ ${method} = "adHoc" ]; then
        sh uploadPackage.sh ${exportPath}/${projectName}.ipa
    else
        echo 暂不自动上传到appstore
        #sh ios/uploadToAppStore.sh ${exportPath}/${projectName}.ipa
    fi
}

#1.先打印编译时的基础信息. 2.再创建文件目录以及安装描述文件 3.打包ipa并自动上传包管理平台
resetConfigJsonFile
echoGitCommitId
createDirAndInstallProvision
buildIpa
