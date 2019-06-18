import React from 'react';
import {
    StyleSheet,
    View,
    RefreshControl,
    Image,
    ImageBackground,
    TouchableOpacity
} from 'react-native';
import BasePage from '../../BasePage';
import DesignRule from '../../constants/DesignRule';
import Waterfall from './components/Waterfall/index';
import user from '../../model/user';
import res from '../mine/res';
import showRes from './res';
import {
    MRText as Text,
    AvatarImage

} from '../../components/ui';
import ScreenUtils from '../../utils/ScreenUtils';
import EmptyUtils from '../../utils/EmptyUtils';

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
    showHeaderBg,
    iconDelete
} = showRes;
const items = [1, 2, 3, 4, 5, 6, 7, 8];
export default class MyDynamicPage extends BasePage {
    $navigationBarOptions = {
        show: false
    };


    constructor(props) {
        super(props);
        this.state = {
            layoutWidth: (DesignRule.width - 45) / 2,
            list: items,
            isRefreshing: false,
            isLoadingMore: false,
            changeHeader: true
        };
    }

    componentWillMount() {
        this.data = [];
        this.loadMore();
    }

    addMoreDatas() {
        for (var i = 0; i < 50; ++i) {
            this.data.push({
                height: 50 + Math.floor(Math.random() * 200)
            });
        }
    }

    refresh = () => {
        if (this.state.isRefreshing || this.state.isLoadingMore) {
            return;
        }
        this.setState({ isRefreshing: true });
        setTimeout(() => {
            this.data = [];
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

    renderItem = (itemData, itemIdx, itemContainer) => {
        return (
            <View style={{
                width: itemContainer.width,
                overflow: 'hidden',
                borderRadius: px2dp(5),
                backgroundColor: DesignRule.white
            }}>
                <Image
                    source={{ uri: 'https://cdn.sharegoodsmall.com/sharegoods/7c37d714e9954fbab1cd67f223206fd0.png?width=4608&height=3456' }}
                    style={{ backgroundColor: 'black', width: itemContainer.width, height: itemData.height }}/>
                <Text style={{
                    fontSize: DesignRule.fontSize_threeTitle,
                    color: DesignRule.textColor_mainTitle,
                    marginTop: px2dp(10),
                    width: itemContainer.width - px2dp(20),
                    alignSelf: 'center'
                }}>
                    大熊毛绒玩具送女友泰迪熊熊猫公仔抱抱熊2米…
                </Text>
                <View style={{
                    flexDirection: 'row',
                    width: itemContainer.width,
                    marginVertical: px2dp(10),
                    paddingHorizontal: px2dp(10),
                    justifyContent: 'space-between'
                }}>
                    <Text>
                        审核中
                    </Text>
                    <Image source={iconDelete} style={{ width: px2dp(15), height: px2dp(15) }}/>
                </View>
            </View>
        );
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
        let blackBack = <Image
            source={back_black}
            resizeMode={'stretch'}
            style={{ height: 20, width: 20 }}
        />;
        let whiteBack = <Image
            source={back_white}
            resizeMode={'stretch'}
            style={{ height: 20, width: 20 }}
        />;
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
                            onPress={()=>{this.props.navigation.goBack();}}>
                            {this.state.changeHeader ? whiteBack : blackBack}
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

    _onScroll = (event) => {
        let Y = event.nativeEvent.contentOffset.y;
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
        return (
            <View style={styles.contain}>
                <Waterfall
                    onScroll={this._onScroll.bind(this)}
                    showsVerticalScrollIndicator={false}
                    style={styles.waterfall}
                    data={this.data}
                    renderHeader={this.renderHeader}
                    gap={px2dp(10)}
                    numberOfColumns={2}
                    expansionOfScope={100}
                    onEndReachedThreshold={1000}
                    onEndReached={this.loadMore}
                    renderItem={this.renderItem}
                    refreshControl={
                        <RefreshControl
                            colors={[DesignRule.mainColor]}
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.refresh}
                        />
                    }/>
                {this.navBackgroundRender()}
                {this.navRender()}
            </View>
        );
    }

}

var styles = StyleSheet.create({
    contain: {
        flex: 1,
        backgroundColor: DesignRule.bgColor
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
    nameStyle:{
        marginTop:px2dp(15),
        color:DesignRule.white,
        fontSize:px2dp(17)
    }
});
