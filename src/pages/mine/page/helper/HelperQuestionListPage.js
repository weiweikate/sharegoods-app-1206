import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import BasePage from '../../../../BasePage';
import UIText from '../../../../components/ui/UIText';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from 'DesignRule';
import res from '../../res';
import {MRText as Text} from '../../../../components/ui'
const arrow_right =  res.button.arrow_right_black;

/**
 * @author chenxiang
 * @date on 2018/9/20
 * @describe 设置页面
 * @org www.sharegoodsmall.com
 * @email chenxiang@meeruu.com
 */
export default class HelperQuestionListPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            data: []
        };
    }

    $navigationBarOptions = {
        title: this.params.list[0] ? this.params.list[0].name : '列表名称',
        show: true // false则隐藏导航
    };

    renderContentView = () => {
        let arr = [];
        if (this.params.list.length > 0) {
            for (let i = 0; i < this.params.list.length; i++) {
                arr.push(
                    <View key={i} style={{ width: ScreenUtils.width, height: 48 }}>
                        <TouchableOpacity style={styles.containerStyles}
                                          onPress={() => this.orderMenuJump(this.params.list[i].id)}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <UIText value={this.params.list[i].title}
                                        style={[styles.blackText, { marginLeft: 5 }]}/>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={arrow_right} style={{ height: 10 }} resizeMode={'contain'}/>
                            </View>
                        </TouchableOpacity>

                        <View style={{ backgroundColor: DesignRule.lineColor_inColorBg, height: 0.5, marginLeft: 21 }}/>

                    </View>
                );
            }
            return arr;
        } else {
            return null;
        }
    };

    renderFooter() {
        return (
            <View style={{
                width: ScreenUtils.width, height: 80, position: 'absolute', bottom: 0,
                alignItems: 'center', justifyContent: 'center'
            }}>
                <Text style={{ fontSize: 13, color: '#999999' }} allowFontScaling={false}>联系客服 400-9696-365</Text>
                <Text style={{ fontSize: 13, color: '#999999' }} allowFontScaling={false}>早9:00 - 22:00</Text>
            </View>
        );
    }

    orderMenuJump(i) {
        this.$navigate('mine/helper/HelperQuestionDetail', { id: i });
    }

    _render() {
        return (
            <View style={{ backgroundColor: DesignRule.bgColor, flex: 1, marginBottom: ScreenUtils.safeBottom }}>
                <ScrollView style={{ marginBottom: 80 }}>
                    <View style={{ width: ScreenUtils.width, height: 10 }}/>
                    {this.renderContentView()}
                </ScrollView>
                {this.renderFooter()}
            </View>
        );

    }
}

const styles = StyleSheet.create({
    blackText: {
        fontSize: 13,
        color: DesignRule.textColor_mainTitle
    },
    containerStyles: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 44,
        paddingLeft: 21,
        paddingRight: 28,
        backgroundColor: 'white',
        flexDirection: 'row'
    }
});
