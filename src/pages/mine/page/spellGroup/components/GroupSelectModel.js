/**
 * @author zhoujianxin
 * @date on 2019/9/4.
 * @desc 分享按钮弹窗
 * @org  www.sharegoodsmall.com
 * @email zhoujianxin@meeruu.com
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import Modal from '../../../../../comm/components/CommModal';
import ScreenUtils from '../../../../../utils/ScreenUtils';
import DesignRule from '../../../../../constants/DesignRule';

export default class GroupSelectModel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    onOpen = () => {
        this.setState({
            visible: true
        });
    };


    onClose = () => {
        this.setState({
            visible: false
        });
    };

    render() {
        const {createAD, inviteShare, data} = this.props;
        const {visible} = this.state;
        let showParams = data;
        return (
            <Modal
                visible={visible}
                transparent={true}
                animationType='fade'
                onRequestClose={() => {
                    this.onClose();
                }}
                style={styles.container}>
                <View style={styles.modalStyle}>
                    <View style={styles.contentStyle}>

                        <TouchableOpacity style={styles.btnTouchStyle}
                                          activeOpacity={0.7}
                                          onPress={() => {
                                              //判断是否传入分享数据 存在type则为传入了分享数据 其他则没传入
                                              if (data && showParams['type']) {
                                                  showParams['type'] = 'Group';
                                              } else {
                                                  showParams = 'Group';
                                              }
                                              this.setState({
                                                  visible: false
                                              }, () => {
                                                  // 唤起分享组件
                                                  inviteShare && inviteShare(showParams)
                                              });
                                          }}>
                            <Text style={{color: '#0076FF', fontSize: 17}} allowFontScaling={false}>
                                邀请好友参团
                            </Text>
                        </TouchableOpacity>

                        <View style={{width: '100%', height: 1, backgroundColor: DesignRule.bgColor}}/>

                        <TouchableOpacity style={styles.btnTouchStyle}
                                          activeOpacity={0.7}
                                          onPress={() => {
                                              //判断是否传入分享数据 存在type则为传入了分享数据 其他则没传入
                                              if (data && showParams['type']) {
                                                  showParams['type'] = 'GroupAD';
                                              } else {
                                                  showParams = 'GroupAD';

                                              }
                                              this.setState({
                                                  visible: false
                                              }, () => {
                                                  //生成海报
                                                  createAD && createAD(showParams);
                                              });
                                          }}>
                            <Text style={{color: '#0076FF', fontSize: 17}} allowFontScaling={false}>
                                生成邀请海报
                            </Text>
                        </TouchableOpacity>

                        <View style={{width: '100%', height: 5, backgroundColor: DesignRule.bgColor}}/>


                        <TouchableOpacity activeOpacity={0.7}
                                          style={styles.btnTouchStyle}
                                          onPress={() => {
                                              this.onClose();
                                          }}>
                            <Text style={{color: '#0076FF', fontSize: 17}} allowFontScaling={false}>
                                取消
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modalStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'flex-end',
    },
    contentStyle: {
        width: ScreenUtils.width,
        minHeight: 138 + ScreenUtils.safeBottom,
        backgroundColor: '#FCFCFC',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        overflow: 'hidden',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: ScreenUtils.safeBottom
    },
    btnTouchStyle:{
        height: 44,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    }

});
