//设置我的店铺基础信息 或者 修改店铺信息
//gesturesEnabled 手势由外部控制
//navigation 会传递一个isChangeStoreInfo bool true表示为修改店铺信息
//isChangeStoreInfo true表示修改信息  false表示第一个创建

import React from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
import BasePage from '../../../BasePage';
import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import BusinessUtils from '../../mine/components/BusinessUtils';
import SpellShopApi from '../api/SpellShopApi';
import spellStatusModel from '../model/SpellStatusModel';
import DesignRule from 'DesignRule';

export default class SetShopNamePage extends BasePage {

    $navigationBarOptions = {
        title: this.params.storeData ? '我的店铺' : '开店基础信息',
        rightNavTitle: '完成',
        rightTitleStyle: styles.rightItem,
        rightNavItemHidden: !this.params.storeData
    };

    $NavBarLeftPressed = () => {
        if (this.params.storeData) {
            this.$navigateBack();
        } else {
            this.props.navigation.popToTop();
        }
    };

    $NavBarRightPressed = () => {
        this._complete();
    };

    constructor(props) {
        super(props);
        this.state = {
            text: null,
            storeHeadUrl: null,
            storeHeadUrlOrigin: null
        };
    }

    componentDidMount() {
        if (this.params.storeData) {
            this.$loadingShow();
            SpellShopApi.getById({ id: this.params.storeData.storeId }).then((data) => {
                let dataTemp = data.data || {};
                this.setState({
                    text: dataTemp.name,
                    storeHeadUrl: dataTemp.headUrl,
                    storeHeadUrlOrigin: dataTemp.headUrl
                });
                this.$loadingDismiss();
            }).catch((error) => {
                this.$toastShow(error.msg);
                this.$loadingDismiss();
            });
        }
    }

    _checkIsHasSpecialStr(str) {
        let myReg = /^[a-zA-Z0-9_\u4e00-\u9fa5]{1,}$/;
        if (!myReg.test(str)) {
            return true;
        }
        return false;
    }

    _complete = () => {
        if (StringUtils.isEmpty(this.state.text)) {
            this.$toastShow('请输入店铺名称');
            return;
        }
        if (this._checkIsHasSpecialStr(this.state.text)) {
            this.$toastShow('此名称带有特殊字符，请重新输入');
            return;
        }
        if (this.state.text.length < 2 || this.state.text.length > 16) {
            this.$toastShow('店铺名称仅限2~16位字符');
            return;
        }
        if (StringUtils.isEmpty(this.state.storeHeadUrlOrigin)) {
            this.$toastShow('店铺头像不能为空');
            return;
        }
        if (this.params.storeData) {
            SpellShopApi.updateStoreInfo({
                name: this.state.text,
                headUrl: this.state.storeHeadUrlOrigin
            }).then(() => {
                this.$toastShow('修改成功');
                this.params.myShopCallBack && this.params.myShopCallBack();
                this.$navigateBack();
            }).catch((error) => {
                this.$toastShow(error.msg);
            });
        } else {
            // 创建店铺，并设置店铺基础信息
            SpellShopApi.initStore({
                name: this.state.text,
                headUrl: this.state.storeHeadUrlOrigin,
                status: 3
            }).then(() => {
                spellStatusModel.getUser(2);
                this.$navigate('spellShop/openShop/OpenShopSuccessPage');
            }).catch((error) => {
                this.$toastShow(error.msg);
            });
        }
    };

    _onChangeText = (text) => {
        this.setState({ text });
    };

    //点击头像
    _clickHeader = () => {
        BusinessUtils.getImagePicker((response) => {
            if (response && typeof response === 'object' && response.ok) {
                const { imageUrl, imageThumbUrl } = response;
                if (imageUrl && imageThumbUrl) {
                    this.setState({
                        storeHeadUrl: imageThumbUrl,
                        storeHeadUrlOrigin: imageUrl
                    });
                }
            } else {
                this.$toastShow(response.msg);
            }
        });
    };

    _render() {
        const uri = this.state.storeHeadUrl;
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.whitePanel}>

                        <TouchableOpacity onPress={this._clickHeader}>
                            {
                                uri ? <Image source={{ uri }} style={styles.headerImg}/> :
                                    <View style={styles.headerImg}/>
                            }
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.uploadContainer} onPress={this._clickHeader}>
                            <Text style={styles.uploadTitle}>{uri ? '重新上传' : '点击上传'}</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={styles.textInputContainer}>
                        <Text style={styles.title}>请设置店铺名称:</Text>
                        <TextInput value={this.state.text}
                                   onChangeText={this._onChangeText}
                                   underlineColorAndroid={'transparent'}
                                   placeholder={'请输入店铺名称'}
                                   blurOnSubmit={false}
                                   style={[styles.textInput, { color: DesignRule.textColor_mainTitle }]}/>
                    </View>

                    {
                        this.params.storeData ? null : <TouchableWithoutFeedback onPress={this._complete}>
                            <View style={styles.btnRow}>
                                <Text style={styles.btnTitle}>开店</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    }

                </ScrollView>
            </View>
        );

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    rightItem: {
        fontSize: 15,
        color: DesignRule.mainColor
    },
    headerImg: {
        width: 90,
        height: 90,
        borderRadius: 5,
        backgroundColor: DesignRule.lineColor_inGrayBg
    },
    whitePanel: {
        marginTop: 10,
        height: 170,
        marginHorizontal: 15,
        borderRadius: 5,
        backgroundColor: 'white',
        shadowColor: 'rgba(102, 102, 102, 0.1)',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 10,
        shadowOpacity: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    uploadContainer: {
        marginTop: 15,
        width: 90,
        height: 25,
        borderRadius: 13,
        backgroundColor: DesignRule.mainColor,
        justifyContent: 'center',
        alignItems: 'center'
    },
    uploadTitle: {
        fontSize: 13,
        color: DesignRule.bgColor
    },
    textInputContainer: {
        marginTop: 10,
        marginHorizontal: 15,
        height: 44,
        borderRadius: 5,
        backgroundColor: 'white',
        shadowColor: 'rgba(102, 102, 102, 0.1)',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 10,
        shadowOpacity: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        fontSize: 13,
        color: DesignRule.textColor_mainTitle,
        marginLeft: 11
    },
    textInput: {
        fontSize: 13,
        marginLeft: 9,
        marginRight: 11,
        flex: 1
    },
    btnRow: {
        height: 50,
        borderRadius: 25,
        backgroundColor: DesignRule.mainColor,
        marginHorizontal: 43,
        marginTop: ScreenUtils.autoSizeHeight(123),
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnTitle: {
        fontSize: 17,
        color: 'white'
    }
});
