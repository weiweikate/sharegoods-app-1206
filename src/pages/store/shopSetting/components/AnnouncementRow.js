//公告所在行
import React, { Component } from 'react';
import { Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import { MRText as Text } from '../../../../components/ui';
import ScreenUtils from '../../../../utils/ScreenUtils';

const DeleteIcon = res.shopSetting.del_icon;
const DashLine = res.shopSetting.xt_03;


export default class AnnouncementRow extends Component {

    _onPress = () => {
        const { content, id } = this.props.itemData;
        this.props.onPress({
            content, id, title: this._formatDateTime()
        });
    };

    _onPressDelete = () => {
        const { content, id } = this.props.itemData;
        this.props.onPressDelete({
            content, id
        });
    };


    _formatDateTime() {
        const { createTime } = this.props.itemData;
        if (createTime) {
            return '店铺公告';
        }
        const date = new Date(createTime);
        const y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '年' + m + '月' + d + '日' + '店铺公告';
    }

    render() {
        const { itemData, storeData } = this.props;
        const { roleType } = storeData;
        const { content } = itemData;
        return (<TouchableWithoutFeedback onPress={this._onPress}>
            <View style={styles.rowContainer}>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>{this._formatDateTime()}</Text>
                    {
                        roleType === 0 && <TouchableOpacity activeOpacity={0.7} onPress={this._onPressDelete} style={styles.delBtn}>
                            <Image style={styles.delImg} source={DeleteIcon}/>
                            <Text style={styles.delTitle} allowFontScaling={false}>删除</Text>
                        </TouchableOpacity>
                    }
                </View>
                <Image style={styles.dashLine} source={DashLine}/>
                <View style={styles.contentContainer}>
                    <Text numberOfLines={5} style={styles.content}>
                        {content}
                    </Text>
                </View>
            </View>
        </TouchableWithoutFeedback>);
    }

}

const styles = StyleSheet.create({
    rowContainer: {
        maxHeight: 196,
        borderRadius: 10,
        backgroundColor: 'white',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 10,
        shadowOpacity: 1,
        marginTop: 10,
        marginHorizontal: 16
    },
    titleRow: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    title: {
        fontSize: 15,
        fontWeight: '500',
        color: DesignRule.mainColor
    },
    contentContainer: {
        backgroundColor: 'white',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    content: {
        fontSize: 14,
        lineHeight: 20,
        color: DesignRule.textColor_mainTitle,
        marginVertical: 10,
        marginHorizontal: 21
    },
    delBtn: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center'
    },
    delImg: {
        width: 17, height: 15, marginRight: 6
    },
    delTitle: {
        fontSize: 13,
        color: DesignRule.textColor_mainTitle
    },
    dashLine: {
        width: ScreenUtils.width - 32
    }
});
