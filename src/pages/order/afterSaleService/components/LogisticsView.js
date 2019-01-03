/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2018/11/30.
 *
 */
'use strict';

import React from 'react';

import {
    StyleSheet,
    View,
    TouchableOpacity
} from 'react-native';

import {
    UIText,
    UIImage
} from '../../../../components/ui';
import DesignRule from '../../../../constants/DesignRule';
import EmptyUtils from '../../../../utils/EmptyUtils';
import res from '../../res';

const right_arrow = res.button.arrow_right_black;

export default class LogisticsView extends React.Component {

    constructor(props) {
        super(props);

        this._bind();

        this.state = {};
    }

    _bind() {

    }

    componentDidMount() {
    }

    /**
     *
     * item{
     *   title,
     *   placeholder,
     *   value,
     *   onPress,
     *   expressNo
     *
     * }
     */
    render() {
        let { data } = this.props;
        return (
            <View style={{ marginBottom: 10 }}>
                {
                    data.map((item, index) => {
                        let isValue = !EmptyUtils.isEmpty(item.value);
                       return(
                           <TouchableOpacity style={styles.item} key={index} onPress={()=>{item.onPress(item.expressNo)}}>
                               <UIText value={item.title} style={styles.title}/>
                               <UIText value={isValue ? item.value : item.placeholder} style={isValue ? styles.vlaue : styles.placeholder}/>
                               <UIImage source={right_arrow} style={{ height: 10, width: 7 }}/>
                           </TouchableOpacity>
                       )
                    })
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        height: 48,
        paddingHorizontal: DesignRule.margin_page,
        alignItems: 'center',
        flexDirection: 'row',
        borderBottomWidth: DesignRule.lineHeight,
        borderBottomColor: DesignRule.lineColor_inWhiteBg,
        backgroundColor: DesignRule.white
    },
    title: {
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_threeTitle,
        flex: 1
    },
    vlaue: {
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_threeTitle,
        marginRight: 20
    },
    placeholder: {
        color: DesignRule.textColor_placeholder,
        fontSize: DesignRule.fontSize_threeTitle,
        marginRight: 20
    }
});
