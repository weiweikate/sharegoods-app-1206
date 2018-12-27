import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, SectionList, Image } from 'react-native';
import { MRText as Text } from '../../../../../components/ui';
import Modal from 'CommModal';
import ScreenUtils from '../../../../../utils/ScreenUtils';
import DesignRule from '../../../../../constants/DesignRule';
import res from '../../../res';

const { px2dp } = ScreenUtils;
const { xp_detail_xp, xp_detail_coupon_bg, xp_detail_coupon, xp_detail_contents } = res.product.xpProduct;

export default class XpDetailActivityInfoModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            xpDetailModel: {}
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.modalVisible !== nextState.modalVisible) {
            return true;
        }
        return false;
    }

    show = (xpDetailModel) => {
        this.setState({
            modalVisible: true,
            xpDetailModel: xpDetailModel
        });
    };

    _close = () => {
        this.setState({
            modalVisible: false
        });
    };

    _renderHeader = ({ section }) => {
        const { headerTittle, headerImg } = section;
        return <View style={styles.itemHeaderView}>
            <Image source={headerImg}/>
            <Text style={styles.itemHeaderText}>{headerTittle}</Text>
        </View>;
    };

    _renderItemCoupon = () => {
        return <View>

        </View>;
    };

    _renderItemXp = () => {
        return <View>

        </View>;
    };

    _renderItemContents = () => {
        return <View>

        </View>;
    };

    _renderItem = ({ item }) => {
        switch (item.type) {
            case 'xp':
                this._renderItemXp();
                break;
            case 'coupon':
                this._renderItemCoupon();
                break;
            case 'contents':
                this._renderItemContents();
                break;
            default:
                return null;
        }
    };

    _keyExtractor = (item, index) => {
        return `${item.type}${index}`;
    };

    render() {
        const { rules } = this.state.xpDetailModel;

        const sectionListData = [
            { headerTittle: '经验值', headerImg: xp_detail_xp, type: 'xp', data: rules || [] },
            { headerTittle: '优惠券', headerImg: xp_detail_coupon, type: 'coupon', data: [{}] },
            { headerTittle: '活动说明', headerImg: xp_detail_contents, type: 'contents', data: [{}] }];

        return (
            <Modal onRequestClose={this._close}
                   visible={this.state.modalVisible}
                   transparent={true}>
                <View style={styles.containerView}>
                    <TouchableOpacity style={styles.topCloseBtn} onPress={this._close}/>
                    <View style={styles.bottomView}>
                        <Text style={styles.tittleText}>活动信息</Text>
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
            </Modal>
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
        height: px2dp(271)
    },
    bottomView: {
        flex: 1, borderTopLeftRadius: 10, borderTopRightRadius: 10,
        backgroundColor: DesignRule.white
    },
    sureBtn: {
        justifyContent: 'center', alignItems: 'center',
        alignSelf: 'center',
        height: 44, width: ScreenUtils.width - 30, marginBottom: ScreenUtils.safeBottom,
        backgroundColor: DesignRule.bgColor_btn, borderRadius: 22
    },
    sureText: {
        color: DesignRule.white, fontSize: 17
    },

    tittleText: {
        alignSelf: 'center', marginTop: 15,
        fontSize: 17, color: DesignRule.textColor_mainTitle
    },

    itemHeaderView: {
        flexDirection: 'row', alignItems: 'center',
        paddingTop: 21, paddingBottom: 10, paddingLeft: 15
    },
    itemHeaderText: {
        marginLeft: 5,
        color: DesignRule.textColor_instruction, fontSize: 13
    }
});

