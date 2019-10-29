/**
 * @author 陈阳君
 * @date on 2019/09/03
 * @describe
 * @org 秀购
 * @email chenyangjun@meeruu.com
 */

import React, { Component } from 'react';
import { View, StyleSheet, Image, FlatList } from 'react-native';
import { MRText } from '../../../../components/ui';
import DesignRule from '../../../../constants/DesignRule';
import NoMoreClick from '../../../../components/ui/NoMoreClick';
import { GroupPersonItem, GroupProductItem } from './ProductGroupItemView';
import RES from '../../res/product';
import { GroupPersonAllList, GroupJoinView, GroupDescView } from './ProductGroupModal';
import { observer } from 'mobx-react';
import ScreenUtils from '../../../../utils/ScreenUtils';

const { arrow_right_black } = RES.button;

/*商详老带新页面*/
@observer
export class GroupIsOldView extends Component {
    render() {
        const { tagName, showRuleText, showSendAmount, sendAmount } = this.props.productGroupModel;
        return (
            <View style={stylesOld.container}>
                <MRText style={stylesOld.imgLeft}>{tagName}</MRText>
                <MRText style={stylesOld.text}>
                    {showRuleText}
                    {showSendAmount && '团长可额外获得'}
                    {showSendAmount && <MRText
                        style={{ color: DesignRule.textColor_redWarn }}>￥{sendAmount}</MRText>}
                    {showSendAmount && '返现哦〜'}
                </MRText>
            </View>
        );
    }
}

const stylesOld = StyleSheet.create({
    container: {
        flexDirection: 'row', alignItems: 'center',
        height: 44, backgroundColor: 'white', marginBottom: 10
    },
    imgLeft: {
        color: '#FF0050', fontSize: 16, marginLeft: 15, marginRight: 10
    },
    text: {
        color: DesignRule.textColor_instruction, fontSize: 12, flex: 1
    }
});

/*商详发起拼团的人*/
@observer
export class GroupOpenPersonSView extends Component {
    showGroupJoinView = ({ itemData, joinList }) => {
        const { productDetailModel } = this.props;
        const { productDetailBtnClick } = productDetailModel;
        productDetailBtnClick && productDetailBtnClick('去凑团');
        this.GroupJoinView.show({ itemData, joinList });
    };

    render() {
        const { productGroupModel, goToBuy, groupNum, productDetailModel } = this.props;
        const { productDetailBtnClick } = productDetailModel;
        const { groupList, groupDesc, requestGroupList } = productGroupModel;
        return (
            <View style={stylesPerson.container}>
                {groupList.length !== 0 &&
                <NoMoreClick style={stylesPerson.topBtn} onPress={() => {
                    this.GroupPersonAllList.show();
                }}>
                    <MRText style={stylesPerson.topLeftText}>以下小伙伴正在发起拼团，你可以直接参加</MRText>
                    <View style={stylesPerson.topRightView}>
                        <MRText style={stylesPerson.topRightText}>更多</MRText>
                        <Image source={arrow_right_black} resizeMode={'contain'} style={{ height: 10 }}/>
                    </View>
                </NoMoreClick>
                }
                {
                    groupList.length !== 0 && (groupList || []).map((item, index) => {
                        if (index > 1) {
                            return null;
                        }
                        return <GroupPersonItem key={index}
                                                itemData={item}
                                                goToBuy={goToBuy}
                                                requestGroupList={requestGroupList}
                                                showGroupJoinView={this.showGroupJoinView}/>;
                    })
                }

                <NoMoreClick style={stylesPerson.bottomView} onPress={() => {
                    productDetailBtnClick && productDetailBtnClick('玩法详情');
                    this.GroupDescView.show();
                }}>
                    <MRText style={stylesPerson.bottomText}>玩法<MRText
                        style={stylesPerson.bottomText1}> 支付开团邀请{groupNum - 1}人参团，人数不足自动退款</MRText></MRText>
                    <Image source={arrow_right_black} resizeMode={'contain'} style={{ height: 10 }}/>
                </NoMoreClick>
                <GroupPersonAllList ref={e => this.GroupPersonAllList = e}
                                    groupList={groupList}
                                    goToBuy={goToBuy}
                                    requestGroupList={requestGroupList}
                                    showGroupJoinView={this.showGroupJoinView}/>
                <GroupJoinView ref={e => this.GroupJoinView = e} goToBuy={goToBuy}/>
                <GroupDescView ref={e => this.GroupDescView = e} groupDesc={groupDesc}/>
            </View>
        );
    }
}

const stylesPerson = StyleSheet.create({
    container: {
        backgroundColor: 'white'
    },
    topBtn: {
        paddingHorizontal: 15,
        height: 24, flexDirection: 'row', alignItems: 'flex-end'
    },
    topLeftText: {
        flex: 1,
        color: DesignRule.textColor_mainTitle, fontSize: 12
    },
    topRightView: {
        flexDirection: 'row', alignItems: 'center'
    },
    topRightText: {
        marginRight: 5,
        color: DesignRule.textColor_instruction, fontSize: 12
    },
    bottomView: {
        paddingHorizontal: 15,
        height: 44, flexDirection: 'row', alignItems: 'center'
    },
    bottomText: {
        flex: 1,
        color: DesignRule.textColor_instruction, fontSize: 12
    },
    bottomText1: {
        color: DesignRule.textColor_mainTitle
    }
});

/*商详大家都在拼商品列表*/
@observer
export class GroupProductListView extends Component {
    _renderItem = ({ item }) => {
        const { productDetailModel } = this.props;
        const { productDetailBtnClick } = productDetailModel;
        return <GroupProductItem itemData={item} productDetailBtnClick={productDetailBtnClick}/>;
    };

    render() {
        const { productGroupModel } = this.props;
        const { groupProducts } = productGroupModel;
        if (groupProducts.length === 0) {
            return null;
        }
        return (
            <View style={stylesProduct.bgView}>
                <View style={stylesProduct.tittleView}>
                    <MRText style={stylesProduct.LeftText}>大家都在拼</MRText>
                </View>
                <FlatList
                    style={stylesProduct.flatList}
                    data={groupProducts || []}
                    keyExtractor={(item) => item.prodCode + ''}
                    renderItem={this._renderItem}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    initialNumToRender={5}
                />
            </View>
        );
    }
}

const stylesProduct = StyleSheet.create({
    bgView: {
        marginTop: 10,
        backgroundColor: DesignRule.white
    },
    tittleView: {
        justifyContent: 'center', marginHorizontal: 15, height: 37
    },
    LeftText: {
        color: DesignRule.textColor_mainTitle, fontSize: 15, fontWeight: '500'
    },
    flatList: {
        marginLeft: 15, marginBottom: 15
    }
});

@observer
export class GroupShowAlertView extends Component {
    render() {
        const { showAlert } = this.props.productGroupModel;
        const { isPinGroupIn } = this.props.productDetailModel;
        if (!showAlert || !isPinGroupIn) {
            return null;
        }
        return (
            <NoMoreClick style={{ position: 'absolute', bottom: ScreenUtils.safeBottom + 40.5, right: 15 }}
                         onPress={() => {
                             this.props.productGroupModel.showAlert = false;
                         }}>
                <View style={{
                    borderRadius: 16,
                    height: 32,
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)'
                }}>
                    <MRText style={{ paddingHorizontal: 15, fontSize: 13, color: 'white' }}>人满发货 人不满自动退款 x</MRText>
                </View>
                <View style={{
                    alignSelf: 'flex-end', marginRight: 25,
                    width: 5,
                    height: 5,
                    borderColor: 'transparent',
                    borderTopColor: 'rgba(0, 0, 0, 0.7)',
                    borderTopWidth: 5,
                    borderBottomWidth: 5,
                    borderRightWidth: 5,
                    borderLeftWidth: 5
                }}/>
            </NoMoreClick>
        );
    }
}
