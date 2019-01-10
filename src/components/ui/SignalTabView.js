/**
 * @author ZhangLei
 * @date 2018/6/7
 * @appType crm_app
 * @Description:个人中心常用的ItemUI控件
 */
import React from 'react';
import {
    View
} from 'react-native';
import { UIText } from './index';
import DesignRule from '../../constants/DesignRule';

const SignalTabView = props => {

    const {
        tableData = this.props.tableData,
        commonViewStyle = {
            flex: 1,
            height: 35,
            justifyContent: 'center',
            backgroundColor: DesignRule.color_fff,
            alignItems: 'center',
            borderWidth: 0.5,
            borderColor: DesignRule.color_ddd
        },
        specialViewStyle = {
            height: 35,
            width: 71,
            justifyContent: 'center',
            backgroundColor: DesignRule.lineColor_inColorBg,
            alignItems: 'center',
            borderWidth: 0.5,
            borderColor: DesignRule.color_ddd
        },
        commonTextStyle = {
            color: DesignRule.textColor_instruction, fontSize: 12
        },
        specialTextStyle = {
            color: DesignRule.textColor_mainTitle_222, fontSize: 12
        }
    } = props;

    this.renderListView = () => {
        let arr = [];
        for (let i = 0; i < tableData.length; i++) {
            arr.push(
                //剩余宽度345
                <View style={{ flexDirection: 'row', paddingLeft: 15, paddingRight: 15 }} key={i}>
                    <View style={specialViewStyle}>
                        <UIText value={tableData[i].name} style={specialTextStyle}/>
                    </View>
                    <View style={commonViewStyle}>
                        <UIText value={tableData[i].value} style={commonTextStyle}/>
                    </View>
                </View>
            );
        }
        return arr;
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {this.renderListView()}
        </View>
    );

};

export default SignalTabView;
