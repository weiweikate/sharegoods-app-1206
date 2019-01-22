/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2018/11/27.
 *
 */
"use strict";

import React from "react";

import {
    StyleSheet,
    View
} from "react-native";

import {
    UIText, UIImage
} from "../../../../components/ui";
// import DesignRule from 'DesignRule';
import ScreenUtils from "../../../../utils/ScreenUtils";
// import DateUtils from '../../../../utils/DateUtils';
import res from "../../res";

const {
    afterSaleService: {
        exchangeGoodsDetailBg
    }
} = res;

export default class HeaderView extends React.Component {

    constructor(props) {
        super(props);

        this._bind();

        this.state = {};
    }

    _bind() {

    }

    componentDidMount() {
    }


    render() {
        let { status, pageType, headerTitle, timeString, detailTitle} = this.props;

        let titleCommpent = () => {
            return <UIText value={headerTitle} style={styles.header_title}/>;
        };
        let detialCommpent = () => {
            return <UIText value={detailTitle} style={styles.header_detail}/>;
        };
        let timerCommpent = () => {
        };
        if (status === 2 && (pageType === 1 || pageType === 2)){
            timerCommpent = () => {
                return <UIText value={timeString} style={styles.header_detail}/>;
            };

        }

        return (
            <View>
                <View style={{ position: "absolute", height: 100, width: ScreenUtils.width }}>
                    <UIImage source={exchangeGoodsDetailBg} style={{ height: 100, width: ScreenUtils.width }}/>
                </View>
                <View style={{
                    height: 100,
                    alignItems: "center",
                    flexDirection: "row",
                    width: ScreenUtils.width
                }}>
                    {/*{imageCommpent()}*/}
                    <View style={{ marginLeft: 15 }}>
                        {titleCommpent()}
                        {detialCommpent()}
                        {timerCommpent()}
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header_title: {
        fontSize: 18,
        color: "white"
    },
    header_detail: {
        fontSize: 12,
        color: "white",
        marginTop: 3
    }
});
