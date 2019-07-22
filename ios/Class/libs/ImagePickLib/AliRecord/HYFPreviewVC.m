//
//  HYFPreviewVC.m
//  crm_app_xiugou
//
//  Created by 胡玉峰 on 2019/7/17.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "HYFPreviewVC.h"

@interface HYFPreviewVC ()<HYFVideoPreviewViewDelegate>

@end

@implementation HYFPreviewVC

- (void)viewDidLoad {
    [super viewDidLoad];
    [self setUpView];
    // Do any additional setup after loading the view.
}
-(void)setUpView{
  HYFVideoPreviewView * preView = [[HYFVideoPreviewView alloc]initWithVideoPath:self.videoPath];
  preView.frame = self.view.bounds;
  preView.delegate = self;
  [self.view addSubview:preView];
  self.preView = preView;
}
-(void)preViewBtnClick:(NSInteger)btnTag{
  if (btnTag == 0) {
    [self.navigationController popViewControllerAnimated:YES];
  }else{
    if (self.finshPreview) {
      self.finshPreview(self.videoPath);
    }
  }
}
/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
