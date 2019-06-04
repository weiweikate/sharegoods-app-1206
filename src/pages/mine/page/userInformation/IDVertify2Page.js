import React from 'react';
import {
    NativeModules,
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import BasePage from '../../../../BasePage';
import {
    UIText, TakePhotoModal, NoMoreClick, UIImage
} from '../../../../components/ui';
import ImageLoad from '@mr/image-placeholder';
import StringUtils from '../../../../utils/StringUtils';
import ScreenUtils from '../../../../utils/ScreenUtils';
import UserSingleItem from '../../components/UserSingleItem';
import BusinessUtils from '../../components/BusinessUtils';
import user from '../../../../model/user';
import MineApi from '../../api/MineApi';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import {MRText as Text, MRTextInput as RNTextInput} from '../../../../components/ui'
import apiEnvironment from '../../../../api/ApiEnvironment';
import { track, trackEvent } from '../../../../utils/SensorsTrack';

const IDcard_country = res.userInfoImg.IDcard_country;
const IDcard_persion = res.userInfoImg.IDcard_persion;
const addressSelect = res.userInfoImg.addressSelect;
const addressUnselect = res.userInfoImg.addressUnselect;
// const htmlUrl = __DEV__ ?
//     "https://testh5.sharegoodsmall.com/static/protocol/privacy.html"
//     :
//     "https://testh5.sharegoodsmall.com/static/protocol/privacy.html";
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
                        <Text style={styles.accountStyle} allowFontScaling={false}>姓名</Text>
                        <RNTextInput
                            style={styles.inputTextStyle}
                            onChangeText={text => this.setState({ name: text })}
                            placeholder={'请填写证件上的真实姓名'}
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
                        <Text style={styles.accountStyle} allowFontScaling={false}>证件号</Text>
                        <RNTextInput
                            style={styles.inputTextStyle}
                            onChangeText={text => this.setState({ idNumber: text })}
                            placeholder={'请填写证件上的证件号码'}
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
                    <NoMoreClick style={{
                        marginTop: 42,
                        backgroundColor: StringUtils.isNoEmpty(this.state.name) && StringUtils.isNoEmpty(this.state.idNumber) && StringUtils.isNoEmpty(this.state.backIdCard) && StringUtils.isNoEmpty(this.state.frontIdCard) ? DesignRule.mainColor : DesignRule.bgColor_grayHeader,
                        width: ScreenUtils.width - 84,
                        height: 45,
                        marginLeft: 42,
                        marginRight: 42,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 25
                    }} onPress={() => this.commit()}>
                        <Text style={{ fontSize: 17, color: 'white' }} allowFontScaling={false}>提交</Text>
                    </NoMoreClick>
                    <View style={{ alignItems: 'center' }}>
                        <UIText value={'（信息仅用户自己可见）'} style={{
                            fontSize: 13,
                            color: DesignRule.textColor_instruction,
                            marginTop: 7
                        }}/>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}
                                          onPress={() => {
                                              this.agreeAggreement();
                                          }}>
                            <Image source={this.state.agreeAggreement ? addressSelect : addressUnselect}
                                   style={{ width: 11, height: 11 }}/>
                            <UIText value={'提交认证代表您已同意'}
                                    style={{ fontSize: 11, color: DesignRule.textColor_instruction }}/>
                            <UIText value={'《实名认证协议》'}
                                    style={{ fontSize: 11, color: DesignRule.mainColor }}
                                    onPress={() => {
                                        this.$navigate('HtmlPage', {
                                            title: '实名认证协议',
                                            uri: apiEnvironment.getCurrentH5Url() + '/static/protocol/privacy.html'
                                        });
                                    }}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

        );
    };
    renderBackIdCard = () => {
        let imageWidth = (ScreenUtils.width - 45) / 2;
        if (StringUtils.isEmpty(this.state.backIdCard) ) {
          return  <UIImage source={IDcard_persion} style={{ height: imageWidth, width: imageWidth }} onPress={() => {
                this.getIDcard_country();
            }}/>
        }else {
            return(
                <TouchableOpacity onPress={() => {
                    this.getIDcard_country();
                }}>
                    <ImageLoad source={{ uri: this.state.backIdCard }} style={{ height: imageWidth, width: imageWidth }}/>
                </TouchableOpacity>)
        }
    };
    renderFrontIdCard = () => {//IDcard_persion
        let imageWidth = (ScreenUtils.width - 45) / 2;
        if (StringUtils.isEmpty(this.state.frontIdCard))
        {
            return  <UIImage source={IDcard_country} style={{ height: imageWidth, width: imageWidth }} onPress={() => {
                this.getIDcard_persion();
            }}/>
        }else {
            return(
                <TouchableOpacity onPress={() => {
                    this.getIDcard_persion();
                }}>
                    <ImageLoad source={{ uri: this.state.frontIdCard }} style={{ height: imageWidth, width: imageWidth }}/>
                </TouchableOpacity>)
        }
    };
    renderHintInformation = () => {
        return (
            <View style={{
                height: 50,
                backgroundColor: DesignRule.mainColor,
                justifyContent: 'center',
                paddingLeft: 15
            }}>
                <UIText value={'请仔细检查姓名和证件号是否有误\n并重新上传图片，提交审核'}
                        style={{ fontSize: 13, lineHeight: 18, color: 'white' }}/>
            </View>
        );
    };
    renderLine = () => {
        return (
            <View style={{ height: 0.5, backgroundColor: DesignRule.lineColor_inColorBg }}/>
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
                    ref={(ref) => {
                        this.takePhoteModal = ref;
                    }}
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
            this.setState({ frontIdCard: callback.imageUrl[0] });
        });
    };
    getIDcard_country = () => {
        BusinessUtils.getImagePicker(callback => {
            this.setState({ backIdCard: callback.imageUrl[0] });
        });
    };


    commit = () => {
        if (!this.state.agreeAggreement) {
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
            frontPhoto: this.state.backIdCard,
            backPhoto: this.state.frontIdCard,
            idcardNo: this.state.idNumber,
            realName: this.state.name
        };
        this.$loadingShow();
        MineApi.addUserCertification(params).then((response) => {
            this.$loadingDismiss();
            NativeModules.commModule.toast('实名认证成功');
            MineApi.getUser().then(resp => {
                let data = resp.data;
                track(trackEvent.ReadCodeentityVerifySuccss, {});
                user.saveUserInfo(data);
            }).catch(err => {
                if (err.code === 10009) {
                    this.gotoLoginPage();
                }
            });
            this.$navigateBack();
            if (this.params.from === 'salePwd') {
                this.$navigate('mine/account/SetOrEditPayPwdPage', {
                    userName: this.state.name,
                    cardNum: this.state.idNumber,
                    oldPwd: '',
                    tips: '重新设置新的交易密码',
                    title: '重置交易密码',
                    from: 'edit'
                });
            }
        }).catch(err => {
            this.$loadingDismiss();
            this.$toastShow(err.msg);
            if (err.code === 10009) {
                this.$navigate('login/login/LoginPage');
            }
        });
    };
    agreeAggreement = () => {
        let agreeAggreement = !this.state.agreeAggreement;
        this.setState({ agreeAggreement: agreeAggreement });
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: DesignRule.bgColor
    }, itemTitleView: {
        height: 48,
        backgroundColor: DesignRule.bgColor,
        paddingLeft: 14,
        justifyContent: 'center'
    }, itemTitleText: {
        fontSize: 13,
        color: DesignRule.textColor_instruction
    }, blackText: {
        fontSize: 15,
        color: DesignRule.textColor_mainTitle
    },
    grayText: {
        fontSize: 15,
        color: DesignRule.textColor_instruction
    }, accountStyle: {
        marginLeft: 16, color: DesignRule.textColor_mainTitle, width: 60
    }, inputTextStyle: {
        height: 40, flex: 1, fontSize: 14, textAlign: 'right', marginRight: 15
    }
});


