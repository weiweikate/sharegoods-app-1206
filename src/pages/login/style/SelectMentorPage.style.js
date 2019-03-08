import {
    StyleSheet
}from 'react-native'
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';

const  Styles =  StyleSheet.create(
    {
        contentStyle: {
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            margin: 0,
            marginTop: -2,
            backgroundColor: DesignRule.bgColor
        },
        rightTopTitleStyle: {
            fontSize: 15,
            color: DesignRule.textColor_secondTitle
        },
        topViewStyle: {
            height: ScreenUtils.px2dp(430)
        },
        bottomViewStyle: {
            height: 100,
            justifyContent: 'center',
            alignItems: 'center'
        }
    }
);

export  default  Styles;
