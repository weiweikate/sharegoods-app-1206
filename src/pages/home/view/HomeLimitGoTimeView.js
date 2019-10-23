import React, { Component } from 'react';
import {
    DeviceEventEmitter,
    ImageBackground,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import { limitGoModule } from '../model/HomeLimitGoModel';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import { observer } from 'mobx-react';
import { autorun } from 'mobx';

const { px2dp } = ScreenUtils;

@observer
export default class HomeLimitGoTimeView extends Component {

    _onChangeTab(number) {
        this._selectedLimit(number);
    }

    selectPage = autorun(() => {
        const { currentPage } = limitGoModule;
        setTimeout(() => {
            this.scrollView && this.scrollView.scrollTo({
                x: px2dp(67) * (currentPage + 0.5) - DesignRule.width / 2,
                animated: true
            });
        }, 200);
    });

    componentDidMount() {
        const { currentPage } = limitGoModule;
        if (this.scrollView) {
            setTimeout(() => {
                this.scrollView && this.scrollView.scrollTo({
                    x: px2dp(67) * (currentPage + 0.5) - DesignRule.width / 2,
                    animated: false
                });
            })
        }
    }

    _selectedLimit(number) {
        let index = number !== -1 ? number : this.state.page;
        let limit = limitGoModule.spikeList[index];
        if (limit) {
            limitGoModule.changeLimitGo(number);
            // 限时购tab点击埋点
            track(trackEvent.SpikeTimeClick,
                {
                    'timeRangeId': limit.activityCode,
                    'timeRange': limit.time,
                    'timeRangeStatus': limit.title
                });
        }
    }

    _tabItem(item, index, isTabActive) {
        const textColor = isTabActive ? 'white' : '#666';
        return (<TouchableOpacity
            key={item.time}
            activeOpacity={1}
            onPress={() => {
                this._onChangeTab(index);
            }}>
            <ImageBackground style={styles.tab}
                             source={isTabActive ? res.tabBg : null}>
                <Text style={[styles.time, { color: textColor }]}>
                    {item.time}
                </Text>
                <Text style={[styles.title, { color: textColor }]}>
                    {item.title}
                </Text>
            </ImageBackground>
        </TouchableOpacity>);
    }

    render() {
        const { spikeList, currentPage } = limitGoModule;
        // tab视图
        let tabViews = [];
        spikeList.map((data, index) => {
            tabViews.push(
                this._tabItem(data, index, index === currentPage)
            );
        });
        if (tabViews.length === 0) {
            return null;
        }
        return (
            <ScrollView
                ref={(e) => {
                    this.scrollView = e;
                }}
                style={{ alignSelf: 'center', height: px2dp(55) }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {tabViews}
            </ScrollView>
        );
    }
}


@observer
export  class StaticLimitGoTimeView extends Component {

    _onChangeTab(number) {
        this._selectedLimit(number);
    }

    selectPage = autorun(() => {
        const { currentPage } = limitGoModule;
        setTimeout(() => {
            this.scrollView && this.scrollView.scrollTo({
                x: px2dp(67) * (currentPage + 0.5) - DesignRule.width / 2,
                animated: true
            });
        }, 200);
    });

    componentDidMount() {
        DeviceEventEmitter.emit('staticeLimitGoTimeView', true)
        const { currentPage } = limitGoModule;
        if (this.scrollView) {
            setTimeout(() => {
                this.scrollView && this.scrollView.scrollTo({
                    x: px2dp(67) * (currentPage + 0.5) - DesignRule.width / 2,
                    animated: false
                });
            })
        }
    }

    componentWillUnmount() {
        DeviceEventEmitter.emit('staticeLimitGoTimeView', false)
    }

    _selectedLimit(number) {
        let index = number !== -1 ? number : this.state.page;
        let limit = limitGoModule.spikeList[index];
        if (limit) {
            limitGoModule.changeLimitGo(number);
            // 限时购tab点击埋点
            track(trackEvent.SpikeTimeClick,
                {
                    'timeRangeId': limit.activityCode,
                    'timeRange': limit.time,
                    'timeRangeStatus': limit.title
                });
        }
    }

    _tabItem(item, index, isTabActive) {
        const textColor = '#666';
        return (<TouchableOpacity
            key={item.time}
            activeOpacity={1}
            onPress={() => {
                this._onChangeTab(index);
            }}>
            <View style={{  minWidth: px2dp(68),
                alignItems: 'center',
                height: px2dp(45)}}>
                <Text style={[styles.time, { color: textColor }]}>
                    {item.time}
                </Text>
                <Text style={[styles.title, { color: textColor }]}>
                    {item.title}
                </Text>
                <View style={{
                    position: 'absolute',
                    bottom: 3,
                    height: 2,
                    width: px2dp(34),
                    alignSelf: 'center',
                    backgroundColor: isTabActive?DesignRule.mainColor: 'white'
                }}/>
            </View>
        </TouchableOpacity>);
    }

    render() {
        const { spikeList, currentPage } = limitGoModule;
        // tab视图
        let tabViews = [];
        spikeList.map((data, index) => {
            tabViews.push(
                this._tabItem(data, index, index === currentPage)
            );
        });
        if (tabViews.length === 0) {
            return null;
        }
        return (
            <View
                style={{ alignItems: 'center', height: px2dp(45), backgroundColor: 'white', width: ScreenUtils.width}}
            >
                <ScrollView
                    ref={(e) => {
                        this.scrollView = e;
                    }}
                    style={{ height: px2dp(45)}}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    {tabViews}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tab: {
        minWidth: px2dp(68),
        alignItems: 'center',
        height: px2dp(51),
        backgroundColor: DesignRule.bgColor
    },
    underline: {
        height: 0
    },
    time: {
        fontWeight: 'bold',
        fontSize: 17,
        marginTop: Platform.OS === 'ios' ? 3 : 0
    },
    title: {
        fontSize: 11,
        marginTop: Platform.OS === 'ios' ? 4 : 2
    }
});
