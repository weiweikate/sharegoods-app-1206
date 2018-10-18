//邀请好友加入店铺
import React from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    ImageBackground,
    TouchableOpacity
} from 'react-native';
import QRCode from 'react-native-qrcode';
import Banner from './src/yqhy_03.png';
import Center from './src/yqhy_04.png';
import ScreenUtils from '../../../utils/ScreenUtils';
import BasePage from '../../../BasePage';
import SpellShopApi from '../api/SpellShopApi';
import { PageLoadingState } from '../../../components/pageDecorator/PageState';

const gap = -5;

export default class InvitationToShopPage extends BasePage {

    $navigationBarOptions = {
        title: '邀请好友加入店铺'
    };

    constructor(props) {
        super(props);
        this.state = {
            data: {}
        };
    }

    componentDidMount() {
        this._loadPageData();
    }

    _loadPageData = () => {
        SpellShopApi.getById().then((data) => {
            this.setState({
                data: data.data || {}
            });
        }).catch((error) => {
            this.$toastShow(error.msg);
        });
    };

    info = {};
    // 保存部分截屏
    _saveImg = () => {

    };

    _shareImg = () => {

    };

    _onLayout = ({ nativeEvent }) => {
        const { layout } = nativeEvent;
        this.info.width = layout.width - (gap * 2);
        this.info.height = layout.height - (gap * 2);
        this.info.left = 40 + gap;
    };

    _onLayoutImg = ({ nativeEvent }) => {
        const { layout } = nativeEvent;
        this.info.imgHeight = layout.height;
    };

    _render() {
        // 需要分享的参数信息
        const shareInfo = this.state.params.shareInfo || {};
        return (
            <View style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ alignItems: 'center' }}>


                        <ImageBackground onLayout={this._onLayout} style={[styles.imgBg]}
                                         source={Center}>
                            <View style={styles.topContainer}>
                                {
                                    shareInfo.headUrl ?
                                        <Image style={styles.topImg} source={{ uri: shareInfo.headUrl }}/> :
                                        <View style={styles.topImg}/>
                                }
                                <View style={{ justifyContent: 'space-between' }}>
                                    <Text style={styles.text}>{shareInfo.name || ''}</Text>
                                    <Text style={styles.text}>店铺ID：{shareInfo.id || ''}</Text>
                                    <Text style={styles.text}>店主：{shareInfo.nickname || ''}</Text>
                                </View>
                            </View>
                            <View style={styles.qrContainer}>
                                <QRCode
                                    value={'https://www.baidu.com/'}
                                    size={140 - 6}
                                    bgColor='#333'
                                    fgColor='white'/>
                            </View>
                            <Text style={styles.wxTip}>分享至微信，为您的店铺增添活力</Text>


                        </ImageBackground>

                        <Image style={{
                            position: 'absolute',
                            top: 40
                        }} onLayout={this._onLayoutImg} source={Banner}/>

                        <View style={{ flexDirection: 'row', marginTop: 50, justifyContent: 'center' }}>
                            <TouchableOpacity style={styles.bottomBtn} onPress={this._saveImg}>
                                <Text style={styles.textBtn}>
                                    保存图片
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.bottomBtn, { marginLeft: 20 }]} onPress={this._shareImg}>
                                <Text style={styles.textBtn}>
                                    分享到...
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    imgBg: {
        marginTop: 95,
        alignItems: 'center',
        width: ScreenUtils.autoSizeWidth(279),
        height: ScreenUtils.autoSizeWidth(370),
        borderRadius: 10,
        overflow: 'hidden'
    },
    topContainer: {
        flexDirection: 'row',
        marginTop: 42
    },
    topImg: {
        width: 65,
        height: 65,
        backgroundColor: '#eee',
        borderRadius: 5,
        marginRight: 9
    },


    text: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        color: '#000000'
    },
    qrContainer: {
        width: 140,
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
        borderWidth: 1,
        borderColor: '#D51243'
    },

    wxTip: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        color: '#D51243',
        marginTop: 15
    },
    bottomBtn: {
        height: 42,
        width: 143,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#D51243',
        borderWidth: 1,
        borderRadius: 5
    },
    textBtn: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 14,
        color: '#D51243'
    }

});
