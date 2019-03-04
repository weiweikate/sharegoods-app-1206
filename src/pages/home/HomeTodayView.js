/**
 * 今日榜单
 */
import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import ScreenUtil from '../../utils/ScreenUtils';

const { px2dp } = ScreenUtil;
import { observer } from 'mobx-react';
import { homeModule } from './Modules';
import { todayModule } from './HomeTodayModel';
import DesignRule from '../../constants/DesignRule';
import MRBannerView from '../../components/ui/bannerView/MRBannerView';
import { MRText as Text } from '../../components/ui';


export const todayHeight = px2dp(240)

// const TodayItem = ({ item, press }) => <TouchableOpacity style={styles.item} onPress={() => press && press()}>
//     <ImageLoad style={styles.img} source={{ uri: item.imgUrl }}/>
// </TouchableOpacity>;

@observer
export default class HomeTodayView extends Component {
    // _todayItemAction(item) {
    //     let router = homeModule.homeNavigate(item.linkType, item.linkTypeCode);
    //     let params = homeModule.paramsNavigate(item);
    //     const { navigate } = this.props;
    //     navigate && navigate(router, { ...params, preseat: '今日榜单' });
    // }

    // render() {
    //     const { todayList } = todayModule;
    //     let items = [];
    //     todayList.map((item, index) => {
    //         items.push(<TodayItem key={index} item={item} press={() => this._todayItemAction(item)}/>);
    //     });
    //     return <View>
    //         {
    //             items.length > 0
    //                 ?
    //                 <View style={styles.container}>
    //                     <View style={styles.titleView}>
    //                         <Text style={styles.title} allowFontScaling={false}>今日榜单</Text>
    //                     </View>
    //                     <ScrollView style={styles.scroll} horizontal={true} showsHorizontalScrollIndicator={false}>
    //                         <View style={{ width: px2dp(4) }}/>
    //                         {items}
    //                         <View style={styles.space}/>
    //                     </ScrollView>
    //                 </View>
    //                 :
    //                 null
    //         }
    //     </View>;
    // }

    state = {
        index: 0
    }

    _onPressRow(e) {
        let index = e.nativeEvent.index;
        const { todayList } = todayModule;
        let item = todayList[index];
        let router = homeModule.homeNavigate(item.linkType, item.linkTypeCode);
        const { navigate } = this.props;
        let params = homeModule.paramsNavigate(item);
        navigate(router, { ...params, preseat: 'home_recommend' });
    }

    _onDidScrollToIndex(e) {
        this.setState({ index: e.nativeEvent.index });
    }

    renderIndexView() {
        const { index } = this.state;
        const { todayList } = todayModule;
        let items = [];
        for (let i = 0; i < todayList.length; i++) {
            if (index === i) {
                items.push(<View key={i} style={styles.activityIndex}/>);
            } else {
                items.push(<View key={i} style={styles.index}/>);
            }
        }
        return <View style={styles.indexView}>
            {items}
        </View>;
    }

    render() {
        const { todayList } = todayModule;

        if (todayList.length === 0) {
            return <View/>
        }

        let items = [];
        todayList.map((item, index) => {
            items.push(item.imgUrl);
        });
        return  <View style={styles.container}>
        <View style={styles.titleView}>
            <View style={styles.flag}/>
            <Text style={styles.title}>今日榜单</Text>
        </View>
        {
            todayList.length === 1
            ?
            <TouchableWithoutFeedback onPress={()=>this._onPressRowWithItem(todayList[0])}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                {this.renderRow(todayList[0])}
            </View>
            </TouchableWithoutFeedback>
            :
            <MRBannerView
                style={{
                    height: px2dp(160),
                    width: ScreenUtil.width - px2dp(30)
                }}
                imgUrlArray={items}
                itemWidth={px2dp(295)}
                itemSpace={px2dp(10)}
                itemRadius={5}
                pageFocused={this.props.pageFocused}
                onDidSelectItemAtIndex={(index) => {
                    this._onPressRow(index);
                }}
                onDidScrollToIndex={(index) => {
                    this._onDidScrollToIndex(index);
                }}
            />
        }
        {this.renderIndexView()}
        </View>;
    }
}

let styles = StyleSheet.create({
    container: {
        height: px2dp(225),
        marginTop: px2dp(15),
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        width: ScreenUtil.width - px2dp(30),
        borderRadius: px2dp(5),
        overflow: 'hidden',
        backgroundColor: '#fff'
    },
    flag: {
        backgroundColor: '#FF0050',
        width: px2dp(2),
        height: px2dp(8)
    },
    titleView: {
        height: px2dp(42),
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(16),
        marginLeft: px2dp(10),
        fontWeight: '600'
    },
    scroll: {
        height: px2dp(175)
    },
    img: {
        width: px2dp(280),
        height: px2dp(140)
    },
    imgView: {
        width: px2dp(280),
        height: px2dp(140),
        borderRadius: px2dp(5),
        overflow: 'hidden'
    },
    item: {
        width: px2dp(280),
        height: px2dp(145),
        marginLeft: px2dp(10)
    },
    space: {
        width: px2dp(15)
    },
    text: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(13),
        marginTop: px2dp(10)
    },
    indexView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: px2dp(10)
    },
    activityIndex: {
        width: px2dp(10),
        height: px2dp(3),
        borderRadius: px2dp(1.5),
        backgroundColor: '#FF0050',
        margin: 2
    },
    index: {
        width: px2dp(5),
        height: px2dp(3),
        borderRadius: px2dp(1.5),
        backgroundColor: '#E4E4E4',
        margin: 2
    }
});
