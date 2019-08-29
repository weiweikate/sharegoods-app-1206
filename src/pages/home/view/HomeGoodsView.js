import React, { Component } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import EmptyUtils from '../../../utils/EmptyUtils';
import { track, trackEvent } from '../../../utils/SensorsTrack';

const { px2dp } = ScreenUtils;
import { homeModule } from '../model/Modules';
import DesignRule from '../../../constants/DesignRule';
import ImageLoader from '@mr/image-placeholder';
import { MRText as Text } from '../../../components/ui/index';
import StringUtils from '../../../utils/StringUtils';
import { topicAdOnPress } from '../HomeTypes';

export const kHomeGoodsViewHeight = px2dp(247);
const goodsWidth = (ScreenUtils.width - px2dp(35)) / 2;

const MoneyItems = ({ money }) => {
    if (EmptyUtils.isEmpty(money)) {
        return <View/>;
    }
    let unitStr = '¥';
    let moneyStr = money;

    return <Text style={styles.unit}>{unitStr}<Text style={styles.money}>{moneyStr}</Text> 起</Text>;
};

export const Goods = ({ goods, press }) => {
    if (goods.linkType === 2) {
        return <TouchableOpacity onPress={() => press && press()}>
            <ReuserImage style={styles.container} source={{ uri: goods.topicImage ? goods.topicImage : '' }}/>
        </TouchableOpacity>;
    }
    return <TouchableWithoutFeedback onPress={() => press && press()}>

        <View style={styles.container}>
            <View style={styles.image}>
                <ReuserImage style={styles.image} source={{ uri: goods.image ? goods.image : '' }}/>
                {
                    StringUtils.isEmpty(goods.secTitle)
                        ?
                        null
                        :
                        <View style={styles.titleView}>
                            <Text style={styles.title} numberOfLines={1}
                                  allowFontScaling={false}>{goods.secTitle}</Text>
                        </View>
                }
            </View>
            <Text style={styles.dis} numberOfLines={2} allowFontScaling={false}>{goods.title}</Text>
            <View style={{ flex: 1 }}/>
            <MoneyItems money={goods.promotionMinPrice ? goods.promotionMinPrice : goods.price}/>
        </View>
    </TouchableWithoutFeedback>;
};

export default class GoodsCell extends Component {
    _goodsAction(data, index) {
        track(trackEvent.HomeRecommendClick, {
            homeRecArea: 2,
            contentKey: data.linkCode,
            contentValue: data.title,
            contentIndex: index,
            tabName: homeModule.tabName
        });
        topicAdOnPress({},{linkType: data.linkType, linkValue: [data.linkCode]});
    }

    render() {
        const { data, goodsRowIndex, otherLen } = this.props;
        const { itemData } = data;
        if (!data || data.length === 0) {
            return null;
        }
        let index = goodsRowIndex - otherLen;
        return <View style={[styles.cell]}>
            <Goods goods={itemData[0]} press={() => this._goodsAction(itemData[0], 2 * index - 1)}/>
            <View style={{ width: px2dp(5) }}/>
            {
                itemData[1]
                    ?
                    <Goods goods={itemData[1]} press={() => this._goodsAction(itemData[1], 2 * index)}/>
                    :
                    <View style={[styles.container, { backgroundColor: '' }]}/>
            }
        </View>;
    }
}

class ReuserImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imagePath: this.props.source.uri
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.source && nextProps.source &&
            this.props.source.uri !== nextProps.source.uri
        ) {
            this.fetchImage(nextProps.source.uri);
        }
    }

    fetchImage(url) {
        this.setState({
            imagePath: ''
        }, () => {
            this.setState({
                imagePath: url
            });
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.imagePath !== nextState.imagePath;
    }

    render() {
        return <ImageLoader
            {...this.props}
            source={{ uri: this.state.imagePath }}
            showPlaceholder={false}
        />;
    }
}

let styles = StyleSheet.create({
    container: {
        height: px2dp(241),
        width: goodsWidth,
        backgroundColor: 'white',
        borderRadius: px2dp(5),
        overflow: 'hidden'
    },
    image: {
        height: goodsWidth,
        width: goodsWidth
    },
    titleView: {
        height: px2dp(25),
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    dis: {
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(12),
        marginTop: px2dp(8),
        marginLeft: px2dp(7),
        marginRight: px2dp(7)
    },
    cell: {
        alignItems: 'center',
        justifyContent: 'center',
        height: kHomeGoodsViewHeight,
        width: ScreenUtils.width,
        flexDirection: 'row'
    },
    title: {
        color: '#fff',
        fontSize: px2dp(12),
        marginLeft: px2dp(5),
        marginRight: px2dp(5)
    },
    space: {
        width: px2dp(5)
    },
    unit: {
        color: DesignRule.mainColor,
        marginBottom: px2dp(8),
        marginLeft: px2dp(7)
    },
    money: {
        fontSize: px2dp(16),
        fontWeight: '500'
    }
});
