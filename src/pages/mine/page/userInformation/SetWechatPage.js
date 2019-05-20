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
// import MineAPI from '../../api/MineApi';
// import user from '../../../../model/user';
import DesignRule from '../../../../constants/DesignRule';

export default class SetWechatPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            wechatID: this.props.navigation.state.params.wechatID,
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
                        style={styles.inputTextStyle}
                        onChangeText={text => this.setState({ wechatID: text })}
                        placeholder={this.state.wechatID?this.state.wechatID:'请输入您的微信号，便于顾问/秀迷联系您'}
                        value={this.state.wechatID}
                    />
                </View>
                {this.renderWideLine()}
                <MRText style={{marginLeft:15, color:'#FF0050'}}>999999</MRText>
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
        // let length = this.state.wechatName.trim().length;
        // console.log('nickname', this.state.wechatName, length);
        // if (length < 2 || length > 8) {
        //     this.$toastShow('昵称长度位2-8位');
        //     return;
        // }
        // MineAPI.updateUserById({ type: 2, nickname: this.state.nickName }).then(res => {
        //
        //     // let containSpecial = RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)]+/);
        //     // if (containSpecial.test(this.state.nickName)) {
        //     //     this.$toastShow('昵称不能包含特殊字符');
        //     //     return;
        //     // }
        //     user.nickname = this.state.nickName;
        //     track(trackEvent.ModifyNickNameSuccess, {});
        //     this.$navigateBack();
        // }).catch(err => {
        //     this.$toastShow(err.msg);
        // });
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
