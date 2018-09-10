/**
 * @author ZhangLei
 * @date 2018/6/7
 * @appType crm_app
 * @Description:个人中心常用的ItemUI控件
 */
import React from 'react';
import {
    View,
} from 'react-native';
import { color } from '../../constants/Theme';
import { UIText } from './index';

const SignalTabView = props => {

    const {
        tableData = this.props.tableData,
        commonViewStyle = {
            flex: 1,
            height: 35,
            justifyContent: 'center',
            backgroundColor: color.gray_FFF,
            alignItems: 'center',
            borderWidth: 0.5,
            borderColor: color.gray_DDD
        },
        specialViewStyle = {
            height: 35,
            width: 71,
            justifyContent: 'center',
            backgroundColor: color.gray_EEE,
            alignItems: 'center',
            borderWidth: 0.5,
            borderColor: color.gray_DDD
        },
        commonTextStyle = {
            color: color.black_999, fontSize: 12
        },
        specialTextStyle = {
            color: color.black_222, fontSize: 12
        },
        ...attributes
    } = props;

    renderListView = () => {
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
