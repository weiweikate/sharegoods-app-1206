import React from 'react';
import BasePage from '../../../BasePage';

import {
    View,
    SectionList,
    StyleSheet,
} from 'react-native';
import ColorUtil from '../../../utils/ColorUtil';
import { ActivityOneView } from './components/SbSectiontHeaderView';
import ScreenUtils from '../../../utils/ScreenUtils';
import SbOpenPrizeHeader from './components/SbOpenPrizeHeader';
import OpenPrizeItemView from './components/OpenPrizeItemView';

export default class SubOpenPrizePage extends BasePage {
    $navigationBarOptions = {
        title: '专题',
        show: true
    };
    _render() {
        return (
            <View>
                <SectionList
                    contentContainerStyle={Styles.list}
                    style={{
                        backgroundColor: ColorUtil.Color_f7f7f7
                    }}
                    numColumns={2}
                    columnWrapperStyle={Styles.itemBgStyle}
                    stickySectionHeadersEnabled={false}
                    /* 渲染头*/
                    renderSectionHeader={
                        ({ section }) => {
                            if (section.key == 'one') {
                                return this._renderHeaderView(section.key);
                            } else {
                                return this._renderActivityView(section.key);
                            }
                        }
                    }

                    // contentContainerStyle={styles.list}//设置cell的样式
                    pageSize={2}  // 配置pageSize确认网格数量
                    sections={[
                        {
                            title: 'one',
                            key: 'one',
                            data: [
                                { key: 'Devin' },
                                { key: 'Jackson' },
                                { key: 'James' },
                                { key: 'Joel' },
                                { key: 'John' },
                                { key: 'Jillian' }
                            ]
                        },
                        {
                            key: 'two',
                            data: [
                                { key: 'Devin' },
                                { key: 'Jackson' },
                                { key: 'James' },
                                { key: 'Joel' },
                                { key: 'John' },
                                { key: 'Jillian' },
                                { key: 'Jimmy' },
                                { key: 'Julie' }
                            ]
                        }
                    ]}
                    renderItem={({ item, index, section }) => {
                        return this._renderRowView(item);
                    }}
                />
            </View>
        );
    }
    /**
     *
     * @param key
     * @returns {*}
     * @private
     */
    _renderActivityView = (key) => {
        return <ActivityOneView/>;
    };
    /**
     *
     * @param key
     * @returns {*}
     * @private
     */
    _renderHeaderView = (key) => {
        if (key === 'one') {
            return <SbOpenPrizeHeader/>;
        } else {
            return <ActivityOneView/>;
        }
    };
    /**
     *
     * @param item
     * @returns {*}
     * @private
     */
    _renderRowView = (item) => {
        return(<OpenPrizeItemView/>);
    };
    /**
     *
     * @private
     */
    _itemClickAction = () => {


    };
}
const Styles = StyleSheet.create({
    list: {
        flexDirection: 'row',//设置横向布局
        flexWrap: 'wrap',  //设置换行显示
        // alignItems: 'flex-start',
        backgroundColor: '#FFFFFF'
    },
    itemBgStyle: {
        width: ScreenUtils.width / 2,
        height: ScreenUtils.width / 2 + 100,
        backgroundColor: ColorUtil.Color_f7f7f7,
        padding: 8,
        paddingBottom: 0
    },
});
