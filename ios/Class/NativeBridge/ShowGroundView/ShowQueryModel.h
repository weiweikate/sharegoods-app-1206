//
//  ShowQueryModel.h
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/2/19.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
@class ShowQuery_dataModel;
typedef NS_ENUM(NSInteger, ShowType) {
  ShowTypeFeatured = 1, // '精选'
  ShowTypeHot,          // '热门'
  ShowTypeRecommend,    // '推荐'
  ShowTypeNew           // '最新'
};
NS_ASSUME_NONNULL_BEGIN

@interface ShowQueryModel : NSObject
@property (nonatomic, assign)NSInteger currentPage;
@property (nonatomic, assign)NSInteger pageSize;
@property (nonatomic, assign)NSInteger totalNum;
@property (nonatomic, assign)NSInteger isMore;
@property (nonatomic, assign)NSInteger totalPage;
@property (nonatomic, assign)NSInteger startIndex;
@property (nonatomic, strong)NSArray<ShowQuery_dataModel *> * data;
@end

NS_ASSUME_NONNULL_END

@interface ShowQuery_dataModel : NSObject
@property (nonatomic, copy)NSString *ID;
@property (nonatomic, copy)NSString *code;
@property (nonatomic, copy)NSString *title;
@property (nonatomic, copy)NSString *coverImg;
@property (nonatomic, copy)NSString *img;
@property (nonatomic, assign)NSInteger generalize;
@property (nonatomic, copy)NSString *categoryId;
@property (nonatomic, copy)NSString *userCode;
@property (nonatomic, copy)NSString *createAdminId;
@property (nonatomic, copy)NSString *updateId;
@property (nonatomic, copy)NSString *updateTime;
@property (nonatomic, copy)NSString *content;

@property (nonatomic, assign)CGFloat coverImgWide;
@property (nonatomic, assign)CGFloat coverImgHigh;
@property (nonatomic, assign)CGFloat imgWide;
@property (nonatomic, assign)CGFloat imgHigh;

/**
 宽高比
 */
@property (nonatomic, readonly, assign)CGFloat aspectRatio;
/**
 显示图片链接
 */
@property (nonatomic, copy)NSString *showImage;
@end
