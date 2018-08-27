#!/bin/sh

# 2012 - Ben Clayton (benvium). Calvium Ltd
# Found at https://gist.github.com/2568707
#
# This script installs a .mobileprovision file without using Xcode. Unlike Xcode, it'll
# work over SSH.
#
# Requires Mac OS X (I'm using 10.7 and Xcode 4.3.2)
#
# IMPORTANT NOTE: You need to download and install the mpParse executable from http://idevblog.info/mobileprovision-files-structure-and-reading
# and place it in the same folder as this script for this to work.
#
# Usage installMobileProvisionFile.sh path/to/foobar.mobileprovision

if [ ! $# == 1 ]; then
    echo "Usage: $0 (path/to/mobileprovision)"
    exit 1
fi

mp=$1

#获取描述文件里面的UUID
uuid=`/usr/libexec/PlistBuddy -c 'Print :UUID' /dev/stdin <<< $(security cms -D -i ${mp})_`

if [ $? -ne 0 ]; then
    #获取失败的时候，终止任务
    echo '-------------------------------------------Error------------------------------------------------------'
    echo '安装描述文件失败'
    exit 1
fi

echo "Found UUID $uuid"
# 安装描述文件
cp $mp ~/Library/MobileDevice/Provisioning\ Profiles/${uuid}.mobileprovision
if [ -d "/Users/Shared/Jenkins/" ];then
    echo '存在Jenkins，自动安装到Jenkins服务器中'
    cp $mp /Users/Shared/Jenkins/Library/MobileDevice/Provisioning\ Profiles/${uuid}.mobileprovision
fi
echo "install mobileprovision success"
