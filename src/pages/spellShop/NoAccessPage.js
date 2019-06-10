import React, { Component } from 'react';
import {
    View, ScrollView,
    Image,
    RefreshControl, ImageBackground,
    StyleSheet, TouchableWithoutFeedback
} from 'react-native';
import SpellStatusModel from './model/SpellStatusModel';
import ScreenUtils from '../../utils/ScreenUtils';
import NavigatorBar from '../../components/pageDecorator/NavigatorBar/NavigatorBar';
import DesignRule from '../../constants/DesignRule';
import res from './res';
import OssHelper from '../../utils/OssHelper';
import { navigate } from '../../navigation/RouterMap';
import apiEnvironment from '../../api/ApiEnvironment';

const {
    pindianzhaojilingbgd,
    pindianzhaojiling
} = res;

export default class NoAccessPage extends Component {
    state = {
        imgError: false
    };

    render() {
        const { imgError } = this.state;
        const imgWidth = ScreenUtils.width;
        const imgHeight = ScreenUtils.height - ScreenUtils.headerHeight - (this.props.leftNavItemHidden ? ScreenUtils.tabBarHeight : 0);
        return (
            <View style={{ flex: 1 }}>
                <NavigatorBar leftNavItemHidden={this.props.leftNavItemHidden}
                              leftPressed={() => {
                                  this.props.navigation.goBack();
                              }}
                              title={this.props.leftNavItemHidden ? '拼店' : '店铺详情'}/>
                <ScrollView showsVerticalScrollIndicator={false}
                            refreshControl={<RefreshControl title="下拉刷新"
                                                            tintColor={DesignRule.textColor_instruction}
                                                            titleColor={DesignRule.textColor_instruction}
                                                            refreshing={SpellStatusModel.refreshing}
                                                            colors={[DesignRule.mainColor]}
                                                            onRefresh={() => {
                                                                SpellStatusModel.getUser(1).then().catch((error) => {
                                                                });
                                                            }}/>}>
                    <View style={{ flex: 1 }}>
                        <ImageBackground style={[styles.bgImg, { width: imgWidth, height: imgHeight }]}
                                         source={imgError ? pindianzhaojilingbgd : { uri: OssHelper('/app/pindianzhaojilingbgd.png') }}
                                         onError={() => {
                                             this.setState({
                                                 imgError: true
                                             });
                                         }}
                                         resizeMode='stretch'>
                            <TouchableWithoutFeedback onPress={() => {
                                navigate('HtmlPage', {
                                    uri: `${apiEnvironment.getCurrentH5Url()}/topic/temp/ST20190084`
                                });
                            }}>
                                <Image style={{ width: imgWidth, height: imgHeight }}
                                       source={imgError ? pindianzhaojiling : { uri: OssHelper('/app/pindianzhaojiling.png') }}
                                       onError={() => {
                                           this.setState({
                                               imgError: true
                                           });
                                       }}
                                       resizeMode='contain'/>
                            </TouchableWithoutFeedback>
                        </ImageBackground>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bgImg: {
        justifyContent: 'center', alignItems: 'center'
    }
});
