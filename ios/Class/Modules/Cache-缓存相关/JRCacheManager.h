//
//  JRCacheManager.h
//  jure
//
//  Created by Max on 2018/8/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//


/*缓存目录**/
#define KDocumentsPath  NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,NSUserDomainMask,YES)[0]
#define KLibraryPath    NSSearchPathForDirectoriesInDomains(NSLibraryDirectory,NSUserDomainMask,YES)[0]
#define KSystemDataPath [NSHomeDirectory() stringByAppendingPathComponent:@"SystemData"][0]
#define KTmpPath         NSTemporaryDirectory()
#define KCachesPath     NSSearchPathForDirectoriesInDomains(NSCachesDirectory,NSUserDomainMask,YES)[0]

typedef void(^getMomerySizeBlock)(unsigned long long memorySise);
typedef void(^finshDelBlock)(void);


#import <Foundation/Foundation.h>

@interface JRCacheManager : NSObject
SINGLETON_FOR_HEADER(JRCacheManager)


-(void)clearMemory;
-(long long)getAllCache;
/**
 获取沙河根目录
 @return
 */
-(NSString *)getRootDirectory;
/**
 从根目录拼接路径
 @param path 要拼接的path
 @return 拼接好的path
 */
-(NSString *)appendRootPathWithPath:(NSString *)path;

/**
 获取某个路径下的缓存
 @param path 路径
 @return 缓存值
 */
-(unsigned long long)getCacheWithPath:(NSString *)path;
//异步
-(void)getAllCachesWithFinshBlock:(getMomerySizeBlock)finshBlock;
/**
 删除某文件夹下的所有文件
 @param path 文件目录
 */
-(void)deleteAllFileOfPath:(NSString *)path;
//异步
-(void)deleteAllFileWithFinshBlock:(finshDelBlock)block;
@end
