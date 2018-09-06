import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TextInput as RNTextInput, Button
} from 'react-native';

import { color } from '../../../../constants/Theme';
import ScreenUtils from '../../../../utils/ScreenUtils';

export default class NickNameModifyPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldNickName: this.props.navigation.state.params.oldNickName,
            nickName: this.props.navigation.state.params.oldNickName
        };
    }

    static  $PageOptions = {
        navigationBarOptions: {
            title: '个人资料'
        },
        renderByPageState: true
    };

    //**********************************ViewPart******************************************
    render() {
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
                <Button
                    title='保存'
                    style={{
                        marginTop: 36,
                        backgroundColor: color.red,
                        width: ScreenUtils.width - 96,
                        height: 48,
                        marginLeft: 48,
                        marginRight: 48
                    }}
                    onPress={() => this.save()}/>
            </View>
        );
    }

    renderWideLine = () => {
        return (
            <View style={{ height: 10, backgroundColor: color.page_background }}/>
        );
    };
    save = () => {
        this.$toastShow('啥啥啥');
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: color.page_background
    }, inputTextStyle: {
        height: 48, backgroundColor: 'white', fontSize: 14, paddingLeft: 14, paddingRight: 14
    }
});
