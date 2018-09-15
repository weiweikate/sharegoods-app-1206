import React from 'react';
import {
    Text, View, Image
} from 'react-native';
import BasePage from '../../../../BasePage';
import Logo from '../../res/setting/launcher.png';

export default class AboutUsPage extends BasePage {

    $navigationBarOptions = {
        title: '关于我们'
    };

    constructor(props) {
        super(props);
        this.state = {
            version: '1.0.0'
        };

    }

    _render() {
        return <View style={{ flexDirection: 'column', flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
            <Image source={Logo} style={{ height: 70, width: 70, marginTop: 40 }}/>
            <Text style={{ color: '#666666', fontSize: 12, marginTop: 10 }}>当前版本：{this.state.version}</Text>
            <Text style={{ color: '#222222', fontSize: 15, marginTop: 94 }}>公司简介</Text>
            <Text style={{
                flex: 1,
                color: '#666666',
                fontSize: 13,
                marginTop: 14,
                marginRight: 40,
                marginLeft: 40
            }}>杭州名融网络有限公司是一家以移动社交零售平台为主的互联网公司。目前，公司以雄厚的资金规模和全球知名时尚品牌共同打造全新的互联网流量经济平台和网红经济平台。公司以强大的资源体系和行业成功案例为依托，不断突破和创新，短短几年多时间已具有百万在线用户！</Text>
            <Text style={{ color: '#999999', fontSize: 11 }}>杭州名融网络有限公司版权所有</Text><Text
            style={{
                color: '#999999',
                fontSize: 11,
                marginTop: 10,
                marginBottom: 24
            }}>Copyright@2018杭州名融网络有限公司版权所有</Text>
        </View>;
    }
}
