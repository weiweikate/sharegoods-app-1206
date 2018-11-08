/**
 * Created by xiangchen on 2018/7/24.
 */
import React from 'react';
import {
    StyleSheet, View, Text
} from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';
import BasePage from '../../BasePage';
import DesignRule from 'DesignRule';

export default class QuestionnairePage extends BasePage {
    constructor(props) {
        super(props);
    }

    $navigationBarOptions = {
        title: '问卷调查',
        show: true // false则隐藏导航
    };

    _render() {
        return (
            <View style={styles.container}>
                <Text style={{ fontWeight: 'bold' }}>
                    I am bold
                    <Text style={{ color: 'red' }}>
                        and red
                    </Text>
                </Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignRule.bgColor
    },
    textitems: {
        width: ScreenUtils.width,
        height: 44,
        backgroundColor: 'white',
        borderStyle: 'solid'
    },
    textsingle: {
        fontSize: 13,
        color: DesignRule.textColor_instruction,
        marginLeft: 16,
        marginRight: 13
    }

});
