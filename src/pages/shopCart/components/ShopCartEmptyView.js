/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2018/12/18.
 *
 */
'use strict';

import React,{Component} from 'react';

import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity
} from 'react-native';

import {
    UIText
} from '../../../components/ui';
import DesignRule from '../../../constants/DesignRule';
import res from '../res';
import PropTypes from 'prop-types'

export default class ShopCartEmptyView  extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={styles.bgViewStyle}>
                <Image
                    source={res.kongShopCartImg}
                    style={styles.imgStyle}
                    resizeMode={'contain'}
                />
                <UIText
                    value={'去添加点什么吧'}
                    style={{
                        marginTop: 10,
                        fontSize: 15,
                        color: DesignRule.textColor_secondTitle
                    }}
                />
                <UIText
                    value={'快去商城逛逛吧~'}
                    style={styles.topTextStyle}
                />

                <TouchableOpacity
                    onPress={
                        () => {
                            this.props.btnClickAction && this.props.btnClickAction();
                        }
                    }
                >
                    <View
                        style={styles.bottomTextBgViewStyle}
                    >
                        <UIText
                            value={'去逛逛'}
                            style={styles.bottomTextStyle}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}
ShopCartEmptyView.propTypes={
    //去逛逛点击事件
    btnClickAction:PropTypes.func.isRequired
}

const styles = StyleSheet.create({

    bgViewStyle:{
        backgroundColor: DesignRule.bgColor,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    imgStyle:{
        height: 115,
        width: 115
    },
    topTextStyle:{
        marginTop: 10,
        fontSize: 15,
        color: DesignRule.textColor_secondTitle
    },
    bottomTextBgViewStyle:{
        marginTop: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: DesignRule.mainColor,
        borderWidth: 1,
        borderRadius: 18,
        width: 115,
        height: 36
    },
    bottomTextStyle:{
        color: DesignRule.mainColor,
        fontSize: 15
    }
});
