//设置我的店铺基础信息 或者 修改店铺信息
//gesturesEnabled 手势由外部控制
//navigation 会传递一个isChangeStoreInfo bool true表示为修改店铺信息
//isChangeStoreInfo true表示修改信息  false表示第一个创建

import React,{Component} from 'react';
import {
    View,
    Text,
    Image,
    Platform,
    TextInput,
    Dimensions,
    StyleSheet,
    ScrollView,
    BackHandler,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import storeModel from '../model/storeModel';
import BusinessUtils from '../../../utils/BusinessUtils';
import ActionSheetView from '../components/ActionSheetView';
import BasePage from '../../../BasePage';
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class SetShopNamePage extends BasePage {

    static navigationOptions = (({navigation})=>{
        const {gesturesEnabled} = navigation.state.params || {};
        return {gesturesEnabled: gesturesEnabled !== false};
    });

    constructor(props){
        super(props);
        if(this.params.isChangeStoreInfo){//修改
            this.state = {
                text: storeModel.storeName,
                switchValue: true,
                storeHeadUrl: storeModel.storeHeadUrl,
                storeHeadUrlOrigin: storeModel.storeHeadUrl
            };
        } else {
            this.state = {
                text: null,
                switchValue: true,
                storeHeadUrl: null,
                storeHeadUrlOrigin: null
            };
        }
    }

    _componentWillMount(){
        if(this.params.isChangeStoreInfo)return;
        if(Platform.OS === 'android'){
            this.backListener = BackHandler.addEventListener('hardwareBackPress', () => {
                if(this.params.gesturesEnabled === false){
                    this._leftPressed();
                    return true;
                } else {
                    return false;
                }
            });
        }
    }

    _componentWillUnmount(){
        if(Platform.OS === 'android'){
            this.backListener && this.backListener.remove();
        }
    }

    _onChangeText = (text)=>{
        this.setState({text});
    };

    //点击头像
    _clickHeader = ()=>{

        BusinessUtils.getImagePicker((response)=>{
           // console.warn(JSON.stringify(response,null,4));
            if(response && typeof response === 'object' && response.ok){
                const {imageUrl,imageThumbUrl} = response;
                if(imageUrl && imageThumbUrl){
                    this.setState({
                        storeHeadUrl: imageThumbUrl,
                        storeHeadUrlOrigin: imageUrl,
                    })
                }
            } else {
                Toast.toast(response.msg);
            }
        });
    };

    // 点击
    _complete = ()=>{
        if(!RegexUtil.trimHeadAndTailStringBlank(this.state.storeHeadUrlOrigin)){
            Toast.toast('店铺头像不能为空');
            return;
        }
        if(!RegexUtil.trimHeadAndTailStringBlank(this.state.text)){
            Toast.toast('店铺名称不能为空');
            return;
        }
        if(this.state.text.length < 4 || this.state.text.length > 16){
            Toast.toast('店铺名称仅限4~16位字符');
            return;
        }
        const {isChangeStoreInfo} = this.params || {};//是否是修改信息
        if(isChangeStoreInfo){
            SpellShopApi.updateStoreBaseInfo({name: this.state.text,headUrl: this.state.storeHeadUrlOrigin}).then((response)=>{
                if(response.ok){
                    storeModel.setStoreImgAndName(this.state.text,this.state.storeHeadUrlOrigin);
                    Toast.toast('修改成功');
                    this.props.navigation.goBack();
                } else {
                    Toast.toast(response.msg);
                }
            });
        } else {
            // 创建店铺，并设置店铺基础信息
            SpellShopApi.createStore({name: this.state.text,headUrl: this.state.storeHeadUrlOrigin}).then(response =>{
                if(response.ok){
                    this.props.navigation.navigate('spellShop/openShop/OpenShopSuccessPage');
                } else {
                    Toast.toast(response.msg);
                }
            });
        }
    };


    _onValueChange = (value)=>{
        this.setState({switchValue: value});
    };

    _leftPressed = ()=>{
        this.props.navigation.popToTop();
    };

    renderContainer() {


        const {isChangeStoreInfo} = this.params || {};//是否是修改信息

        const uri = this.state.storeHeadUrl;

        return (
            <View style={styles.container}>
                {
                    isChangeStoreInfo ? <NavigatorBar navigation={this.props.navigation}
                                      title={'我的店铺'}
                                      rightNavTitle={'完成'}
                                      rightTitleStyle={styles.rightItem}
                                      rightPressed={this._complete}/> : <NavigatorBar navigation={this.props.navigation}
                                                                                      leftPressed={this._leftPressed}
                                                                                       title={'开店基础信息'}/>
                }
                <ScrollView>

                    <View style={styles.whitePanel}>

                        <TouchableOpacity onPress={this._clickHeader}>
                            {
                                uri ? <Image source={{uri}} style={styles.headerImg}/> : <View style={styles.headerImg}/>
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
                                   style={[styles.textInput,{color: this.state.text ? '#333' : "#c8c8c8"}]}/>
                    </View>

                    {
                        // 暂不使用。产品要求隐藏
                        // isChangeStoreInfo ? null : <View style={[styles.textInputContainer,{justifyContent: 'space-between',}]}>
                        //     <Text style={styles.title}>申请到拼店首页进行推荐</Text>
                        //     {
                        //         Platform.OS === 'android' ? <Switch onTintColor={'#00ce5c'}
                        //                                             thumbTintColor={'white'}
                        //                                             style={{marginRight: 15}}
                        //                                             value={this.state.switchValue}
                        //                                             onValueChange={this._onValueChange}/> : <Switch style={{marginRight: 15}}
                        //                                                                                             value={this.state.switchValue}
                        //                                                                                             onValueChange={this._onValueChange}/>
                        //     }
                        // </View>
                    }

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
                <ActionSheetView ref={ref=> {this.actionSheetRef = ref;}}/>
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
        color: "#e60012"
    },
    headerImg: {
        width: 90,
        height: 90,
        borderRadius: 5,
        backgroundColor: "#dddddd",
    },
    whitePanel: {
        marginTop: 10,
        height: 170,
        marginHorizontal: 15,
        borderRadius: 5,
        backgroundColor: "#ffffff",
        shadowColor: "rgba(102, 102, 102, 0.1)",
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
        backgroundColor: "#e60012",
        justifyContent: 'center',
        alignItems: 'center'
    },
    uploadTitle: {
        fontFamily: "PingFang-SC-Medium",
        fontSize: 13,
        color: "#f7f7f7"
    },
    textInputContainer: {
        marginTop: 10,
        marginHorizontal: 15,
        height: 44,
        borderRadius: 5,
        backgroundColor: "#ffffff",
        shadowColor: "rgba(102, 102, 102, 0.1)",
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
        color: "#222222",
        marginLeft: 11,
    },
    textInput: {
        fontFamily: "PingFang-SC-Medium",
        fontSize: 13,
        marginLeft: 9,
        marginRight: 11,
        flex: 1
    },
    btnRow: {
        height: 48,
        borderRadius: 5,
        backgroundColor: "#e60012",
        marginHorizontal: 43,
        marginTop: SCREEN_HEIGHT - 450,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnTitle: {
        fontFamily: "PingFang-SC-Medium",
        fontSize: 13,
        color: "#ffffff"
    }
});
