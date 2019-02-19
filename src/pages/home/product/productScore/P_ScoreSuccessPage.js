import React from 'react';
import { View, StyleSheet, Image, FlatList } from 'react-native';
import { MRText as Text } from '../../../../components/ui';
import NoMoreClick from '../../../../components/ui/NoMoreClick';
import UIImage from '@mr/image-placeholder';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import BasePage from '../../../../BasePage';
import HomeAPI from '../../api/HomeAPI';

const { width } = ScreenUtils;

export default class P_ScoreSuccessPage extends BasePage {

    componentDidMount() {
        HomeAPI.order_list({ page: 1, pageSize: 10 }).then((data) => {
            return Promise.resolve(data);
        });
    }

    _renderListHeader = () => {
        return <View style={styles.headerContainer}>
            <Image style={styles.headerImg}/>
            <Text style={styles.headerText}>感谢晒单~</Text>
            <NoMoreClick style={styles.headerBtn}>
                <Text style={styles.headerBtnText}>返回首页</Text>
            </NoMoreClick>
            <View style={styles.nextView}>
                <Text style={styles.nextText}>接着晒下去</Text>
            </View>
        </View>;
    };
    _renderItem = ({ item }) => {
        return <View style={styles.itemContainer}>
            <UIImage style={styles.itemImg}/>
            <Text style={styles.itemTittle} numberOfLines={2}>大熊毛绒玩具送女友泰迪熊熊猫公仔抱抱熊2米女生布娃娃</Text>
            <NoMoreClick style={styles.itemBtn}>
                <Text style={styles.itemBtnText}>去晒单</Text>
            </NoMoreClick>
        </View>;
    };

    _keyExtractor = (item, index) => {
        return `${item.id}${index}`;
    };

    _render() {
        return (
            <View style={styles.container}>
                <FlatList data={['', '', '', '', '', '', '', '']}
                          renderItem={this._renderItem}
                          keyExtractor={this._keyExtractor}
                          ListHeaderComponent={this._renderListHeader}/>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    /**header**/
    headerContainer: {
        alignItems: 'center',
        backgroundColor: DesignRule.white
    },
    headerImg: {
        marginTop: 20, marginBottom: 10
    },
    headerText: {
        fontSize: 17, color: DesignRule.textColor_mainTitle
    },
    headerBtn: {
        marginTop: 20, marginBottom: 30, justifyContent: 'center', alignItems: 'center',
        height: 40, width: 120,
        borderColor: DesignRule.lineColor_inWhiteBg, borderWidth: 1, borderRadius: 20
    },
    headerBtnText: {
        fontSize: 15, color: DesignRule.textColor_secondTitle
    },
    nextView: {
        width: width,
        justifyContent: 'center', alignItems: 'center',
        height: 33, backgroundColor: DesignRule.bgColor
    },
    nextText: {
        fontSize: 11, color: DesignRule.textColor_mainTitle
    },

    /**item**/
    itemContainer: {
        flexDirection: 'row', marginBottom: 10,

        height: 85, backgroundColor: DesignRule.white
    },
    itemImg: {
        marginLeft: 15, marginTop: 10, marginRight: 10,
        width: 60, height: 60
    },
    itemTittle: {
        marginRight: 15, marginTop: 10, flex: 1,
        fontSize: 13, color: DesignRule.textColor_mainTitle
    },
    itemBtn: {
        position: 'absolute', right: 15, bottom: 10, justifyContent: 'center', alignItems: 'center',
        height: 24, width: 80,
        borderColor: DesignRule.mainColor, borderWidth: 1, borderRadius: 12
    },
    itemBtnText: {
        fontSize: 13, color: DesignRule.mainColor
    }
});
