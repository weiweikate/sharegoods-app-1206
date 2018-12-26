import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MRText as Text } from '../../../../components/ui';
import BasePage from '../../../../BasePage';
import XpDetailProductView from './components/XpDetailProductView';
import XpDetailSelectListView from './components/XpDetailSelectListView';
import XpDetailBottomView from './components/XpDetailBottomView';
import XpDetailUpSelectListView from './components/XpDetailUpSelectListView';
import XpDetailParamsModal from './components/XpDetailParamsModal';
import XpDetailActivityInfoModal from './components/XpDetailActivityInfoModal';
import XpDetailModel from './XpDetailModel';
import { observer } from 'mobx-react';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../../../comm/res';
import procductRes from '../../res';

const arrow_right_black = res.button.arrow_right_black;
const detail_more_down = procductRes.product.detailNavView.detail_more_down;

@observer
export class XpDetailPage extends BasePage {

    xpDetailModel = new XpDetailModel();

    $navigationBarOptions = {
        title: '经验值专区',
        rightNavImage: detail_more_down
    };

    componentDidMount() {
        const { activityCode } = this.params;
        this.xpDetailModel.request_act_exp_detail(activityCode);
    }

    _activityAction = () => {
        this.XpDetailActivityInfoModal.show();
    };

    _paramsAction = () => {
        this.XpDetailParamsModal.show();
    };

    _render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    {/*选择框*/}
                    <XpDetailSelectListView xpDetailModel={this.xpDetailModel}/>
                    {/*商品信息*/}
                    <XpDetailProductView xpDetailModel={this.xpDetailModel}/>
                    <View style={styles.productPramsView}>
                        <TouchableOpacity style={styles.pramsBtn} onPress={this._activityAction}>
                            <Text style={styles.pramsText}>活动规则</Text>
                            <Image style={styles.arrowImg} source={arrow_right_black}/>
                        </TouchableOpacity>
                        <View style={styles.lineView}/>
                        <TouchableOpacity style={styles.pramsBtn} onPress={this._paramsAction}>
                            <Text style={styles.pramsText}>参数信息</Text>
                            <Image style={styles.arrowImg} source={arrow_right_black}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.productInfoView}>
                        <View style={styles.infoTextView}>
                            <Text style={styles.pramsText}>商品信息</Text>
                        </View>
                    </View>
                </ScrollView>
                {/*购买,购物车*/}
                <XpDetailBottomView/>

                {/*上拉显示的选择框*/}
                <XpDetailUpSelectListView xpDetailModel={this.xpDetailModel}/>

                {/*modal*/}
                {/*活动信息*/}
                <XpDetailParamsModal ref={(e) => this.XpDetailParamsModal = e}/>
                {/*规格*/}
                <XpDetailActivityInfoModal ref={(e) => this.XpDetailActivityInfoModal = e}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
