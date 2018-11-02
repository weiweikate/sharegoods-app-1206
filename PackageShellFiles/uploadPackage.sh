#!/bin/sh
#set -e

#安装包文件路径
packagePath=$1

#蒲公英配置的参数
# readonly APIKey=94329e916eb4262a6ecbe3632f2d2276
# readonly UserKey=f5b7d971ed1b5a4c24f1ec7a7dd7fb4f

# huyufeng
readonly APIKey=f8fd88e52443f483f4bb5d7dfb857e02
readonly UserKey=0ceec8de7f57ef87ef2a7ad14bb728ab
#蒲公英账号密码
#地址：https://www.pgyer.com/
#账号：13735533492
#密码：123qwe

# 校验包文件是否存在
checkPackagePath(){
    if [ ! -f "${packagePath}" ]; then
        echo '/*------------------------------\033[41;37m注意\033[0m---------------------------*/'
        echo 'package not exist, please checkout file at Path:' ${packagePath}
        exit 1;
    fi
}


# 上传安装包到蒲公英
uploadWithPgyer(){
    echo "开始上传到pgyer----------------->"
    curlresponse=$(curl -i -F "file=@$packagePath" \
                -F "uKey=$UserKey" \
                -F "_api_key=$APIKey" \
                http://qiniu-storage.pgyer.com/apiv1/app/upload)
    echo '---------安装包上传蒲公英结果------'
    echo $curlresponse
}

checkPackagePath

uploadWithPgyer


