/**
 * 精选热门
 */
import React from 'react';
import { View, StyleSheet, Platform, Animated } from 'react-native';
import ShowBannerView from './ShowBannerView';
import { observer } from 'mobx-react';
import { tag, showBannerModules } from './Show';
import ScreenUtils from '../../utils/ScreenUtils';
import DesignRule from '../../constants/DesignRule';

const { px2dp } = ScreenUtils;
import ShowRecommendView from './components/ShowRecommendView';
import ReleaseButton from './components/ReleaseButton';

import user from '../../model/user';
import SelectionPage, { sourceType } from '../product/SelectionPage';
import AddCartModel from './model/AddCartModel';
import shopCartCacheTool from '../shopCart/model/ShopCartCacheTool';
import { track, trackEvent } from '../../utils/SensorsTrack';
import bridge from '../../utils/bridge';
import ShowApi from './ShowApi';
import EmptyUtils from '../../utils/EmptyUtils';
import ShowUtils from './utils/ShowUtils';
import RouterMap, { routeNavigate, routePush } from '../../navigation/RouterMap';
import DownloadUtils from './utils/DownloadUtils';

@observer
export default class ShowHotView extends React.Component {

    // state = {
    //     isEnd: false,
    //     isFetching: false,
    //     hasRecommend: false,
    //     isScroll: false,
    // };

    constructor(props) {
        super(props);
        this.firstLoad = true;
        this.state = {
            headerView: null,
            showToTop: false,
            rightValue: new Animated.Value(1)
        };

    }

    componentDidMount() {
        if (this.firstLoad === true) {
            console.log('ShowHotView firstLoad');
            this.loadData();
        }
    }

    refresh() {
        console.log('ShowHotView refresh ');
        if (this.firstLoad === true) {
            return;
        }
        this.loadData();
    }


    loadData() {
        showBannerModules.loadBannerList(() => {
            if (Platform.OS !== 'ios') {
                this.setState({
                    headerView: this.renderHeader()
                });
            }
        });
    }

    addCart = (detail) => {
        let addCartModel = new AddCartModel();
        addCartModel.requestProductDetail(detail.prodCode, (productIsPromotionPrice) => {
            this.SelectionPage.show(addCartModel, (amount, skuCode) => {
                const { prodCode, name, originalPrice } = addCartModel;
                shopCartCacheTool.addGoodItem({
                    'amount': amount,
                    'skuCode': skuCode,
                    'productCode': detail.prodCode
                });
                /*加入购物车埋点*/
                const { showNo , userInfoVO } = detail;
                const { userNo } = userInfoVO || {};
                track(trackEvent.XiuChangAddToCart, {
                    xiuChangBtnLocation:'1',
                    xiuChangListType:'1',
                    articleCode:showNo,
                    author:userNo,
                    spuCode: prodCode,
                    skuCode: skuCode,
                    spuName: name,
                    pricePerCommodity: originalPrice,
                    spuAmount: amount,
                });
            }, { sourceType: productIsPromotionPrice ? sourceType.promotion : null });
        }, (error) => {
            bridge.$toast(error.msg || '服务器繁忙');
        });
    };

    releaseButtonShow = () => {
        Animated.timing(
            this.state.rightValue,
            {
                toValue: 1,
                duration: 300
            }
        ).start();
    };

    releaseButtonHidden = () => {
        Animated.timing(
            this.state.rightValue,
            {
                toValue: 0,
                duration: 300
            }
        ).start();
    };

    renderHeader = () => {
        const { bannerList } = showBannerModules;
        if (!bannerList || bannerList.length <= 0) {
            return null;
        }
        return (<View style={{ backgroundColor: DesignRule.bgColor, width: ScreenUtils.width - px2dp(30) }}>
                <ShowBannerView navigate={this.props.navigate} pageFocused={this.props.pageFocus}/>
            </View>
        );
    };

    scrollToTop = () => {
        if (this.state.showToTop) {
            this.RecommendShowList && this.RecommendShowList.scrollToTop();
        }
    };

    render() {
        const right = this.state.rightValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-px2dp(22), px2dp(15)]
        });

        return (
            <View style={styles.container}>
                <View style={{ flex: 1, paddingHorizontal: 15 }}>
                    <ShowRecommendView style={{ flex: 1 }}
                                       uri={'/social/show/content/page/query@GET'}
                                       ref={(ref) => {
                                           this.RecommendShowList = ref;
                                       }}
                                       type={'recommend'}
                                       headerHeight={showBannerModules.bannerHeight + 20}
                                       renderHeader={Platform.OS === 'ios' ? this.renderHeader() : this.state.headerView}
                                       onStartRefresh={() => {
                                           this.loadData();
                                       }}
                                       params={{ spreadPosition: tag.Recommend + '' }}
                                       onItemPress={({ nativeEvent }) => {

                                           const { navigate } = this.props;
                                           let params = {
                                               data: nativeEvent,
                                               ref: this.RecommendShowList,
                                               index: nativeEvent.index
                                           };
                                           if (nativeEvent.showType === 1 || nativeEvent.showType === 3) {
                                               navigate('show/ShowDetailPage', params);
                                           } else {
                                               navigate('show/ShowRichTextDetailPage', params);
                                           }

                                           const { showNo , userInfoVO } = nativeEvent;
                                           const { userNo } = userInfoVO || {};
                                           track(trackEvent.XiuChangEnterClick,{
                                               xiuChangListType:1,
                                               articleCode:showNo,
                                               author:userNo,
                                               xiuChangEnterBtnName:'秀场列表'
                                           })

                                       }}
                                       onNineClick={({ nativeEvent }) => {
                                           routeNavigate(RouterMap.ShowDetailImagePage, {
                                               imageUrls: nativeEvent.imageUrls,
                                               index: nativeEvent.index
                                           });
                                       }}
                                       onAddCartClick={({ nativeEvent }) => {
                                           this.addCart(nativeEvent);
                                       }}

                                       onPressProduct={({ nativeEvent }) => {
                                           routePush(RouterMap.ProductDetailPage, { productCode: nativeEvent.prodCode });
                                       }}

                                       onZanPress={({ nativeEvent }) => {
                                           //app native层提前修改了数据
                                           if (!nativeEvent.detail.like) {
                                               ShowApi.reduceCountByType({
                                                   showNo: nativeEvent.detail.showNo,
                                                   type: 1
                                               });
                                           } else {
                                               ShowApi.incrCountByType({ showNo: nativeEvent.detail.showNo, type: 1 });
                                           }
                                       }}

                                       onDownloadPress={({ nativeEvent }) => {
                                           if (!user.isLogin) {
                                               routeNavigate(RouterMap.LoginPage);
                                               return;
                                           }
                                           let { detail } = nativeEvent;
                                           if (!EmptyUtils.isEmptyArr(detail.resource)) {
                                               let urls = detail.resource.map((value) => {
                                                   return value.url;
                                               });
                                               ShowUtils.downloadShow(urls, detail.content).then(() => {
                                                   detail.downloadCount += 1;
                                                   ShowApi.incrCountByType({
                                                       showNo: nativeEvent.detail.showNo,
                                                       type: 4
                                                   });
                                                   this.RecommendShowList && this.RecommendShowList.replaceItemData(nativeEvent.index, JSON.stringify(detail));
                                               });
                                           }

                                           DownloadUtils.downloadProduct(nativeEvent);

                                           const { showNo , userInfoVO } = detail;
                                           const { userNo } = userInfoVO || {};
                                           track(trackEvent.XiuChangDownLoadClick,{
                                               xiuChangBtnLocation:'1',
                                               xiuChangListType:'1',
                                               articleCode:showNo,
                                               author:userNo
                                           })
                                       }}

                                       onSharePress={({ nativeEvent }) => {
                                           this.shareModal && this.shareModal.open();
                                           this.props.onShare(nativeEvent);

                                       }}

                                       onScrollY={({ nativeEvent }) => {
                                           this.setState({
                                               showToTop: nativeEvent.YDistance > ScreenUtils.height
                                           });
                                       }}


                                       onScrollStateChanged={({ nativeEvent }) => {
                                           const { state } = nativeEvent;
                                           if (state === 0) {
                                               this.releaseButtonShow();
                                           } else {
                                               this.releaseButtonHidden();
                                           }
                                       }}
                    />
                    {
                        user.token ?
                            <Animated.View style={{
                                position: 'absolute',
                                right: right,
                                bottom: px2dp(118)
                            }}>
                                <ReleaseButton
                                    onPress={() => {
                                        if (!user.isLogin) {
                                            routeNavigate(RouterMap.LoginPage);
                                            return;
                                        }
                                        routeNavigate(RouterMap.ReleaseNotesPage);
                                    }}/>
                            </Animated.View> : null
                    }
                </View>
                <SelectionPage ref={(ref) => this.SelectionPage = ref}/>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    titleView: {
        height: px2dp(53),
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: '#999',
        fontSize: px2dp(11),
        height: 100,
        width: 100
    },
    container: {
        flex: 1
    }
});
