import React from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    KeyboardAvoidingView,
    Image
} from 'react-native';
import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import GoodsItem from '../components/confirmOrder/GoodsItem';
import { confirmOrderModel } from '../model/ConfirmOrderModel';
import { observer } from 'mobx-react';
import BasePage from '../../../BasePage';
import DesignRule from '../../../constants/DesignRule';
import ConfirmAddressView from '../components/confirmOrder/ConfirmAddressView';
import ConfirmPriceView from '../components/confirmOrder/ConfirmPriceView';
import ConfirmBottomView from '../components/confirmOrder/ConfirmBottomView';
// import { renderViewByLoadingState } from '../../../components/pageDecorator/PageState';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import SelectOneTicketModel from '../components/confirmOrder/SelectOneTicketModel';
import SelectTicketModel from '../components/confirmOrder/SelectTicketModel';
import { MRText } from '../../../components/ui';
import RouterMap from '../../../navigation/RouterMap';
import res from '../res';
import ActivateTicketView from '../components/confirmOrder/ActivateTicketView';
const step_header = res.step_header;

@observer
export default class ConfirmOrderPage extends BasePage {
    constructor(props) {
        super(props);
        // this.params.orderParamVO = {orderProducts: [{ skuCode: 'SKU000000890001', //string 平台skuCode
        //                                 quantity: 1, //int 购买数量
        //         activityCode: '', //string 活动code
        //         batchNo: 1}],source : 1}
        confirmOrderModel.clearData();
        confirmOrderModel.orderParamVO = this.params.orderParamVO;
        confirmOrderModel.judgeIsAllVirtual(this.params.orderParamVO.orderProducts);
    }

    $navigationBarOptions = {
        title: '提交订单',
        show: true // false则隐藏导航
    };

    renderFailProductList(){
        if (confirmOrderModel.failProductList.length  == 0){
            return null;
        }

        return(
            <View style={styles.block}>
                {
                    confirmOrderModel.failProductList.length > 0 ?
                        <View style={{
                            backgroundColor: 'white',
                            paddingLeft: 15,
                            height: 36,
                            justifyContent: 'center',
                            marginTop: 5,
                            borderBottomWidth: 1,
                            borderBottomColor: DesignRule.lineColor_inWhiteBg
                        }}>
                            <MRText style={{
                                fontSize: 12,
                                color: '#333333'}}>
                                失效商品
                            </MRText>
                        </View> : null
                }

                {
                    confirmOrderModel.failProductList.length > 0 ?
                        confirmOrderModel.failProductList.map((item, index) => {
                            return <GoodsItem
                                key={'failProductList'+index}
                                uri={item.specImg}
                                activityCodes={item.failReason?[item.failReason]:[]}
                                goodsName={item.productName}
                                salePrice={item.unitPrice}
                                category={item.spec}
                                goodsNum={'x' + item.quantity}
                                onPress={() => {
                                }}
                                failProduct={true}
                            />
                        })  : null
                }
            </View>
        )
    }
    //**********************************ViewPart******************************************
    _renderContent = () => {
        return (
            <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: ScreenUtils.safeBottom }}>
                <ScrollView
                    ref={(e) => this.listView = e}
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}>
                    {this.renderHeaderImage()}
                    {
                        !confirmOrderModel.isAllVirtual ?  <ConfirmAddressView selectAddress={() => this.selectAddress()}/> : null
                    }
                    {this.renderGroupSponsor()}
                    <View style={styles.block}>
                    {
                        confirmOrderModel.productOrderList.map((item, index) => {
                            return this._renderItem(item, index)
                        })
                    }
                    </View>
                    {this.renderFailProductList()}
                    <KeyboardAvoidingView>
                        <ConfirmPriceView
                            jumpToCouponsPage={(params) => this.jumpToCouponsPage(params)}
                            inputFocus={() => {
                            }}/>
                    </KeyboardAvoidingView>
                    <ActivateTicketView />
                </ScrollView>
                <ConfirmBottomView commitOrder={() => this.commitOrder()}/>
                <SelectOneTicketModel ref={(ref)=>{this.oneTicketModel = ref}}/>
                <SelectTicketModel ref={(ref)=>{this.ticketModel = ref}} />
            </View>
        );
    };

    _renderItem = (item, index) => {
        return (<GoodsItem
            key={index}
            uri={item.specImg}
            activityCodes={item.activityList || []}
            goodsName={item.productName}
            salePrice={StringUtils.formatMoneyString(item.unitPrice)}
            category={item.spec}
            goodsNum={'x' + item.quantity}
            onPress={() => {
            }}
        />);
    };

    /**
     * 渲染顶部图片
     */
    renderHeaderImage(){
        if (this.params.orderParamVO.bizTag !== 'group') {return null}
        return(
            <View style={{backgroundColor: 'white', marginBottom: 1}}>
                <Image source={step_header}
                       style={{width: ScreenUtils.autoSizeWidth(280),
                           marginLeft: ScreenUtils.autoSizeWidth(47.5),
                           height:  ScreenUtils.autoSizeWidth(83.5),
                           marginTop: ScreenUtils.autoSizeWidth(10),
                       }}/>
                <View style={{flexDirection: 'row', marginTop: 3}}>
                    <MRText style={styles.text}>选择商品开团/参团</MRText>
                    <MRText style={[styles.text,{marginLeft: ScreenUtils.autoSizeWidth(10)}]}>邀请好友参团</MRText>
                    <MRText style={[styles.text,{marginLeft: ScreenUtils.autoSizeWidth(10)}]}>人满成团</MRText>
                </View>
            </View>
        )

    }

    renderGroupSponsor(){
        if (this.params.orderParamVO.bizTag !== 'group') {return null}
        let groupData = this.params.orderParamVO.groupData || {}
        if (!groupData.isSponsor) {
            return(
                <View style={{backgroundColor: 'white', marginBottom: 1, justifyContent: 'center', height: ScreenUtils.autoSizeWidth(40), paddingLeft: ScreenUtils.autoSizeWidth(15)}}>
                    <MRText style={{fontSize: ScreenUtils.autoSizeWidth(13), color: DesignRule.textColor_instruction}}>{'团长:'+ (groupData.sponsor|| '')}</MRText>
                </View>
            )
        }
        return null
    }

    componentWillUnmount() {
        confirmOrderModel.clearData();
    }

    _render() {
        return (
            <View style={styles.container}>
                {this._renderContent()}
            </View>
        );
    }

    componentDidMount() {
        this.loadPageData(this.params.orderParamVO.couponsId);
    }

    loadPageData = (couponsId) => {
        // 获取订单数据
        confirmOrderModel.makeSureProduct_selectDefaltCoupon(couponsId);
    };

    // 地址重新选择
    selectAddress = () => {
        if (confirmOrderModel.isNoAddress === false){
            this.$navigate('mine/address/AddressManagerPage', {
                from: 'order',
                currentId: confirmOrderModel.addressId,
                callBack: (json) => {
                    confirmOrderModel.selectAddressId(json)
                }
            });
        }else {
            this.$navigate(RouterMap.AddressEditAndAddPage,{
                callBack: (json) => {
                    confirmOrderModel.selectAddressId(json)
                },
                from: 'add'
            });
        }
    };

    // 提交订单
    commitOrder = () => {
        confirmOrderModel.submitProduct();
    };

    // 选择优惠券
    jumpToCouponsPage = (params) => {
        if (params === 'justOne') {//一元券
            let payAmount = parseInt(confirmOrderModel.payInfo.payAmount || 0); //要实付钱
            let tokenCoin =  parseInt(confirmOrderModel.tokenCoin);//一元优惠的券
            let orderAmount = payAmount + tokenCoin;
            if (orderAmount < 1 || orderAmount.isNaN){//订单总价格要大于1
                this.$toastShow('订单价格大于1元才可使用一元优惠');
                return;
            }
            //打开一券选择框
            this.oneTicketModel && this.oneTicketModel.open(orderAmount, (data) => {
                //选择完以后回调
                data = parseInt(data);
                confirmOrderModel.selecttokenCoin(data);
            })
        } else {
            track(trackEvent.ViewCoupon, { couponModuleSource: 3 });
            this.ticketModel && this.ticketModel.open(confirmOrderModel.getAvailableProducts(), (data) => {
                if (data.code) {
                    confirmOrderModel.selectUserCoupon(data.code)
                } else if (data === 'giveUp') {
                    confirmOrderModel.selectUserCoupon('')
                }
            })
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: DesignRule.bgColor
    },
    text: {
        width: ScreenUtils.autoSizeWidth(100),
        marginLeft: ScreenUtils.autoSizeWidth(45 - 20),
        fontSize: ScreenUtils.autoSizeWidth(12),
        color: DesignRule.textColor_instruction,
        textAlign: 'center'
    },
    block: {
        marginBottom: 10,
        marginHorizontal: DesignRule.margin_page,
        borderRadius: 5,
        overflow: 'hidden'
    }
});
