//
//  SwichView.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/7/19.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "SwichView.h"
#import  <SDAutoLayout.h>
@interface SwichView()
@property(nonatomic, strong)NSMutableArray<UIButton *> *btns;
@property(nonatomic, strong)UIView *lineView;
@end
@implementation SwichView

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

- (NSMutableArray<UIButton *> *)btns{
  if (!_btns) {
    _btns = [NSMutableArray new];
  }
  return _btns;
}

- (UIView *)lineView{
  if (!_lineView) {
    _lineView = [UIView new];
    _lineView.backgroundColor = [UIColor colorWithHexString:@"FF0050"];
    _lineView.bounds = CGRectMake(0, 0, 30, 2);
    _lineView.center = CGPointMake(20, 40-2);
    _lineView.layer.zPosition = 1;
    [self addSubview:_lineView];
  }
  return _lineView;
}

- (void)setData:(NSArray<NSString *> *)data
{
  if (data.count == _data.count) {
    BOOL eq = YES;
    for (int i = 0; i < data.count; i++) {
      if (![data[i] isEqualToString:_data[i]]) {
         eq = NO;
        break;
      }
    }
    if (eq) {
      return;
    }
  }
  _data = data;
   [self setUI];
}

- (void)setUI{
  for (int i = 0; i<self.btns.count; i++) {
    [self.btns[i] removeFromSuperview];
  }
  [self.btns removeAllObjects];
  self.lineView.hidden = _data.count == 1;
  if (_data.count == 0) {
    return;
  }
  for (int i = 0; i < _data.count; i ++) {
    UIButton *btn = [UIButton new];
    btn.tag = 1000 + i;
    [btn addTarget:self action:@selector(btnTap:) forControlEvents:UIControlEventTouchUpInside];
    [btn setTitle:_data[i] forState:0];
    btn.titleLabel.font = [UIFont systemFontOfSize:14];
    if (_data.count > 1) {
      [btn setTitleColor:[UIColor colorWithHexString:@"#333333"] forState:UIControlStateNormal];
      [btn setTitleColor:[UIColor colorWithHexString:@"#FF0050"] forState:UIControlStateSelected];
    }else{
      [btn setTitleColor:[UIColor colorWithHexString:@"#333333"] forState:UIControlStateNormal];
      [btn setTitleColor:[UIColor colorWithHexString:@"#333333"] forState:UIControlStateSelected];
    }
    [self addSubview:btn];
    btn.sd_layout.leftSpaceToView(self, i * 80)
    .topSpaceToView(self, 0)
    .bottomSpaceToView(self, 0)
    .widthIs(40);
    [self.btns addObject:btn];

  }

  if (_index > _data.count - 1) {
    self.index = _data.count - 1;
  }else{
    self.index = _index;
  }

}


- (void)setIndex:(NSInteger)index
{
//  if (_btns.count -1 < index) {
//    return;
//  }
  if (_index != index) {
    if (self.selectBlock) {
      self.selectBlock(index);
    }
  }
  [self changToIndex:index];
}
-(void)changToIndex:(NSInteger)index
{
  UIButton *btn = _btns[_index];
  btn.titleLabel.font = [UIFont systemFontOfSize:14];
  btn.selected = NO;

  btn = _btns[index];
  btn.titleLabel.font = [UIFont systemFontOfSize:16];
  btn.selected = YES;
  WS(weakSelf)
  [UIView animateWithDuration:0.3 animations:^{
    weakSelf.lineView.centerX_sd = btn.centerX_sd;
  }];

  _index = index;
}

- (void)btnTap:(UIButton *)btn{
  self.index = btn.tag - 1000;
  if (self.selectBlock) {
    self.selectBlock(btn.tag - 1000);
  }
}


@end


@implementation SwichViewNavi
{
  UIButton *btn;
}
- (instancetype)init
{
  self = [super init];
  if (self) {
    self.frame = CGRectMake(0, 0, KScreenWidth, kNavBarHeight);
    self.swichView = [SwichView new];
    [self addSubview:self.swichView];
    btn = [UIButton new];
    [btn addTarget:self action:@selector(back) forControlEvents:UIControlEventTouchUpInside];
    UIImage *img = [UIImage imageNamed:@"back"];
    [btn setImage:[img imageWithRenderingMode:(UIImageRenderingModeAlwaysTemplate)] forState:0];
    [self addSubview:btn];
    btn.frame = CGRectMake(0, kNavBarHeight - 44, 44, 44);
  }
  return self;
}

- (void)back{
  if (self.backBlock) {
    self.backBlock();
  }
}

- (void)setSelectBlock:(void (^)(NSInteger))selectBlock
{
   _selectBlock = selectBlock;
   self.swichView.selectBlock = selectBlock;
}

- (void)setData:(NSArray<NSString *> *)data
{
  _data = data;
  self.swichView.data = data;
  self.swichView.bounds = CGRectMake(0, 0, 80*data.count - 40, 44);
  self.swichView.center = CGPointMake(self.centerX_sd, (kNavBarHeight - 44) + 22);
}

- (void)setHidden:(BOOL)hidden
{
  self.swichView.hidden = hidden;
  UIImage *img = [UIImage imageNamed:@"back"];
  [btn setImage:[img imageWithRenderingMode:(UIImageRenderingModeAlwaysTemplate)] forState:0];
  btn.tintColor = [UIColor colorWithHexString:hidden?@"ffffff":@"333333"];
//  btn.tintColor = hidden?[UIColor whiteColor]:[UIColor blackColor];
  self.backgroundColor = hidden?[UIColor clearColor]:[UIColor whiteColor];
}

@end
