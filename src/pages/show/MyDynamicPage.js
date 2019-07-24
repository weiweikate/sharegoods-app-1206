import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Platform
} from 'react-native';
import BasePage from '../../BasePage';
import DesignRule from '../../constants/DesignRule';
import res from '../mine/res';
import ScreenUtils from '../../utils/ScreenUtils';
import ShowDynamicView from './components/ShowDynamicView';
import RouterMap,{backToShow} from '../../navigation/RouterMap';
import UserInfoView from './components/UserInfoView';

const headerBgSize = { width: 375, height: 200 };
const headerHeight = ScreenUtils.statusBarHeight + 44;
const offset = ScreenUtils.getImgHeightWithWidth(headerBgSize) - headerHeight;

const { px2dp } = ScreenUtils;


const {
    back_white,
    back_black
} = res.button;


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
        if(Platform.OS === 'ios'){
            return null;
        }
        return <UserInfoView userType={this.params.userType} userInfo={this.params.userInfo}/>
    };

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
        let Waterfall = ShowDynamicView;
        let headerHeight = Platform.OS === 'ios' ? 210 : 200;
        const {userNo = ''} = this.params.userInfo || {};
        return (
            <View style={styles.contain}>
                <Waterfall style={{ flex: 1, marginTop: -10 }}
                           headerHeight={px2dp(headerHeight+100)}
                           changeNav={({nativeEvent})=>{
                               this.setState({
                                   changeHeader:nativeEvent.show
                               })
                           }}
                           userType={`${this.params.userType}${userNo}`}
                           type={'MyDynamic'}
                           renderHeader={this.renderHeader()}
                           onItemPress={({ nativeEvent }) => {
                               let params = {
                                   code: nativeEvent.showNo
                               };
                               if (nativeEvent.showType === 1) {
                                   this.$navigate(RouterMap.ShowDetailPage, params);
                               }else if(nativeEvent.showType == 3){
                                   params.isCollect = nativeEvent.isCollect;
                                   params.isPersonal = nativeEvent.isPersonal;
                                   this.$navigate(RouterMap.ShowVideoPage, params);
                               }else {
                                   this.$navigate(RouterMap.ShowRichTextDetailPage, params);
                               }

                           }}
                           goCollection={()=>{
                               backToShow(1);
                           }}
                           goPublish={()=>{
                               this.$navigate(RouterMap.ReleaseNotesPage);
                           }}
                />
                {this.navRender()}

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
