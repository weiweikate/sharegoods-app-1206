import React from 'react';
import {
    StyleSheet,
    View,
    TextInput as RNTextInput, Button
} from 'react-native';
import BasePage from '../../../../BasePage';
import { color } from '../../../../constants/Theme';
import ScreenUtils from '../../../../utils/ScreenUtils';
import MineAPI from '../../api/MineApi';
import user from '../../../../model/user';

export default class NickNameModifyPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            oldNickName: this.props.navigation.state.params.oldNickName,
            nickName: this.props.navigation.state.params.oldNickName
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
                <RNTextInput
                    style={styles.inputTextStyle}
                    onChangeText={text => this.setState({ nickName: text })}
                    placeholder={this.state.nickName}
                    value={this.state.nickName}
                    underlineColorAndroid={'transparent'}
                />
                {this.renderWideLine()}
                <View style={{
                    marginTop: 36,
                    width: ScreenUtils.width - 96,
                    height: 50,
                    marginLeft: 48,
                    marginRight: 48
                }}>
                    <Button
                        title='保存'
                        color={color.red}
                        onPress={() => this.save()}/>
                </View>
            </View>
        );
    }

    renderWideLine = () => {
        return (
            <View style={{ height: 10, backgroundColor: color.page_background }}/>
        );
    };
    save = () => {
        MineAPI.updateUserById({ type: 2, nickname: this.state.nickName }).then(res => {
            if (res.code === 10000) {
                user.nickname = this.state.nickName;
                this.$navigateBack();
            }
        }).catch(err => {
            console.log(err);
        });
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: color.page_background
    }, inputTextStyle: {
        height: 48, backgroundColor: 'white', fontSize: 14, paddingLeft: 14, paddingRight: 14
    }
});
