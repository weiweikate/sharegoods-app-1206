//
//  RSAEncryptor.h
//  crm_app_xiugou
//
//  Created by Max on 2018/11/20.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RSAEncryptor : NSObject




/**
 *  加密方法
 *
 *  @param str   需要加密的字符串
 *  @param path  '.der'格式的公钥文件路径
 *  @param Base64  是否编码为Base64
 */
+ (NSString *)encryptString:(NSString *)str publicKeyWithContentsOfFile:(NSString *)path isBase64:(BOOL)Base64;
/**
 *  解密方法
 *
 *  @param str       需要解密的字符串
 *  @param path      '.p12'格式的私钥文件路径
 *  @param password  私钥文件密码
 *  @param Base64  是否编码为Base64
 */
+ (NSString *)decryptString:(NSString *)str privateKeyWithContentsOfFile:(NSString *)path password:(NSString *)password isBase64:(BOOL)Base64;
/**
 *  加密方法
 *
 *  @param str    需要加密的字符串
 *  @param pubKey 公钥字符串
 *  @param Base64  是否编码为Base64
 */
+ (NSString *)encryptString:(NSString *)str publicKey:(NSString *)pubKey isBase64:(BOOL)Base64;
/**
 *  解密方法
 *
 *  @param str     需要解密的字符串
 *  @param privKey 私钥字符串
 *  @param Base64  是否编码为Base64
 */
+ (NSString *)decryptString:(NSString *)str privateKey:(NSString *)privKey isBase64:(BOOL)Base64;

@end

NS_ASSUME_NONNULL_END
