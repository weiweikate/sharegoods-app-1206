//
//  JRCacheManager.m
//  jure
//
//  Created by Max on 2018/8/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "JRCacheManager.h"



@implementation JRCacheManager
SINGLETON_FOR_CLASS(JRCacheManager)

-(void)clearMemory{
  
  [self deleteAllFileOfPath:KTmpPath];
  [self deleteAllFileOfPath:[KLibraryPath stringByAppendingString:@"/Library"]];
}
- (long long)getAllCache{
  
  double_t tmpSize = [self getCacheWithPath:KTmpPath];
  double_t cachesSize = [self getCacheWithPath:[KLibraryPath stringByAppendingString:@"/Library"]];
  
  double_t allSize = tmpSize + cachesSize;
  
  return allSize;
}
-(NSString *)getRootDirectory{
  return NSHomeDirectory();
}

-(NSString *)appendRootPathWithPath:(NSString *)path{
 return  [[self getRootDirectory]stringByAppendingPathComponent:path];
}

-(unsigned long long)getCacheWithPath:(NSString *)path{
  // 总大小
  unsigned long long size = 0;
  // 文件管理者
  NSFileManager *mgr = [NSFileManager defaultManager];
  // 是否为文件夹
  BOOL isDirectory = NO;
  // 路径是否存在
  BOOL exists = [mgr fileExistsAtPath:path isDirectory:&isDirectory];
  if (!exists) return size;
  if (isDirectory) { // 文件夹
    // 获得文件夹的大小  == 获得文件夹中所有文件的总大小
    NSDirectoryEnumerator *enumerator = [mgr enumeratorAtPath:path];
    for (NSString *subpath in enumerator) {
      // 全路径
      NSString *fullSubpath = [path stringByAppendingPathComponent:subpath];
      // 累加文件大小
      size += [mgr attributesOfItemAtPath:fullSubpath error:nil].fileSize;
    }
  } else { // 文件
    size = [mgr attributesOfItemAtPath:path error:nil].fileSize;
  }
  size = size/1024;//kb
  return size;
}
-(void)getAllCachesWithFinshBlock:(getMomerySizeBlock)finshBlock{
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    //回到主线程
    double_t tmpSize = [self getCacheWithPath:KTmpPath];
    double_t cachesSize = [self getCacheWithPath:[KLibraryPath stringByAppendingString:@"/Library"]];
    double_t allSize = tmpSize + cachesSize;
    dispatch_async(dispatch_get_main_queue(), ^{
      finshBlock(allSize);
    });
  });
}

-(void)deleteAllFileOfPath:(NSString *)path{
  NSDirectoryEnumerator *enumerator = [[NSFileManager defaultManager] enumeratorAtPath:path];
  for (NSString *fileName in enumerator) {
    [[NSFileManager defaultManager] removeItemAtPath:[path stringByAppendingPathComponent:fileName] error:nil];
  }
}
-(void)deleteAllFileWithFinshBlock:(finshDelBlock)block{
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    [self deleteAllFileOfPath:KTmpPath];
    [self deleteAllFileOfPath:[KLibraryPath stringByAppendingString:@"/Library"]];
    //回主
    dispatch_async(dispatch_get_main_queue(), ^{
      block();
    });
  });
}

@end
