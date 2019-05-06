//
//  JXModel.h
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/4/24.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@class GoodsDataModel,SourcesModel,UserInfoModel;

@interface JXModel : NSObject

@property (nonatomic,copy) NSString * content;
@property (nonatomic,assign) NSInteger downloadCount;
@property (nonatomic,assign) NSInteger likesCount;
@property (nonatomic,assign) NSInteger shareCount;
@property (nonatomic,copy) NSString * showNo;

@property (nonatomic,strong)NSArray<GoodsDataModel*> * products;
@property (nonatomic,strong)NSArray<SourcesModel*> * sources;
@property (nonatomic,strong)UserInfoModel * userInfoVO;

@property (nonatomic,assign) BOOL  isOpening;
@end

@interface SourcesModel : NSObject
@property (nonatomic,copy) NSString * url;
@property (nonatomic,assign) NSInteger type;
@end

@interface GoodsDataModel : NSObject
@property (nonatomic,copy) NSString * desc;
@property (nonatomic,copy) NSString * image;
@property (nonatomic,assign) CGFloat originalPrice;
@property (nonatomic,assign) CGFloat price;
@property (nonatomic,copy) NSString * productNo;
@end

@interface UserInfoModel : NSObject
@property (nonatomic,copy) NSString * userImg;
@property (nonatomic,assign) NSInteger userName;
@property (nonatomic,assign) NSInteger userNo;

@end
