/**
 * Created by zhanglei on 2018/6/13.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    DeviceEventEmitter
} from 'react-native';

import StringUtils from '../../utils/StringUtils';
import DesignRule from '../../constants/DesignRule';

/**
 * 最近搜索view
 */
class HotSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View>
                <View style={styles.top}>
                    <Text style={{ fontSize: 13, color: DesignRule.textColor_placeholder }}>热门搜索</Text>
                </View>
                <View style={styles.tagView}>
                    {this.rendTag()}
                </View>
            </View>
        );
    }


    //render标签
    rendTag = () => {
        //最近搜索
        let tagList = [];
        if (this.props.recentData.length > 0) {
            // console.log('从父组件拿到最近搜索记录=' + this.props.recentData)
            for (let index = 0; index < this.props.recentData.length; index++) {
                tagList.push(
                    <View style={styles.tagText} key={index}>
                        <Text onPress={() =>
                            DeviceEventEmitter.emit('inputText', this.props.recentData[index])}
                              key={index}>{StringUtils.formatString(this.props.recentData[index])}</Text>
                    </View>
                );
            }
            return tagList;

        } else {
            return <Text style={{ flex: 1, backgroundColor: 'white', marginRight: 15 }}>no data</Text>;
        }
    };
}

const styles = StyleSheet.create(
    {
        top: {
            flexDirection: 'row',   // 水平排布
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 15,
            justifyContent: 'space-between',
            alignItems: 'center' //元素垂直居中排布
        },
        image: {
            width: 14,
            height: 14,
            alignItems: 'flex-end'
        },
        tagView: {
            flexDirection: 'row',   // 水平排布
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 10,
            flexWrap: 'wrap',
            alignItems: 'center'
        },
        tagText: {
            backgroundColor: '#DFDFDF',
            borderWidth: 1,
            borderColor: '#DFDFDF',
            borderRadius: 4,
            paddingLeft: 8,
            paddingRight: 8,
            paddingTop: 4,
            paddingBottom: 4,
            marginRight: 8,
            marginBottom: 8
        }
    }
);
//因为要在其他类中使用
export default HotSearch;
