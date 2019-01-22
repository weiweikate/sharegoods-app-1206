import jsrsasign from 'jsrsasign';
import rsa_config from './rsa_config';
// 创建RSAKey对象
// import {
//     NativeModules
// } from 'react-native';

let may_key = '-----BEGIN PRIVATE KEY-----' + rsa_config.rsa_key + '-----END PRIVATE KEY-----';

function randomString(len) {
    len = len || 32;
    let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    let maxPos = $chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

const RSA = {
     async sign(params = {}) {
        // 'Security-Policy': 'SIGNATURE'
        let result = [];
        let nonce = randomString(16);
        let timestamp = +new Date();
        let client = rsa_config.client;
        let version = rsa_config.version;
        let map = {
            nonce,//16位随机字符串
            timestamp,//当前时间戳
            client,//客户端
            version,//版本
            ...params//参数
        };
        for (let key in map) {
            result.push(key + '=' + map[key]);
        }
        result.sort();

        try {
            // new Promise((resolve) => {
            // })
            let sig = new jsrsasign.crypto.Signature({ 'alg': 'SHA256withRSA' });
            // initialize for signature generation
            sig.init(may_key);
            // update data
            sig.updateString(result.join('&'));
            let s = sig.sign();
            //测试
            console.log('-----');
            // console.log(s)
            //原生加签
            // console.log(jsrsasign.hex2b64(s));
            // const signString  =  await NativeModules.commModule.signWith(result.join('&'));
            // console.log('原生加签');
            // console.log(signString);
            // return {
            //     nonce,
            //     timestamp,
            //     client,
            //     version,
            //     sign:signString
            // };

                // NativeModules.commModule.signWith(result.join('&'), (jsonDic) => {
                // console.log('------原生加签');
                // console.log(jsonDic);
                // return {
                //     nonce,
                //     timestamp,
                //     client,
                //     version,
                //     sign: jsrsasign.hex2b64(s)
                // };
            // }

            // );
            //js延签
            return {
                nonce,
                timestamp,
                client,
                version,
                sign: jsrsasign.hex2b64(s)
            };
        } catch (e) {
            console.log('签名失败---参数---' + params);
        }

    }
};

export { RSA };
