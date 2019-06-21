import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    ImageBackground,
    TouchableOpacity,
    Platform
} from 'react-native';
import BasePage from '../../BasePage';
import DesignRule from '../../constants/DesignRule';
import user from '../../model/user';
import res from '../mine/res';
import showRes from './res';
import {
    MRText as Text,
    AvatarImage

} from '../../components/ui';
import ScreenUtils from '../../utils/ScreenUtils';
import EmptyUtils from '../../utils/EmptyUtils';
import ShowDynamicView from './components/ShowDynamicView';
import ShowFoundView from './ShowFoundView';

const headerBgSize = { width: 375, height: 200 };
const headerHeight = ScreenUtils.statusBarHeight + 44;
const offset = ScreenUtils.getImgHeightWithWidth(headerBgSize) - headerHeight;

const { px2dp } = ScreenUtils;
const {
    mine_user_icon
} = res.homeBaseImg;

const {
    back_white,
    back_black
} = res.button;
const {
    showHeaderBg
} = showRes;

export default class MyDynamicPage extends BasePage {
    $navigationBarOptions = {
        show: false
    };


    constructor(props) {
        super(props);
        this.data = [];

        this.state = {
            isRefreshing: false,
            isLoadingMore: false,
            changeHeader: true
        };
    }

    componentWillMount() {
        this.loadMore();
    }

    addMoreDatas = () => {
        for (var i = 0; i < 50; ++i) {
            this.data.push({
                height: 50 + Math.floor(Math.random() * 200)
            });
        }
        this.setState({ data: this.data });
    };

    refresh = () => {
        if (this.state.isRefreshing || this.state.isLoadingMore) {
            return;
        }
        this.setState({ isRefreshing: true });
        setTimeout(() => {
            this.data = [];
            this.setState({ data: [] });
            this.addMoreDatas();
            this.setState({ isRefreshing: false });
        }, 500);
    };

    loadMore = () => {
        if (this.state.isRefreshing || this.state.isLoadingMore) {
            return;
        }
        this.setState({ isLoadingMore: true });
        setTimeout(() => {
            this.addMoreDatas();
            this.setState({ isLoadingMore: false });
        }, 500);
    };


    renderHeader = () => {
        let icon = (user.headImg && user.headImg.length > 0) ?
            <AvatarImage source={{ uri: user.headImg }} style={styles.userIcon}
                         borderRadius={px2dp(65 / 2)}/> : <Image source={mine_user_icon} style={styles.userIcon}
                                                                 borderRadius={px2dp(65 / 2)}/>;
        let name = '';
        if (EmptyUtils.isEmpty(user.nickname)) {
            name = user.phone ? user.phone : '未登录';
        } else {
            name = user.nickname.length > 6 ? user.nickname.substring(0, 6) + '...' : user.nickname;
        }

        return (
            <ImageBackground source={EmptyUtils.isEmpty(user.headImg) ? showHeaderBg : { uri: user.headImg }}
                             style={styles.headerContainer} blurRadius={EmptyUtils.isEmpty(user.headImg) ? 0 : 10}>
                {icon}
                <Text style={styles.nameStyle}>
                    {name}
                </Text>
            </ImageBackground>
        );
    };

    navBackgroundRender() {
        return (
            <View ref={(ref) => this.headerBg = ref}
                  style={{
                      backgroundColor: 'white',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: headerHeight,
                      opacity: 0
                  }}/>
        );
    }

    navRender = () => {
        return (
            <View
                style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingRight: px2dp(15),
                    height: headerHeight,
                    paddingTop: ScreenUtils.statusBarHeight
                }}>
                    <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={styles.left}
                            onPress={() => {
                                this.props.navigation.goBack();
                            }}>
                            <Image
                                source={this.state.changeHeader ? back_white : back_black}
                                resizeMode={'stretch'}
                                style={{ height: 20, width: 20 }}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={{
                        color: this.state.changeHeader ? DesignRule.white : DesignRule.textColor_mainTitle,
                        fontSize: px2dp(17),
                        includeFontPadding: false
                    }}>
                        我的
                    </Text>
                    <View style={{ flex: 1 }}/>

                </View>
            </View>
        );
    };

    _onScroll = (nativeEvent) => {
        let Y = nativeEvent.YDistance - px2dp(10);
        // alert(Y);
        if (Y < offset) {
            this.st = Y / offset;

            this.setState({
                changeHeader: this.st > 0.7 ? false : true
            });
        } else {
            this.st = 1;
            this.setState({
                changeHeader: false
            });
        }


        this.headerBg.setNativeProps({
            opacity: this.st
        });
    };


    _render() {
        let Waterfall = Platform.OS == 'ios' ? ShowFoundView : ShowDynamicView;
        return (
            <View style={styles.contain}>
                <Waterfall style={{ flex: 1, marginTop: -10 }}
                           ref={(ref) => {
                               this.dynamicList = ref;
                           }}
                           uri={'/social/show/content/page/mine/query@GET'}
                           type={'MyDynamic'}
                           renderHeader={this.renderHeader()}
                           onItemPress={({ nativeEvent }) => {
                               let params = {
                                   data: nativeEvent,
                                   ref: this.dynamicList,
                                   index: nativeEvent.index
                               };
                               if (nativeEvent.showType === 1) {
                                   this.$navigate('show/ShowDetailPage', params);
                               } else {
                                   this.$navigate('show/ShowRichTextDetailPage', params);
                               }

                           }}
                           onScrollY={({ nativeEvent }) => {
                               this._onScroll(nativeEvent);
                           }}
                />
                {this.navBackgroundRender()}
                {this.navRender()}

            </View>
        );
    }

}

var styles = StyleSheet.create({
    contain: {
        flex: 1,
        backgroundColor: 'red'
    },
    headerContainer: {
        width: DesignRule.width,
        height: px2dp(200),
        alignItems: 'center'
    },
    userIcon: {
        width: px2dp(65),
        height: px2dp(65),
        marginTop: px2dp(79)
    },
    waterfall: {
        backgroundColor: DesignRule.bgColor
    },
    left: {
        paddingHorizontal: 15
    },
    nameStyle: {
        marginTop: px2dp(15),
        color: DesignRule.white,
        fontSize: px2dp(17)
    }
});
