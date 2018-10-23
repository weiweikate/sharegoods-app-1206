import React from 'react';
import {
    NativeModules,
    StyleSheet,
    View,
    Image,
    TextInput as RNTextInput,
    Text,
    TouchableOpacity,
    ScrollView, Button
} from 'react-native';
import BasePage from '../../../../BasePage';
import {
    UIText, UIImage, TakePhotoModal
} from '../../../../components/ui';
import { color } from '../../../../constants/Theme';
import StringUtils from '../../../../utils/StringUtils';
import ScreenUtils from '../../../../utils/ScreenUtils';
import IDcard_country from '../../res/userInfoImg/IDcard_country.png';
import IDcard_persion from '../../res/userInfoImg/IDcard_persion.png';
import addressSelect from '../../res/userInfoImg/addressSelect.png';
import addressUnselect from '../../res/userInfoImg/addressUnselect.png';
import UserSingleItem from '../../components/UserSingleItem';
import BusinessUtils from '../../components/BusinessUtils';
import user from '../../../../model/user';
import MineApi from '../../api/MineApi';

export default class IDVertify2Page extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            agreeAggreement: true,
            isShowTakePhotoModal: false,
            name: '',
            idNumber: '',
            backIdCard: '',
            frontIdCard: '',
            disFailedStatus: false
        };
    }

    $navigationBarOptions = {
        title: '实名认证',
        show: true // false则隐藏导航
        // hiddenNav:false
    };

    //**********************************ViewPart******************************************
    _render() {
        return (
            <View style={styles.container}>
                {this.state.disFailedStatus ? this.renderHintInformation() : null}
                {this.renderContent()}
            </View>
        );
    }

    renderContent = () => {
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    <View style={styles.itemTitleView}>
                        <UIText value={'请填写自己的真实姓名及证件号'} style={styles.itemTitleText}/>
                    </View>
                    {this.renderLine()}
                    <UserSingleItem leftText={'证件'} rightText={'身份证'} rightTextStyle={styles.grayText}
                                    leftTextStyle={styles.blackText} isLine={false} isArrow={false}/>
                    {this.renderWideLine()}
                    <View style={{
                        height: 56,
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={styles.accountStyle}>姓名</Text>
                        <RNTextInput
                            style={styles.inputTextStyle}
                            onChangeText={text => this.setState({ name: text })}
                            placeholder={'请输入真实姓名'}
                            underlineColorAndroid={'transparent'}
                        />
                    </View>
                    {this.renderLine()}
                    <View style={{
                        height: 56,
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={styles.accountStyle}>证件号</Text>
                        <RNTextInput
                            style={styles.inputTextStyle}
                            onChangeText={text => this.setState({ idNumber: text })}
                            placeholder={'请输入证件号'}
                            underlineColorAndroid={'transparent'}
                        />
                    </View>
                    <View style={[styles.itemTitleView, { justifyContent: 'center', alignItems: 'center' }]}>
                        <UIText value={'请上传证件照的正反\n需保持姓名及证件号清晰可见'}
                                style={[styles.itemTitleText, { textAlign: 'center' }]}/>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingLeft: 15,
                        paddingRight: 15
                    }}>
                        {this.renderBackIdCard()}
                        {this.renderFrontIdCard()}
                    </View>
                    <View style={{
                        marginTop: 26,
                        width: ScreenUtils.width - 96,
                        height: 48,
                        marginLeft: 48,
                        marginRight: 48
                    }}>
                        <Button
                            title='提交'
                            color={color.red}
                            onPress={() => this.commit()}/>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <UIText value={'（信息仅用户自己可见）'} style={{
                            fontFamily: 'PingFang-SC-Medium',
                            fontSize: 13,
                            color: '#999999',
                            marginTop: 7
                        }}/>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}
                                          onPress={() => {
                                              this.agreeAggreement();
                                          }}>
                            <Image source={this.state.agreeAggreement ? addressSelect : addressUnselect}
                                   style={{ width: 11, height: 11 }}/>
                            <UIText value={'提交认证代表您已同意'}
                                    style={{ fontFamily: 'PingFang-SC-Medium', fontSize: 11, color: '#999999' }}/>
                            <UIText value={'《实名认证协议》'}
                                    style={{ fontFamily: 'PingFang-SC-Medium', fontSize: 11, color: '#D62B56' }}
                                     onPress={()=>{this.$navigate('HtmlPage', {
                                         title: '用户协议内容',
                                         uri: 'https://reg.163.com/agreement_mobile_ysbh_wap.shtml?v=20171127'
                                     })}}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

        );
    };
    renderBackIdCard = () => {
        let imageWidth = (ScreenUtils.width - 45) / 2;
        return (StringUtils.isEmpty(this.state.backIdCard) ?
            <UIImage source={IDcard_country} style={{ height: imageWidth, width: imageWidth }} onPress={() => {
                this.getIDcard_country();
            }}/> :
            <UIImage source={{ uri: this.state.backIdCard }} style={{ height: imageWidth, width: imageWidth }}
                     onPress={() => {
                         this.getIDcard_country();
                     }}/>);
    };
    renderFrontIdCard = () => {
        let imageWidth = (ScreenUtils.width - 45) / 2;
        return (StringUtils.isEmpty(this.state.frontIdCard) ?
            <UIImage source={IDcard_persion} style={{ height: imageWidth, width: imageWidth }} onPress={() => {
                this.getIDcard_persion();
            }}/> :
            <UIImage source={{ uri: this.state.frontIdCard }} style={{ height: imageWidth, width: imageWidth }}
                     onPress={() => {
                         this.getIDcard_persion();
                     }}/>);
    };
    renderHintInformation = () => {
        return (
            <View style={{ height: 50, backgroundColor: '#e60012', justifyContent: 'center', paddingLeft: 15 }}>
                <UIText value={'请仔细检查姓名和证件号是否有误\n并重新上传图片，提交审核'}
                        style={{ fontFamily: 'PingFang-SC-Medium', fontSize: 13, lineHeight: 18, color: '#ffffff' }}/>
            </View>
        );
    };
    renderLine = () => {
        return (
            <View style={{ height: 1, backgroundColor: color.gray_EEE }}/>
        );
    };
    renderWideLine = () => {
        return (
            <View style={{ height: 10 }}/>
        );
    };
    renderModal = () => {
        return (
            <View>
                <TakePhotoModal
                    isShow={this.state.isShowTakePhotoModal}
                    closeWindow={() => {
                        this.setState({ isShowTakePhotoModal: false });
                    }}
                    takePhoto={() => {
                        this.setState({ isShowTakePhotoModal: false });
                    }}
                    selectPhoto={() => {
                        this.setState({ isShowTakePhotoModal: false });
                    }}
                />
            </View>

        );
    };
    //**********************************BusinessPart******************************************
    getIDcard_persion = () => {
        BusinessUtils.getImagePicker(callback => {
            this.setState({ frontIdCard: callback.imageUrl });
        });
    };
    getIDcard_country = () => {
        BusinessUtils.getImagePicker(callback => {
            this.setState({ backIdCard: callback.imageUrl });
        });
    };

    loadPageData() {

    }

    commit = () => {
        if(!this.state.agreeAggreement){
            NativeModules.commModule.toast('请先勾选实名认证协议');
            return;
        }
        if (StringUtils.isEmpty(this.state.name)) {
            NativeModules.commModule.toast('请输入姓名');
            return;
        }
        if (!StringUtils.isChineseName(this.state.name)) {
            NativeModules.commModule.toast('请输入真实姓名');
            return;
        }
        if (StringUtils.isEmpty(this.state.idNumber)) {
            NativeModules.commModule.toast('请输入证件号');
            return;
        }
        if (!StringUtils.isCardNo(this.state.idNumber)) {
            NativeModules.commModule.toast('请输入真实证件号');
            return;
        }
        if (StringUtils.isEmpty(this.state.backIdCard)) {
            NativeModules.commModule.toast('请上传身份证背面图');
            return;
        }
        if (StringUtils.isEmpty(this.state.frontIdCard)) {
            NativeModules.commModule.toast('请上传身份证正面图');
            return;
        }
        let params = {
            backPhoto: this.state.backIdCard,
            frontPhoto: this.state.frontIdCard,
            idcardNo: this.state.idNumber,
            realName: this.state.name
        };
        this.$loadingShow();
        MineApi.addUserCertification(params).then((response) => {
            this.$loadingDismiss();
            if (response.code === 10000) {
                NativeModules.commModule.toast('实名认证成功');
                user.realnameStatus = 1;
                this.$navigateBack();
            } else {
                if (response.code == 500) {
                    this.setState({ disFailedStatus: true });
                }
                NativeModules.commModule.toast(response.msg);
            }
        }).catch(e => {
            this.$loadingDismiss();
            this.$toastShow(e.msg);
        });
    };
    agreeAggreement = () => {
        let agreeAggreement = !this.state.agreeAggreement;
        this.setState({ agreeAggreement: agreeAggreement });
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: color.page_background
    }, itemTitleView: {
        height: 48,
        backgroundColor: '#f7f7f7',
        paddingLeft: 14,
        justifyContent: 'center'
    }, itemTitleText: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        color: '#999999'
    }, blackText: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 15,
        color: '#222222'
    },
    grayText: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 15,
        color: '#999999'
    }, accountStyle: {
        marginLeft: 16, color: color.loginTextBlack, width: 60
    }, inputTextStyle: {
        marginLeft: 20, height: 40, flex: 1, backgroundColor: 'white', fontSize: 14
    }
});

