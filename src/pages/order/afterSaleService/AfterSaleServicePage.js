import React from 'react';
import {
    NativeModules,
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import BasePage from '../../../BasePage';
import GoodsItem from '../components/GoodsItem';
import ExchangeTypeModal from '../../../components/ui/ExchangeTypeModal';
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
// import Toast from '../../../utils/bridge';

// import OrderApi from 'OrderApi'

class AfterSaleServicePage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            pwd: '',
            thirdType: 1,
            passwordDis: false,
            phoneError: false,
            passwordError: false,
            refundsDescription: '',
            hasInputNum: 0,
            isShowSingleSelctionModal: false,
            isShowTakePhotoModal: false,
            isShowExchangeTypeModal: false,
            /*
            * pageType:
            * 0 :AfterSaleServicePage:'售后服务',   =========》退款
            * 1 :appleForRefundPage:'申请退款',     =========》退货退款
            * 2 :appleForExchangeGoods:'申请换货',   =========》换货
            *
            * 3 :AfterSaleServicePage:'售后服务',   =========》全退(1.0版本不用)
            * */
            pageType: this.params.pageType ? this.params.pageType : 0,
            pageTitle: ['申请退款', '售后服务', '申请换货'],
            activeProduct: ['', '退回商品需由买家承担运费，请确保不影响商品完好', '活动产品，不支持单个产品退款'],
            reason: ['退款原因', '退款原因', '换货原因'],
            inputReason: ['退款说明', '退款说明', '换货说明'],
            actualReason: '',
            imageArr: [
                // {
                //     imageUrl:'https://ws1.sinaimg.cn/large/006tNc79gy1fsys3wvijdj30iu0iu7k3.jpg',
                //     imageThumbUrl:'https://ws1.sinaimg.cn/large/006tNc79gy1fsys3wvijdj30iu0iu7k3.jpg'
                // },
            ],
            index: this.params.index ? this.params.index : 0,
            pageData: this.params.pageData ? this.params.pageData : {},
            hasApply: false
        };
    }

    $navigationBarOptions = {
        title: ['申请退款', '售后服务', '申请换货'][this.params.pageType ? this.params.pageType : 0],
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
                <UIText value={'订单编号：' + this.params.pageData.orderNum}
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
                            <UIText value={StringUtils.formatMoneyString(this.params.pageData.goodsPrice)}
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
                            <UIText value={StringUtils.formatMoneyString(this.params.pageData.goodsPrice)}
                                    style={{ color: color.red, fontSize: 13 }}/>
                        </View>
                    </View>
                );
                break;
            case 2:
                return (
                    <View>
                        {this.renderWideLine()}
                        <TouchableOpacity style={{height:48,backgroundColor:color.white,justifyContent:'space-between',flexDirection:'row',alignItems:'center'}} onPress={()=>this.exchangeType()}>
                        <UIText value={'更换型号'} style={{color:color.black_222,fontSize:13,marginLeft:16}}/>
                        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                        <UIText style={{color:color.black_222,fontSize:13,marginRight:5}} value={'红色 X'}/>
                        <UIImage source={arrow_right} style={{height:10,width:7,marginRight:15}}/>
                        </View>
                        </TouchableOpacity>
                        <View style = {{height: 30, alignItems: 'center', flexDirection: 'row'}}>
                            <UIText value = {'*'} style = {{fontSize: 12, color: '#D51243', marginLeft: 15}}/>
                            <UIText value = {'请确保退换商品不影响二次销售'} style = {{fontSize: 12, color: '#999999'}}/>
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
                    <UIText value={'下单时间：' + DateUtils.getFormatDate(this.params.pageData.createTime / 1000)}
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
                            color: StringUtils.isNoEmpty(this.state.actualReason) ? color.black_222 : color.gray_c8c,
                            fontSize: 13,
                            marginRight: 5
                        }} value={StringUtils.isNoEmpty(this.state.actualReason) ? this.state.actualReason : '请选择'}/>
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
                        onChangeText={text => this.setState({ refundsDescription: text, hasInputNum: text.length })}
                        placeholder={'填写说明文字...'}
                        maxLength={100}
                        underlineColorAndroid={'transparent'}
                    />
                    <View style={{
                        position: 'absolute',
                        right: 5,
                        bottom: 11
                    }}>
                        <UIText value={this.state.hasInputNum + '/100'}
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
        let itemArr = [];
        // for (let i = 0; i < this.params.pageData.list.length; i++) {
        itemArr.push(
            <GoodsItem
                uri={this.params.pageData.list[this.params.index].uri}
                goodsName={this.params.pageData.list[this.params.index].goodsName}
                salePrice={StringUtils.formatMoneyString(this.params.pageData.list[this.params.index].salePrice)}
                category={this.params.pageData.list[this.params.index].category}
                goodsNum={this.params.pageData.list[this.params.index].goodsNum}
                onPress={() => this.jumpToProductDetailPage(this.params.pageData.productId)}
            />
        );
        // }
        return itemArr;
    };
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
        return (
            <View>
                <BottomSingleSelectModal
                    isShow={this.state.isShowSingleSelctionModal}
                    detail={['不喜欢/不想要了', '空包裹', '快递/物流一直未送到', '货物破损已拒签']}
                    closeWindow={() => {
                        this.setState({ isShowSingleSelctionModal: false });
                    }}
                    commit={(index) => {
                        this.setState({ isShowSingleSelctionModal: false });
                        this.setState({ actualReason: ['不喜欢/不想要了', '空包裹', '快递/物流一直未送到', '货物破损已拒签'][index] });
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
                <ExchangeTypeModal
                    isShow={this.state.isShowExchangeTypeModal}
                    detail={[{ title: '颜色分类', arr: ['金色', '红色', '黑色', '银色'] }, {
                        title: '规格',
                        arr: ['32G', '64G', '128G', '256G']
                    }, { title: '型号', arr: ['大陆', '国外', '港版'] }]}
                    closeWindow={() => {
                        this.setState({ isShowExchangeTypeModal: false });
                    }}
                    commit={(data) => {
                        this.setState({ isShowExchangeTypeModal: false });
                    }}
                />
            </View>

        );
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
    };

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
        this.setState({ isShowExchangeTypeModal: true });
    };

    loadPageData() {

    }

    commit = () => {
        if (this.state.hasApply) {
            NativeModules.commModule.toast('您已申请,请勿重复提交');
            return;
        }
        let imgUrls = '';
        let smallImgUrls = '';
        for (let i = 0; i < this.state.imageArr.length; i++) {
            if (i = 0) {
                imgUrls = this.state.imageArr[i].imageUrl;
                smallImgUrls = this.state.imageArr[i].imageThumbUrl;
            } else {
                imgUrls = ',' + this.state.imageArr[i].imageUrl;
                smallImgUrls = ',' + this.state.imageArr[i].imageThumbUrl;
            }
        }
        const params = {
            imgUrls: imgUrls,
            orderProductId: this.params.pageData.list[this.params.index].id,
            remark: this.state.refundsDescription,
            returnReason: this.state.actualReason,
            smallImgUrls: smallImgUrls
        };
        if (StringUtils.isEmpty(params.remark)) {
            NativeModules.commModule.toast('请选择说明');
            return;
        }
        if (StringUtils.isEmpty(params.returnReason) && this.state.pageType === 2) {
            NativeModules.commModule.toast('请填写原因');
            return;
        }
        if (StringUtils.isEmpty(params.imgUrls)) {
            NativeModules.commModule.toast('请上传照片');
            return;
        }
        /*
         * pageType:
         * 0 :AfterSaleServicePage:'售后服务',   =========》退款
         * 1 :appleForRefundPage:'申请退款',     =========》退货退款
         * 2 :appleForExchangeGoods:'申请换货',   =========》换货
         *
         * 3 :AfterSaleServicePage:'售后服务',   =========》全退(1.0版本不用)
         * */
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
                // Toast.showLoading();
                // OrderApi.orderRefund(params).then((response) => {
                //     //{"code":200,"msg":"退款成功","data":{"returnProductId":242},"ok":true}
                //     Toast.hiddenLoading();
                //     if (response.ok) {
                //         if (response.data && !response.data.returnProductId) {
                //             NativeModules.commModule.toast(response.msg + '');
                //             return;
                //         }
                //         if (this.params.refleshOrderDetail) {
                //             this.params.refleshOrderDetail();
                //         }
                //         this.navigate('order/afterSaleService/ApplyRefundNextPage', {
                //             returnProductId: response.data.returnProductId,
                //             pageType: 0,
                //             pageData: this.state.pageData,
                //             index: this.state.index,
                //             returnProductStatus: 4
                //         });
                //     } else {
                //         NativeModules.commModule.toast(response.msg);
                //     }
                // }).catch(e => {
                //     Toast.hiddenLoading();
                // });
                break;
            case 1:
                // Toast.showLoading();
                // OrderApi.applyReturnGoods(params).then((response) => {
                //     //{"code":200,"msg":"退货退款申请提交成功，请在7天内填写退回的信息！","data":{"returnProductId":248},"ok":true}
                //     Toast.hiddenLoading();
                //     if (response.ok) {
                //         if (!response.data.returnProductId) {
                //             NativeModules.commModule.toast(response.msg + '');
                //             return;
                //         }
                //         if (this.params.refleshOrderDetail) {
                //             this.params.refleshOrderDetail();
                //         }
                //         this.navigate('order/afterSaleService/ApplyRefundNextPage', {
                //             returnProductId: response.data.returnProductId,
                //             pageType: 0,
                //             pageData: this.state.pageData,
                //             index: this.state.index,
                //             returnProductStatus: 3
                //         });
                //     } else {
                //         NativeModules.commModule.toast(response.msg);
                //     }
                // }).catch(e => {
                //     Toast.hiddenLoading();
                // });
                break;
            case 2:
                // Toast.showLoading();
                // OrderApi.applyExchangeProduct(params).then((response) => {
                //     Toast.hiddenLoading();
                //     if (response.ok && typeof response.data ==== 'object') {
                //         if (StringUtils.isEmpty(response.data) || !response.data.returnProductId) {
                //             NativeModules.commModule.toast(response.msg + '');
                //             return;
                //         }
                //         if (this.params.refleshOrderDetail) {
                //             this.params.refleshOrderDetail();
                //         }
                //         this.navigate('order/afterSaleService/ApplyRefundNextPage', {
                //             returnProductId: response.data.returnProductId,
                //             pageType: 0,
                //             pageData: this.state.pageData,
                //             index: this.state.index,
                //             returnProductStatus: 3
                //         });
                //     } else {
                //         NativeModules.commModule.toast(response.msg + '');
                //     }
                // }).catch(e => {
                //     Toast.hiddenLoading();
                // });
                break;
        }
        this.setState({ hasApply: true });
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
