/**
 * 招募中...
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';


export default class SearchRecruitingRow extends Component {

    static propTypes = {
        item: PropTypes.object,         // 内容
        onPress: PropTypes.func      // 点击
    };

    _onPress = (item) => {
        this.props.onPress && this.props.onPress(item);
    };

    render() {
        const { item } = this.props;
        return (<TouchableWithoutFeedback onPress={()=>this._onPress(item)}>
            <View style={styles.rowContainer}>
                {
                    item.headUrl ? <Image source={{ uri: item.headUrl }} style={styles.img}/> :
                        <View style={styles.img}/>
                }
                <View style={styles.right}>
                    <View style={styles.row}>
                        <Text style={styles.title}>{item.name || ''}</Text>
                        <View style={styles.ingContainer}>
                            <Text style={styles.ingText}>招募中</Text>
                        </View>
                    </View>
                    <View style = {{flexDirection:'row',justifyContent:'space-between',marginTop:11}}>
                        <Text style={[styles.desc]}>店长:{item.storeUserName || ''}</Text>
                        <Text style={[styles.desc]}>{item.storeUserNum || 0}成员</Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>);
    }
}

const styles = StyleSheet.create({
    rowContainer: {
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: 'white'
    },
    right: {
        flex:1,
        marginLeft: 10,
    },
    img: {
        alignSelf:'center',
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: '#c8c8c8',
        backgroundColor: '#c8c8c8'
    },
    row: {
        flexDirection: 'row',
    },
    title: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        color: '#000000'
    },
    ingContainer: {
        width: 46,
        height: 15,
        borderRadius: 7,
        backgroundColor: '#0186f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5
    },
    ingText: {
        fontSize: 11,
        color: '#f7f7f7'
    },
    desc: {
        fontSize: 12,
        color: '#666666'
    }
});

