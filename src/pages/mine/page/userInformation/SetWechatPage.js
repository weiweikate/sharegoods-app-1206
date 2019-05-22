/**
 * Created by zhoujianxin on 2019/5/20.
 * @Desc
 */

import React from 'react';
import {
    StyleSheet,
    View
} from 'react-native';
import BasePage from '../../../../BasePage';
import {UIButton, MRTextInput as RNTextInput, MRText} from '../../../../components/ui';
import ScreenUtils from '../../../../utils/ScreenUtils';
import MineAPI from '../../api/MineApi';
import user from '../../../../model/user';
import DesignRule from '../../../../constants/DesignRule';

export default class SetWechatPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            weChatNumber: this.props.navigation.state.params.weChatNumber,
            error:''
        };
    }

    $navigationBarOptions = {
        title: '个人资料',
        show: true // false则隐藏导航
    };

    //**********************************ViewPart******************************************
    _render() {
        return (
            <View style={styles.container}>
                {this.renderWideLine()}
                <View style={{ backgroundColor: 'white' }}>
                    <RNTextInput
                        autoCapitalize={'none'}
                        style={styles.inputTextStyle}
                        onChangeText={text => this.setState({ weChatNumber: text ,error:''})}
                        placeholder={this.state.weChatNumber?this.state.weChatNumber:'请输入您的微信号，便于顾问/秀迷联系您'}
                        value={this.state.weChatNumber}
                    />
                </View>
                {this.renderWideLine()}
                {this.state.error.length>0?<MRText style={{marginLeft:15, color:'#FF0050'}}>{this.state.error}</MRText>:null}
                {this.renderWideLine()}
                <UIButton
                    value={'保存'}
                    style={{
                        marginTop: 8,
                        width: ScreenUtils.width - 96,
                        height: 50,
                        marginLeft: 48,
                        marginRight: 48,
                        borderRadius: 25,
                        backgroundColor: DesignRule.mainColor
                    }}
                    onPress={() => this.save()}/>
            </View>
        );
    }

    renderWideLine = () => {
        return (
            <View style={{ height: 10, backgroundColor: DesignRule.bgColor }}/>
        );
    };
    save = () => {
        let length = this.state.weChatNumber?this.state.weChatNumber.trim().length:0;
        if (length < 6 || length > 20) {
            this.setState({
                error:'请填写正确的微信号'
            })
            this.$toastShow('微信长度为6-20位');
            return;
        }

        let containSpecial = RegExp(/^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/);
        if (!containSpecial.test(this.state.weChatNumber)) {
            this.setState({
                error:'请填写正确的微信号'
            })
            this.$toastShow('首字母、数字、下划线和减号，不支持设置中文');
            return;
        }

        MineAPI.updateUserById({ type: 7, weChatNumber: this.state.weChatNumber }).then(res => {
            user.weChatNumber = this.state.weChatNumber;
            this.$navigateBack();
        }).catch(err => {
            this.$toastShow(err.msg);
        });
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: DesignRule.bgColor
    },
    inputTextStyle: {
        height: 48, fontSize: 14, paddingLeft: 14, paddingRight: 14
    }
});
