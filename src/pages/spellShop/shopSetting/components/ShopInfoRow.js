//拼店页面，店铺行数据
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import DesignRule from 'DesignRule';

export default class ShopInfoRow extends Component {

    static propTypes = {
        id: PropTypes.number.isRequired,        //店铺id
        headUrl: PropTypes.string.isRequired,   //头像
        name: PropTypes.string.isRequired,      //店名
        hadUser: PropTypes.number.isRequired,   //店内目前成员人数
        click: PropTypes.func.isRequired       //点击毁掉
    };

    render() {
        return (<TouchableOpacity onPress={() => {
            this.props.id && this.props.click(this.props.id);
        }} style={styles.container}>

            {
                this.props.headUrl && typeof this.props.headUrl === 'string' ?
                    <Image style={styles.icon} source={{ uri: this.props.headUrl }}/> : <View style={styles.icon}/>
            }

            <View style={styles.right}>
                <Text numberOfLines={2} style={styles.shopName}>{this.props.name || ''}</Text>
                <Text numberOfLines={1} style={styles.desc}>{this.props.hadUser || 0}成员</Text>
            </View>

        </TouchableOpacity>);
    }

}

const styles = StyleSheet.create({
    container: {
        height: 80,
        flexDirection: 'row',
        paddingHorizontal: 15,
        alignItems: 'center',
        backgroundColor: DesignRule.white
    },
    icon: {
        width: 50,
        height: 50,
        backgroundColor: '#eee',
        borderWidth: 1,
        borderColor: '#c8c8c8'
    },
    right: {
        flex: 1,
        marginLeft: 11,
        justifyContent: 'center'
    },
    shopName: {
        fontSize: 13,
        color: '#000000'
    },
    desc: {
        fontSize: 12,
        color: '#666',
        marginTop: 9
    }

});

