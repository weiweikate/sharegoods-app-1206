/**
 * @author 陈阳君
 * @date on 2019/09/03
 * @describe
 * @org 秀购
 * @email chenyangjun@meeruu.com
 */

import React, { Component } from 'react';
import { View, StyleSheet, Image, FlatList } from 'react-native';
import newToOld from './newToOld.png';
import { MRText } from '../../../../components/ui';
import DesignRule from '../../../../constants/DesignRule';
import NoMoreClick from '../../../../components/ui/NoMoreClick';
import { GroupPersonItem, GroupProductItem } from './ProductGroupItemView';
import RES from '../../res/product';
import ProductGroupModal, { action_type } from './ProductGroupModal';
import ProductApi from '../../api/ProductApi';
import { observer } from 'mobx-react';

const { arrow_right_black } = RES.button;

/*老带新页面*/
export class GroupIsOldView extends Component {
    render() {
        return (
            <View style={stylesOld.container}>
                <Image source={newToOld} style={stylesOld.img}/>
                <MRText style={stylesOld.text}>所有用户都能开团，但商城新客才能参团哟</MRText>
            </View>
        );
    }
}

const stylesOld = StyleSheet.create({
    container: {
        flexDirection: 'row', alignItems: 'center',
        height: 44, backgroundColor: 'white'
    },
    img: {
        marginLeft: 15,
        width: 47, height: 15
    },
    text: {
        marginLeft: 10,
        color: DesignRule.textColor_instruction, fontSize: 12
    }
});

/*拼团团长们*/
@observer
export class GroupOpenPersonSView extends Component {
    requestGroupPerson = ({ groupId }) => {
        ProductApi.promotion_group_joinUser({ groupId }).then((item) => {
            this.ProductGroupModal.show({ actionType: action_type.persons });
        }).catch(e => {
        });
    };

    render() {
        const { productGroupModel } = this.props;
        const { groupList } = productGroupModel;
        return (
            <View style={stylesPerson.container}>
                <NoMoreClick style={stylesPerson.topBtn} onPress={(item) => {
                    this.ProductGroupModal.show({ actionType: action_type.persons });
                }}>
                    <MRText style={stylesPerson.topLeftText}>以下小伙伴正在发起拼团，你可以直接参加</MRText>
                    <View style={stylesPerson.topRightView}>
                        <MRText style={stylesPerson.topRightText}>更多</MRText>
                        <Image source={arrow_right_black} resizeMode={'contain'} style={{ height: 10 }}/>
                    </View>
                </NoMoreClick>
                {
                    (groupList || []).map((item, index) => {
                        if (index > 1) {
                            return null;
                        }
                        return <GroupPersonItem key={index} itemData={item} onPress={() => {
                            this.requestGroupPerson({ groupId: item.id });
                        }}/>;
                    })
                }
                <NoMoreClick style={stylesPerson.bottomView} onPress={() => {
                    this.ProductGroupModal.show({ actionType: action_type.desc });
                }}>
                    <MRText style={stylesPerson.bottomText}>玩法<MRText
                        style={stylesPerson.bottomText1}> 支付开团邀请1人参团，人数不足自动退款</MRText></MRText>
                    <Image source={arrow_right_black} resizeMode={'contain'} style={{ height: 10 }}/>
                </NoMoreClick>
                <ProductGroupModal ref={e => this.ProductGroupModal = e}/>
            </View>
        );
    }
}

const stylesPerson = StyleSheet.create({
    container: {
        marginTop: 10,
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

/*拼团商品列表*/
@observer
export class GroupProductListView extends Component {
    _renderItem = () => {
        return <GroupProductItem/>;
    };

    render() {
        return (
            <View style={stylesProduct.bgView}>
                <View style={stylesProduct.tittleView}>
                    <MRText style={stylesProduct.LeftText}>大家都在拼</MRText>
                </View>
                <FlatList
                    style={stylesProduct.flatList}
                    data={[{}, {}, {}, {}, {}, {}]}
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
