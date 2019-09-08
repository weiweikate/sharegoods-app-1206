/**
 * Created by xiangchen on 2018/8/6.
 */
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import PropTypes from 'prop-types';
import DesignRule from '../../../constants/DesignRule';
import {
    MRText as Text
} from '../../../components/ui';
// 状态：0.删除 1.未开始 2.进行中 3.已售完 4.时间结束 5.手动结束
const statues = {
    deleteStatue: 0,
    noBegin: 1,
    isBeginning: 2,
    haveSoldOut: 3,
    timeOver: 4,
    handOver: 5
};

export default class ProgressBarView extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.statueRender = {
            [statues.deleteStatue]: null,
            [statues.noBegin]: this._noBeginTextRender,
            [statues.isBeginning]: this._renderProgress,
            [statues.haveSoldOut]: this._renderHaveSoltOut, //将抢光视图去掉
            [statues.timeOver]: this._renderHaveSoltOut,
            [statues.handOver]: this._renderHaveSoltOut
        };
    }

    render() {
        const { statue, itemData } = this.props;
        return (
            itemData.productType === 2 ? (this.statueRender[statue] ? this.statueRender[statue]() : null) : null
        );
    }

    _renderProgress = () => {
        const { progressValue, haveRobNum } = this.props;
        return (
            <View style={Styles.progressBgStyle}>
                <View style={[Styles.progressContentStyle,{ width: progressValue * (ScreenUtils.width / 2 - 40)}]}/>
                <Text style={Styles.haveRobTextStyle}>
                    {'已抢' + haveRobNum + '件'}
                </Text>
                <Text style={Styles.progressNumTextStyle}>
                    {(progressValue * 100).toFixed(0) + '%'}
                </Text>
            </View>
        );

    };
    _noBeginTextRender = () => {
        const { itemData } = this.props;
        return (
            <View>
                <Text
                    style={Styles.normalTextStyle}
                    number={1}
                >
                    {itemData.reseCount + '人已关注'}
                </Text>
            </View>

        );
    };
    _renderHaveSoltOut = () => {
        const { itemData } = this.props;
        return (
            <Text
                style={[Styles.normalTextStyle,
                    { color: DesignRule.textColor_instruction }
                ]}
                number={1}
            >
                {'抢光了' + (parseInt(itemData.totalNumber) - parseInt(itemData.surplusNumber)) + '件'}
            </Text>
        );
    };
}
const Styles = StyleSheet.create({
    normalTextStyle: {
        color: DesignRule.bgColor_blue,
        fontSize: 11,
        marginTop: 5,
        marginLeft: 0,
        marginRight: 10
    },
    progressBgStyle: {
        width: ScreenUtils.width / 2 - 40,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'rgba(230, 0, 18, 0.3)',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5
    },
    progressContentStyle: {
        height: 12,
        borderRadius: 6,
        backgroundColor: DesignRule.mainColor,
        alignItems: 'flex-start',
        justifyContent: 'center',
        position: 'absolute'
    },
    haveRobTextStyle: {
        fontSize: 11, marginLeft: 5, color: 'white'
    },
    progressNumTextStyle:{
        fontSize: 11,
        marginRight: 5,
        color: 'white'
    }
});

ProgressBarView.propTypes = {
    progressValue: PropTypes.number.isRequired,
    haveRobNum: PropTypes.number.isRequired,
    statue: PropTypes.number,
    itemData: PropTypes.object
};
