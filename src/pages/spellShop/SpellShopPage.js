//拼店tab页面
import React from 'react';
import {
    View,
    Image,
    StyleSheet,
    ScrollView,
    RefreshControl
} from 'react-native';

// 图片资源
import IntroduceImg from './src/hhk_03.png';
import IntroduceImg1 from './src/hhk_031.png';
import ScreenUtils from '../../utils/ScreenUtils';
import BasePage from '../../BasePage';

import { observer } from 'mobx-react';
import SpellStatusModel from './model/SpellStatusModel';
import RecommendPage from './recommendSearch/RecommendPage';
import NavigatorBar from '../../components/pageDecorator/NavigatorBar/NavigatorBar';
import MyShop_RecruitPage from './MyShop_RecruitPage';

@observer
export default class SpellShopPage extends BasePage {
    constructor(props) {
        super(props);
    }

    $navigationBarOptions = {
        show: false
    };

    $getPageStateOptions = () => {
        return {
            loadingState: SpellStatusModel.loadingState,
            netFailedProps: {
                netFailedInfo: SpellStatusModel.netFailedInfo,
                reloadBtnClick: () => {
                    SpellStatusModel.getUser(2);
                }
            }
        };
    };
    _renderContainer = () => {
        //加入了店铺&&店铺状态不为关闭 1正常,2缴纳,3招募中
        if (SpellStatusModel.storeId && SpellStatusModel.storeStatus && SpellStatusModel.storeStatus !== 0) {
            return (<MyShop_RecruitPage navigation={this.props.navigation}/>);
        } else if (SpellStatusModel.canSeeGroupStore) {
            // 能看见推荐店铺页面
            return (<RecommendPage navigation={this.props.navigation} leftNavItemHidden={true}/>);
        } else {
            // 初始化的介绍页面
            return (
                <View>
                    <NavigatorBar leftNavItemHidden={true} title={'拼店'}/>
                    <ScrollView refreshControl={<RefreshControl refreshing={false} onRefresh={this._onRefresh}/>}
                                showsVerticalScrollIndicator={false}>
                        <View style={{ flex: 1 }}>
                            <Image style={styles.levelLow} source={IntroduceImg} resizeMode='stretch'/>
                            <Image style={styles.levelLow1} source={IntroduceImg1} resizeMode='stretch'/>
                        </View>
                    </ScrollView>
                </View>
            );
        }
    };

    _render() {
        return (
            <View style={styles.container}>
                {this._renderContainer()}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    levelLow: {
        width: ScreenUtils.width,
        height: ScreenUtils.height - ScreenUtils.headerHeight - ScreenUtils.tabBarHeight
    },
    levelLow1: {
        position: 'absolute',
        marginTop: ScreenUtils.isIOSX ? ScreenUtils.autoSizeHeight(78 + 60) : ScreenUtils.autoSizeHeight(78),
        width: ScreenUtils.autoSizeWidth(375 - 59 * 2),
        height: ScreenUtils.autoSizeWidth(257),
        alignSelf: 'center'
    }
});

