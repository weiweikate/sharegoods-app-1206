/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by huchao on 2018/10/16.
 *
 */
"use strict";
import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Platform,
    TouchableWithoutFeedback
} from "react-native";
import BasePage from '../../../../BasePage';
import ScreenUtils from '../../../../utils/ScreenUtils';
import {
    UIImage,
    UIText
} from '../../../../components/ui';
import bg_01 from '../../res/customerservice/bg_01.png'
import bg from '../../res/customerservice/bg.png'
const autoSizeWidth =  ScreenUtils.autoSizeWidth;
import CommShareModal from '../../../../comm/components/CommShareModal'
import bridge from '../../../../utils/bridge'
// import BaseUrl from '../../../../api/BaseUrl'
import fanhui from '../../res/homeBaseImg/fanhui.png'
import apiEnvironment from '../../../../api/ApiEnvironment';
import DesignRule from 'DesignRule';

type Props = {};
export default class InviteFriendsPage extends BasePage<Props> {
    constructor(props) {
        super(props);
        this.state = {
            disable:false,
            path: ''
        };
        this._bind();
    }

    $navigationBarOptions = {
        title: "",
        show: false// false则隐藏导航
    };

    _bind() {
        this.loadPageData = this.loadPageData.bind(this);
        this.creatQRCodeImage = this.creatQRCodeImage.bind(this);
    }

    componentDidMount() {
        this.loadPageData();
    }

    loadPageData() {
        this.creatQRCodeImage(`${apiEnvironment.getCurrentH5Url()}/register`);
    }

    creatQRCodeImage(QRCodeStr){
       bridge.creatQRCodeImage(QRCodeStr, (path) => {
           this.setState({path:Platform.OS === 'android' ? 'file://' + path : '' + path});
       }) ;
    }

    //截屏
    _saveImg = () => {
        this.setState({
            disable: true
        }, () => {
            bridge.saveScreen(null, () => {
                this.$toastShow('保存成功');
                this.__timer__ = setTimeout(() => {
                    this.setState({
                        disable: false
                    });
                }, 2500);
            }, () => {
                this.$toastShow('保存失败');
                this.setState({
                    disable: false
                });
            });
        });
    };

    _render() {
        return (
            <View style={styles.container}>
                <UIImage source = {bg_01}
                         style = {{
                             width: autoSizeWidth(375),
                             height: autoSizeWidth(567 / 2.0),
                             top: 0,
                             left: 0,
                             position: 'absolute',
                         }}/>
                <UIImage source = {bg}
                         style = {{
                             width: autoSizeWidth(486 / 2),
                             height: autoSizeWidth(582 / 2.0),
                             marginTop: autoSizeWidth(140),
                         }}/>
                <TouchableWithoutFeedback onPress = {() => {this.$navigateBack()}}>
                    <View style = {{
                        width: 44,
                        height: 44,
                        top: ScreenUtils.statusBarHeight,
                        left: 0,
                        position: 'absolute',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <UIImage source = {fanhui}
                             style = {{
                                 width: 13,
                                 height: 22
                             }}/>
                    </View>
                </TouchableWithoutFeedback>
                <UIImage source = {{uri: this.state.path}}
                         style = {{
                             width: autoSizeWidth(160),
                             height: autoSizeWidth(160),
                             top: autoSizeWidth(165),
                             left: autoSizeWidth(107.5),
                             position: 'absolute',
                             backgroundColor: DesignRule.mainColor,
                         }}/>
                <UIText value = {'专属你的惊喜福利活动\n数量有限赶快参与吧～'}
                        style = {{
                            marginTop: autoSizeWidth(20),
                            fontSize: autoSizeWidth(18),
                            color: DesignRule.textColor_secondTitle,
                            lineHeight: autoSizeWidth(28)
                        }}
                />
                <View style = {{flexDirection: 'row', marginTop: autoSizeWidth(50)}}>
                    <View style = {{flex: 1}}/>
                    <TouchableOpacity style={styles.btnContainer} onPress={this._saveImg} disabled={this.state.disable}>
                        <UIText value = {'保存图片'} style = {styles.btnText}/>
                    </TouchableOpacity>
                    <View style = {{flex: 1}}/>
                    <TouchableOpacity style={styles.btnContainer} onPress={() => {this.shareModal.open()}}>
                        <UIText value = {'分享至...'} style = {styles.btnText}/>
                    </TouchableOpacity>
                    <View style = {{flex: 1}}/>
                </View>
                <CommShareModal ref={(ref) => this.shareModal = ref}
                                 // type={'promotionShare'}
                               //  imageJson={{
                               //      imageUrlStr: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1539577593172&di=c87eead9eb2e2073b50758daf6194c62&imgtype=0&src=http%3A%2F%2Fi2.hdslb.com%2Fbfs%2Farchive%2F59c914525c484566292f8d8d3d29c964ca59c7ca.jpg',
                               //      titleStr: '商品标题',
                               //      priceStr: '¥100.00',
                               //      QRCodeStr: '分享的链接'
                               //  }}
                                webJson={{
                                    title: '邀请好友免费领取福利',
                                    dec: '属你的惊喜福利活动\n数量有限赶快参与吧～',
                                    linkUrl: `${apiEnvironment.getCurrentH5Url()}/register`,
                                    thumImage: 'logo.png'
                                }}
                                // miniProgramJson = {{
                                //     title: '分享小程序title',
                                //     dec: '分享小程序子标题',
                                //     thumImage: 'logo.png',
                                //     linkUrl: '${apiEnvironment.getCurrentH5Url()}/pages/index/index',
                                //     userName: 'gh_3ac2059ac66f',
                                //     miniProgramPath: 'pages/index/index'}}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    btnContainer: {
        borderRadius: autoSizeWidth(25),
        width: autoSizeWidth(150),
        height: autoSizeWidth(50),
        backgroundColor: '#F2D3A2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        fontSize: 18,
        color: 'white',
    }
});
