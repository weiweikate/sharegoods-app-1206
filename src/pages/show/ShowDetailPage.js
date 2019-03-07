import React from 'react';
import {
    ScrollView,
    Image,
    TouchableOpacity,
    View,
    ActivityIndicator,
    StyleSheet,
    NativeModules,
    Alert
} from 'react-native';
import ShowImageView from './ShowImageView';
import res from './res';
import ScreenUtils from '../../utils/ScreenUtils';
import DesignRule from '../../constants/DesignRule';
import AutoHeightWebView from '@mr/react-native-autoheight-webview';

const { px2dp } = ScreenUtils;
// import HTML from 'react-native-render-html';
import { ShowDetail } from './Show';
import { observer } from 'mobx-react';
import CommShareModal from '../../comm/components/CommShareModal';
import user from '../../model/user';
import apiEnvironment from '../../api/ApiEnvironment';
import ImageLoad from '@mr/image-placeholder';
import BasePage from '../../BasePage';
import { PageLoadingState } from '../../components/pageDecorator/PageState';
import {
    MRText as Text
} from '../../components/ui';
import Toast from '../../utils/bridge';
import { NetFailedView } from '../../components/pageDecorator/BaseView';
import AvatarImage from '../../components/ui/AvatarImage';

const Goods = ({ data, press }) => <TouchableOpacity style={styles.goodsItem} onPress={() => {
    press && press();
}}>
    <ImageLoad style={styles.goodImg} source={{ uri: data.headImg ? data.headImg : '' }}/>
    <View style={styles.goodDetail}>
        <Text style={styles.name} allowFontScaling={false}>{data.name}</Text>
        <View style={{ height: px2dp(4) }}/>
        <Text style={styles.price} allowFontScaling={false}>￥ {data.price}起</Text>
    </View>
</TouchableOpacity>;

@observer
export default class ShowDetailPage extends BasePage {

    $navigationBarOptions = {
        title: '',
        show: false
    };

    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params || {};
        this.showDetailModule = new ShowDetail();
        this.state = {
            pageState: PageLoadingState.loading,
            errorMsg: ''
        };
        this.noNeedRefresh = false;
    }

    $isMonitorNetworkStatus() {
        return true;
    }

    componentWillMount() {
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
                if (this.noNeedRefresh) {
                    this.noNeedRefresh = true;
                    return;
                }
                const { state } = payload;
                if (state && state.routeName === 'show/ShowDetailPage') {
                    Toast.showLoading();
                    if (this.params.code) {
                        this.showDetailModule.showDetailCode(this.params.code || this.params.id).then(() => {
                            this.setState({
                                pageState: PageLoadingState.success
                            });
                            Toast.hiddenLoading();
                        }).catch(error => {
                            this.setState({
                                pageState: PageLoadingState.fail,
                                errorMsg: error.msg || '获取详情失败'
                            });
                            this._whiteNavRef.setNativeProps({
                                opacity: 1
                            });
                            Toast.$toast(error.msg || '获取详情失败');
                            Toast.hiddenLoading();
                        });
                    } else {
                        this.showDetailModule.loadDetail(this.params.id).then(() => {
                            this.setState({
                                pageState: PageLoadingState.success
                            });
                            Toast.hiddenLoading();
                        }).catch(error => {
                            this.setState({
                                pageState: PageLoadingState.fail,
                                errorMsg: error.msg || '获取详情失败'
                            });
                            this._whiteNavRef.setNativeProps({
                                opacity: 1
                            });
                            Toast.$toast(error.msg || '获取详情失败');
                            Toast.hiddenLoading();
                        });
                    }
                }
            }
        );
    }

    componentWillUnmount() {
        this.willFocusSubscription && this.willFocusSubscription.remove();
    }

    _goBack() {
        console.log('_goBack');
        const { navigation } = this.props;
        navigation.goBack(null);
    }

    _goToGoodsPage(good) {
        const { navigation } = this.props;
        navigation.push('home/product/ProductDetailPage', {
            productCode: good.code, preseat: '秀场详情'
        });
    }

    _goodAction() {
        console.log('_goodAction', user.isLogin);
        if (user.isLogin) {
            this.showDetailModule.showGoodAction();
        } else {
            const { navigation } = this.props;
            navigation.push('login/login/LoginPage');
        }
    }

    _collectAction() {
        if (user.isLogin) {
            this.showDetailModule.showConnectAction();
        } else {
            const { navigation } = this.props;
            navigation.push('login/login/LoginPage');
        }
    }

    _goToShare() {
        this.shareModal && this.shareModal.open();
    }

    _onScroll = (event) => {
        let Y = event.nativeEvent.contentOffset.y;
        let height = ScreenUtils.width;
        let shadowOpacity = 0;
        console.log('_onScroll', Y);
        if (Y < height) {
            shadowOpacity = Y / height;
        } else {
            shadowOpacity = 1;
        }
        this._whiteNavRef.setNativeProps({
            opacity: shadowOpacity
        });
        this._blackNavRef.setNativeProps({
            opacity: 1 - shadowOpacity
        });
    };

    _onLongClickImage = (event) => {
        alert(event.nativeEvent.url);
    };

    _renderNormalTitle() {
        return <View style={styles.whiteNav} ref={(ref) => {
            this._whiteNavRef = ref;
        }} opacity={0}>
            <View style={styles.navTitle}>
                <TouchableOpacity style={styles.backView} onPress={() => this._goBack()}>
                    <Image source={res.back}/>
                </TouchableOpacity>
                <View style={styles.titleView}>
                    <Text style={styles.title}>秀场</Text>
                </View>
                <TouchableOpacity style={styles.shareView} onPress={() => {
                    this._goToShare();
                }}>
                    <Image source={res.more}/>
                </TouchableOpacity>
            </View>
        </View>;
    }

    _showImagesPage(imgs, index) {
        this.noNeedRefresh = true;
        const { navigation } = this.props;
        navigation.push('show/ShowDetailImagePage', {
            imageUrls: imgs,
            index: index
        });
    }

    _onLongClickImage = (event)=>{
        let url = event.nativeEvent.url;
        Alert.alert('保存图片','', [
            {
                text: '取消', onPress: () => {

                }
            },
            {
                text: '保存到相册', onPress: () => {
                    NativeModules.commModule.saveImageToPhotoAlbumWithUrl(url).then(()=>{
                        this.$toastShow('保存成功!')
                    }).catch((error)=>{

                    });
                }
            }]);
    }

    _render() {

        const { pageState } = this.state;
        if (pageState === PageLoadingState.fail) {
            return <View style={styles.container}><NetFailedView
                netFailedInfo={{ msg: this.state.errorMsg }}/>{this._renderNormalTitle()}</View>;
        }

        const { detail, isCollecting } = this.showDetailModule;
        if (!detail) {
            return <View style={styles.loading}/>;
        }
        let products = detail.products;
        let number = detail.click;
        if (!number) {
            number = 0;
        }
        if (number > 999999) {
            number = 999999 + '+';
        }


        let html = '<!DOCTYPE html><html>' +
            '<head>' +
            '<meta http-equiv="Content-type" content="text/html; charset=utf-8" />' +
            //'<meta content="m.007fenqi.com" name="author"/>' +
            '<meta content="yes" name="apple-mobile-web-app-capable"/>' +
            '<meta content="yes" name="apple-touch-fullscreen"/>' +
            '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />' +
            '<meta http-equiv="Expires" content="-1"/>' +
            '<meta http-equiv="Cache-Control" content="no-cache">' +
            '<meta http-equiv="Pragma" content="no-cache">'
            // + '<link rel="stylesheet" href="http://m.007fenqi.com/app/app.css" type="text/css"/>'
            + '<style type="text/css">' + 'html, body, p, embed, iframe, div ,video {'
            + 'position:relative;width:100%;margin:0;padding:0;background-color:#ffffff' + ';line-height:28px;box-sizing:border-box;display:block;font-size:'
            + px2dp(13)
            + 'px;'
            + '}'
            + 'p {word-break:break-all;}'
            + 'table { border-collapse:collapse;}'
            + 'table, td, th {border:1px solid #ddd;}'
            + 'blockquote { display: block;' +
            '    background: #f9f9f9;' +
            '    border-left: 10px solid #ccc;' +
            '    margin: 10px;' +
            '    padding: 0px;' +
            '    position: relative;' +
            '    box-sizing: border-box;}'
            //  + Utils.NVL(this.props.webviewStyle, '')
            + '</style>'
            + '<script type="text/javascript">'
            + 'function ResizeImages() {'
            + 'var myimg,oldwidth;'
            + 'var maxwidth = document.body.clientWidth;'
            + 'for(i=0;i <document.images.length;i++){'
            + 'myimg = document.images[i];'
            + 'if(myimg.width > maxwidth){'
            + 'oldwidth = myimg.width;'
            + 'myimg.width = maxwidth;'
            + '}'
            + '}'
            + '}'
            + '</script>'
            + '</head>'
            + '<body onload="ResizeImages();">'
            + '<div>'
            + detail.content
            + '</div>'
            + '</body></html>';

        return <View style={styles.container}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={30}
                onScroll={this._onScroll.bind(this)}
            >
                {
                    detail.imgs
                        ?
                        <ShowImageView items={detail.imgs.slice()}
                                       onPress={(imgs, index) => this._showImagesPage(imgs, index)}/>
                        :
                        <View style={styles.header}/>
                }
                <View style={styles.profileRow}>
                    <View style={styles.profileLeft}>
                        <AvatarImage borderRadius={px2dp(15)} style={styles.portrait}
                                     source={{ uri: detail.userHeadImg ? detail.userHeadImg : '' }}/>
                        <Text style={styles.showName}
                              allowFontScaling={false}>{detail.userName ? detail.userName : ''}</Text>
                    </View>
                    {/*<View style={styles.profileRight}>*/}
                        {/*<Image source={res.button.see}/>*/}
                        {/*<Text style={styles.number} allowFontScaling={false}>{number}</Text>*/}
                    {/*</View>*/}
                </View>
                {/*<HTML html={content} imagesMaxWidth={width - px2dp(30)}*/}
                {/*imagesInitialDimensions={{ width: width - px2dp(30), height: 0 }} containerStyle={{*/}
                {/*backgroundColor: '#fff',*/}
                {/*marginLeft: px2dp(15),*/}
                {/*marginRight: px2dp(15)*/}
                {/*}} baseFontStyle={{*/}
                {/*lineHeight: px2dp(28),*/}
                {/*color: DesignRule.textColor_mainTitle,*/}
                {/*fontSize: px2dp(13)*/}
                {/*}}/>*/}
                <AutoHeightWebView source={{ html: html }}
                                   style={{ width: DesignRule.width-30,alignSelf:'center' }}
                                   scalesPageToFit={true}
                                   javaScriptEnabled={true}
                                   cacheEnabled={true}
                                   domStorageEnabled={true}
                                   mixedContentMode={'always'}
                                   onLongClickImage={this._onLongClickImage}
                                   showsHorizontalScrollIndicator={false}
                                   showsVerticalScrollIndicator={false}

                />
                <View style={styles.goodsView}>
                    {
                        products.map((value, index) => {
                            return <Goods key={index} data={value} press={() => {
                                this._goToGoodsPage(value);
                            }}/>;
                        })
                    }
                </View>

                {
                    isCollecting
                        ?
                        <View style={[styles.bottomBtn]}>
                            <ActivityIndicator style={styles.btnLoading} size='small'/>
                        </View>
                        :
                        <TouchableOpacity style={styles.bottomBtn} onPress={() => this._collectAction()}>
                            <Image style={styles.collectImg}
                                   source={detail.hadCollect ? res.showFire : res.noShowFire}/>
                            <Text style={styles.bottomText}
                                  allowFontScaling={false}>{'人气值'} · {detail.collectCount}</Text>
                        </TouchableOpacity>
                }
            </ScrollView>
            <View style={styles.bottom}>
                <View style={styles.showTimesWrapper}>
                    <Image source={res.button.see} style={styles.seeImgStyle}/>
                    <Text style={styles.number} allowFontScaling={false}>浏览 · {number}</Text>
                </View>

                <TouchableOpacity style={styles.leftButton} onPress={() => this._goToShare()}>
                    <Image source={res.share}/>
                    <View style={{ width: px2dp(10) }}/>
                    <Text style={styles.text} allowFontScaling={false}>秀一秀</Text>
                </TouchableOpacity>
            </View>
            {this._renderNormalTitle()}
            <View style={styles.nav} ref={(ref) => {
                this._blackNavRef = ref;
            }}>
                <View style={styles.navTitle}>
                    <TouchableOpacity style={styles.backView} onPress={() => this._goBack()}>
                        <Image source={res.button.show_detail_back}/>
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}/>
                    <TouchableOpacity style={styles.shareView} onPress={() => {
                        this._goToShare();
                    }}>
                        <Image source={res.grayMore}/>
                    </TouchableOpacity>
                </View>
            </View>
            <CommShareModal ref={(ref) => this.shareModal = ref}
                            type={'miniProgram'}
                            miniProgramJson={{
                                title: detail.title,
                                dec: '分享小程序子标题',
                                thumImage: 'logo.png',
                                hdImageURL: detail.img,
                                linkUrl: `${apiEnvironment.getCurrentH5Url()}/discover/detail/${detail.id}?upuserid=${user.code || ''}`,
                                miniProgramPath: `/pages/discover/discover-detail/discover-detail?articleId=${detail.id}&inviteId=${user.code || ''}`
                            }}
            />
        </View>;
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    loading: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    header: {
        height: ScreenUtils.statusBarHeight
    },
    scroll: {
        flex: 1
    },
    bottom: {
        height: px2dp(50) + ScreenUtils.safeBottom,
        paddingBottom: ScreenUtils.safeBottom,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: ScreenUtils.onePixel,
        borderTopColor: '#ddd',
        justifyContent: 'space-between'
    },
    goodsItem: {
        height: px2dp(66),
        width: ScreenUtils.width - 2 * px2dp(15),
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: ScreenUtils.onePixel,
        borderRadius: px2dp(5),
        marginBottom: px2dp(10),
        overflow: 'hidden'
    },
    collectImg: {
        marginLeft: px2dp(16)
    },
    goodImg: {
        height: px2dp(65),
        width: px2dp(65)
    },
    goodDetail: {
        flex: 1,
        marginLeft: px2dp(9),
        marginRight: px2dp(9)
    },
    name: {
        fontSize: px2dp(13),
        color: DesignRule.textColor_mainTitle,
        fontWeight: '600'
    },
    price: {
        fontSize: px2dp(13),
        color: '#FF1A54'
    },
    goodsView: {
        marginTop: px2dp(17),
        marginRight: px2dp(15),
        marginLeft: px2dp(15),
        marginBottom: px2dp(15)
    },
    button: {
        backgroundColor: '#FF1A54',
        height: px2dp(32),
        width: px2dp(125),
        borderRadius: px2dp(16),
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: px2dp(15)
    },
    buttonTitle: {
        color: '#fff',
        fontSize: px2dp(15)
    },
    bottomGoodImg: {},
    bottomText: {
        marginLeft: px2dp(8),
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(11)
    },
    connectImg: {},
    profileRow: {
        height: px2dp(45),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    portrait: {
        width: px2dp(30),
        height: px2dp(30),
        borderRadius: px2dp(15)
    },
    showName: {
        color: DesignRule.textColor_mainTitle,
        marginLeft: px2dp(5),
        fontSize: px2dp(11)
    },
    profileLeft: {
        flexDirection: 'row',
        marginLeft: px2dp(15),
        alignItems: 'center'
    },
    profileRight: {
        flexDirection: 'row',
        marginRight: px2dp(15),
        alignItems: 'center'
    },
    number: {
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(13),
        marginLeft: px2dp(8)
    },
    bottomBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom:px2dp(15)
    },
    leftButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: DesignRule.mainColor,
        flexDirection: 'row',
        height: px2dp(50),
        flex:1
    },
    text: {
        color: '#fff',
        fontSize: px2dp(14)
    },
    btnLoading: {
        marginLeft: px2dp(26)
    },
    nav: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: ScreenUtils.width,
        height: px2dp(44) + ScreenUtils.statusBarHeight,
        paddingTop: ScreenUtils.statusBarHeight
    },
    whiteNav: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: ScreenUtils.width,
        height: px2dp(44) + ScreenUtils.statusBarHeight,
        paddingTop: ScreenUtils.statusBarHeight,
        backgroundColor: '#fff'
    },
    navTitle: {
        height: px2dp(44),
        width: ScreenUtils.width,
        flexDirection: 'row',
        alignItems: 'center'
    },
    backView: {
        width: px2dp(50),
        height: px2dp(44),
        alignItems: 'center',
        justifyContent: 'center'
    },
    shareView: {
        width: px2dp(50),
        height: px2dp(44),
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        color: '#333',
        fontSize: px2dp(17)
    },
    showTimesWrapper:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        flex:1
    },
    seeImgStyle:{
        width:px2dp(20),
        height:px2dp(12)
    }
});

