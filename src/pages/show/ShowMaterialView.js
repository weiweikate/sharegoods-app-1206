/**
 * 精选热门
 */
import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { observer } from 'mobx-react';
import { tag } from './Show';
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
export default class ShowMaterialView extends React.Component {

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
            showEditorIcon: true,
            showToTop: false,
            rightValue: new Animated.Value(1)
        };

    }

    scrollToTop = () => {
        if (this.state.showToTop) {
            this.materialList && this.materialList.scrollToTop();
        }
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
                    xiuChangListType:'2',
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


    render() {
        const right = this.state.rightValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-px2dp(22), px2dp(15)]
        });
        return (
            <View style={styles.container}>
                <View style={{ flex: 1, paddingHorizontal: 15, paddingTop: ScreenUtils.isIOS ? 5 : 0 }}>
                    <ShowRecommendView style={{ flex: 1 }}
                                       uri={'/social/show/content/page/query@GET'}
                                       ref={(ref) => {
                                           this.materialList = ref;
                                       }}
                                       params={{ spreadPosition: tag.Material + '' }}
                                       userIsLogin={user.token ? true : false}
                                       onItemPress={({ nativeEvent }) => {
                                           const { navigate } = this.props;
                                           let params = {
                                               data: nativeEvent,
                                               ref: this.materialList,
                                               index: nativeEvent.index
                                           };
                                           if (nativeEvent.showType === 1 || nativeEvent.showType === 3) {
                                               navigate(RouterMap.ShowDetailPage, params);
                                           } else {
                                               navigate(RouterMap.ShowRichTextDetailPage, params);
                                           }

                                           const { showNo , userInfoVO } = nativeEvent;
                                           const { userNo } = userInfoVO || {};
                                           track(trackEvent.XiuChangEnterClick,{
                                               xiuChangListType:2,
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
                                       onPressProduct={({ nativeEvent }) => {
                                           routePush(RouterMap.ProductDetailPage, { productCode: nativeEvent.prodCode,trackType:3 });
                                       }}

                                       onAddCartClick={({ nativeEvent }) => {
                                           // alert(nativeEvent.prodCode);
                                           this.addCart(nativeEvent.prodCode);
                                       }}
                                       onZanPress={({ nativeEvent }) => {
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
                                                   this.materialList && this.materialList.replaceItemData(nativeEvent.index, JSON.stringify(detail));
                                               });
                                           }

                                           DownloadUtils.downloadProduct(nativeEvent);

                                           const { showNo , userInfoVO } = detail;
                                           const { userNo } = userInfoVO || {};
                                           track(trackEvent.XiuChangDownLoadClick,{
                                               xiuChangBtnLocation:'1',
                                               xiuChangListType:'2',
                                               articleCode:showNo,
                                               author:userNo
                                           })

                                       }}

                                       onScrollY={({ nativeEvent }) => {
                                           // alert(JSON.stringify(nativeEvent.YDistance)+ScreenH)
                                           this.setState({
                                               showToTop: nativeEvent.YDistance > ScreenUtils.height
                                           });
                                       }}


                                       onSharePress={({ nativeEvent }) => {
                                           this.shareModal && this.shareModal.open();
                                           this.props.onShare(nativeEvent);

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
    recTitle: {
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(19),
        fontWeight: '400'
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
