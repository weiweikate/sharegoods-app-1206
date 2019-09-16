import { Image, SectionList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MRText as Text } from '../../../components/ui';
import React, { Component } from 'react';
import ScreenUtils from '../../../utils/ScreenUtils';
import { ActivityOneView, SbSectiontHeaderView } from './SbSectiontHeaderView';
import PropTypes from 'prop-types';
import DesignRule from '../../../constants/DesignRule';

export default class ThreeColumnListView extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <SectionList
                contentContainerStyle={Styles.list}
                style={{
                    backgroundColor: DesignRule.bgColor
                }}
                numColumns={2}
                stickySectionHeadersEnabled={false}
                /* 渲染头*/
                renderSectionHeader={
                    ({ section }) => {
                        if (section.key === 'one') {
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
        );
    }

    _renderHeaderView = (key) => {
        return (
            <SbSectiontHeaderView
                subjectType={0}
            />
        );
    };
    _renderActivityView = (key) => {
        return (
            <ActivityOneView/>
        );
    };
    _itemClickAction = (item) => {
        console.log(item.key);

    };
    _renderRowView = (item) => {
        return (
            <TouchableOpacity activeOpacity={0.7} onPress={() => this._itemClickAction(item)} key={item.key}>
                <View style={Styles.itemBgStyle}>
                    <View style={Styles.itemContentStyle}>
                        {/*头部image*/}
                        <Image
                            style={Styles.itemTopImageStyle}
                        />
                        <View style={Styles.itemTipBgViewStyle}>
                            <Text style={Styles.itemTipTextStyle}>
                                测试测试测试测试
                            </Text>
                        </View>
                        <Text
                            style={Styles.itemBottomTextStyle}
                            number={2}
                        >
                            测试测试测试测试 测试测试测试测试 测试测试测试测试
                        </Text>

                        <Text style={Styles.itemBottomPriceTextStyle}>
                            $52起
                        </Text>

                    </View>
                </View>
            </TouchableOpacity>
        );
    };
}

ThreeColumnListView.propTypes = {
    //专题列表列数
    columnNumber: PropTypes.number,
    //0无切换 1 有切换
    subjectType: PropTypes.number
};

const Styles = StyleSheet.create({
    list: {
        flexDirection: 'row',//设置横向布局
        flexWrap: 'wrap',  //设置换行显示
        alignItems: 'flex-start',
        backgroundColor: 'white'
    },
    itemBgStyle: {
        width: ScreenUtils.width / 3,
        height: ScreenUtils.width / 3 + 70,
        backgroundColor: DesignRule.bgColor,
        padding: 8,
        paddingBottom: 0
    },
    itemContentStyle: {
        flex: 1,
        backgroundColor: 'white'
    },
    itemTopImageStyle: {
        backgroundColor: DesignRule.mainColor,

        width: ScreenUtils.width / 3 - 16,
        height: ScreenUtils.width / 3 - 16
    },
    itemTipBgViewStyle: {
        position: 'absolute',
        alignItems: 'center',
        marginTop: ScreenUtils.width / 3 - 16 - 16,
        width: ScreenUtils.width / 3 - 16,
        height: 16,
        opacity: 0.3,
        backgroundColor: DesignRule.textColor_mainTitle
    },
    itemTipTextStyle: {
        flex: 1,
        paddingTop: 3,
        fontSize: 11,
        color: 'white'

    },
    itemBottomTextStyle: {
        marginTop: 10,
        color: DesignRule.textColor_mainTitle,
        width: ScreenUtils.width / 3 - 16,
        height: 28,
        fontSize: 12
    },
    itemBottomPriceTextStyle: {
        color: DesignRule.mainColor,
        fontSize: 16,
        marginTop: 10
    }
});

