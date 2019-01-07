import React from 'react';
import { StyleSheet, ScrollView, Image, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import ShowImageView from './ShowImageView';
import res from './res';
import ScreenUtils from '../../utils/ScreenUtils';
import DesignRule from '../../constants/DesignRule';
const { px2dp, width } = ScreenUtils;
import HTML from 'react-native-render-html'
import { ShowDetail } from './Show';
import { observer } from 'mobx-react';
import CommShareModal from '../../comm/components/CommShareModal';
import user from '../../model/user';
import apiEnvironment from '../../api/ApiEnvironment';
import ImageLoad from '@mr/image-placeholder'
import BasePage from '../../BasePage'
import { PageLoadingState } from '../../components/pageDecorator/PageState'
import {
    MRText as Text,
} from '../../components/ui';

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

    $getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState
        };
    };

    $navigationBarOptions = {
        title: '',
        show: false
    };
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params || {}
        this.showDetailModule = new ShowDetail()
        this.state = {
            loadingState: PageLoadingState.loading,
        }

    }
    $isMonitorNetworkStatus() {
        return true;
    }
    componentWillMount() {
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
                const { state } = payload;
                if (state && state.routeName === 'show/ShowDetailPage') {
                    if (this.params.code) {
                        this.showDetailModule.showDetailCode(this.params.code).then(() => {
                            this.setState({
                                loadingState: PageLoadingState.success
                            })
                        })
                    } else {
                        this.showDetailModule.loadDetail(this.params.id).then(() => {
                            this.setState({
                                loadingState: PageLoadingState.success
                            })
                        })
                    }
                }
            }
        )
    }

    componentWillUnmount() {
        this.willFocusSubscription && this.willFocusSubscription.remove();
    }

    _goBack() {
        const { navigation } = this.props;
        navigation.goBack(null);
    }

    _goToGoodsPage(good) {
        const { navigation } = this.props;
        navigation.push('home/product/ProductDetailPage', {
            productCode: good.code,preseat:'秀场详情'
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
        let Y = event.nativeEvent.contentOffset.y
        let height = ScreenUtils.width
        let shadowOpacity = 0
        console.log('_onScroll', Y)
        if (Y < height) {
            shadowOpacity = Y / height
        } else {
            shadowOpacity = 1;
        }
        this._whiteNavRef.setNativeProps({
            opacity:shadowOpacity
        });
        this._blackNavRef.setNativeProps({
            opacity:1 - shadowOpacity
        })
    }

    _render() {
        const { detail, isCollecting } = this.showDetailModule;
        if (!detail) {
            return <View style={styles.loading}/>;
        }
        let content = `<div>${detail.content}</div>`;
        let products = detail.products;
        let number = detail.click
        if (!number) {
            number = 0
        }
        if (number > 999999) {
            number = 999999 + '+'
        }
        return <View style={styles.container}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                onScroll={this._onScroll.bind(this)}
            >
            {
                detail.imgs
                ?
                <ShowImageView items={detail.imgs.slice()}/>
                :
                <View style={styles.header}/>
            }
            <View style={styles.profileRow}>
                <View style={styles.profileLeft}>
                    <ImageLoad borderRadius={px2dp(15)} style={styles.portrait} source={{ uri: detail.userHeadImg ? detail.userHeadImg : '' }}/>
                    <Text style={styles.showName} allowFontScaling={false}>{detail.userName ? detail.userName : ''}</Text>
                </View>
                <View style={styles.profileRight}>
                    <Image source={res.button.see}/>
                    <Text style={styles.number} allowFontScaling={false}>{number}</Text>
                </View>
            </View>
            <HTML html={content} imagesMaxWidth={width - px2dp(30)} imagesInitialDimensions={{width: width - px2dp(30), height: 0}} containerStyle={{
                backgroundColor: '#fff',
                marginLeft: px2dp(15),
                marginRight: px2dp(15)
            }} baseFontStyle={{ lineHeight: px2dp(25), color: DesignRule.textColor_mainTitle, fontSize: px2dp(13) }}/>
            <View style={styles.goodsView}>
                {
                    products.map((value, index) => {
                        return <Goods key={index} data={value} press={() => {
                            this._goToGoodsPage(value);
                        }}/>;
                    })
                }
            </View>
        </ScrollView>
            <View style={styles.bottom}>
                {
                    isCollecting
                    ?
                    <View style={[styles.bottomBtn]}>
                        <ActivityIndicator style={styles.btnLoading} size='small'/>
                    </View>
                    :
                    <TouchableOpacity style={styles.bottomBtn} onPress={() => this._collectAction()}>
                        <Image style={styles.collectImg} source={detail.hadCollect ? res.collected : res.uncollected}/>
                        <Text style={styles.bottomText} allowFontScaling={false}>{'人气值'} · {detail.collectCount}</Text>
                    </TouchableOpacity>
                }
                <TouchableOpacity style={styles.leftButton} onPress={() => this._goToShare()}>
                    <Image source={res.share}/>
                    <View style={{width: px2dp(10)}}/>
                    <Text style={styles.text} allowFontScaling={false}>秀一秀</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.whiteNav} ref={(ref)=> {this._whiteNavRef = ref}} opacity={0}>
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
            </View>
            <View style={styles.nav} ref={(ref)=> {this._blackNavRef = ref}}>
                <View style={styles.navTitle}>
                    <TouchableOpacity style={styles.backView} onPress={() => this._goBack()}>
                        <Image source={res.button.show_detail_back}/>
                    </TouchableOpacity>
                    <View style={{flex: 1}}/>
                    <TouchableOpacity style={styles.shareView} onPress={() => {
                        this._goToShare();
                    }}>
                        <Image source={res.button.show_share}/>
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
        marginBottom: px2dp(20)
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
        fontSize: px2dp(11),
        marginLeft: px2dp(9)
    },
    bottomBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    leftButton: {
        width: px2dp(125),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: DesignRule.mainColor,
        flexDirection: 'row',
        height: px2dp(50)
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
    }
});

