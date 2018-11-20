import React from 'react';
import {
    View,
    Image,
    ScrollView
} from 'react-native';
import BasePage from '../../../../BasePage';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from 'DesignRule';
import res from '../../res';

const agreementDetailImg = res.userInfoImg.yonghuxiayi_img;
export default class UserAgreementPage extends BasePage {
    constructor(props) {
        super(props);
    }

    $navigationBarOptions = {
        title: '用户协议',
        show: true // false则隐藏导航
        // hiddenNav:false
    };

    _render() {
        return (
            <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{ width: ScreenUtils.width, height: 25, backgroundColor: DesignRule.bgColor }}/>
                <Image source={agreementDetailImg} style={{ width: ScreenUtils.width }} resizeMode={'stretch'}/>
            </ScrollView>
        );
    }
}
