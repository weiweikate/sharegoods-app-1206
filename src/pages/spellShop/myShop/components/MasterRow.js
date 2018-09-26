//店长信息

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import ShopMasterIcon from '../res/dz_03.png';

export default class MasterRow extends Component {


    static propTypes = {
        item: PropTypes.object,     //数据
        style: PropTypes.any,       //样式
        onPress: PropTypes.func,    //点击回调
    };

    static defaultProps = {
        item: {}
    };

    _clickAssistantDetail = ()=>{
        const {id} = this.props.item;
        const {onPress} = this.props;
        onPress && id && onPress(id);
    };

    render() {
        let {headImg,nickName,levelName,storeTotalBonus} = this.props.item;
        return (<TouchableWithoutFeedback onPress={this._clickAssistantDetail}>
            <View style={styles.container}>
                <Image style={styles.iconGap} source={ShopMasterIcon}/>
                <View style={styles.row}>
                    {
                        headImg ? <Image source={{uri: headImg}} style={styles.headerImg}/> : <View style={styles.headerImg}/>
                    }
                    <View style={styles.right}>
                        <Text style={styles.name}>{(nickName || '  ')}</Text>
                        <Text style={styles.level}>{levelName || ' '}</Text>
                        <Text style={styles.desc}>贡献度：{storeTotalBonus || 0}%</Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>);
    }
}

const styles = StyleSheet.create({
    container: {
        height: 105,
        borderRadius: 10,
        backgroundColor: "#ffffff",
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 10,
        shadowOpacity: 1,
        marginTop: 10,
        marginHorizontal: 15,
    },
    iconGap: {
        marginLeft: 0,
        marginTop: 10
    },
    row: {
        flexDirection: 'row',
        marginTop: 7
    },
    headerImg: {
        width: 28,
        height: 28,
        backgroundColor: '#f6a3aa',
        borderRadius: 14,
        marginLeft: 20,
        marginTop: 15
    },
    right: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'center'
    },
    name: {
        fontSize: 14,
        color: "#222"
    },
    level: {
        fontSize: 13,
        color: "#666666",
        marginVertical: 3
    },
    desc: {
        fontSize: 12,
        color: "#666666"
    }
});
