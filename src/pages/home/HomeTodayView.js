/**
 * 今日榜单
 */
import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import ScreenUtil from '../../utils/ScreenUtils';

const { px2dp } = ScreenUtil;
import { observer } from 'mobx-react';
import { homeModule } from './Modules';
import { todayModule } from './HomeTodayModel';
import DesignRule from '../../constants/DesignRule';
import ImageLoad from '@mr/image-placeholder';
import { MRText as Text } from '../../components/ui';

const TodayItem = ({ item, press }) => <TouchableOpacity style={styles.item} onPress={() => press && press()}>
    <ImageLoad cacheable={true} style={styles.img} source={{ uri: item.imgUrl }}/>
</TouchableOpacity>;

@observer
export default class HomeTodayView extends Component {
    _todayItemAction(item) {
        let router = homeModule.homeNavigate(item.linkType, item.linkTypeCode);
        let params = homeModule.paramsNavigate(item);
        const { navigate } = this.props;
        navigate && navigate(router, { ...params, preseat: '今日榜单' });
    }

    render() {
        const { todayList } = todayModule;
        let items = [];
        todayList.map((item, index) => {
            items.push(<TodayItem key={index} item={item} press={() => this._todayItemAction(item)}/>);
        });
        return <View>
            {
                items.length > 0
                    ?
                    <View style={styles.container}>
                        <View style={styles.titleView}>
                            <Text style={styles.title} allowFontScaling={false}>今日榜单</Text>
                        </View>
                        <ScrollView style={styles.scroll} horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={{ width: px2dp(5) }}/>
                            {items}
                            <View style={styles.space}/>
                        </ScrollView>
                    </View>
                    :
                    null
            }
        </View>;
    }
}

let styles = StyleSheet.create({
    container: {
        height: px2dp(243),
        backgroundColor: '#fff'
    },
    titleView: {
        height: px2dp(53),
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(19),
        fontWeight: '600'
    },
    scroll: {
        height: px2dp(175)
    },
    img: {
        width: px2dp(300),
        height: px2dp(175)
    },
    item: {
        width: px2dp(300),
        height: px2dp(175),
        borderRadius: px2dp(5),
        overflow: 'hidden',
        marginLeft: px2dp(10)
    },
    space: {
        width: px2dp(15)
    }
});
