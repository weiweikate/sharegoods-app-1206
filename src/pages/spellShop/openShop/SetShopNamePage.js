//设置我的店铺基础信息 或者 修改店铺信息
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
import StringUtils from '../../../utils/StringUtils';
import BasePage from '../../../BasePage';
import ScreenUtils from '../../../utils/ScreenUtils';
import NavigatorBar from '../../../components/pageDecorator/NavigatorBar';


export default class SetShopNamePage extends BasePage {

    $navigationBarOptions = {
        show: false
    };

    constructor(props) {
        super(props);
        let params = this.props.navigation.state.params || {};
        if (params.isChangeStoreInfo) {//修改
            this.state = {
                text: '测试名称',
                storeHeadUrl: null,
                storeHeadUrlOrigin: null
            };
        } else {
            this.state = {
                text: '',
                storeHeadUrl: null,
                storeHeadUrlOrigin: null
            };
        }
    }

    _onChangeText = (text) => {
        this.setState({ text });
    };

    //点击头像
    _clickHeader = () => {

    };

    // 点击
    _complete = () => {
        // if (!this.state.storeHeadUrlOrigin) {
        //     this.$loadingShow('店铺头像不能为空');
        //     return;
        // }
        if (!StringUtils.isEmpty(this.state.text)) {
            this.$toastShow('店铺名称不能为空');
            return;
        }
        // if (this.state.text.length < 4 || this.state.text.length > 16) {
        //     this.$loadingShow('店铺名称仅限4~16位字符');
        //     return;
        // }

        this.$navigate('spellShop/openShop/OpenShopSuccessPage');
    };

    _render() {


        const { isChangeStoreInfo } = this.params || {};//是否是修改信息

        const uri = this.state.storeHeadUrl;

        return (
            <View style={styles.container}>
                {
                    isChangeStoreInfo ? <NavigatorBar navigation={this.props.navigation}
                                                      title={'我的店铺'}
                                                      rightNavTitle={'完成'}
                                                      rightTitleStyle={styles.rightItem}
                                                      rightPressed={this._complete}/> :
                        <NavigatorBar navigation={this.props.navigation}
                                      leftPressed={this._leftPressed}
                                      title={'开店基础信息'}/>
                }
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
                        isChangeStoreInfo ? null : <TouchableWithoutFeedback onPress={this._complete}>
                            <View style={styles.btnRow}>
                                <Text style={styles.btnTitle}>
                                    确定
                                </Text>
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
        backgroundColor: '#e60012',
        marginHorizontal: 43,
        marginTop: ScreenUtils.height - 450,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnTitle: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 13,
        color: '#ffffff'
    }
});
