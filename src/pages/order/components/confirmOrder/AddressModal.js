/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2019/9/25.
 *
 */


'use strict';

/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2019/9/20.
 *
 */

'use strict';

import React from 'react';

import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    ScrollView,
    Image
} from 'react-native';

import {
    MRText
} from '../../../../components/ui';
import Modal from '../../../../comm/components/CommModal';
import ScreenUtils from '../../../../utils/ScreenUtils';
import { observer } from 'mobx-react';
import LinearGradient from 'react-native-linear-gradient';
import { confirmOrderModel } from '../../model/ConfirmOrderModel';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res'

const {unselected_circle, selected_circle_red} = res.button

@observer
export default class AddressModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {index: 0};
    }

    onPress(){
        confirmOrderModel.addressModal_selecetAddress(this.state.index)
    }

    renderItem=(data, index)=>{
        let {province, city, area, street, address } = data;
        street = street || '';
        address = address || ''
        return(
            <TouchableWithoutFeedback onPress={()=> {this.setState({index})}}>
                <View
                    style={{
                        height: DesignRule.autoSizeWidth(42),
                        paddingHorizontal: DesignRule.autoSizeWidth(15),
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                    <MRText
                        style={{
                            flex: 1,
                            fontSize: DesignRule.autoSizeWidth(12),
                            color: '#666666',
                            marginRight: DesignRule.autoSizeWidth(10)}}>
                        {province + city + area + street + address}
                    </MRText>
                    <Image
                        source={this.state.index === index? selected_circle_red: unselected_circle}
                        style={{height: DesignRule.autoSizeWidth(17), width: DesignRule.autoSizeWidth(17)}}
                    />
                </View>
            </TouchableWithoutFeedback>
        )
    }


    renderContent() {
        return (
            <View style={styles.modal}>
                <View  style={styles.bg}>
                    <MRText style={styles.title}>{'您修改了配送地址，是否切换？'}</MRText>
                    <View
                        style={{height: ScreenUtils.autoSizeWidth(120),
                            width: ScreenUtils.autoSizeWidth(290),
                            marginTop:ScreenUtils.autoSizeWidth(10),
                        }}>
                        <ScrollView >
                            {
                                confirmOrderModel.addressList.map((item, index)=>this.renderItem(item, index))
                            }
                        </ScrollView>
                    </View>
                    <View style={{marginTop:  ScreenUtils.autoSizeWidth(10), flexDirection: 'row', justifyContent: 'center'}}>
                        <TouchableWithoutFeedback onPress={() => {confirmOrderModel.closeAddressModal()}}>
                            <View style={{width: ScreenUtils.autoSizeWidth(85),
                                height:  ScreenUtils.autoSizeWidth(30),
                                borderRadius:  ScreenUtils.autoSizeWidth(15),
                                borderWidth: 1,
                                borderColor: DesignRule.mainColor,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight:  ScreenUtils.autoSizeWidth(20)
                            }}>
                                <MRText style={{fontSize:  ScreenUtils.autoSizeWidth(13), color: DesignRule.mainColor}}>取消</MRText>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => {this.onPress()}}>
                            <LinearGradient style={{ height: ScreenUtils.autoSizeWidth(30),
                                width: ScreenUtils.autoSizeWidth(85),
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius:  ScreenUtils.autoSizeWidth(15),

                            }}
                                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                            colors={['#FC5D39', '#FF0050']}
                            >
                                <MRText style={{fontSize:  ScreenUtils.autoSizeWidth(13), color: 'white'}}>切换</MRText>
                            </LinearGradient>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View>
        );
    }


    render() {
        return (
            <Modal
                animationType='slide'
                ref={(ref) => {
                    this.modal = ref;
                }}
                onRequestClose={() => {
                    confirmOrderModel.closeAddressModal()
                }}
                visible={ confirmOrderModel.addressModalShow}>
                {this.renderContent()}
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        alignItems: 'center',
        justifyContent: 'center'

    },
    bg: {
        width: ScreenUtils.autoSizeWidth(290),
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
        padding: ScreenUtils.autoSizeWidth(15),
    },
    title: {
        fontSize: ScreenUtils.autoSizeWidth(13),
        color: '#333333',
        marginTop: ScreenUtils.autoSizeWidth(5),
        textAlign: 'center'
    }
});
