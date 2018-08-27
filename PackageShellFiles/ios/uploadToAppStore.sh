#!/bin/sh
#set -e

# 上传ipa包 参数是ipa的文件路径
uploadIpaToAppStore(){
    ipaPath=$1
    altoolPath="/Applications/Xcode.app/Contents/Applications/Application Loader.app/Contents/Frameworks/ITunesSoftwareService.framework/Versions/A/Support/altool"
    "$altoolPath" --validate-app -f ${ipaPath} -u dnlhot@163.com -p Jure2018 -t ios --output-format xml
    "$altoolPath" --upload-app -f ${ipaPath} -u  dnlhot@163.com -p Jure2018 -t ios --output-format xml
    echo "ipa包上传app store结束,请自行查看上传结果"
}

