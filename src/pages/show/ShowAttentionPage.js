/**
 * 精选热门
 */
import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { observer } from 'mobx-react';
import ScreenUtils from '../../utils/ScreenUtils';

const { px2dp } = ScreenUtils;
import ReleaseButton from './components/ReleaseButton';

import user from '../../model/user';
import SelectionPage, { sourceType } from '../product/SelectionPage';
import AddCartModel from './model/AddCartModel';
import shopCartCacheTool from '../shopCart/model/ShopCartCacheTool';
import { track, trackEvent } from '../../utils/SensorsTrack';
import bridge from '../../utils/bridge';
import ShowApi from './ShowApi';
import EmptyUtils from '../../utils/EmptyUtils';
import RouterMap, { routeNavigate, routePush } from '../../navigation/RouterMap';
import DownloadUtils from './utils/DownloadUtils';
import ShowAttentionView from './components/ShowAttentionView';
import WhiteModel from './model/WhiteModel';

@observer
export default class ShowAttentionPage extends React.Component {

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
            showToTop: false,
            rightValue: new Animated.Value(1)
        };

    }



    addCart = (productStr,detailStr) => {
        const product = JSON.parse(productStr);
        const detail = JSON.parse(detailStr);
        let addCartModel = new AddCartModel();
        addCartModel.requestProductDetail(product.prodCode, (productIsPromotionPrice) => {
            this.SelectionPage.show(addCartModel, (amount, skuCode) => {
                const { prodCode, name, originalPrice } = addCartModel;
                shopCartCacheTool.addGoodItem({
                    'amount': amount,
                    'skuCode': skuCode,
                    'productCode': product.prodCode
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
                    <ShowAttentionView style={{ flex: 1 }}
                                       uri={this.props.uri}
                                       ref={(ref) => {
                                           this.RecommendShowList = ref;
                                       }}
                                       isLogin={!EmptyUtils.isEmpty(user.token)}
                                       onCollection={({nativeEvent})=>{
                                           if (!user.isLogin) {
                                               routeNavigate(RouterMap.LoginPage);
                                               return;
                                           }
                                           if (!nativeEvent.detail.collect) {
                                               ShowApi.reduceCountByType({
                                                   showNo: nativeEvent.detail.showNo,
                                                   type: 2
                                               });
                                           } else {
                                               ShowApi.incrCountByType({ showNo: nativeEvent.detail.showNo, type: 2 });
                                           }
                                       }}
                                       onSeeUser={({nativeEvent})=>{
                                           let userNo = nativeEvent.userInfoVO.userNo;
                                           if(user.code === userNo){
                                               routeNavigate(RouterMap.MyDynamicPage, { userType: WhiteModel.userStatus === 2 ? 'mineWriter' : 'mineNormal' });
                                           }else {
                                               routeNavigate(RouterMap.MyDynamicPage,{userType:'others',userInfo:nativeEvent.userInfoVO});
                                           }
                                       }}
                                       onItemPress={({ nativeEvent }) => {
                                           const { showNo , userInfoVO } = nativeEvent;
                                           const { userNo } = userInfoVO || {};
                                           const { navigate } = this.props;
                                           let params = {
                                               data: nativeEvent,
                                               ref: this.RecommendShowList,
                                               index: nativeEvent.index,
                                               code:showNo
                                           };
                                           if (nativeEvent.showType === 1) {
                                               navigate(RouterMap.ShowDetailPage, params);
                                           }  else if(nativeEvent.showType === 3){
                                               navigate(RouterMap.ShowVideoPage, {code:showNo});
                                           }else {
                                               navigate(RouterMap.ShowRichTextDetailPage, params);
                                           }

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
                                           this.addCart(nativeEvent.product,nativeEvent.detail);
                                       }}

                                       onPressProduct={({ nativeEvent }) => {
                                           const detail = JSON.parse(nativeEvent.detail)
                                           const product = JSON.parse(nativeEvent.product)
                                           const {showNo} = detail || {};
                                           track(trackEvent.XiuChangSpuClick, {
                                               xiuChangBtnLocation:'1',
                                               xiuChangListType:'1',
                                               articleCode:showNo,
                                               spuCode: product.prodCode,
                                               spuName: product.name,
                                               author: detail.userInfoVO ? detail.userInfoVO.userNo : ''
                                           });
                                           routePush(RouterMap.ProductDetailPage, { productCode: product.prodCode ,trackType:3,trackCode:showNo,sgscm:`2.${showNo}.none.none`});
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
                                           let callback = ()=>{
                                               detail.downloadCount += 1;
                                               ShowApi.incrCountByType({
                                                   showNo: nativeEvent.detail.showNo,
                                                   type: 4
                                               });
                                               this.RecommendShowList && this.RecommendShowList.replaceItemData(nativeEvent.index, JSON.stringify(detail));
                                               this.props.onShare(nativeEvent,true);

                                               const { showNo , userInfoVO } = detail;
                                               const { userNo } = userInfoVO || {};
                                               track(trackEvent.XiuChangDownLoadClick,{
                                                   xiuChangBtnLocation:'1',
                                                   xiuChangListType:'1',
                                                   articleCode:showNo,
                                                   author:userNo
                                               })
                                           }
                                           DownloadUtils.downloadShow(detail,callback);
                                       }}

                                       onSharePress={({ nativeEvent }) => {
                                           this.props.onShare(nativeEvent,false);
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
