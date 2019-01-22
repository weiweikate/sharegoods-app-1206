/**
 * 精品推荐
 */
import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import ScreenUtil from '../../utils/ScreenUtils';

const { px2dp } = ScreenUtil;
import { observer } from 'mobx-react';
import { homeModule } from './Modules';
import DesignRule from '../../constants/DesignRule';
import { recommendModule } from './HomeRecommendModel';
import ImageLoad from '@mr/image-placeholder';
import { MRText as Text } from '../../components/ui';

const RecommendItem = ({ item, press }) => <TouchableOpacity style={styles.item} onPress={() => press && press()}>
    <View style={styles.imgView}>
        <ImageLoad cacheable={true} style={styles.img} source={{ uri: item.imgUrl }}/>
    </View>
</TouchableOpacity>;

@observer
export default class HomeRecommendView extends Component {

    _onRecommendAction(item) {
        let router = homeModule.homeNavigate(item.linkType, item.linkTypeCode);
        const { navigate } = this.props;
        let params = homeModule.paramsNavigate(item);
        navigate(router, { ...params, preseat: 'home_recommend' });
        // navigate && navigate(router,  params)
    }

    render() {
        const { recommendList } = recommendModule;
        let items = [];
        recommendList.map((item, index) => {
            items.push(<RecommendItem key={index} item={item} press={() => this._onRecommendAction(item)}/>);
        });
        return <View>
            {
                items.length > 0
                    ?
                    <View style={styles.container}>
                        <View style={styles.titleView}>
                            <Text style={styles.title} allowFontScaling={false}>精品推荐</Text>
                        </View>
                        <ScrollView style={styles.scroll} horizontal={true} showsHorizontalScrollIndicator={false}>
                            <View style={{ width: px2dp(4) }}/>
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
        height: px2dp(207),
        backgroundColor: '#fff',
        marginTop: px2dp(10)
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
    }
});
