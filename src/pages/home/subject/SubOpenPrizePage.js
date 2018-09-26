import React from 'react';
import BasePage from '../../../BasePage';

import {
    View,
    SectionList,
    StyleSheet,
    TouchableOpacity,
    Image,
    Text
} from 'react-native';
import ColorUtil from '../../../utils/ColorUtil';
import { ActivityOneView } from './components/SbSectiontHeaderView';
import ScreenUtils from '../../../utils/ScreenUtils';
import SbOpenPrizeHeader from './components/SbOpenPrizeHeader';

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

    _renderActivityView = (key) => {
        return <ActivityOneView/>;
    };
    _renderHeaderView = (key) => {
        if (key === 'one') {
            return <SbOpenPrizeHeader/>;
        } else {
            return <ActivityOneView/>;
        }
    };
    _renderRowView = (item) => {
        return (
            <TouchableOpacity onPress={() => this._itemClickAction(item)} key={item.key}>
                <View style={Styles.itemBgStyle}>
                    <View style={Styles.itemContentStyle}>
                        {/*头部image*/}
                        <Image
                            style={Styles.itemTopImageStyle}
                        />
                        <Text
                            style={Styles.itemBottomTextStyle}
                            number={2}
                        >
                            测试测试测试测试 测试测试测试测试 测试测试测试测试
                        </Text>
                        <Text
                            style={Styles.itemFolloweTextStyle}
                            number={1}
                        >
                            52人已关注
                        </Text>

                        <View
                            style={{
                                flexDirection: 'row'

                            }}
                        >
                            <View style={{}}>
                                <Text style={Styles.itemBottomPriceTextStyle}>
                                    $52起
                                </Text>
                            </View>

                        </View>

                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    /*条目点击事件*/
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
    itemContentStyle: {
        flex: 1,
        backgroundColor: 'white'
    },
    itemTopImageStyle: {
        backgroundColor: 'red',
        width: ScreenUtils.width / 2 - 16,
        height: ScreenUtils.width / 2 - 16
    },
    // itemTipBgViewStyle: {
    //     position: 'absolute',
    //     alignItems: 'center',
    //     marginTop: ScreenUtils.width / 2 - 16 - 16,
    //     width: ScreenUtils.width / 2 - 16,
    //     height: 16,
    //     opacity: 0.3,
    //     backgroundColor: 'black'
    // },
    // itemTipTextStyle: {
    //     flex: 1,
    //     paddingTop: 3,
    //     fontSize: 11,
    //     color: ColorUtil.Color_ffffff
    //
    // },
    itemBottomTextStyle: {
        padding: 10,
        color: ColorUtil.Color_222222,
        width: ScreenUtils.width / 2 - 16,
        height: 38,
        fontSize: 12

    },
    itemFolloweTextStyle: {
        color: ColorUtil.Color_33b4ff,
        fontSize: 11,
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10
    },
    itemBottomPriceTextStyle: {
        color: ColorUtil.Color_d51243,
        fontSize: 16,
        marginTop: 10
    }
});
