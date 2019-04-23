import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MRText as Text } from '../../../components/ui/index';
import BasePage from '../../../BasePage';
import XpDetailProductView from './components/XpDetailProductView';
import XpDetailSelectListView from './components/XpDetailSelectListView';
import XpDetailBottomView from './components/XpDetailBottomView';
import XpDetailUpSelectListView from './components/XpDetailUpSelectListView';
import XpDetailParamsModal from './components/XpDetailParamsModal';
import XpDetailActivityInfoModal from './components/XpDetailActivityInfoModal';
import XpDetailModel from './XpDetailModel';
import { observer } from 'mobx-react';
import DesignRule from '../../../constants/DesignRule';
import productRes from '../res/product';
import { PageLoadingState, renderViewByLoadingState } from '../../../components/pageDecorator/PageState';
import ScreenUtils from '../../../utils/ScreenUtils';
import HTML from 'react-native-render-html';
import SelectionPage from '../SelectionPage';
import shopCartCacheTool from '../../shopCart/model/ShopCartCacheTool';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import DetailNavShowModal from '../components/DetailNavShowModal';
import user from '../../../model/user';
import RouterMap from '../../../navigation/RouterMap';
import DetailHeaderScoreView from '../components/DetailHeaderScoreView';
import apiEnvironment from '../../../api/ApiEnvironment';
import CommShareModal from '../../../comm/components/CommShareModal';
import { beginChatType, QYChatTool } from '../../../utils/QYModule/QYChatTool';
import Manager, { AdViewBindModal } from '../../../components/web/WebModalManager';
import LuckyIcon from '../../guide/LuckyIcon';
import { homeType } from '../../home/HomeTypes';

const { arrow_right_black } = productRes.button;
const { detail_more_down } = productRes.detailNavView;
const { xp_detail_icon } = productRes.xpProduct;

@observer
export class XpDetailPage extends BasePage {

    xpDetailModel = new XpDetailModel();
    manager = new Manager();
    AdModal = observer(AdViewBindModal(this.manager))

    $navigationBarOptions = {
        title: '经验值专区'
    };

    $NavBarRenderRightItem = () => {
        return <TouchableOpacity style={styles.rightNavBtn} onPress={this._rightPressed}>
            <Image source={detail_more_down}/>
            {this.xpDetailModel.messageCount === 0 ? null : <View style={styles.rightNavMessage}/>}
        </TouchableOpacity>;
    };

    _rightPressed = () => {
        this.DetailNavShowModal.show(this.xpDetailModel.messageCount, (item) => {
            switch (item.type) {
                case 0:
                    if (!user.isLogin) {
                        this.$navigate(RouterMap.LoginPage);
                        return;
                    }
                    this.$navigate('message/MessageCenterPage');
                    break;
                case 1:
                    this.$navigate('home/search/SearchPage');
                    break;
                case 2:
                    this.shareModal && this.shareModal.open();
                    break;
                case 4:
                    this.$navigateBackToHome();
                    break;
            }
        }, 2);
    };

    _getBasePageStateOptions = () => {
        return {
            loadingState: this.xpDetailModel.basePageState,
            netFailedProps: {
                buttonText: '重新加载',
                netFailedInfo: this.xpDetailModel.basePageError,
                reloadBtnClick: this._request_act_exp_detail
            }
        };
    };

    _getProductStateOptions = () => {
        return {
            loadingState: this.xpDetailModel.productPageState,
            netFailedProps: {
                buttonText: '重新加载',
                netFailedInfo: this.xpDetailModel.productPageError,
                reloadBtnClick: this.xpDetailModel.request_getProductDetailByCode
            }
        };
    };

    componentDidMount() {
        this._request_act_exp_detail();
        if (user.isLogin) {
            this.xpDetailModel.getMessageCount();
        }
    }

    _request_act_exp_detail = () => {
        const { activityCode, productCode } = this.params;
        this.xpDetailModel.request_act_exp_detail(activityCode, productCode);
        //浮动弹窗、返回弹框请求接口
        this.luckyIcon&&this.luckyIcon.getLucky(3,activityCode)
        this.manager.getAd(3,activityCode,homeType.Alert)
    };

    _imgBtnAction = () => {
        this.$navigate(RouterMap.BigImagesPage, { pData: this.xpDetailModel.pData });
    };

    /*活动信息*/
    _activityAction = () => {
        this.XpDetailActivityInfoModal.show(this.xpDetailModel);
    };

    /*产品参数*/
    _paramsAction = () => {
        this.XpDetailParamsModal.show(this.xpDetailModel);
    };

    /*加入购物车 立即购买*/
    _bottomViewAction = (type) => {
        if (type === 'goGwc') {
            this.$navigate('shopCart/ShopCart', {
                hiddeLeft: false
            });
        } else if (type === 'keFu') {
            track(trackEvent.ClickOnlineCustomerService, { customerServiceModuleSource: 2 });
            if (!user.isLogin) {
                this.$navigate('login/login/LoginPage');
                return;
            }
            const { pData } = this.xpDetailModel;
            const { shopId, title, name, secondName, imgUrl, prodCode, minPrice, maxPrice } = pData || {};
            QYChatTool.beginQYChat({
                shopId: shopId,
                title: title,
                chatType: beginChatType.BEGIN_FROM_PRODUCT,
                data: {
                    title: name,
                    desc: secondName,
                    pictureUrlString: imgUrl,
                    urlString: `${apiEnvironment.getCurrentH5Url()}/product/99/${prodCode}`,
                    note: minPrice !== maxPrice ? `￥${minPrice}-￥${maxPrice}` : `￥${minPrice}`
                }
            });
        } else {
            if (!user.isLogin) {
                this.$navigate(RouterMap.LoginPage);
                return;
            }
            this.goType = type;
            this.SelectionPage.show(this.xpDetailModel.pData, this._selectionViewConfirm, { needUpdate: true });
        }
    };

    /*选择规格确认*/
    _selectionViewConfirm = (amount, skuCode) => {
        let orderProducts = [];
        if (this.goType === 'joinCart') {
            let temp = {
                'amount': amount,
                'skuCode': skuCode,
                'productCode': this.xpDetailModel.selectedSpuCode,
                activityCode: this.params.activityCode,
            };
            shopCartCacheTool.addGoodItem(temp);

            /*加入购物车埋点*/
            const { prodCode, name, originalPrice } = this.xpDetailModel.pData;
            track(trackEvent.AddToShoppingcart, {
                spuCode: prodCode,
                skuCode: skuCode,
                spuName: name,
                pricePerCommodity: originalPrice,
                spuAmount: amount,
                shoppingcartEntrance: 4
            });
        } else if (this.goType === 'buy') {
            //订单延签卡  加个菊花
            orderProducts.push({
                skuCode: skuCode,
                quantity: amount,
                productCode: this.xpDetailModel.selectedSpuCode
            });
            this.$navigate('order/order/ConfirOrderPage', {
                orderParamVO: {
                    orderType: 98,
                    orderProducts: orderProducts,
                    source: 3
                }
            });
        }
    };

    _onScroll = (event) => {
        let Y = event.nativeEvent.contentOffset.y;
        if (Y < 100) {
            this.xpDetailModel.showUpSelectList = false;
        } else {
            this.xpDetailModel.showUpSelectList = true;
        }
    };

    _renderProduct = () => {
        const { pParamList, pData } = this.xpDetailModel;
        return <View>
            {/*商品信息*/}
            <XpDetailProductView xpDetailModel={this.xpDetailModel} imgBtnAction={this._imgBtnAction}/>
            <View style={styles.productPramsView}>
                <TouchableOpacity style={styles.pramsBtn} onPress={this._activityAction}>
                    <Text style={styles.pramsText}>活动规则</Text>
                    <Image style={styles.arrowImg} source={arrow_right_black}/>
                </TouchableOpacity>
                {
                    pParamList.length !== 0 ? <View>
                        <View style={styles.lineView}/>
                        <TouchableOpacity style={styles.pramsBtn} onPress={this._paramsAction}>
                            <Text style={styles.pramsText}>参数信息</Text>
                            <Image style={styles.arrowImg} source={arrow_right_black}/>
                        </TouchableOpacity>
                    </View> : null
                }
            </View>
            <DetailHeaderScoreView style={{ marginTop: 10, marginBottom: 0 }} pData={pData}
                                   navigation={this.props.navigation}/>
            <View style={styles.productInfoView}>
                <View style={styles.infoTextView}>
                    <Text style={styles.pramsText}>商品信息</Text>
                </View>
                {/*图片详情*/}
                <HTML html={this.xpDetailModel.pHtml}
                      imagesMaxWidth={ScreenUtils.width}
                      imagesInitialDimensions={{ width: ScreenUtils.width, height: 0 }}
                      containerStyle={{ backgroundColor: '#fff' }}/>
            </View>
        </View>;
    };

    _renderBaseView = () => {
        const { status, prods } = this.xpDetailModel;
        if (status !== 2 || prods.length === 0) {
            let textShow = status === 1 ? '活动尚未开始，尽请期待~' : (status === 3 ? '活动已结束，下次再来哦~' : '商品已走丢，暂无活动商品~');
            return <View style={styles.statusNoAccessView}>
                <Image source={xp_detail_icon}/>
                <Text style={styles.statusNoAccessText}>{textShow}</Text>
            </View>;
        } else {
            let pageStateDic = this._getProductStateOptions();
            return <View style={styles.container}>
                <ScrollView onScroll={this._onScroll} scrollEventThrottle={10} showsVerticalScrollIndicator={false}>
                    {/*选择框*/}
                    <XpDetailSelectListView xpDetailModel={this.xpDetailModel}/>
                    {/*页面状态*/}
                    {pageStateDic.loadingState === PageLoadingState.success ? this._renderProduct() :
                        <View style={{ height: ScreenUtils.autoSizeHeight(500) }}>
                            {renderViewByLoadingState(pageStateDic, this._renderProduct)}
                        </View>}
                </ScrollView>

                {/*购买,购物车*/}
                {pageStateDic.loadingState === PageLoadingState.success &&
                <XpDetailBottomView bottomViewAction={this._bottomViewAction} xpDetailModel={this.xpDetailModel}/>}

                {/*上拉显示的选择框*/}
                <XpDetailUpSelectListView xpDetailModel={this.xpDetailModel}/>
            </View>;
        }
    };

    _render() {
        const { activityCode } = this.params;
        const { bannerUrl } = this.xpDetailModel;
        let AdModal = this.AdModal;
        return (
            <View style={styles.container}>
                {/*页面状态*/}
                {renderViewByLoadingState(this._getBasePageStateOptions(), this._renderBaseView)}

                {/*modal*/}
                {/*活动信息*/}
                <XpDetailParamsModal ref={(e) => this.XpDetailParamsModal = e}/>
                {/*规格*/}
                <XpDetailActivityInfoModal ref={(e) => this.XpDetailActivityInfoModal = e}/>
                {/*sku选择*/}
                <SelectionPage ref={(ref) => this.SelectionPage = ref}/>
                {/*nav更多跳转*/}
                <DetailNavShowModal ref={(ref) => this.DetailNavShowModal = ref}/>

                <CommShareModal ref={(ref) => this.shareModal = ref}
                                type={'miniProgramWithCopyUrl'}
                                webJson={{
                                    title: `经验值大礼包`,
                                    dec: `快速升级会员等级,更多权益享不停!`,
                                    thumImage: `${bannerUrl}`,
                                    linkUrl: `${apiEnvironment.getCurrentH5Url()}/experience?activityCode=${activityCode}&upuserid=${user.code || ''}`
                                }}
                                miniProgramJson={{
                                    title: `经验值大礼包`,
                                    dec: `快速升级会员等级,更多权益享不停!`,
                                    hdImageURL: `${bannerUrl}`,
                                    thumImage: 'logo.png',
                                    linkUrl: `${apiEnvironment.getCurrentH5Url()}/experience?activityCode=${activityCode}&&upuserid=${user.code || ''}`,
                                    miniProgramPath: `/pages/index/index?type=6&id=${activityCode}&inviteId=${user.code || ''}`
                                }}/>
                <LuckyIcon ref={(ref)=>{this.luckyIcon = ref}}/>
                <AdModal />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    statusNoAccessView: { alignItems: 'center', alignSelf: 'center', marginTop: ScreenUtils.px2dp(130) },

    statusNoAccessText: { fontSize: 13, color: DesignRule.textColor_instruction, marginTop: 8 },

    rightNavBtn: {
        justifyContent: 'center', alignItems: 'center',
        width: 44
    },
    rightNavMessage: {
        position: 'absolute', top: 0, right: 8, height: 8, width: 8, borderRadius: 4,
        backgroundColor: DesignRule.mainColor
    },

    productPramsView: {
        marginTop: 10,
        backgroundColor: DesignRule.white
    },
    pramsBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        height: 44
    },
    pramsText: {
        marginLeft: 15,
        fontSize: 13, color: DesignRule.textColor_mainTitle
    },
    arrowImg: {
        marginRight: 15
    },
    lineView: {
        backgroundColor: DesignRule.lineColor_inWhiteBg,
        height: StyleSheet.hairlineWidth
    },

    productInfoView: {
        marginTop: 10,
        backgroundColor: DesignRule.white
    },
    infoTextView: {
        height: 44, justifyContent: 'center'
    }
});

export default XpDetailPage;
