import React, { Component } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Text, ScrollView } from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import { observer } from 'mobx-react';
import { categoryModule } from '../model/HomeCategoryModel';
// import DesignRule from '../../../constants/DesignRule';
import bridge from '../../../utils/bridge';
import { track, trackEvent } from '../../../utils/SensorsTrack';
import { homeModule } from '../model/Modules';
import { homePoint } from '../HomeTypes';

const { px2dp } = ScreenUtils;

export const categoryHeight = px2dp(44);

const CategoryItem = ({ text, press, left }) => <TouchableWithoutFeedback onPress={() => press && press()}>
    <View style={[styles.item, { marginLeft: left }]}>
        <Text style={styles.text} numberOfLines={1}>{text}</Text>
    </View>
</TouchableWithoutFeedback>;

@observer
export default class HomeCategoryView extends Component {

    _adAction(data, index) {
        if (!data) {
            bridge.$toast('数据加载失败！');
            return;
        }
        track(trackEvent.bannerClick, homeModule.bannerPoint(data, homePoint.homeCategory, index));
        const { navigate } = this.props;
        navigate(data.route, {
            fromHome: true,
            id: 1,
            linkTypeCode: data.linkTypeCode,
            code: data.linkTypeCode,
            keywords: data.name,
            categoryId: data.id,
            activityCode: data.linkTypeCode
        });
    }

    render() {
        const { categoryList } = categoryModule;
        if (categoryList.length === 0) {
            return null;
        }
        let len = 5;
        if (categoryList.length > 0) {
            len = categoryList.length;
        }
        let itemsArr = [];
        let itemAll = [];
        for (let i = 0; i < len; i++) {
            i === 0 ? itemAll.push(
                <CategoryItem
                    text={categoryList[i] ? (categoryList[i].secondName ? categoryList[i].secondName : categoryList[i].name) : ' '}
                    key={'category' + i}
                    left={0}
                    press={() => {
                        this._adAction(categoryList[i], i);
                    }}
                />
                ) :
                itemsArr.push(
                    <CategoryItem
                        text={categoryList[i] ? (categoryList[i].secondName ? categoryList[i].secondName : categoryList[i].name) : ' '}
                        key={'category' + i}
                        left={i === 0 ? 0 : px2dp(10)}
                        press={() => {
                            this._adAction(categoryList[i], i);
                        }}
                    />
                );
        }
        return <View style={styles.container}>
            <View style={{ height: px2dp(20) }}>
                {itemAll}
            </View>
            <ScrollView horizontal
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}>
                {itemsArr}
            </ScrollView>
        </View>;
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        // paddingTop: px2dp(12),
        // paddingBottom: px2dp(12),
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
        width: ScreenUtils.width,
        flexDirection: 'row',
        height: categoryHeight,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    item: {
        flex: 1,
        height: px2dp(20),
        borderRadius: px2dp(10),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(254,170,95,0.1)'
    },
    text: {
        color: '#FF0050',
        fontSize: px2dp(12),
        paddingLeft: px2dp(12),
        paddingRight: px2dp(12)
    }
});
