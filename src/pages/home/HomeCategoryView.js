import React, { Component } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Text } from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';
import { observer } from 'mobx-react';
import { categoryModule } from './HomeCategoryModel';
import DesignRule from '../../constants/DesignRule';

const { px2dp } = ScreenUtils;

export const categoryHeight = px2dp(44);

const CategoryItem = ({ text, press, left }) => <TouchableWithoutFeedback onPress={() => press && press()}>
    <View style={[styles.item, { marginLeft: left }]}>
        <Text style={styles.text}>{text}</Text>
    </View>
</TouchableWithoutFeedback>;

@observer
export default class HomeCategoryView extends Component {

    _adAction(data) {
        const { navigate } = this.props;
        navigate(data.route, {
            fromHome: true,
            id: 1,
            linkTypeCode: data.linkTypeCode,
            code: data.linkTypeCode,
            name: data.name,
            categoryId: data.id,
            activityCode: data.linkTypeCode
        });
    }

    render() {
        const { categoryList } = categoryModule;
        if (categoryList.length === 0) {
            return <View/>;
        }

        let itemsArr = [];
        categoryList.map((value, index) => {
            itemsArr.push(
                <CategoryItem
                    text={value.name}
                    key={'category' + index}
                    left={index === 0 ? 0 : px2dp(6)}
                    press={() => this._adAction(value)}
                />
            );
        });
        return <View style={styles.container}>
            {itemsArr}
        </View>;
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        paddingTop: px2dp(12),
        paddingBottom: px2dp(12),
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
        backgroundColor: DesignRule.lineColor_inColorBg
    },
    text: {
        color: DesignRule.textColor_instruction,
        fontSize: px2dp(12)
    }
});
