import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';

/**
 * 热门搜索view
 */

export default class HotSearchView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        };
    }

    render() {
        return (
            <View>
                <View style={styles.top}>
                    <Text style={{ fontSize: 13, color: '#999999' }}>热门搜索</Text>
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

        <TouchableOpacity onPress={() => this.clearHistory()}>
            <Image
                style={styles.image}
                source={require('../res/search_delete.png')}
            />
        </TouchableOpacity>;


    };

    _clickItemAction = (item) => {

    };

    //render标签
    rendTag = () => {
        //最近搜索
        let tagList = [];
        if (this.state.list.length > 0) {
            for (let index = 0; index < this.state.list.length; index++) {
                tagList.push(
                    <TouchableOpacity onPress={() => this._clickItemAction(this.state.list[index])}
                                      style={styles.tagText} key={index}>
                        <Text>{this.state.list[index]}</Text>
                    </TouchableOpacity>
                );
            }
            return tagList;

        }
    };
}

const styles = StyleSheet.create(
    {
        top: {
            flexDirection: 'row',   // 水平排布
            justifyContent: 'space-between',
            alignItems: 'center' //元素垂直居中排布
        },
        image: {
            alignItems: 'flex-end'
        },
        tagView: {
            flexDirection: 'row',   // 水平排布
            flexWrap: 'wrap',
            alignItems: 'center'
        },
        tagText: {
            backgroundColor: '#DFDFDF'
        }
    }
);
