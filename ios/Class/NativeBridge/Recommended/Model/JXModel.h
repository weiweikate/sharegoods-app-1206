//
//  JXModel.h
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/4/24.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@class JXModelData,GoodsDataModel,SourcesModel,UserInfoModel,promotionResultModel,ActityModel;

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

@property (nonatomic,copy) NSString * title;
@property (nonatomic,copy) NSString * content;
@property (nonatomic,copy) NSString * cursor;//查询关键词  
@property (nonatomic,assign) NSInteger downloadCount; //下载数
@property (nonatomic,assign) NSInteger collectCount; //收藏数
@property (nonatomic,assign) NSInteger likesCount; //点赞数
@property (nonatomic,assign) NSInteger clickCount; //浏览量
@property (nonatomic,assign) NSInteger hotCount; //人气值
@property (nonatomic,assign) NSInteger createSource; //文章创建来源{1:运营文章/素材，2:用户文章，3:商家素材
@property (nonatomic,assign) NSInteger shareCount;
@property (nonatomic,copy) NSString * showNo; //文章id
@property (nonatomic,strong)NSArray<GoodsDataModel*> * products;
@property (nonatomic,strong)NSArray<SourcesModel*> * resource;
@property (nonatomic,strong)UserInfoModel * userInfoVO;
@property (nonatomic,assign) NSInteger showType;
@property (nonatomic,assign) NSInteger attentionStatus;//0 未关注 1 关注 2 相互关注
@property (nonatomic,copy) NSString * publishTimeStr;
@property (nonatomic,copy) NSString * nowTime;
@property (nonatomic,copy) NSString * remark;

@property (nonatomic,assign) BOOL like;//是否点赞

@property (nonatomic,assign) BOOL collect; //是否收藏
@property (nonatomic,assign) BOOL isOpening;
@property (nonatomic,assign) BOOL owner;
@end

@interface SourcesModel : NSObject
@property (nonatomic,copy) NSString * url;//资源链接 兼容旧版本
@property (nonatomic,copy) NSString * baseUrl;//资源链接不带？
@property (nonatomic,assign) NSInteger type; //类型:{1:封面图片，2:普通图片，3：活动封面图片，4：视频 5 视频图片}
@property (nonatomic,assign) CGFloat height;
@property (nonatomic,assign) CGFloat width;
@property (nonatomic,assign) CGFloat videoSize;
@property (nonatomic,assign) CGFloat videoTime;
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
@property (nonatomic, strong)promotionResultModel * promotionResult;
@end

@interface UserInfoModel : NSObject
@property (nonatomic,copy) NSString * userImg;
@property (nonatomic,copy) NSString * userName;
@property (nonatomic,copy) NSString * userNo;

@end

@interface promotionResultModel : NSObject
@property (nonatomic, strong)ActityModel *groupActivity;
@property (nonatomic, strong)ActityModel *singleActivity;
@end

@interface ActityModel : NSObject
@property (nonatomic,copy) NSString * endTime;
@property (nonatomic,copy) NSString * startTime;
@property (nonatomic,assign) NSInteger type;

@end
