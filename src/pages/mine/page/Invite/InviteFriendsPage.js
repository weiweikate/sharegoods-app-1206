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
    Platform
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

type Props = {};
export default class InviteFriendsPage extends BasePage<Props> {
    constructor(props) {
        super(props);
        this.state = {
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
        this.creatQRCodeImage('二维码链接');
    }

    creatQRCodeImage(QRCodeStr){
       bridge.creatQRCodeImage(QRCodeStr, (path) => {
           this.setState({path:Platform.OS === 'android' ? 'file://' + path : '' + path});
       }) ;
    }

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
                <UIImage source = {{uri: this.state.path}}
                         style = {{
                             width: autoSizeWidth(160),
                             height: autoSizeWidth(160),
                             top: autoSizeWidth(165),
                             left: autoSizeWidth(107.5),
                             position: 'absolute',
                             backgroundColor: 'red',
                         }}/>
                <UIText value = {'专属你的惊喜福利活动\n数量有限赶快参与吧～'}
                        style = {{
                            marginTop: autoSizeWidth(20),
                            fontSize: autoSizeWidth(18),
                            color: '#666666',
                            lineHeight: autoSizeWidth(28)
                        }}
                />
                <View style = {{flexDirection: 'row', marginTop: autoSizeWidth(50)}}>
                    <View style = {{flex: 1}}/>
                    <TouchableOpacity style={styles.btnContainer} onPress={() => {bridge.saveScreen()}}>
                        <UIText value = {'保存图片'} style = {styles.btnText}/>
                    </TouchableOpacity>
                    <View style = {{flex: 1}}/>
                    <TouchableOpacity style={styles.btnContainer} onPress={() => {this.shareModal.open()}}>
                        <UIText value = {'分享至...'} style = {styles.btnText}/>
                    </TouchableOpacity>
                    <View style = {{flex: 1}}/>
                </View>
                <CommShareModal ref={(ref) => this.shareModal = ref}
                                // type={'miniProgram'}
                               //  imageJson={{
                               //      imageUrlStr: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1539577593172&di=c87eead9eb2e2073b50758daf6194c62&imgtype=0&src=http%3A%2F%2Fi2.hdslb.com%2Fbfs%2Farchive%2F59c914525c484566292f8d8d3d29c964ca59c7ca.jpg',
                               //      titleStr: '商品标题',
                               //      priceStr: '¥100.00',
                               //      QRCodeStr: '分享的链接'
                               //  }}
                                webJson={{
                                    title: '分享标题(当为图文分享时候使用)',
                                    dec: '内容(当为图文分享时候使用)',
                                    linkUrl: 'http://testh5.sharegoodsmall.com/#/register',
                                    thumImage: 'logo.png'
                                }}
                                // miniProgramJson = {{
                                //     title: '分享小程序title',
                                //     dec: '分享小程序子标题',
                                //     thumImage: 'logo.png',
                                //     linkUrl: 'https://testapi.sharegoodsmall.com/pages/index/index',
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
