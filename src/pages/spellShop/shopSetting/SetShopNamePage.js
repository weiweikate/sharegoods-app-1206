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
            this.$navigateReset();
        }
    };

    $NavBarRightPressed = () => {
        this._complete();
    };

    constructor(props) {
        super(props);
        if (this.params.storeData) {//修改
            this.state = {
                text: this.params.storeData.storeName,
                storeHeadUrl: this.params.storeData.storeHeadUrl,
                storeHeadUrlOrigin: this.params.storeData.storeHeadUrl
            };
        } else {
            this.state = {
                text: null,
                storeHeadUrl: null,
                storeHeadUrlOrigin: null
            };
        }
    }

    _complete = () => {
        if (StringUtils.isEmpty(this.state.storeHeadUrlOrigin)) {
            this.$toastShow('店铺头像不能为空');
            return;
        }
        if (StringUtils.isEmpty(this.state.text)) {
            this.$toastShow('店铺名称不能为空');
            return;
        }
        if (this.state.text.length < 2 || this.state.text.length > 16) {
            this.$toastShow('店铺名称仅限2~16位字符');
            return;
        }
        if (this.params.storeData) {
            SpellShopApi.updateStoreInfo({
                name: this.state.text,
                headUrl: this.state.storeHeadUrlOrigin
            }).then(() => {
                this.$toastShow('修改成功');
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
                                   style={[styles.textInput, { color: this.state.text ? '#333' : '#c8c8c8' }]}/>
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
        color: '#e60012'
    },
    headerImg: {
        width: 90,
        height: 90,
        borderRadius: 5,
        backgroundColor: '#dddddd'
    },
    whitePanel: {
        marginTop: 10,
        height: 170,
        marginHorizontal: 15,
        borderRadius: 5,
        backgroundColor: '#ffffff',
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
        backgroundColor: '#e60012',
        justifyContent: 'center',
        alignItems: 'center'
    },
    uploadTitle: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        color: '#f7f7f7'
    },
    textInputContainer: {
        marginTop: 10,
        marginHorizontal: 15,
        height: 44,
        borderRadius: 5,
        backgroundColor: '#ffffff',
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
        color: '#222222',
        marginLeft: 11
    },
    textInput: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        marginLeft: 9,
        marginRight: 11,
        flex: 1
    },
    btnRow: {
        height: 48,
        borderRadius: 5,
        backgroundColor: '#D51243',
        marginHorizontal: 43,
        marginTop: ScreenUtils.autoSizeHeight(123),
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnTitle: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        color: '#ffffff'
    }
});
