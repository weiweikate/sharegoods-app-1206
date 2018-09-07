/**
 * Created by xiangchen on 2018/7/10.
 */
import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,

    ScrollView
} from 'react-native';
import BasePage from '../../../../BasePage';
import UIText from '../../../../components/ui/UIText';
import UIImage from '../../../../components/ui/UIImage';
import ScreenUtils from '../../../../utils/ScreenUtils';
import csperson from '../../res/customerservice/kf_03.png';
import backmg from '../../res/customerservice/xwduo.png';
import kf11 from '../../res/customerservice/kf_11.png';
import monenybpg from '../../res/customerservice/kf_20.png';
import qbcIcon from '../../res/customerservice/kf_22.png';
import autobcIon from '../../res/customerservice/kf_24.png';
import phoneIcon from '../../res/customerservice/kf_30.png';
import personIcon from '../../res/customerservice/kf_30-33.png';
// import QYChatUtil from 'QYChatUtil'
export default class MyHelperPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            typeList: []
        };
    }

    // $PageOptions = {
    //     navigationBarOptions: {
    //         title:'帮助与客服',
    //         show:true
    //     },
    //     renderByPageState: true
    // };
    $navigationBarOptions = {
        title: '帮助与客服',
        show: true // false则隐藏导航
    };

    renderHotQuestionList = () => {
        return (
            <View style={{ width: ScreenUtils.width, backgroundColor: 'white' }}>
                {this.state.typeList.map((item, index) => {
                    return (
                        <View key={index} style={styles.hotQuestionStyle}>
                            <TouchableOpacity activeOpacity={0.6} onPress={() => this.orderListq(item.typeid)}
                                              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Image source={kf11} style={{ width: 37, height: 37 }}/>
                                <Text style={{ fontSize: 11, color: '#666666' }}>{item.name}</Text>
                            </TouchableOpacity>
                            <View style={styles.hot2ViewStyle}>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    <UIText onPress={() => this.gotoquestionDetail(item.list[0].id)}
                                            style={{ marginLeft: 10, fontSize: 15, color: '#666666' }}
                                            value={item.list.length > 0 ? item.list[0].title : ''}/>
                                </View>
                                <View style={{ width: '100%', height: 0.5, backgroundColor: '#c9c9c9' }}/>
                                <View style={{ flex: 1, justifyContent: 'center', borderColor: '#c9c9c9' }}>
                                    <UIText onPress={() => this.gotoquestionDetail(item.list[0].id)}
                                            style={{ marginLeft: 10, fontSize: 15, color: '#666666' }}
                                            value={item.list.length > 1 ? item.list[1].title : ''}/>
                                </View>
                            </View>
                        </View>
                    );
                })}

            </View>
        );
    };
    renderBodyView = () => {
        return (
            <View style={{ flex: 1 }}>
                <ScrollView>
                    <View
                        style={{ alignItems: 'center', marginTop: 1, flexDirection: 'row', backgroundColor: 'white' }}>
                        <Image style={{ width: 90, height: 101, flex: 1, marginBottom: 2 }} source={csperson}
                               resizeMode="contain"/>
                        <UIImage source={backmg} style={{ flex: 2, height: 63, width: 232 }}
                                 onPress={() => this.jumpTohelpPage()}/>
                    </View>
                    <View style={{
                        width: ScreenUtils.width,
                        height: 32,
                        justifyContent: 'center',
                        backgroundColor: '#F6F6F6'
                    }}>
                        <Text style={{
                            marginLeft: 16, width: 60, height: 15, fontFamily: 'PingFang-SC-Medium', fontSize: 13,
                            color: '#666666'
                        }}>热门问题</Text>
                    </View>
                    {this.renderHotQuestionList()}
                    <View style={{ height: 1, backgroundColor: '#f6f6f6' }}/>
                    <View style={{
                        alignItems: 'center',
                        height: 87,
                        flexDirection: 'row',
                        marginTop: 10,
                        backgroundColor: 'white'
                    }}>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => console.log('退款进度')}
                                          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={monenybpg} style={{ width: 37, height: 37 }}/>
                            <Text style={styles.textFontstyle}>退款进度</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => this.questionfeedBack()}
                                          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={qbcIcon} style={{ width: 37, height: 37 }}/>
                            <Text style={styles.textFontstyle}>问题反馈</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => console.log('自动退款')}
                                          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={autobcIon} style={{ width: 37, height: 37 }}/>
                            <Text style={styles.textFontstyle}>自动退款</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 177, backgroundColor: '#f6f6f6' }}/>
                </ScrollView>
                <View style={{
                    flexDirection: 'row', backgroundColor: '#fff', width: ScreenUtils.width,
                    height: 80, position: 'absolute', bottom: 0, alignItems: 'center', zIndex: 21
                }}>

                    <View style={{ width: 58, height: 54, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <UIImage source={phoneIcon} style={{ height: 20, width: 24 }}/>
                        <Text style={[styles.textFontstyle, { marginTop: 5 }]}>咨询电话</Text>
                        <Text style={styles.textFontstyle}>8：30-24：00</Text>
                    </View>

                    <View style={{ width: 1, height: '70%', backgroundColor: '#C5c5c5' }}/>

                    <TouchableOpacity
                        style={{ width: 58, height: 54, alignItems: 'center', justifyContent: 'center', flex: 1 }}
                        onPress={() => this.jumpQYIMPage()}>
                        <UIImage source={personIcon} style={{ height: 20, width: 24 }}/>
                        <Text style={[styles.textFontstyle, { marginTop: 5 }]}>在线客服</Text>
                        <Text style={styles.textFontstyle}>8：30-24：00</Text>

                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    jumpQYIMPage = () => {
        // QYChatUtil.qiYUChat()
    };

    jumpTohelpPage() {
        console.log('fankui');
    }

    orderListq(typeid) {
        this.$navigate('mine/helper/HelperQuestionListPage');
        // this.navigate(RouterPaths.HelperQuestionListPage,{typeid:typeid})
    }

    questionfeedBack() {
        this.$navigate('mine/helper/HelperFeedbackPage');
    }

    gotoquestionDetail(id) {
        this.$navigate('mine/helper/HelperQeustionDetail');
        // this.navigate(RouterPaths.HelperQeustionDetail,{id:id})
    }

    loadPageData() {
        // MineApi.queryHelpQuestionList().then(res => {
        //     if(res.ok&&typeof res.data==='object'){
        //         let typeList = res.data.typeList;
        //         let list = res.data.list;
        //         let listArr =[];
        //         for (let i = 0; i < typeList.length;i++){
        //             let arr =[];
        //             for (let j = 0; j < list.length; j++) {
        //                 if (list[j].name == typeList[i].name){
        //                     arr.push(list[j])
        //                 }
        //             }
        //             if(arr.length>=0){
        //                 listArr.push({ name: typeList[i].name, list: arr, typeid: typeList[i].id})
        //             }
        //         }
        //         this.setState({
        //             typeList: listArr
        //         })
        //     }else{
        //        this.$toastShow(res.msg);
        //         this.setState({isEmpty: true})
        //     }
        //     }
        // );
    }

    _render() {
        return (
            <View style={styles.container}>
                {this.renderBodyView()}
            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#F6F6F6'
        // marginTop: ScreenUtils.isIOS ? (ScreenUtils.isIOSX ? 44 : 20) : 0
    },
    hotQuestionStyle: {
        alignItems: 'center',
        flexDirection: 'row',
        width: ScreenUtils.width,
        height: 80,
        borderColor: '#c9c9c9',
        borderWidth: 0.5
    },
    hot2ViewStyle: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        flex: 2,
        borderColor: '#c9c9c9',
        borderWidth: 0.5
    },
    textFontstyle: {
        fontSize: 11,
        color: '#666666'
    }
});
