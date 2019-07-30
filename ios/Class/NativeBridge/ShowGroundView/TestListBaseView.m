//
//  TestListBaseView.m
//  JXCategoryView
//
//  Created by jiaxin on 2018/8/27.
//  Copyright © 2018年 jiaxin. All rights reserved.
//

#import "TestListBaseView.h"
#import "WHCWaterfallFlowLayout.h"

@interface TestListBaseView()<UICollectionViewDataSource, WHCWaterfallFlowLayoutDelegate, UICollectionViewDelegate, UIScrollViewDelegate>
@property (nonatomic, copy) void(^scrollCallback)(UIScrollView *scrollView);
@end

@implementation TestListBaseView

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
//        _tableView = [[UITableView alloc] initWithFrame:CGRectMake(0, 0, frame.size.width, frame.size.height) style:UITableViewStylePlain];
        WHCWaterfallFlowLayout *whcLayout = [[WHCWaterfallFlowLayout alloc] init];
        whcLayout.itemSpacing = 10;
        whcLayout.lineSpacing = 10;
        whcLayout.sectionInset = UIEdgeInsetsMake(10, 10, 10, 10);
        whcLayout.colCount = 2;
        whcLayout.delegate = self;
        UICollectionView * collectionView = [[UICollectionView alloc]initWithFrame:self.bounds collectionViewLayout:whcLayout];
        collectionView.showsVerticalScrollIndicator = NO;
        collectionView.showsHorizontalScrollIndicator = NO;
        [collectionView registerClass:[UICollectionViewCell class] forCellWithReuseIdentifier:@"ShowCell"];
        collectionView.dataSource = self;
        collectionView.delegate = self;
        collectionView.backgroundColor = [UIColor whiteColor];
        self.collectionView = collectionView;
        [self addSubview:collectionView];
      
    }
    return self;
}

- (void)layoutSubviews {
    [super layoutSubviews];
    self.collectionView.frame = self.bounds;
}

#pragma mark - UITableViewDataSource, UITableViewDelegate

- (NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView{
    return 1;
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section{
    
    //  self.collectionView.mj_footer.hidden = self.shops.count == 0;
    
    return self.dataSource.count;
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath{
    
    UICollectionViewCell * cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"ShowCell" forIndexPath:indexPath];
    cell.layer.cornerRadius = 4;
    cell.clipsToBounds = YES;
    cell.backgroundColor = [UIColor redColor];
 
    return cell;
}


- (CGFloat)collectionView:(UICollectionView *)collectionView layout:(WHCWaterfallFlowLayout*)collectionViewLayout heightForWidth:(CGFloat)width atIndexPath:(NSIndexPath*)indexPath
{
   
    return width + 20*indexPath.row;
}


- (void)scrollViewDidScroll:(UIScrollView *)scrollView {
    self.scrollCallback(scrollView);
}


#pragma mark - JXPagingViewListViewDelegate

- (UIScrollView *)listScrollView {
    return self.collectionView;
}

- (void)listViewDidScrollCallback:(void (^)(UIScrollView *))callback {
    self.scrollCallback = callback;
}

- (UIView *)listView {
    return self;
}

@end
