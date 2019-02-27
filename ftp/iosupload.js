/**
 * @author huyufeng
 * @date 2019/1/29
 */

var Client = require('ftp');
var fs = require("fs");

var c = new Client();
var config = {
    host:'172.16.10.253',
    port:21,
    user:'yufeng.h',
    password:'Hyf*123456'
}
var remoatPath = '/package/test/ios';
var currDate = new Date();
var dirName = `/${currDate.getFullYear()}.${currDate.getMonth()+1}.${currDate.getDate()}-${currDate.getHours()}.${currDate.getMinutes()}.${currDate.getMinutes()}`;
var dir = remoatPath+dirName;
var localfile = '/Users/huyufeng/Documents/appStore/adhoc/1.1.0.1/222.ipa';

function cdRemoteDir() {
    c.cwd(dir,function(error,currDir) {
        if(error){
            console.error(error);
            return;
        }
        upload();
    })
}

function upload() {
    let remoteFile = 'release.ipa';
    c.put(localfile,remoteFile,function(error) {
        if(error){
            console.error(error);
            throw error;
            c.end();
        }else {
            console.log('上传成功');
            c.end();
        }
    })
}

function makeDir (){
    console.log(dir);
    console.log(localfile);
    c.mkdir(dir,function() {
        fs.exists(localfile,function(exists) {
            if(!exists){
                throw new Error('本地ipa文件不存在');
                c.end();
            }else {
                console.log('上传中');
                cdRemoteDir();
            }
        })
    })
}

c.on('ready',function() {
    makeDir();
});
c.connect(config)


