//公告所在行
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
import DeleteIcon from '../res/del-icon.png';
import DashLine from '../res/xt_03.png';

export default class AnnouncementRow extends Component {

    static propTypes = {
        content: PropTypes.string.isRequired,       // 内容
        id: PropTypes.number.isRequired,            // id
        createTime: PropTypes.number.isRequired,    // 发布时间
        onPress: PropTypes.func.isRequired,         // 点击回调
        onPressDelete: PropTypes.func.isRequired,   // 点击删除的回调
        canDelete: PropTypes.bool.isRequired       // 是否可以删除
    };

    _onPress = () => {
        this.props.onPress({
            content: this.props.content,
            id: this.props.id,
            title: this._formatDateTime()
        });
    };

    _onPressDelete = () => {
        this.props.onPressDelete({
            content: this.props.content,
            id: this.props.id
        });
    };


    _formatDateTime() {
        if (!this.props.createTime) {
            return '店铺公告';
        }
        const date = new Date(this.props.createTime);
        const y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '年' + m + '月' + d + '日' + '店铺公告';
    }

    render() {
        // const content = "公告，是指政府、团体对重大事件当众正式" +
        //     "公布或者公开宣告，宣布。国务院2012年4月16" +
        //     "日发布、2012年7月1日起施行的《党政机关公文" +
        //     "处理工作条例》，对公告的使用表述为：“适用于" +
        //     "向国内外宣布重要事项或者法定事项适用于" +
        //     "向国内外宣布重要事项或者法定事项适用于" +
        //     "向国内外宣布重要事项或者法定事项";

        const { canDelete, content } = this.props;
        return (<TouchableWithoutFeedback onPress={this._onPress}>
            <View style={styles.rowContainer}>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>{this._formatDateTime()}</Text>
                    {
                        canDelete ? <TouchableOpacity onPress={this._onPressDelete} style={styles.delBtn}>
                            <Image style={styles.delImg} source={DeleteIcon}/>
                            <Text style={styles.delTitle}>删除</Text>
                        </TouchableOpacity> : null
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
        backgroundColor: '#ffffff',
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
        fontFamily: 'PingFang-SC-Regular',
        fontSize: 15,
        fontWeight: 'bold',
        color: '#e60012'
    },
    contentContainer: {
        backgroundColor: 'white',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    content: {
        fontFamily: 'PingFang-SC-Regular',
        fontSize: 14,
        lineHeight: 20,
        color: '#000000',
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
        color: '#000000'
    },
    dashLine: {
        width: Dimensions.get('window').width - 32
    }
});
