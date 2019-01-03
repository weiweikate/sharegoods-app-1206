//拼店页面，店铺行数据
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import DesignRule from 'DesignRule';
import UIImage from "@mr/image-placeholder";
import {
    MRText as Text
} from '../../../../components/ui';

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
                    <UIImage style={styles.icon} source={{ uri: this.props.headUrl }}/> : <View style={styles.icon}/>
            }

            <View style={styles.right}>
                <Text numberOfLines={2} style={styles.shopName} allowFontScaling={false}>{this.props.name || ''}</Text>
                <Text numberOfLines={1} style={styles.desc} allowFontScaling={false}>{this.props.hadUser || 0}成员</Text>
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
        backgroundColor: 'white'
    },
    icon: {
        width: 50,
        height: 50,
        backgroundColor: DesignRule.lineColor_inColorBg,
        borderWidth: 1,
        borderColor: DesignRule.textColor_hint
    },
    right: {
        flex: 1,
        marginLeft: 11,
        justifyContent: 'center'
    },
    shopName: {
        fontSize: 13,
        color: DesignRule.textColor_mainTitle
    },
    desc: {
        fontSize: 12,
        color: DesignRule.textColor_secondTitle,
        marginTop: 9
    }

});

