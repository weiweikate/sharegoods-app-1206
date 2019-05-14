//
//  JXModel.h
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/4/24.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@class JXModelData,GoodsDataModel,SourcesModel,UserInfoModel;

@interface JXModel : NSObject
@property (nonatomic, assign)NSInteger currentPage;
@property (nonatomic, assign)NSInteger pageSize;
@property (nonatomic, assign)NSInteger totalNum;
@property (nonatomic, assign)NSInteger isMore;
@property (nonatomic, assign)NSInteger totalPage;
@property (nonatomic, assign)NSInteger startIndex;
@property (nonatomic, strong)NSArray<JXModelData *> * data;

@end

@interface JXModelData : NSObject
@property (nonatomic,copy) NSString * content;
@property (nonatomic,assign) NSInteger downloadCount;
@property (nonatomic,assign) NSInteger likesCount;
@property (nonatomic,assign) NSInteger shareCount;
@property (nonatomic,assign) NSInteger hotCount;
@property (nonatomic,copy) NSString * showNo;
@property (nonatomic,strong)NSArray<GoodsDataModel*> * products;
@property (nonatomic,strong)NSArray<SourcesModel*> * resource;
@property (nonatomic,strong)UserInfoModel * userInfoVO;
@property (nonatomic,assign) NSInteger clickCount;
@property (nonatomic,assign) NSInteger showType;
@property (nonatomic,copy) NSString * publishTimeStr;
@property (nonatomic,assign) BOOL like;

@property (nonatomic,assign) BOOL isOpening;
@end

@interface SourcesModel : NSObject
@property (nonatomic,copy) NSString * url;
@property (nonatomic,assign) NSInteger type;
@end

@interface GoodsDataModel : NSObject
@property (nonatomic,copy) NSString * name;
@property (nonatomic,copy) NSString * imgUrl;
@property (nonatomic,assign) CGFloat originalPrice;
@property (nonatomic,assign) CGFloat maxPrice;
@property (nonatomic,assign) CGFloat minPrice;
@property (nonatomic,assign) CGFloat promotionMaxPrice;
@property (nonatomic,assign) CGFloat promotionMinPrice;
@property (nonatomic,copy) NSString * secondName;
@property (nonatomic,assign) CGFloat v0Price;
@property (nonatomic,copy) NSString * productNo;
@property (nonatomic,assign) CGFloat groupPrice;
@property (nonatomic,copy) NSString * prodCode;

@end

@interface UserInfoModel : NSObject
@property (nonatomic,copy) NSString * userImg;
@property (nonatomic,copy) NSString * userName;
@property (nonatomic,copy) NSString * userNo;

@end
