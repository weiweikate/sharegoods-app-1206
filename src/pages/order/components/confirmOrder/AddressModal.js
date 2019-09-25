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
    ScrollView
} from 'react-native';

import {
    MRText
} from '../../../../components/ui';
import Modal from '../../../../comm/components/CommModal';
import ScreenUtils from '../../../../utils/ScreenUtils';
import { observer } from 'mobx-react';
import LinearGradient from 'react-native-linear-gradient';
import { confirmOrderModel } from '../../model/ConfirmOrderModel';

@observer
export default class AddressModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {index: 0};
    }

    onPress(){
        confirmOrderModel.addressModal_selecetAddress(this.state.index)
    }


    renderContent() {
        return (
            <View style={styles.modal}>
                <View  style={styles.bg}>
                    <MRText style={styles.title}>{'您修改了配送地址，是否切换？'}</MRText>
                   <View style={{height: ScreenUtils.autoSizeWidth(150)}}>
                       <ScrollView>
                       </ScrollView>
                   </View>
                    <View style={{marginTop:  ScreenUtils.autoSizeWidth(30), flexDirection: 'row', justifyContent: 'center'}}>
                        <TouchableWithoutFeedback onPress={() => {confirmOrderModel.closeAddressModal()}}>
                            <View style={{width: ScreenUtils.autoSizeWidth(110),
                                height:  ScreenUtils.autoSizeWidth(34),
                                borderRadius:  ScreenUtils.autoSizeWidth(17),
                                borderWidth: 1,
                                borderColor: '#999999',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight:  ScreenUtils.autoSizeWidth(20)
                            }}>
                                <MRText style={{fontSize:  ScreenUtils.autoSizeWidth(14), color: '#999999'}}>不同意并退出</MRText>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => {this.onPress()}}>
                            <LinearGradient style={{width: ScreenUtils.autoSizeWidth(110),
                                height:  ScreenUtils.autoSizeWidth(34),
                                borderRadius:  ScreenUtils.autoSizeWidth(17),
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                            colors={['#FC5D39', '#FF0050']}
                            >
                                <MRText style={{fontSize:  ScreenUtils.autoSizeWidth(16), color: 'white'}}>同意</MRText>
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
    btn: {
        height: ScreenUtils.autoSizeWidth(40),
        width: ScreenUtils.autoSizeWidth(180),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: ScreenUtils.autoSizeWidth(30)
    },
    btnText: {
        fontSize: ScreenUtils.autoSizeWidth(16),
        color: '#9B5A19'
    },
    title: {
        fontSize: ScreenUtils.autoSizeWidth(16),
        color: '#333333',
        marginTop: ScreenUtils.autoSizeWidth(5),
        textAlign: 'center'
    }
});
