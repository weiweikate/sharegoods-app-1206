/**
 * @author 陈阳君
 * @date on 2019/09/24
 * @describe
 * @org 秀购
 * @email chenyangjun@meeruu.com
 */

import React from 'react';
import { View } from 'react-native';
import BasePage from '../../BasePage';
import spellStatusModel from './SpellStatusModel';
import MyShop_RecruitPage from '../spellShop/MyShop_RecruitPage';
import MyShop_RecruitPageNew from './MyShop_RecruitPage';

export default class IsShowNewStore extends BasePage {

    $navigationBarOptions = {
        show: false
    };

    _render() {
        return (
            <View style={{ flex: 1 }}>
                {
                    spellStatusModel.showNewStore ? <MyShop_RecruitPageNew navigation={this.props.navigation}/> :
                        <MyShop_RecruitPage navigation={this.props.navigation}/>
                }
            </View>
        );
    }
}
