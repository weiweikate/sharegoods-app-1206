//
//  SCCell.m
//  crm_app_xiugou
//
//  Created by Max on 2018/12/17.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "SCCell.h"

@implementation SCCell

- (void)awakeFromNib {
    [super awakeFromNib];
  
    // Initialization code
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}
-(instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier{
  if (self = [super initWithStyle:style
                  reuseIdentifier:reuseIdentifier]) {
    [self initView];
  }
  return self;
}
-(void)initView{
  UILabel * label = [[UILabel alloc]initWithFrame:CGRectMake(10, 20, 100, 30)];
  label.text = @"label wenzi ";
  [self.contentView addSubview:label];
}
+(instancetype)cellWithTableView:(UITableView *)tableView andId:(NSString *)cellID{
  SCCell * cell =  [tableView dequeueReusableCellWithIdentifier:cellID];
  if (!cell) {
    cell = [[SCCell alloc]initWithStyle:UITableViewCellStyleValue1 reuseIdentifier:cellID];
  }
  return cell;
}

@end
