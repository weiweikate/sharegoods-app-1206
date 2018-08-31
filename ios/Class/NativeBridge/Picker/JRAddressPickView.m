//
//  JRAddressPickView.m
//  jure
//
//  Created by Max on 2018/8/14.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "JRAddressPickView.h"
#define KBottomBgView_H  (245 +  kTabBarMoreHeight)
#define KPickView_H  (KBottomBgView_H - 45 -  kTabBarMoreHeight)


@interface JRAddressPickView()<UIPickerViewDelegate,UIPickerViewDataSource>

@property(nonatomic,strong)UIButton *cancelBtn;
@property(nonatomic,strong)UIButton *sureBtn;
@property(nonatomic,strong)UIView *bottomBgView;
@property(nonatomic,strong)UIButton *maskView;
@property(nonatomic,strong)NSDictionary *selectDataDic;
@end

@implementation JRAddressPickView

-(instancetype)initWithFrame:(CGRect)frame{
  if (self = [super initWithFrame:frame]) {
    self.height = KBottomBgView_H;
    self.width = KScreenWidth;
    self.left = 0;
    self.top = KScreenHeight;
   
  }
  return self;
}
#pragma mark --delegate

- (CGFloat)pickerView:(UIPickerView *)pickerView rowHeightForComponent:(NSInteger)component __TVOS_PROHIBITED{
  return 45;
}
- (nullable NSString *)pickerView:(UIPickerView *)pickerView titleForRow:(NSInteger)row forComponent:(NSInteger)component __TVOS_PROHIBITED
{
  if (component == 0) {
    return self.dataArr[row][@"name"];
  }else if (component == 1){
     NSInteger firstRow = [pickerView selectedRowInComponent:0];
    NSArray * secArr = self.dataArr[firstRow][@"value"];
     return secArr[row][@"name"];
  }else if (component ==2){
     NSInteger firstRow = [pickerView selectedRowInComponent:0];
     NSInteger secRow = [pickerView selectedRowInComponent:1];
     NSArray * thirdArr = self.dataArr[firstRow][@"value"][secRow][@"value"];
     return thirdArr[row][@"name"];
  }
  return @"北京";
}
- (NSInteger)numberOfComponentsInPickerView:(UIPickerView *)pickerView{
  return 3;
}
-(NSInteger)pickerView:(UIPickerView *)pickerView numberOfRowsInComponent:(NSInteger)component{
  if (component == 0) {
    return self.dataArr.count;
  }else if(component == 1){
    NSInteger firstRow = [pickerView selectedRowInComponent:0];
    NSArray * secArr = self.dataArr[firstRow][@"value"];
    return secArr.count;
  }else if (component == 2){
     NSInteger firstRow = [pickerView selectedRowInComponent:0];
     NSInteger secRow = [pickerView selectedRowInComponent:1];
    NSArray * thirdArr = self.dataArr[firstRow][@"value"][secRow][@"value"];
    return thirdArr.count;
  }
  return 0;
}
//{"cityId":330100,"cityName":"杭州","districId":330109,"districName":"萧山区","provinceId":330000,"provinceName":"浙江"}
- (void)pickerView:(UIPickerView *)pickerView didSelectRow:(NSInteger)row inComponent:(NSInteger)component __TVOS_PROHIBITED{
    [pickerView reloadAllComponents];
  NSInteger  firstRow = [pickerView selectedRowInComponent:0];
  NSInteger  secRow = [pickerView selectedRowInComponent:1];
  NSInteger thirdRow = [pickerView selectedRowInComponent:2];
  
//  id string = self.dataArr[fistRow][@"value"][secRow][@"code"];
 self.selectDataDic = @{@"provinceId":self.dataArr[firstRow][@"code"],
    @"provinceName":self.dataArr[firstRow][@"name"],
    @"cityId":self.dataArr[firstRow][@"value"][secRow][@"code"],
    @"cityName":self.dataArr[firstRow][@"value"][secRow][@"name"],
    @"districId":self.dataArr[firstRow][@"value"][secRow][@"value"][thirdRow][@"code"],
    @"districName":self.dataArr[firstRow][@"value"][secRow][@"value"][thirdRow][@"name"],
    };
  
}
//重写方法
- (UIView *)pickerView:(UIPickerView *)pickerView viewForRow:(NSInteger)row forComponent:(NSInteger)component reusingView:(UIView *)view{
  UILabel* pickerLabel = (UILabel*)view;
  if (!pickerLabel){
    pickerLabel = [[UILabel alloc] init];
    pickerLabel.adjustsFontSizeToFitWidth = YES;
    [pickerLabel setTextAlignment:NSTextAlignmentCenter];
    [pickerLabel setBackgroundColor:[UIColor whiteColor]];
    [pickerLabel setFont:[UIFont boldSystemFontOfSize:15]];
    [pickerLabel setTextColor:[UIColor darkGrayColor]];
  }
  pickerLabel.text=[self pickerView:pickerView titleForRow:row forComponent:component];
  return pickerLabel;
}
-(void)setDataArr:(NSArray *)dataArr{
  _dataArr = dataArr;
   self.selectDataDic = @{@"provinceId":self.dataArr[0][@"code"],
    @"provinceName":self.dataArr[0][@"name"],
    @"cityId":self.dataArr[0][@"value"][0][@"code"],
    @"cityName":self.dataArr[0][@"value"][0][@"name"],
    @"districId":self.dataArr[0][@"value"][0][@"value"][0][@"code"],
    @"districName":self.dataArr[0][@"value"][0][@"value"][0][@"name"],
    };
  [self.pickerView reloadAllComponents];
}
-(void)showView{
  [self addSubview:self.bottomBgView];
  [self.bottomBgView addSubview:self.pickerView];
  [self.bottomBgView addSubview:self.sureBtn];
  [self.bottomBgView addSubview:self.cancelBtn];
  [[UIApplication sharedApplication].keyWindow addSubview:self.maskView];
  [ [UIApplication sharedApplication].keyWindow addSubview:self];
  
  [UIView animateWithDuration:0.3 animations:^{
    self.top = KScreenHeight - KBottomBgView_H;
  }];
}
-(void)hideView:(UIButton *)btn{
  [self.maskView removeFromSuperview];
  [self removeFromSuperview];
}
-(void)sureBtnClick:(UIButton *)btn{
  if (self.sureBlock) {
    self.sureBlock(self.selectDataDic.copy);
  }
  [self hideView:nil];
}
- (UIButton *)cancelBtn{
  if (!_cancelBtn) {
    _cancelBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [_cancelBtn setFrame:CGRectMake(10, 0, 60, 45)];
    [_cancelBtn setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    _cancelBtn.titleLabel.font = [UIFont systemFontOfSize:15];
    [_cancelBtn setTitle:@"取消" forState:UIControlStateNormal];
    [_cancelBtn addTarget:self action:@selector(hideView:) forControlEvents:UIControlEventTouchUpInside];
  }
  return _cancelBtn;
}
-(UIButton *)sureBtn{
  if (!_sureBtn) {
    _sureBtn= [UIButton buttonWithType:UIButtonTypeCustom];
    [_sureBtn setFrame:CGRectMake(KScreenWidth - 70, 0, 60, 45)];
    _sureBtn.titleLabel.font = [UIFont systemFontOfSize:15];
    [_sureBtn setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    [_sureBtn setTitle:@"确定" forState:UIControlStateNormal];
    [_sureBtn addTarget:self action:@selector(sureBtnClick:) forControlEvents:UIControlEventTouchUpInside];
  }
  return _sureBtn;
}
-(UIButton *)maskView{
  if (!_maskView) {
    _maskView = [UIButton buttonWithType:UIButtonTypeCustom];
    [_maskView setFrame:CGRectMake(0, 0, KScreenWidth, KScreenHeight)];
    _maskView.backgroundColor = [UIColor blackColor];
    _maskView.alpha = 0.5;
    [_maskView addTarget:self action:@selector(hideView:) forControlEvents:UIControlEventTouchUpInside];
  }
  return _maskView;
}
- (UIView *)bottomBgView{
  if (!_bottomBgView) {
    _bottomBgView = [[UIView alloc]initWithFrame:CGRectMake(0, 0, KScreenWidth, KBottomBgView_H)];
    _bottomBgView.backgroundColor = [UIColor whiteColor];
//    _bottomBgView.alpha = 0.6;
    _bottomBgView.backgroundColor = [UIColor whiteColor];
  }
  return _bottomBgView;
}
- (UIPickerView *)pickerView{
  if (!_pickerView) {
    _pickerView = [[UIPickerView alloc]initWithFrame:CGRectMake(0, 45, KScreenWidth, KPickView_H)];
    _pickerView.delegate = self;
    _pickerView.dataSource = self;
  }
  return _pickerView;
}

@end
