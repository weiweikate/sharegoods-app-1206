//
//  MRScrollNumberView.m
//  crm_app_xiugou
//
//  Created by 胡胡超 on 2019/11/4.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "MRScrollNumberView.h"
#import "LNNumberScrollAnimatedView.h"
@interface MRScrollNumberView()
@property(nonatomic, weak) LNNumberScrollAnimatedView *socreAnimation;
@end
@implementation MRScrollNumberView

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/
//color:processColor(color),
//         num,
//         fontSize

- (instancetype)init
{
  if (self = [super init]) {
    LNNumberScrollAnimatedView *socreAnimation = [LNNumberScrollAnimatedView new];
       socreAnimation.density = 5;
       socreAnimation.duration = 0.5;
       socreAnimation.minLength = 1;
       socreAnimation.isAscending = YES;
       socreAnimation.durationOffset = -0.1;
       [self addSubview:socreAnimation];
       self.socreAnimation = socreAnimation;
  }
  
  return self;
}
- (void)setData:(NSDictionary *)data
{
  _data = data;
  
  NSNumber *color = data[@"color"];
  if (color) {
    unsigned int colorInt = [color unsignedIntValue];
    self.socreAnimation.textColor = [UIColor colorWithRGB:colorInt];
  }
  
  NSNumber *fontSize = data[@"fontSize"];
  UIFont *textFont = [UIFont systemFontOfSize:10];
  if (fontSize) {
    textFont = [UIFont systemFontOfSize:[fontSize integerValue]];
  }
  self.socreAnimation.font = textFont;
  NSNumber *num = data[@"num"];
  if (num) {
    NSInteger n = [num integerValue];
    NSString* text = @"";
    while (n>0) {
      n/=10;
      text = [NSString stringWithFormat:@"%@9",text];
    }
    CGSize scoreTextSize = [text sizeWithAttributes:[NSDictionary dictionaryWithObjectsAndKeys:textFont,NSFontAttributeName, nil]];
    self.socreAnimation.frame = CGRectMake(0, 0, scoreTextSize.width, scoreTextSize.height);
    self.socreAnimation.minLength = text.length;
    [self.socreAnimation setValue:@0];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.2 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
              [self.socreAnimation setValue:num];
             [self.socreAnimation startAnimation];
       });
  }
}
@end
