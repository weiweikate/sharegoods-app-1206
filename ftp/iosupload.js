/**
 * @author huyufeng
 * @date 2019/1/29
 */

var Client = require('ftp');
var fs = require("fs");

var c = new Client();
var config = {
    host: '172.16.10.253',
    port: 21,
    user: 'yufeng.h',
    password: 'Hyf*123456'
}
console.log(__dirname)
var currDate = new Date();
// var dirName = `/feng${currDate.getFullYear()}.${currDate.getMonth() + 1}.${currDate.getDate()}-${currDate.getHours()}.${currDate.getMinutes()}.${currDate.getMinutes()}`;
var localfile = '/Users/mac/Desktop/ipa/crm_app_xiugou.ipa';

function getEnviroment(callBack) {
    fs.readFile('/Users/mac/.jenkins/workspace/sharegood-ios/config.json', function(err, data) {
        if (err) {
            return console.error(err);
        }
        var config = JSON.parse(data);//将字符串转换为json对象
        callBack && callBack(config.envType, config.Version)
    })
}


function getRemoatPath(callBack) {
    getEnviroment((evnTyp, dirName) => {
        console.log(config.envType)
        var endDir = '';
        if (evnTyp === 'qa') {
            endDir = '/package/test/ios/' + dirName;
        } else if (evnTyp === 'pre_release') {
            endDir = '/package/uat/ios/' + dirName;
        } else if (evnTyp === 'garyTest') {
            endDir = '/package/gray/ios/' + dirName;
        } else if (evnTyp === 'online') {
            endDir = '/package/online/ios/' + dirName;
        }
        callBack && callBack(endDir)
    })
}

function cdRemoteDir() {
    getRemoatPath((endDir) => {
        c.cwd(endDir, function(error, currDir) {
            if (error) {
                console.error(error);
                return;
            }
            upload(endDir);
        })
    })
}

function upload(endDir) {

    var dirArr = endDir.split('/');
    var remoteFile = '';
    if (dirArr.length > 0) {
        remoteFile = dirArr[dirArr.length - 1]
    } else {
        remoteFile = 'release.ipa';
    }
    c.put(localfile, remoteFile, function(error) {
        if (error) {
            console.error(error);
            throw error;
            c.end();
        } else {
            console.log('上传成功');
            c.end();
        }
    })
}

function makeDir() {
    console.log(localfile);

    getRemoatPath((endDir) => {
        console.log('远程地址' + endDir);
        console.log('本地地址' + localfile)
        console.log(__dirname)
        c.mkdir(endDir, function() {
            fs.exists(localfile, function(exists) {
                if (!exists) {
                    throw new Error('本地ipa文件不存在');
                    c.end();
                } else {
                    console.log('上传中');
                    cdRemoteDir();
                }
            })
        })
    })

}

c.on('ready', function() {
    makeDir();
});
c.connect(config)


