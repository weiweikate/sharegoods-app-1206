/**
 * Created by nuomi on 2018/7/18.
 * 提供预览当前用户信息页面
 * 用于显示当前用户各个字段参数的值
 * 任何可能在测试阶段产生疑惑或者容易差生bug误差的参数信息，都应当提供预览调试面板
 * 否则真机包，又需要各种抓包，断点调试才可能还原异常现场
 */
import React, { Component } from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import user from '../../model/user';
import DesignRule from '../../constants/DesignRule';

export default class UserInfoPage extends Component {

    static $PageOptions = {
        navigationBarOptions: {
            title: '当前用户信息'
        }
    };

    state = { cookie: null };

    componentDidMount() {
        // todo cookie
        this.setState({ cookie: {} });
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <Text style={{ margin: 15, color: DesignRule.mainColor }}>登录状态：{user.isLogin ? '登录成功' : '未登录'}</Text>
                <Text selectable style={{ margin: 10 }}>当前cookie：{JSON.stringify(this.state.cookie)}</Text>
                {
                    Object.keys(user).map((key, index) => {
                        return <Text key={index} selectable style={{ margin: 10 }}>
                            {`${key}: ${user[key]}`}
                        </Text>;
                    })
                }
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignRule.bgColor
    }
});
