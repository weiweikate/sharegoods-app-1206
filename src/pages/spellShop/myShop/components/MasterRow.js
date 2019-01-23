//店长信息

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import DesignRule from '../../../../constants/DesignRule';
import StringUtils from '../../../../utils/StringUtils';
import res from '../../res';
import UIImage from '@mr/image-placeholder';

const ShopMasterIcon = res.myShop.dz_03;
import {
    MRText as Text
} from '../../../../components/ui';

export default class MasterRow extends Component {


    static propTypes = {
        item: PropTypes.object,     //数据
        style: PropTypes.any,       //样式
        onPress: PropTypes.func    //点击回调
    };

    static defaultProps = {
        item: {}
    };

    _clickAssistantDetail = () => {
        const { userCode } = this.props.item;
        const { onPress } = this.props;
        onPress && userCode && onPress(userCode);
    };

    render() {
        let { headImg, nickName, levelName, contribution } = this.props.item;
        let { tradeBalance } = this.props;
        tradeBalance = StringUtils.isEmpty(tradeBalance) ? 0 : parseFloat(tradeBalance);
        contribution = StringUtils.isEmpty(contribution) ? 0 : parseFloat(contribution);
        return (<TouchableWithoutFeedback onPress={this._clickAssistantDetail}>
            <View style={styles.container}>
                <UIImage style={styles.iconGap} source={ShopMasterIcon}/>
                <View style={styles.row}>
                    {
                        headImg ? <UIImage source={{ uri: headImg }} style={styles.headerImg} borderRadius={14}/> :
                            <View style={[styles.headerImg, { backgroundColor: DesignRule.lineColor_inColorBg }]}/>
                    }
                    <View style={styles.right}>
                        <Text style={styles.name} allowFontScaling={false}>{(nickName || '  ')}</Text>
                        <Text style={styles.level} allowFontScaling={false}>{levelName || ' '}</Text>
                        <Text style={styles.desc}
                              allowFontScaling={false}>贡献度：{tradeBalance === 0 ? 0 : ((contribution / tradeBalance) * 100).toFixed(2)}%</Text>
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
        backgroundColor: '#ffffff',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 10,
        shadowOpacity: 1,
        marginTop: 10,
        marginHorizontal: 15
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
        marginLeft: 20,
        marginTop: 15,
        borderRadius: 14
    },
    right: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'center'
    },
    name: {
        fontSize: 14,
        paddingBottom: 3,
        color: '#222'
    },
    level: {
        fontSize: 13,
        color: DesignRule.textColor_secondTitle,
        marginVertical: 3
    },
    desc: {
        fontSize: 12,
        color: DesignRule.textColor_secondTitle
    }
});
