/**
 * pageType: 0(退款),1(退货退款),2(换货)
 * isEdit: true(编辑申请)，false（提交申请）。当编辑申请的时候，数据都是从接口获取的。
 * productId: 商品id
 *
 */
import React from 'react';
import {
    NativeModules,
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';
import BasePage from '../../../BasePage';
import GoodsItem from '../components/GoodsGrayItem';
//import ExchangeTypeModal from '../../../components/ui/ExchangeTypeModal';
import {
    UIText, UIImage, AddPhotos, TakePhoneModal
} from '../../../components/ui';
import { color } from '../../../constants/Theme';
import BottomSingleSelectModal from '../components/BottomSingleSelectModal';
import StringUtils from '../../../utils/StringUtils';
// import ScreenUtils from '../../../utils/ScreenUtils';
import arrow_right from '../res/arrow_right.png';
// import addressLine from '../res/addressLine.png';
// import AddressItem from '../components/AddressItem';
import AutoExpandingInput from '../../../components/ui/AutoExpandingInput';
import DateUtils from '../../../utils/DateUtils';
import BusinessUtils from '../../mine/components/BusinessUtils';

import OrderApi from '../api/orderApi';
import SelectionPage from '../../home/product/SelectionPage';
import HomeAPI from '../../home/api/HomeAPI';
import EmptyUtils from '../../../utils/EmptyUtils';

class AfterSaleServicePage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            isShowSingleSelctionModal: false,
            isShowTakePhotoModal: false,
            pageType: this.params.pageType ? this.params.pageType : 0, //  0(退款),1(退货退款),2(换货)
            activeProduct: ['', '退回商品需由买家承担运费，请确保不影响商品完好', '仅限更换同款相同价格商品'],
            reason: ['退款原因', '退货原因', '换货原因'],
            inputReason: ['退款说明', '退货说明', '换货说明'],
            productData: {},// 里面包含了商品、订单id、价格等信息
            returnReason: this.params.isEdit === true ? this.params.returnReason : '',                  //退款原因
            remark: this.params.isEdit === true ? this.params.remark : '',                              //退款具体说明
            imageArr: this.params.isEdit === true ? this.params.imgList : [],                           //选择的图片数组
            /** 编辑申请需要的售后详情id*/
            returnProductId: this.params.returnProductId,
            /** 换货需要的数据*/
            selectionData: {}, //规格数据
            exchangePriceId: this.params.exchangePriceId,
            exchangeSpec: this.params.exchangeSpec,
            exchangeSpecImg: this.params.exchangeSpecImg
        };
        this.loadSelectionData = this.loadSelectionData.bind(this);
    }

    componentDidMount() {

        this.loadPageData();
    }

    $navigationBarOptions = {
        title: ['申请退款', '申请退货', '申请换货'][this.params.pageType ? this.params.pageType : 0],
        show: true// false则隐藏导航
    };
    //**********************************ViewPart******************************************
    renderActiveProduct = () => {
        return (this.state.activeProduct[this.params.pageType] === '' ? null :
                <View>
                    <View style={{
                        height: 20,
                        backgroundColor: color.red,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <UIText value={this.state.activeProduct[this.params.pageType]}
                                style={{ fontSize: 13, color: color.white }}/>
                    </View>
                    {this.renderWideLine()}
                </View>
        );
    };
    renderOrderNum = () => {
        return (
            <View style={{ height: 40, backgroundColor: color.white, justifyContent: 'center' }}>
                <UIText value={'订单编号：' + this.state.productData.orderNum}
                        style={{ color: color.black_222, fontSize: 13, marginLeft: 16 }}/>
            </View>
        );
    };
    refundAndExchangeType = () => {
        switch (this.state.pageType) {
            case 0:
                return (
                    <View>
                        {this.renderWideLine()}
                        <View style={{
                            height: 40,
                            backgroundColor: color.white,
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}>
                            <UIText value={'退款金额：'} style={{ color: color.black_222, fontSize: 13, marginLeft: 16 }}/>
                            <UIText value={StringUtils.formatMoneyString(this.state.productData.refundPrice)}
                                    style={{ color: color.red, fontSize: 13 }}/>
                        </View>
                    </View>
                );
                break;
            case 1:
                return (
                    <View>
                        {this.renderWideLine()}
                        <View style={{
                            height: 40,
                            backgroundColor: color.white,
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}>
                            <UIText value={'退款金额：'} style={{ color: color.black_222, fontSize: 13, marginLeft: 16 }}/>
                            <UIText value={StringUtils.formatMoneyString(this.state.productData.refundPrice)}
                                    style={{ color: color.red, fontSize: 13 }}/>
                        </View>
                    </View>
                );
                break;
            case 2:
                return (
                    <View>
                        {this.renderWideLine()}
                        <TouchableOpacity style={{
                            height: 48,
                            backgroundColor: color.white,
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            alignItems: 'center'
                        }} onPress={() => this.exchangeType()}>
                            <UIText value={'更换型号'} style={{ color: color.black_222, fontSize: 13, marginLeft: 16 }}/>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <UIText style={{ color: color.black_222, fontSize: 13, marginRight: 5 }}
                                        value={this.state.exchangeSpec || '请选择'}/>
                                <UIImage source={arrow_right} style={{ height: 10, width: 7, marginRight: 15 }}/>
                            </View>
                        </TouchableOpacity>
                        <View style={{ height: 30, alignItems: 'center', flexDirection: 'row' }}>
                            <UIText value={'*'} style={{ fontSize: 12, color: '#D51243', marginLeft: 15 }}/>
                            <UIText value={'请确保退换商品不影响二次销售'} style={{ fontSize: 12, color: '#999999' }}/>
                        </View>
                        {/*{this.renderWideLine()}*/}
                        {/*<AddressItem*/}
                        {/*name={this.state.pageData.receiverName}*/}
                        {/*phone={this.state.pageData.receiverNum}*/}
                        {/*address={this.state.pageData.receiverAddress}*/}
                        {/*/>*/}
                        {/*<UIImage source={addressLine} style={{ width: ScreenUtils.width, height: 3 }}/>*/}
                    </View>
                );
                break;
        }
    };
    renderOrderTime = () => {
        return (
            <View>
                <View style={{ height: 40, backgroundColor: color.white, justifyContent: 'center' }}>
                    <UIText value={'下单时间：' + DateUtils.getFormatDate(this.state.productData.orderCreateTime / 1000)}
                            style={{ color: color.black_222, fontSize: 13, marginLeft: 16 }}/>
                </View>
                {this.renderWideLine()}
                <TouchableOpacity style={{
                    height: 48,
                    backgroundColor: color.white,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center'
                }} onPress={() => this.showRefundReason()}>
                    <UIText value={this.state.reason[this.state.pageType]}
                            style={{ color: color.black_222, fontSize: 13, marginLeft: 16 }}/>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <UIText style={{
                            color: StringUtils.isNoEmpty(this.state.returnReason) ? color.black_222 : color.gray_c8c,
                            fontSize: 13,
                            marginRight: 5
                        }} value={StringUtils.isNoEmpty(this.state.returnReason) ? this.state.returnReason : '请选择'}/>
                        <UIImage source={arrow_right} style={{ height: 10, width: 7, marginRight: 15 }}/>
                    </View>
                </TouchableOpacity>
                {this.refundAndExchangeType()}
                <View style={{
                    height: 40,
                    backgroundColor: color.page_background,
                    alignItems: 'center',
                    flexDirection: 'row'
                }}>
                    <UIText value={this.state.inputReason[this.state.pageType]}
                            style={{ color: color.black_222, fontSize: 13, marginLeft: 16 }}/>
                </View>
                <View style={{ height: 90, backgroundColor: color.white }}>
                    <AutoExpandingInput
                        style={styles.inputTextStyle}
                        onChangeText={text => this.setState({ remark: text })}
                        defaultValue={this.state.remark}
                        placeholder={'填写说明文字...'}
                        maxLength={180}
                        underlineColorAndroid={'transparent'}
                    />
                    <View style={{
                        position: 'absolute',
                        right: 5,
                        bottom: 11
                    }}>
                        <UIText value={this.state.remark.length + '/180'}
                                style={{ color: color.black_222, fontSize: 13, marginLeft: 16, width: 50 }}/>
                    </View>
                </View>
                <View style={{
                    height: 40,
                    backgroundColor: color.page_background,
                    alignItems: 'center',
                    flexDirection: 'row'
                }}>
                    <UIText value={'上传凭证'} style={{ color: color.black_222, fontSize: 13, marginLeft: 16 }}/>
                </View>
                <View style={{ paddingLeft: 20, paddingRight: 20, marginBottom: 38, backgroundColor: color.white }}>
                    <AddPhotos
                        imageArr={this.state.imageArr}
                        addPic={() => this.addPic()}
                        deletePic={(index) => this.deletePic(index)}
                    />
                </View>
            </View>
        );
    };
    renderWideLine = () => {
        return (
            <View style={{ height: 10, backgroundColor: color.page_background }}/>
        );
    };
    renderGoodsList = () => {
        let productData = this.state.productData;
        return (
            <GoodsItem
                uri={productData.specImg}
                goodsName={productData.productName}
                salePrice={StringUtils.formatMoneyString(productData.price)}
                category={productData.spec}
                goodsNum={productData.num}
                //onPress={() => this.jumpToProductDetailPage(this.params.pageData.productId)}
            />
        );
    }
    ;
    renderCommit = () => {
        return (
            <TouchableOpacity
                style={{ backgroundColor: color.red, justifyContent: 'center', height: 47, alignItems: 'center' }}
                onPress={() => this.commit()}>
                <UIText value={'提交'} style={{ color: color.white, fontSize: 16 }}/>
            </TouchableOpacity>

        );
    };
    renderModal = () => {
        // let productData = this.state.productData;
        let returnReasons = ['多拍/错拍/不想要', '快递/物流一直未收到', '未按约定时间发货', '商品/破损/少件/污渍等', '货物破损已拒签', '假冒品牌/产品', '退运费', '发票问题', '其他'];
        return (
            <View>
                <BottomSingleSelectModal
                    isShow={this.state.isShowSingleSelctionModal}
                    detail={returnReasons}
                    closeWindow={() => {
                        this.setState({ isShowSingleSelctionModal: false });
                    }}
                    commit={(index) => {
                        this.setState({ isShowSingleSelctionModal: false });
                        this.setState({ returnReason: returnReasons[index] });
                    }}
                />
                <TakePhoneModal
                    isShow={this.state.isShowTakePhotoModal}
                    closeWindow={() => {
                        this.setState({ isShowTakePhotoModal: false });
                    }}
                    takePhoto={() => {
                        this.setState({ isShowTakePhotoModal: false });
                    }}
                    selectPhoto={() => {
                        this.setState({ isShowTakePhotoModal: false });
                    }}
                />
                {/*<ExchangeTypeModal*/}
                {/*isShow={this.state.isShowExchangeTypeModal}*/}
                {/*detail={[{ title: '颜色分类', arr: ['金色', '红色', '黑色', '银色'] }, {*/}
                {/*title: '规格',*/}
                {/*arr: ['32G', '64G', '128G', '256G']*/}
                {/*}, { title: '型号', arr: ['大陆', '国外', '港版'] }]}*/}
                {/*closeWindow={() => {*/}
                {/*this.setState({ isShowExchangeTypeModal: false });*/}
                {/*}}*/}
                {/*commit={(data) => {*/}
                {/*this.setState({ isShowExchangeTypeModal: false });*/}
                {/*}}*/}
                {/*/>*/}
                <SelectionPage ref={(ref) => this.SelectionPage = ref}/>
            </View>

        );
    };

    //选择规格确认
    _selectionViewConfirm = (amount, priceId, exchangeSpec, exchangeSpecImg) => {
        this.setState({
            exchangePriceId: priceId,
            exchangeSpec: exchangeSpec,
            exchangeSpecImg: exchangeSpecImg
        });
    };

    _render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    {this.renderActiveProduct()}
                    {this.renderOrderNum()}
                    {this.renderGoodsList()}
                    {this.renderOrderTime()}
                </ScrollView>
                {this.renderCommit()}
                {this.renderModal()}
            </View>
        );
    }

    renderLine = () => {
        return (
            <View style={{ height: 1, backgroundColor: color.line }}/>
        );
    };

    //**********************************BusinessPart******************************************
    showRefundReason = () => {
        this.setState({
            isShowSingleSelctionModal: true
        });
    };
    exchangeType = () => {
        if (EmptyUtils.isEmpty(this.state.selectionData)) {
            this.loadSelectionData();
        } else {
            this.SelectionPage.show(this.state.selectionData, this._selectionViewConfirm, {
                afterAmount: this.state.productData.num,
                afterPrice: this.state.productData.price,
                type: 'after',
                productPriceId: this.state.productData.productPriceId,
            });
        }
    };

    loadPageData() {
        let that = this;
        OrderApi.subOrderLookDetial({ orderProductId: this.params.orderProductId }).then((result) => {
            that.setState({ productData: result.data });
        }).catch(error => {

        });
    }

    /**
     * 获取规格的数据
     */
    loadSelectionData() {
        this.$loadingShow();
        HomeAPI.getProductSpec({
            id: this.params.productId
        }).then((data) => {
            this.$loadingDismiss();
            data.data = data.data || {};
            this.setState({
                selectionData: data.data
            }, () => {
                this.SelectionPage.show(this.state.selectionData, this._selectionViewConfirm, {
                    afterAmount: this.state.productData.num,
                    afterPrice: this.state.productData.price,
                    type: 'after'
                });
            });
        }).catch((data) => {
            this.$loadingDismiss();
            this.$toastShow(data.msg);
        });
    }

    commit = () => {
        let imgList = [];
        for (let i = 0; i < this.state.imageArr.length; i++) {
            // if (i = 0) {
            //     imgUrls = this.state.imageArr[i].imageUrl;
            //     smallImgUrls = this.state.imageArr[i].imageThumbUrl;
            // } else {
            //     imgUrls = ',' + this.state.imageArr[i].imageUrl;
            //     smallImgUrls = ',' + this.state.imageArr[i].imageThumbUrl;
            // }
            let smallImg = this.state.imageArr[i].smallImg || this.state.imageArr[i].imageThumbUrl;
            let originalImg = this.state.imageArr[i].originalImg || this.state.imageArr[i].imageUrl;
            imgList.push({ originalImg, smallImg });
        }
        const params = {
            imgList: imgList,
            orderProductId: this.params.orderProductId,
            remark: this.state.remark,
            returnReason: this.state.returnReason
        };
        if (params.remark.length > 180) {
            NativeModules.commModule.toast('输入的说明文字超出了180个');
            return;
        }
        if (StringUtils.isEmpty(params.returnReason) && this.state.pageType === 2) {
            NativeModules.commModule.toast('请填写原因');
            return;
        }
        // if (StringUtils.isEmpty(imgList)) {
        //     NativeModules.commModule.toast('请上传照片');
        //     return;
        // }
        if (this.params.isEdit) {
            params.returnProductId = this.state.returnProductId;
        }
        /** 修改申请*/
        if (this.params.isEdit) {
            if (this.params.pageType === 2) {
                params.exchangePriceId = this.state.exchangePriceId;
                params.exchangeSpec = this.state.exchangeSpec;
                params.exchangeSpecImg = this.state.exchangeSpecImg;
            }
            OrderApi.updateApply(params).then((response) => {
                this.$loadingDismiss();
                this.params.callBack && this.params.callBack();
                this.$navigateBack();

            }).catch(e => {
                this.$loadingDismiss();
                this.$toastShow(e.msg);
            });
            return;
        }
        /** 提交申请、提交申请成功要通知订单刷新*/
        switch (this.params.pageType) {
            /*
            todo 后端返回不规范
            * {
             "code": 200,
             "msg": "已在退款申请中，不能重复申请！",
             "data": null
             }
            * */

            case 0:
                this.$loadingShow();
                OrderApi.applyRefund(params).then((response) => {
                    this.$loadingDismiss();
                    DeviceEventEmitter.emit('OrderNeedRefresh');
                    this.$navigate('order/afterSaleService/ExchangeGoodsDetailPage', {
                        returnProductId: response.data.id,
                        pageType: 0
                    });

                }).catch(e => {
                    this.$loadingDismiss();
                    this.$toastShow(e.msg);
                });
                break;
            case 1:
                this.$loadingShow();
                OrderApi.applyReturnGoods(params).then((response) => {
                    this.$loadingDismiss();
                    DeviceEventEmitter.emit('OrderNeedRefresh');
                    this.$navigate('order/afterSaleService/ExchangeGoodsDetailPage', {
                        returnProductId: response.data.id,
                        pageType: 1
                    });
                }).catch(e => {
                    this.$loadingDismiss();
                    this.$toastShow(e.msg);
                });
                break;
            case 2:
                params.exchangePriceId = this.state.exchangePriceId;
                params.exchangeSpec = this.state.exchangeSpec;
                params.exchangeSpecImg = this.state.exchangeSpecImg;
                this.$loadingShow();
                OrderApi.applyExchangeGoods(params).then((response) => {
                    this.$loadingDismiss();
                    DeviceEventEmitter.emit('OrderNeedRefresh');
                    this.$navigate('order/afterSaleService/ExchangeGoodsDetailPage', {
                        returnProductId: response.data.id,
                        pageType: 2
                    });
                }).catch(e => {
                    this.$loadingDismiss();
                    this.$toastShow(e.msg);
                });
                break;
        }

    };
    jumpToProductDetailPage = (productId) => {
        this.navigate('product/ProductDetailPage', { productId: productId });
    };
    addPic = () => {
        let imageArr = this.state.imageArr;
        if (imageArr.length === 3) {
            NativeModules.commModule.toast('已经勾选三张了');
            return;
        }
        BusinessUtils.getImagePicker(callback => {
            imageArr.push({ imageUrl: callback.imageUrl, imageThumbUrl: callback.imageThumbUrl });
            this.setState({ imageArr: imageArr });
        });
    };
    deletePic = (index) => {
        let imageArr = [];
        for (let i = 0; i < this.state.imageArr.length; i++) {
            if (i !== index) {
                imageArr.push(this.state.imageArr[i]);
            }
        }
        this.setState({ imageArr: imageArr });
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.page_background,
        justifyContent: 'flex-end'
    }, inputTextStyle: {
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: 'white',
        fontSize: 14

    }
});

export default AfterSaleServicePage;
