#import "commModule.h"
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import <AFNetworking.h>
#import <SandBoxPreviewTool/SandBoxPreviewTool.h>
#import "JRDeviceInfo.h"
#import <MBProgressHUD.h>
#import "PickerManager.h"
#import <Photos/Photos.h>
#import <Photos/PHAssetChangeRequest.h>
#import "XGImageCompression.h"
#import "JSPushManager.h"
#import "RSAManager.h"

#define AppVersion [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"]

@interface commModule()

@property (nonatomic,copy) RCTResponseSenderBlock callBack;

@end

@implementation commModule

@synthesize bridge=_bridge;

RCT_EXPORT_MODULE()


RCT_EXPORT_METHOD(captureScreenImage:(NSDictionary *)info and:(RCTResponseSenderBlock)callback){

  dispatch_async(dispatch_get_main_queue(), ^{
    UIView * view = UIApplication.sharedApplication.keyWindow.rootViewController.view;
    UIImage * image = [self captureImageFromView:view andInfo:info];
    [[PHPhotoLibrary sharedPhotoLibrary] performChanges:^{
      [PHAssetChangeRequest creationRequestForAssetFromImage:image];
    } completionHandler:^(BOOL success, NSError * _Nullable error) {
      callback(@[@(success)]);
      NSLog(@"success = %d, error = %@", success, error);
    }];
  
  });
}

-(UIImage *)captureImageFromView:(UIView *)view andInfo:(NSDictionary *)info{
  
  CGFloat width = [info[@"width"] floatValue];
  CGFloat height = [info[@"height"] floatValue];
  CGFloat left = [info[@"left"] floatValue];
  CGFloat top = [info[@"top"] floatValue];
  BOOL allScreen = [info[@"allScreen"] boolValue];
  
  UIGraphicsBeginImageContextWithOptions(view.frame.size,NO, 0);
  
  [view.layer renderInContext:UIGraphicsGetCurrentContext()];

  UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
  
  if(allScreen){
    
    UIGraphicsEndImageContext();
    
    return image;
  }

  CGRect myImageRect = CGRectMake(left * image.scale, top * image.scale, width * image.scale, height * image.scale);

  CGImageRef imageRef = image.CGImage;

  CGImageRef subImageRef = CGImageCreateWithImageInRect(imageRef,myImageRect );

  CGContextRef context = UIGraphicsGetCurrentContext();

  CGContextDrawImage(context, myImageRect, subImageRef);

  UIImage* smallImage = [UIImage imageWithCGImage:subImageRef];

  CGImageRelease(subImageRef);

  UIGraphicsEndImageContext();

  return smallImage;
  
}

- (NSDictionary *)formatterCookie:(NSHTTPCookie *)cookie{
  return  @{
            @"version": [NSNumber numberWithUnsignedInteger:cookie.version],
            @"name": cookie.name?:[NSNull null],
            @"value": cookie.value?:[NSNull null],
            @"expiresDate": cookie.expiresDate?[NSString stringWithFormat:@"%@",cookie.expiresDate]:[NSNull null],
            @"sessionOnly": [NSNumber numberWithBool:cookie.sessionOnly],
            @"domain": cookie.domain?:[NSNull null],
            @"path": cookie.path?:[NSNull null],
            @"secure": [NSNumber numberWithBool:cookie.secure],
            @"HTTPOnly": [NSNumber numberWithBool:cookie.HTTPOnly],
            @"comment": cookie.comment?:[NSNull null],
            };
}


RCT_EXPORT_METHOD(getCookie:(NSString *)url and:(RCTResponseSenderBlock)callback){
  NSHTTPCookieStorage *cookieJar = [NSHTTPCookieStorage sharedHTTPCookieStorage];
  NSMutableArray * mr = [NSMutableArray array];
  NSArray <NSHTTPCookie *> * arr = url && url.length ? [cookieJar cookiesForURL:[NSURL URLWithString:url]] : cookieJar.cookies;
  for (NSHTTPCookie *cookie in arr) {
    [mr addObject:[self formatterCookie:cookie]];
  }
  callback(@[mr]);
}

RCT_EXPORT_METHOD(clearCookie:(NSString *)url){
  if(url && url.length){
    NSArray *cookies = [[NSHTTPCookieStorage sharedHTTPCookieStorage] cookiesForURL:[NSURL URLWithString:url]];
    for (int i = 0; i < [cookies count]; i++) {
      NSHTTPCookie *cookie = (NSHTTPCookie *)[cookies objectAtIndex:i];
      [[NSHTTPCookieStorage sharedHTTPCookieStorage] deleteCookie:cookie];
    }
  }
}


#pragma mark - 打开沙河预览工具
RCT_EXPORT_METHOD(openSandBoxPreview){
  dispatch_async(dispatch_get_main_queue(), ^{
    [SandBoxPreviewTool.sharedTool autoOpenCloseApplicationDiskDirectoryPanel];
    [SandBoxPreviewTool.sharedTool setOpenLog:YES];
  });
}


/*-------目前仅仅处理http缓存，RN自带图片默认使用的是HTTP缓存--------*/

#pragma mark - 获取磁盘不重要缓存的使用情况
RCT_EXPORT_METHOD(getDiskCacheSize:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
  NSURLCache *httpCache = [NSURLCache sharedURLCache];
  resolve(@([httpCache currentDiskUsage]));
}

#pragma mark - 删除磁盘不重要缓存
RCT_EXPORT_METHOD(clearDiskCache:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
{
  NSURLCache *httpCache = [NSURLCache sharedURLCache];
  [httpCache removeAllCachedResponses];
  resolve(nil);
}



#pragma mark -
//TODO 三方登陆
RCT_EXPORT_METHOD(thirdLogin:(NSString *)loginType){
  NSLog(@"%@",loginType);
}



//RN弹窗MBProgressHUD方式
RCT_EXPORT_METHOD(toast:(NSString*)msg){
    if(msg && [msg isKindOfClass:[NSString class]] && msg.length){
      dispatch_async(dispatch_get_main_queue(), ^{
        [JRLoadingAndToastTool showToast:msg andDelyTime:2.5];
      });
    }
}

//RN显示网络加载
RCT_EXPORT_METHOD(showLoadingDialog:(NSString *)msg){
    dispatch_async(dispatch_get_main_queue(), ^{
      if (msg) {
         [JRLoadingAndToastTool showLoadingText:msg];
      }else{
         [JRLoadingAndToastTool showLoadingText:@""];
      }
     
    });
}

//RN取消显示网络加载
RCT_EXPORT_METHOD(hideLoadingDialog){
    dispatch_async(dispatch_get_main_queue(), ^{
      [JRLoadingAndToastTool dissmissLoading];
    });
}

//传递网络参数
//TODO 毫无意义？why not dictionray ? why transform to string ? only compatible android ? bad design
RCT_EXPORT_METHOD(netCommParas:(RCTResponseSenderBlock)callback){

    NSMutableDictionary *netParas = [NSMutableDictionary dictionary];
    [netParas setObject:@"ios"forKey:@"OS"];
    [netParas setObject:[[[UIDevice currentDevice] identifierForVendor] UUIDString] forKey:@"mac"];//设备唯一id
    [netParas setObject:AppVersion forKey:@"version"];
    [netParas setObject:[JRDeviceInfo device] forKey:@"device"];
    [netParas setObject:[JRDeviceInfo systemVersion] forKey:@"systemVersion"];

    NSError * err = nil;

    //将字典转换成JSON字符串
    NSData *netPaData = [NSJSONSerialization dataWithJSONObject:netParas options:NSJSONWritingPrettyPrinted error:&err];

    NSString *netPaStr = [[NSString alloc]initWithData:netPaData encoding:NSUTF8StringEncoding];
    NSMutableString *netPaStrAfter = [netPaStr mutableCopy];

    [netPaStrAfter replaceOccurrencesOfString:@" " withString:@"" options:(NSLiteralSearch) range:NSMakeRange(0, netPaStr.length)];
    [netPaStrAfter replaceOccurrencesOfString:@"\n" withString:@"" options:NSLiteralSearch range:NSMakeRange(0, netPaStrAfter.length)];

    callback(@[netPaStrAfter]);
}

//存储记录到本地
RCT_EXPORT_METHOD(putNativeStore:(NSString *)key value:(NSString *)value) {
  if(key && [key isKindOfClass:[NSString class]] && key.length && value && [value isKindOfClass:[NSString class]] && value.length){
    [[NSUserDefaults standardUserDefaults] setObject:value forKey:key];
  }
}

//从本地中获取记录
RCT_EXPORT_METHOD(getNativeStore:(NSString *)key callback:(RCTResponseSenderBlock)callback) {
  NSString * value = nil;
  if (key && [key isKindOfClass:[NSString class]] && key.length) {
    value = [[NSUserDefaults standardUserDefaults] objectForKey:key];
  }
  callback(@[value ? : @""]);
}


//RN选择城市 这个接口返回
//{"cityId":330100,"cityName":"杭州","districId":330109,"districName":"萧山区","provinceId":330000,"provinceName":"浙江"}
RCT_EXPORT_METHOD(cityPicker:(RCTResponseSenderBlock)callback){
  dispatch_async(dispatch_get_main_queue(),^{
    [[PickerManager sharedInstance]showPickAndFinsh:^(NSDictionary *selectData) {
      callback(@[selectData.copy]);
    }];
  });
}


RCT_EXPORT_METHOD(setCityPicker:(NSArray *)pickerData){
  [PickerManager sharedInstance].array = pickerData;
}


RCT_EXPORT_METHOD(netWorkState:(RCTResponseSenderBlock)callback){

    BOOL reachable =[AFNetworkReachabilityManager sharedManager].reachable;
    
    NSNumber *result = [NSNumber numberWithBool:reachable];
    
    callback(@[result]);
    
}

RCT_EXPORT_METHOD(RN_ImageCompression:(NSArray *) paths
                  fileSize:(NSArray *)fileSizes
                  limitSize:(NSInteger)limitSize
                  callback:(RCTResponseSenderBlock)callback
                  ){
  NSLog(@"%@\n%@", paths, fileSizes);
  for (int i = 0 ; i < paths.count; i++) {
     [XGImageCompression RN_ImageCompressionWithPath:paths[i] fileSize:[fileSizes[i] integerValue] limitSize:limitSize];
  }
 
  NSLog(@"执行开始");
  callback(@[]);
  NSLog(@"执行结束");
}
RCT_EXPORT_METHOD(removeLaunch){
  dispatch_async(dispatch_get_main_queue(), ^{
    AppDelegate *delegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
    [delegate removeLaunch];
  });
}
/* 示例
* 更新推送的
 */
RCT_EXPORT_METHOD(updatePushAlias:(id)paramAlias){
  dispatch_async(dispatch_get_main_queue(), ^{
    NSDictionary * paramAliasDic = paramAlias;
    NSLog(@"%@",paramAliasDic);
    if (paramAlias[@"userId"]) {
      [JSPushManager setAlias:paramAlias[@"userId"]];
    }
  });
}
/* 示例
 * {
 * environment: "测试"
 * levelRemark: "V0"
 * status: "已激活"
 * version: "1.0.3"
 * }
 */
RCT_EXPORT_METHOD(updatePushTags:(id)paramTags){
  dispatch_async(dispatch_get_main_queue(), ^{
    NSDictionary * paramTagsDic = paramTags;
    NSLog(@"%@",paramTagsDic);
    NSMutableSet * aliasSet = [NSMutableSet new];
    [aliasSet addObject:paramTagsDic[@"environment"]?paramTagsDic[@"environment"]:@"测试" ];
    [aliasSet addObject:paramTagsDic[@"levelRemark"]?paramTagsDic[@"levelRemark"]:@"V0"];
    [aliasSet addObject:paramTagsDic[@"status"]?paramTagsDic[@"status"]:@"网信会员"];
    [aliasSet addObject:paramTagsDic[@"version"]?paramTagsDic[@"version"]:@"1.0.0"];
    [JSPushManager setTags:aliasSet];
  });
}

RCT_EXPORT_METHOD(signWith:(NSString *)signString callback:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject){
  NSString * signedString = [[RSAManager sharedInstance] signSHA1String:signString];
//  NSLog(@"加签后的字符串-----原生---- %@",signedString);
    resolve(signedString);
}

RCT_EXPORT_METHOD(setDarkMode){
  dispatch_async(dispatch_get_main_queue(), ^{
    [UIApplication sharedApplication].statusBarStyle = UIStatusBarStyleLightContent;
  });
}

RCT_EXPORT_METHOD(setLightMode){
  dispatch_async(dispatch_get_main_queue(), ^{
    [UIApplication sharedApplication].statusBarStyle = UIStatusBarStyleDefault;
  });
}

@end
