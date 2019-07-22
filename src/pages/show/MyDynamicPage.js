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
import ShowGroundView from './components/ShowGroundView';
import RouterMap from '../../navigation/RouterMap';
import WriterInfoView from './components/WriterInfoView';

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

        this.state = {
            changeHeader: true
        };
    }

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

        //布局不能改，否则android不能显示
        return (
            <View style={{
                flex: 1,
                position: 'absolute',
                left: 0,
                top: 0,
                width: DesignRule.width,
                height: px2dp(270),
                backgroundColor: '#F7F7F7',
                marginBottom: px2dp(ScreenUtils.isIOS ? 10 : 0)
            }}>
                <ImageBackground source={EmptyUtils.isEmpty(user.headImg) ? showHeaderBg : { uri: user.headImg }}
                                 style={styles.headerContainer} blurRadius={EmptyUtils.isEmpty(user.headImg) ? 0 : 10}>
                    {icon}
                    <Text style={styles.nameStyle}>
                        {name}
                    </Text>
                </ImageBackground>
                <WriterInfoView style={{ marginLeft: DesignRule.margin_page, marginTop: px2dp(-35)}}/>
            </View>
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
        let Waterfall = Platform.OS === 'ios' ? ShowGroundView : ShowDynamicView;
        let headerHeight = Platform.OS === 'ios' ? 210 : 200;
        let userCode = this.params.userCode || '';
        return (
            <View style={styles.contain}>
                <Waterfall style={{ flex: 1, marginTop: -10 }}
                           uri={'/social/show/content/page/mine/query@GET'}
                           headerHeight={px2dp(headerHeight+100)}
                           userType={`${this.params.userType}${userCode}`}
                           type={'MyDynamic'}
                           renderHeader={this.renderHeader()}
                           onItemPress={({ nativeEvent }) => {
                               let params = {
                                   code: nativeEvent.showNo
                               };
                               if (nativeEvent.showType === 1 || nativeEvent.showType == 3) {
                                   this.$navigate(RouterMap.ShowDetailPage, params);
                               } else {
                                   this.$navigate(RouterMap.ShowRichTextDetailPage, params);
                               }

                           }}
                           onScrollY={({ nativeEvent }) => {
                               // this._onScroll(nativeEvent);
                           }}
                />
                {/*{this.navBackgroundRender()}*/}
                {/*{this.navRender()}*/}

            </View>
        );
    }

}

var styles = StyleSheet.create({
    contain: {
        flex: 1
    },
    headerContainer: {
        width: DesignRule.width,
        height: px2dp(235),
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
