/**
 * @author xzm
 * @date 2019/6/19
 */

import React from 'react';
import {
    StyleSheet,
    RefreshControl,
    Image,
    View
} from 'react-native';
import BasePage from '../../BasePage';
import NoMoreClick from '../../components/ui/NoMoreClick';
import res from './res';
import Waterfall from './components/Waterfall/Waterfall';
import DesignRule from '../../constants/DesignRule';
import ScreenUtils from '../../utils/ScreenUtils';
import TagDescriptionView from './components/TagDescriptionView';
import { MRText } from '../../components/ui';

const { iconShowShare } = res;
const { px2dp } = ScreenUtils;

export default class TagDetailPage extends BasePage {
    constructor(props) {
        super(props);
        this.state={
            isRefreshing: false,
            isLoadingMore: false,
        }
    }

    $navigationBarOptions = {
        title: '夏天的风景',
        show: true
    };

    $NavBarRenderRightItem = () => {
        return (
            <NoMoreClick onPress={this._publish}>
                <Image source={iconShowShare}/>
            </NoMoreClick>
        );
    };

    componentDidMount(){
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
                <MRText style={{
                    fontSize: DesignRule.fontSize_threeTitle,
                    color: DesignRule.textColor_mainTitle,
                    marginTop: px2dp(10),
                    width: itemContainer.width - px2dp(20),
                    alignSelf: 'center'
                }}>
                    大熊毛绒玩具送女友泰迪熊熊猫公仔抱抱熊2米…
                </MRText>
            </View>
        );
    };


    renderHeader=()=>{return (<TagDescriptionView/>)}

    _render() {
        return (
            <Waterfall
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
        );
    }
}

var styles = StyleSheet.create({});
