import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    SectionList,
    Image,
    TouchableWithoutFeedback
} from 'react-native';
import { MRText as Text } from '../../../../components/ui';
import CommModal from '../../../../comm/components/CommModal';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';

const { px2dp } = ScreenUtils;
const { fa_huo, ji_su, qi_tian, zheng_ping } = res.product.service;

export default class DetailHeaderServiceModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            supportSeven: false,
            supportHoliday: false
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.modalVisible !== nextState.modalVisible) {
            return true;
        }
        return false;
    }

    show = (supportSeven, supportHoliday) => {
        this.setState({
            modalVisible: true,
            supportSeven,
            supportHoliday
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
        const { supportHoliday, supportSeven } = this.state;

        let sectionListData = [
            {
                headerTittle: '正品保证',
                headerImg: zheng_ping,
                data: [{ content: '该商品由中国人保承保正品保证险' }]
            },
            {
                headerTittle: '极速退款',
                headerImg: ji_su,
                data: [{ content: '消费退款是为诚信会员提供的退款退货流程的专享特权，额度是根据每个用户当前 信誉评级情况而定' }]
            },
            {
                headerTittle: `${supportSeven ? '' : '不支持'}七天无理由退换`,
                headerImg: qi_tian,
                data: [{ content: '消费者在满足7天无理由退换货申请条件的前提下，可以提成 "7天无理由退换货" 的申请' }]
            },
            {
                headerTittle: `${supportHoliday ? '' : '不支持'}节假日发货`,
                headerImg: fa_huo,
                data: [{ content: '该商品支持节假日发货' }]
            }
        ];


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
        paddingVertical: 5, marginLeft: px2dp(42), marginRight: px2dp(25),
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

