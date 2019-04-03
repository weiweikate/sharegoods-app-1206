/**
 * 超值热卖
 */

import React, { Component } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Image } from 'react-native';
import ScreenUtil from '../../utils/ScreenUtils';
import { track, trackEvent } from '../../utils/SensorsTrack';

const { px2dp, onePixel } = ScreenUtil;
import { observer } from 'mobx-react';
import { homeModule } from './Modules';
import { homeLinkType, homeRoute, homePoint } from './HomeTypes';
import { subjectModule } from './HomeSubjectModel';
import DesignRule from '../../constants/DesignRule';
import { getShowPrice, getTopicJumpPageParam } from '../topic/model/TopicMudelTool';
import ImageLoad from '@mr/image-placeholder';
import EmptyUtils from '../../utils/EmptyUtils';
import { MRText as Text } from '../../components/ui';
import HomeTitleView from './HomeTitleView';
import res from './res';

const MoneyItems = ({ money }) => {
    if (EmptyUtils.isEmpty(money)) {
        return null;
    }
    let unitStr = '¥';
    let moneyStr = '';
    let index = money.indexOf('¥');
    if (index !== -1) {
        moneyStr = money.substring(index + 1, money.length);
    }
    return <Text style={styles.unit}>{unitStr}<Text style={styles.money}>{moneyStr}</Text> 起</Text>;
};

const GoodItems = ({ img, title, money, press }) => {
    return <TouchableWithoutFeedback onPress={() => {
        press && press();
    }}>
        <View style={styles.goodsView}>
            <ImageLoad style={styles.goodImg} source={{ uri: img ? encodeURI(img) : '' }}/>
            <Text style={styles.goodsTitle} numberOfLines={2} allowFontScaling={false}>{title}</Text>
            <View style={{ flex: 1 }}/>
            <MoneyItems money={money}/>
        </View>
    </TouchableWithoutFeedback>;
};

const MoreItem = ({ press }) => <TouchableOpacity style={styles.moreView} onPress={() => {
    press && press();
}}>
    <Image source={res.home_right}/>
    <View style={{ height: px2dp(10) }}/>
    <Text style={styles.seeMore} allowFontScaling={false}>查看更多</Text>
</TouchableOpacity>;

const ActivityItem = ({ data, press, goodsPress }) => {
    const { imgUrl, topicBannerProductDTOList } = data;
    let goodsItem = [];
    topicBannerProductDTOList && topicBannerProductDTOList.map((value, index) => {
        if (index >= 8) {
            return;
        }
        let price = getShowPrice(value);
        goodsItem.push(
            <GoodItems
                key={index}
                title={value.productName}
                money={price}
                img={value.specImg ? value.specImg : ''}
                press={() => {
                    goodsPress && goodsPress(value);
                }}
            />
        );
    });
    return <View>
        <TouchableWithoutFeedback onPress={() => {
            press && press();
        }}>
            <View style={styles.bannerView}>
                <ImageLoad style={styles.banner}
                           source={{ uri: imgUrl ? encodeURI(imgUrl) : '' }}/>
            </View>
        </TouchableWithoutFeedback>
        {
            topicBannerProductDTOList && topicBannerProductDTOList.length > 0
                ?
                <ScrollView style={styles.scroll} horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View style={{ width: px2dp(7.5) }}/>
                    {goodsItem}
                    {
                        topicBannerProductDTOList.length >= 8 ?
                            <MoreItem press={() => {
                                press && press();
                            }}/>
                            : null
                    }
                    <View style={{ width: topicBannerProductDTOList.length < 8 ? px2dp(7.5) : px2dp(5) }}/>
                </ScrollView>
                :
                <View style={{ height: px2dp(15) }}/>
        }
    </View>;
};

@observer
export default class HomeSubjectView extends Component {
    _subjectActions(item) {
        track(trackEvent.bannerClick, homeModule.bannerPoint(item, homePoint.homeSubject));
        const { navigate } = this.props;
        let params = homeModule.paramsNavigate(item);
        const router = homeModule.homeNavigate(item.linkType, item.linkTypeCode);
        navigate(router, params);
    }

    _goodAction(good, item) {
        const { navigate } = this.props;
        if (item.linkType === homeLinkType.exp) {
            if (good.endTime >= good.currTime) {
                const router = homeModule.homeNavigate(item.linkType, item.linkTypeCode);
                navigate(router, { activityCode: item.linkTypeCode, productCode: good.prodCode });
            } else {
                const router = homeRoute[homeLinkType.good];
                navigate(router, { productCode: good.prodCode });
            }
        } else {
            const pageObj = getTopicJumpPageParam(good);
            navigate(pageObj.pageRoute, { ...pageObj.params });
        }
    }

    render() {
        const { subjectList } = subjectModule;
        if (!subjectList) {
            return null;
        }
        if (subjectList.length <= 0) {
            return null;
        }
        let items = [];
        subjectList.map((item, index) => {
            items.push(<ActivityItem data={item} key={index} press={() => this._subjectActions(item)}
                                     goodsPress={(good) => {
                                         this._goodAction(good, item);
                                     }}/>);
        });
        if (items.length === 0) {
            return null;
        }
        return <View style={styles.container}>
            <HomeTitleView title={'超值热卖'}/>
            {items}
        </View>;
    }
}

const bannerWidth = ScreenUtil.width - px2dp(50);
const bannerHeight = bannerWidth * (240 / 650);

let styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginTop: px2dp(15),
        width: ScreenUtil.width - px2dp(30),
        marginLeft: px2dp(15),
        marginRight: px2dp(15),
        borderRadius: 5
    },
    bannerView: {
        marginLeft: px2dp(10),
        marginRight: px2dp(10),
        borderRadius: px2dp(5),
        overflow: 'hidden'
    },
    banner: {
        width: bannerWidth,
        height: bannerHeight
    },
    scroll: {
        height: px2dp(170),
        marginTop: px2dp(5),
        marginBottom: px2dp(10)
    },
    goodsView: {
        marginTop: px2dp(5),
        width: px2dp(100),
        height: px2dp(170),
        marginHorizontal: px2dp(2.5)
    },
    goodImg: {
        width: px2dp(100),
        height: px2dp(100)
    },
    goodsTitle: {
        marginHorizontal: px2dp(2.5),
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(12),
        marginTop: px2dp(5)
    },
    money: {
        fontSize: px2dp(16),
        fontWeight: '600'
    },
    unit: {
        marginHorizontal: px2dp(2.5),
        color: DesignRule.mainColor,
        fontSize: px2dp(12),
        marginBottom: px2dp(2)
    },
    moreView: {
        width: px2dp(100),
        height: px2dp(170),
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: px2dp(5),
        backgroundColor: DesignRule.bgColor,
        borderRadius: (5),
        marginRight: px2dp(5)
    },
    seeMore: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(11)
    },
    seeMoreEn: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(9)
    },
    line: {
        height: onePixel,
        width: px2dp(43),
        backgroundColor: '#e3e3e3',
        margin: px2dp(2.5)
    }
});
