import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    DeviceEventEmitter,
    TouchableOpacity,
    // NativeModules
} from 'react-native';
import StringUtils from '../../utils/StringUtils';
import DesignRule from "../../constants/DesignRule";
import {MRText as Text}from './UIText';

/**
 * 最近搜索view
 */
class RecentSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View>
                <View style={styles.top}>
                    <Text style={{ fontSize: 13, color: DesignRule.textColor_placeholder }}>历史搜素</Text>
                    {this.renderDeleteImg()}
                </View>
                <View style={styles.tagView}>
                    {this.rendTag()}
                </View>
            </View>
        );
    }

    //是否展示删除按钮
    renderDeleteImg = () => {
        if (this.props.recentData.length > 0) {
            return (
                <TouchableOpacity onPress={() => this.props.clearHistory()}>
                    <Image
                        style={styles.image}
                        source={require('./searchBar/search_delete.png')}
                    />
                </TouchableOpacity>
            );
        }
    };

    //清除历史标签
    clearHistory = () => {
        //父组件的数组清零
        if (this.props.clearHistory) {
            this.props.clearHistory();
        }
    };

    //render标签
    rendTag = () => {
        //最近搜索
        let tagList = [];
        if (this.props.recentData.length > 0) {
            // console.log('从父组件拿到最近搜索记录=' + this.props.recentData)
            for (let index = 0; index < this.props.recentData.length; index++) {
                tagList.push(
                    <TouchableOpacity key={index} onPress={() =>
                        DeviceEventEmitter.emit('inputText', this.props.recentData[index])}>
                        <Text style={styles.tagText}>{StringUtils.formatString(this.props.recentData[index])}</Text>
                    </TouchableOpacity>
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
            alignItems: 'center',
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
export default RecentSearch;
