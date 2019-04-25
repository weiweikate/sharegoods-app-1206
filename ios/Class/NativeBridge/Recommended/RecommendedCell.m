//
//  Recommended Cell.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/4/24.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "RecommendedCell.h"
#import "UIView+SDAutoLayout.h"
#import "View/JXHeaderView.h"
#import "View/JXBodyView.h"
#import "View/JXFooterView.h"


@interface RecommendedCell()
@property (nonatomic,strong)JXHeaderView* headView;
@property (nonatomic,strong)JXBodyView* bodyView;
@property (nonatomic,strong)JXFooterView* footerView;

@end

@implementation RecommendedCell

-(JXHeaderView *)headView{
  if (!_headView) {
    _headView = [[JXHeaderView alloc] init];
  }
  return _headView;
}
-(JXBodyView *)bodyView{
  if (!_bodyView) {
    _bodyView = [[JXBodyView alloc] init];
  }
  return _bodyView;
}

-(JXFooterView *)footerView{
  if (!_footerView) {
    _footerView = [[JXFooterView alloc] init];
  }
  return _footerView;
}

- (void)awakeFromNib {
    [super awakeFromNib];
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];
}

-(instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier{
  
  if (self = [super initWithStyle:style reuseIdentifier:reuseIdentifier]) {
    
    self.selectionStyle = UITableViewCellSelectionStyleNone;
    [self setUI];
  }
  
  return self;
}

-(void)setUI{
  [self.contentView addSubview:self.headView];
  [self.contentView addSubview:self.bodyView];
  [self.contentView addSubview:self.footerView];
  
  self.headView.sd_layout
  .topSpaceToView(self.contentView, 50)
  .leftSpaceToView(self.contentView, 25)
  .rightSpaceToView(self.contentView, 25)
  .heightIs(130);
  
  self.bodyView.sd_layout
  .topSpaceToView(self.headView, 10)
  .leftSpaceToView(self.contentView, 60)
  .rightSpaceToView(self.contentView, 60)
  .heightIs(140);
//
  self.footerView.sd_layout
  .topSpaceToView(self.bodyView, 10)
  .leftSpaceToView(self.contentView, 60)
  .rightSpaceToView(self.contentView, 60)
  .heightIs(130);
}

-(void)setModel:(JXModel *)model{
  _model = model;
  
  UIView * lastView;
  
    [self.contentView addSubview:self.footerView];
    lastView = _footerView;
    self.footerView.sd_layout
    .topSpaceToView(self.bodyView, 10)
    .leftEqualToView(self.contentView)
    .rightEqualToView(self.contentView)
    .heightIs(([UIScreen mainScreen].bounds.size.width-30-6)/3*2);

  [self setupAutoHeightWithBottomView:lastView bottomMargin:15];
}
@end
