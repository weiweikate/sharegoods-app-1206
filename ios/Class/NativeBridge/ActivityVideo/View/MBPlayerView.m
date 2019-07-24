//
//  MBPlayerView.m
//  crm_app_xiugou
//
//  Created by 周建新 on 2019/7/16.
//  Copyright © 2019年 Facebook. All rights reserved.
//

#import "MBPlayerView.h"
#import "UIView+SDAutoLayout.h"
#import "MBToastLabelView.h"
#import "MBProgressHUD+PD.h"

#import "MBFileManager.h"
#import "MBAVAssetResourceLoader.h"

@interface MBPlayerView()<MBAVAssetResourceLoaderDelegate>

@property (nonatomic, weak) AVPlayerLayer *playerLayer;  //播放画面Layer
@property (nonatomic) AVPlayerItem *playerItem;          //播放Item

@property (nonatomic, strong) MBAVAssetResourceLoader *resourceLoader; //加载代理

@end

@implementation MBPlayerView

#pragma mark - Lifecycle

- (instancetype)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
//      self.backgroundColor = [UIColor blackColor];
      self.frame = frame;
      [self addPlayEvent];
      self.isPlaying = NO;
    }

    return self;
}

- (void)dealloc {
  [self.player pause];
  [self.playerItem cancelPendingSeeks];
  [self.playerItem.asset cancelLoading];
  [[NSNotificationCenter defaultCenter] removeObserver:self];
  [self.playerLayer removeFromSuperlayer];
  self.player = nil;
  self.playerLayer = nil;
  self.resourceLoader = nil;
  self.backgroundColor = [UIColor clearColor];
  if (self.playerItem) {
    [self.playerItem removeObserver:self forKeyPath:@"status"];
  }
}

#pragma mark - Custom Accessors

- (AVPlayer *)player {
    if (!_player) {
        _player = [[AVPlayer alloc] init];
    }

    return _player;
}


- (BOOL)isPlaying {
    if (self.player.rate) {
        return YES;
    }

    return NO;
}

#pragma mark - IBActions

#pragma mark - Public

- (void)setUrlString:(NSString *)urlString {
    [self configurePlayerWithURL:urlString];
}

#pragma mark - Private

- (void)addPlayEvent {
//    UITapGestureRecognizer *tapGestureRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapAction)];
//    [self addGestureRecognizer:tapGestureRecognizer];
//    self.userInteractionEnabled = YES;
}

- (void)configurePlayerWithURL:(NSString *)urlString {
    [[NSNotificationCenter defaultCenter] removeObserver:self];

    _urlString = urlString;

    NSURL *url = [NSURL URLWithString:urlString];

  //修改URL的Schema，让asset的资源加载走代理
    self.resourceLoader = nil;
    self.resourceLoader = [[MBAVAssetResourceLoader alloc] init];
    NSURL *playURL = [self.resourceLoader getSchemeVideoURL:url];
    AVURLAsset *urlAsset = [AVURLAsset assetWithURL:playURL];

    [urlAsset.resourceLoader setDelegate:self.resourceLoader queue:dispatch_get_main_queue()];

    [self.player pause];
    [self.playerLayer removeFromSuperlayer];
    self.player = nil;
    self.playerLayer = nil;
    self.backgroundColor = [UIColor clearColor];
    if ([self.playDelegate respondsToSelector:@selector(resetStatus)]) {
      [self.playDelegate resetStatus];
    }
    if (self.playerItem) {
        [self.playerItem removeObserver:self forKeyPath:@"status"];
    }

  // 初始化播放单元
    self.playerItem = [AVPlayerItem playerItemWithAsset:urlAsset];
    self.player = [AVPlayer playerWithPlayerItem:self.playerItem];
    [self.playerItem addObserver:self forKeyPath:@"status" options:NSKeyValueObservingOptionNew context:nil];
    self.playerLayer.videoGravity =AVLayerVideoGravityResizeAspectFill;
    self.playerLayer = [AVPlayerLayer playerLayerWithPlayer:self.player];
    self.playerLayer.frame = CGRectMake(0, 0, KScreenWidth, KScreenHeight);

    [self.layer addSublayer:self.playerLayer];

    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(playDidFinish) name:AVPlayerItemDidPlayToEndTimeNotification object:self.player.currentItem];
}


- (void)playDidFinish {
    NSLog(@"视频播放完整");
    [self.player seekToTime:CMTimeMake(0, 1)];
    [self.player play];
}

- (void)tapAction {
    if (self.player.rate) { //通过rate来判断播放状态
        [self.player pause];
    }else {
        [self.player play];
    }
}

#pragma mark - Protocol KVO

- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary<NSKeyValueChangeKey,id> *)change
                       context:(void *)context
{
    if ([keyPath isEqualToString:@"status"]) {
        AVPlayerItemStatus status = [[change objectForKey:NSKeyValueChangeNewKey] integerValue];
        switch (status) {
            case AVPlayerItemStatusUnknown:
                NSLog(@"%@ : error:%@", @"AVPlayerItemStatusUnknown", [_playerItem.error localizedDescription]);
                break;

            case AVPlayerItemStatusReadyToPlay:
                NSLog(@"%@", @"AVPlayerItemStatusReadyToPlay");
                self.backgroundColor = [UIColor blackColor];
                [self.player play];
                if ([self.playDelegate respondsToSelector:@selector(playerViewDidPrepareToShowVideo)]) {
                    [self.playDelegate playerViewDidPrepareToShowVideo];
                }
                break;

            case AVPlayerItemStatusFailed:
                NSLog(@"%@ : error:%@", @"AVPlayerItemStatusFailed", [_playerItem.error localizedDescription]);
                break;
        }
    }
}


#pragma mark - Protocol MBAVAssetResourceLoaderDelegate
- (void)didCompleteWithError:(NSError *)error {
  NSString *errorMessage = @"未知错误";

  switch (error.code) {
    case -1005:
      errorMessage = @"网络中断";
      break;

    case -1009:
      errorMessage = @"无网络链接";
      break;

    case -1001:
      errorMessage = @"请求超时";
      break;

    case -1004:
      errorMessage = @"服务器内部错误";
      break;

    case -1003:
      errorMessage = @"找不到服务器";
      break;

    default:
      break;
  }
  [MBProgressHUD showSuccess:errorMessage];
}

@end
