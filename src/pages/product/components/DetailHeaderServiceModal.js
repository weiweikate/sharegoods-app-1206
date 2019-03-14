import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    SectionList,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import { MRText as Text } from '../../../components/ui/index';
import CommModal from '../../../comm/components/CommModal';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import res from '../res/product';

const { px2dp } = ScreenUtils;
const { fa_huo, ji_su, qi_tian, zheng_ping, bounus } = res.service;

export default class DetailHeaderServiceModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            pData: {}
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.modalVisible !== nextState.modalVisible) {
            return true;
        }
        return false;
    }

    show = (pData) => {
        this.setState({
            modalVisible: true,
            pData
        });
    };

    _close = () => {
        this.setState({
            modalVisible: false
        });
    };

    _renderHeader = ({ section }) => {
        const { headerTittle, headerImg } = section;
        return <TouchableWithoutFeedback>
            <View style={styles.itemHeaderView}>
                <Image source={headerImg}/>
                <Text style={styles.itemHeaderText}>{headerTittle}</Text>
            </View>
        </TouchableWithoutFeedback>;
    };

    _renderItem = ({ item }) => {
        return <TouchableWithoutFeedback>
            <View>
                <Text style={styles.itemText}>{item.content}</Text>
            </View>
        </TouchableWithoutFeedback>;
    };

    _keyExtractor = (item, index) => {
        return `${item.headerTittle}${index}`;
    };

    render() {
        const { restrictions } = this.state.pData;
        //1优惠券,4退换,8节假日

        let sectionListData = [
            {
                headerTittle: '质量保障',
                headerImg: zheng_ping,
                data: [{ content: '秀购售卖的所有商品均通过正规品牌商或供应商渠道采购（由正规品牌商或者供应商提供），确保正品（质量有保障），请您放心购买' }]
            },
            {
                headerTittle: '48小时发货',
                headerImg: ji_su,
                data: [{ content: '支持48小时发货（法定节假日或者促销活动期间以平台通知为准，因自然灾害等不可抗力因素造成的发货延时除外）' }]
            },
            {
                headerTittle: `${(restrictions & 4) === 4 ? '' : '不支持'}7天无理由退换货`,
                headerImg: qi_tian,
                data: [{ content: `${(restrictions & 4) === 4 ? '收到商品之日7天（含）内，可在线申请退货服务（部分食品、贴身衣物等特殊商品除外）' : '食品、贴身衣物、兑换、秒杀、经验翻倍等特殊商品，无质量问题不支持退换货'}` }]
            },
            {
                headerTittle: `${(restrictions & 8) === 8 ? '' : '不支持'}节假日发货`,
                headerImg: fa_huo,
                data: [{ content: `该商品${(restrictions & 8) === 8 ? '' : '不支持'}节假日发货` }]
            }
        ];

        if ((restrictions & 1) !== 1) {
            sectionListData.push({
                headerTittle: `不支持使用优惠券`,
                headerImg: bounus,
                data: [{ content: `该商品不支持使用优惠券使用优惠券` }]
            });
        }


        return (
            <CommModal onRequestClose={this._close}
                       visible={this.state.modalVisible}
                       transparent={true}>
                <View style={styles.containerView}>
                    <TouchableOpacity style={styles.topCloseBtn} onPress={this._close}/>
                    <View style={styles.bottomView}>
                        <Text style={styles.tittleText}>基础保障</Text>
                        <SectionList keyExtractor={this._keyExtractor}
                                     showsVerticalScrollIndicator={false}
                                     renderSectionHeader={this._renderHeader}
                                     renderItem={this._renderItem}
                                     sections={sectionListData}/>
                        <TouchableOpacity style={styles.sureBtn} onPress={this._close}>
                            <Text style={styles.sureText}>确定</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </CommModal>
        );
    }
}

const styles = StyleSheet.create({
    containerView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: ScreenUtils.width
    },
    topCloseBtn: {
        height: px2dp(175)
    },
    bottomView: {
        flex: 1, borderTopLeftRadius: 10, borderTopRightRadius: 10,
        backgroundColor: DesignRule.white
    },

    tittleText: {
        alignSelf: 'center', marginTop: 15,
        fontSize: 17, color: DesignRule.textColor_mainTitle
    },

    itemHeaderView: {
        flexDirection: 'row', alignItems: 'center',
        paddingTop: 16, paddingBottom: 5, paddingLeft: px2dp(25),
        backgroundColor: DesignRule.white
    },
    itemHeaderText: {
        marginLeft: 5,
        color: DesignRule.textColor_mainTitle, fontSize: 13
    },

    itemText: {
        paddingVertical: 5, marginLeft: px2dp(25) + 16 + 5, marginRight: px2dp(25),
        color: DesignRule.textColor_instruction, fontSize: 11
    },

    sureBtn: {
        justifyContent: 'center', alignItems: 'center',
        alignSelf: 'center',
        height: 44, width: ScreenUtils.width - 30, marginBottom: ScreenUtils.safeBottom + 15,
        backgroundColor: DesignRule.bgColor_btn, borderRadius: 22
    },
    sureText: {
        color: DesignRule.white, fontSize: 17
    }
});

