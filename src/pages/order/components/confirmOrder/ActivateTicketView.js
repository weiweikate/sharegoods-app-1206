/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2019/9/17.
 *
 */
'use strict';

import React from 'react';

import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Image,
    Alert
} from 'react-native';

import {
    MRText
} from '../../../../components/ui';
import DesignRule from '../../../../constants/DesignRule';
import { observer } from 'mobx-react';
import { confirmOrderModel } from '../../model/ConfirmOrderModel';
import res from '../../res';
const {activate_icon, button: {unselected_circle, selected_circle_red}, activate_text} = res;

@observer
export default class ActivateTicketView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
    }



    componentDidMount() {
    }

    onPress = () => {
        Alert.alert('兑换券激活后不能取消，\n是否确认激活？',null,
            [{text: '取消', onPress: ()=> {}},
                {text: '确定', onPress: ()=> confirmOrderModel.invokeTicket(confirmOrderModel.invokeItem)}])
    }



    render() {
        if (!confirmOrderModel.canInvoke&&!confirmOrderModel.invokeSelect) {
            return null;
        }

        return (
            <TouchableWithoutFeedback
                onPress={this.onPress}
                disabled={confirmOrderModel.invokeSelect}
            >
                <View style={styles.block}>
                    <Image source={activate_icon}
                           style={styles.image}
                    />
                    <View style={styles.textContainer}>
                        <MRText style={styles.title}>现在勾选激活，立即兑换商品</MRText>
                        <MRText style={styles.detail}>激活后不可取消</MRText>
                    </View>
                    {!confirmOrderModel.invokeSelect? <Image source={activate_text}
                           style={styles.activate_text}/> : null}
                    <Image source={confirmOrderModel.invokeSelect? selected_circle_red :unselected_circle}
                           style={styles.btn}/>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    block: {
        marginBottom: 10,
        marginHorizontal: DesignRule.margin_page,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        height: DesignRule.autoSizeWidth(50),
        paddingHorizontal: DesignRule.autoSizeWidth(10)
    },
    image: {
        height: DesignRule.autoSizeWidth(30),
        width: DesignRule.autoSizeWidth(30),
    },
    textContainer: {
        flex: 1,
        marginLeft: DesignRule.autoSizeWidth(10)
    },
    title: {
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.autoSizeWidth(12)
    },
    detail: {
        color: DesignRule.textColor_instruction,
        fontSize: DesignRule.autoSizeWidth(10)
    },
    activate_text:{
        height: DesignRule.autoSizeWidth(18),
        width: DesignRule.autoSizeWidth(50),
    },
    btn:{
        height: DesignRule.autoSizeWidth(17),
        width: DesignRule.autoSizeWidth(17),
        marginLeft:5
    }
});
