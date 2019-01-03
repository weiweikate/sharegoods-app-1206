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
import ScreenUtils from '../../utils/ScreenUtils';
import DesignRule from '../../constants/DesignRule';
import {MRText as Text} from './UIText';

const VerticalTableView = props => {

    const {
        tableData = this.props.tableData,
        commonViewStyle = {
            height: 35,
            width: (ScreenUtils.width - 30) / (tableData[0].value.length + 1),
            justifyContent: 'center',
            backgroundColor: DesignRule.lineColor_inColorBg,
            alignItems: 'center',
            borderWidth: 0.5,
            borderColor: DesignRule.color_ddd
        },
        specialViewStyle = {
            height: 35,
            width: (ScreenUtils.width - 30) / (tableData[0].value.length + 1),
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
            color: DesignRule.textColor_mainTitle, fontSize: 12
        }
    } = props;


    this.renderListView = () => {
        let arr = [];
        for (let i = 0; i < tableData[0].value.length + 1; i++) {
            arr.push(
                this.renderItemListView(i)
            );
        }
        return arr;
    };
    this.renderItemListView = (index) => {
        let arr = [];
        if (index === 0) {
            for (let i = 0; i < tableData.length; i++) {
                arr.push(
                    //剩余宽度345
                    <View style={specialViewStyle} key={i}>
                        <Text style={specialTextStyle}>{tableData[index].name}</Text>
                    </View>
                );
            }

        } else {
            for (let i = 0; i < tableData.length; i++) {
                arr.push(
                    //剩余宽度345
                    <View style={commonViewStyle} key={i}>
                        <Text style={commonTextStyle}>{tableData[i].value[index - 1]}</Text>
                    </View>
                );
            }
        }
        return (
            <View style={{ flexDirection: 'row' }}>
                {arr}
            </View>
        );
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {this.renderListView()}
        </View>
    );

};

export default VerticalTableView;
