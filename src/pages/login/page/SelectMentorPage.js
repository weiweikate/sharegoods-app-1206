/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by feng on 2018/11/28.
 *
 */


'use strict';
import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    ScrollView
} from 'react-native';
import BasePage from '../../../BasePage';
import DesignRule from '../../../constants/DesignRule';
import MentorItemView from '../components/MentorItemView';
import ScreenUtils from '../../../utils/ScreenUtils';
import res from '../res';
import LoginAPI from '../api/LoginApi';
import bridge from '../../../utils/bridge';
import UIText from '../../../components/ui/UIText';
import Styles from '../style/SelectMentorPage.style';
import { homeRegisterFirstManager } from '../../home/manager/HomeRegisterFirstManager';
import { MRText as Text } from '../../../components/ui';
import { TrackApi } from '../../../utils/SensorsTrack';

const { px2dp } = ScreenUtils;
const {
    refresh
} = res;

export default class SelectMentorPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            selectIndex: -1,
            mentorData: [],
            isFirstLoad: true
        };
        this.scrView = null;
        this.itemViewArr = [];
        this.itemRefArr = [];
        TrackApi.adviserSelectPage();
    }
    // 禁用某个页面的手势
    static navigationOptions = {
        gesturesEnabled: false
    };
    $navigationBarOptions = {
        title: '',
        show: true// false则隐藏导航
    };
    /**
     * 跳过函数
     */
    jump = () => {
        bridge.$toast('注册成功');
        LoginAPI.givePackage().then(result => {
            homeRegisterFirstManager.setShowRegisterModalUrl(result.data.give);
            this.$navigateBackToHome();
        }).catch(error => {
            this.$navigateBackToHome();
        });
    };

    _bind() {
        this.loadPageData = this.loadPageData.bind(this);
    }

    componentDidMount() {
        this.loadPageData();
    }
    /**
     * 拉取数据
     */
    loadPageData() {
        setTimeout(() => {
            this.$loadingShow();
        });
        LoginAPI.queryInviterList({}).then(response => {
            this.$loadingDismiss();
            console.log(response);
            if (response.data.length < 3) {
                this.setState({
                    mentorData: response.data,
                });
            } else {
                this.setState({
                    mentorData: response.data
                });
            }
        }).catch(error => {
            this.$loadingDismiss();
            bridge.$toast(error.msg);
        });
    }

    _render() {
        return (
            <View style={Styles.contentStyle}>
                <View
                    style={Styles.topViewStyle}
                >
                    {this._renderTopText()}
                    {this._renderMentorListView()}
                    {this._renderBottomBtn()}
                </View>
                <View
                    style={Styles.bottomViewStyle}
                >
                    <View
                        style={{
                            height: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 100,
                            borderColor: DesignRule.textColor_instruction
                        }}
                    >
                        <Text
                            onPress={
                                () => this.jump()
                            }
                            style={{
                                color: '#979797',
                                fontSize: 13

                            }}
                        >
                            跳过
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
    _renderMentorListView = () => {
        return (
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {
                    this.state.mentorData.length > 0
                        ?
                        this._renderListView()
                        :
                        this._renderNoMentorView()
                }
                <TouchableOpacity
                    onPress={
                        () => {
                            this._bindMentor();
                        }
                    }
                    style={{
                        marginTop: 120
                    }}
                >
                    <View
                        style={
                            [{
                                height: 40,
                                width: ScreenUtils.width - 80,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 20
                            },
                                this.state.selectIndex !== -1 ?
                                    {
                                        backgroundColor: DesignRule.mainColor
                                    }
                                    : {
                                        backgroundColor: DesignRule.bgColor_grayHeader
                                    }
                            ]
                        }
                    >
                        <Text
                            style={{
                                color: DesignRule.textColor_white,
                                fontSize: 17
                            }}
                        >
                            确定
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    _renderBottomBtn = () => {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: px2dp(20),
                    alignItems: 'center',
                    width: ScreenUtils.width - px2dp(100),
                    marginLeft: px2dp(50)
                }}
            >
                <Text
                    style={{
                        fontSize: 13,
                        color: DesignRule.textColor_instruction,
                        justifyContent: 'center'
                    }}
                    onPress={() => {
                        this.$navigateBack();
                    }}
                >
                    填写会员号
                </Text>

                <TouchableOpacity>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 15
                        }}
                    >
                        <Image
                            style={{
                                width: 16,
                                height: 16
                            }}
                            source={refresh}
                        />
                        <Text
                            style={{
                                fontSize: 13,
                                color: DesignRule.textColor_instruction,
                                marginLeft: 5
                            }}
                            onPress={
                                () => this._changeMetorList()
                            }
                        >
                            换一批
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    _renderNoMentorView = () => {
        return (
            <View
                style={
                    {
                        marginTop: 80,
                        width: ScreenUtils.width,
                        height: 90,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }
                }
            >
                <UIText
                    style={{
                        fontSize: 13,
                        color: DesignRule.textColor_placeholder
                    }}
                    value={'暂无顾问'}
                />
                <UIText
                    style={{
                        marginTop:3,
                        fontSize: 13,
                        color: DesignRule.textColor_placeholder
                    }}
                    value={'请填写会员号 或 跳过'}
                />
            </View>
        );
    };
    _renderListView = () => {
        return (
            <ScrollView
                ref={
                    (ref) => {
                        this.scrView = ref;
                    }
                }
                style={{
                    marginTop: px2dp(40),
                    width: ScreenUtils.width,
                    height: 140
                }}
                contentContainerStyle={
                    SwichStyles.bgStyle
                }
                scrollEnabled={false}
                // contentOffset={{ x: this.state.selectIndex * ScreenUtils.width / 5, y: 0 }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                // onMomentumScrollEnd={(event) => {
                //     // this.scrView && this.scrView.scrollTo({ x: (index-1) * ScreenUtils.width/5, y: 0, animated: true });
                //     if (this.itemRefArr.length > 0 && this.itemRefArr.length > 0) {
                //         let offsetX = event.nativeEvent.contentOffset.x;
                //         let index = parseInt(offsetX / (ScreenUtils.width / 5));
                //         if (offsetX % (ScreenUtils.width / 5) > 0) {
                //             index = index + 1;
                //         }
                //         console.log('索引------' + index);
                //         if (index === this.selectIndex) {
                //             return;
                //         }
                //         if (this.itemViewArr.length > 0 && this.itemViewArr.length > index) {
                //             this.setState({
                //                 selectIndex: index
                //             });
                //         }
                //         if (this.itemViewArr.length > 0 && index >= this.itemRefArr.length) {
                //             // this.itemRefArr[this.itemRefArr.length - 1]&& this.itemRefArr[this.itemRefArr.length - 1]._startAnimation();
                //             // this.itemRefArr[this.selectIndex]._resetAnimation();
                //             // this.selectIndex = this.itemRefArr.length - 1;
                //             let newSelectIndex = this.itemRefArr.length - 1;
                //             this.setState({
                //                 selectIndex: newSelectIndex
                //             });
                //         }
                //         console.log('state' + this.state.selectIndex);
                //     }
                // }}
                // onScrollEndDrag={(event) => {
                //     if (this.itemRefArr.length > 0 && this.itemRefArr.length > 0) {
                //         let offsetX = event.nativeEvent.contentOffset.x;
                //         let index = parseInt(offsetX / (ScreenUtils.width / 5));
                //         if (offsetX % (ScreenUtils.width / 5) > 0) {
                //             index = index + 1;
                //         }
                //         console.log('索引------' + index);
                //         if (index === this.selectIndex) {
                //             return;
                //         }
                //         if (this.itemViewArr.length > 0 && this.itemViewArr.length > index) {
                //             // this.itemRefArr[this.selectIndex]._resetAnimation();
                //             // this.itemRefArr[index]&& this.itemRefArr[index]._startAnimation();
                //             // this.selectIndex = index;
                //             this.setState({
                //                 selectIndex: index
                //             });
                //         }
                //         if (this.itemViewArr.length > 0 && index >= this.itemRefArr.length) {
                //             // this.itemRefArr[this.itemRefArr.length - 1]&& this.itemRefArr[this.itemRefArr.length - 1]._startAnimation();
                //             // this.itemRefArr[this.selectIndex]._resetAnimation();
                //             // this.selectIndex = this.itemRefArr.length - 1;
                //             let newSelectIndex = this.itemRefArr.length - 1;
                //             this.setState({
                //                 selectIndex: newSelectIndex
                //             });
                //         }
                //     }
                // }}
            >
                {/*<View*/}
                {/*style={{*/}
                {/*width: ScreenUtils.width / 5 * 2*/}
                {/*}}*/}
                {/*/>*/}
                {
                    this._createItemView().map(itemView => {
                        return (itemView);
                    })
                }
                {/*<View*/}
                {/*style={{*/}
                {/*width: ScreenUtils.width / 5 * 2*/}
                {/*}}*/}
                {/*/>*/}
            </ScrollView>
        );
    };
    /*
    * 绑定导师
    * */
    _bindMentor = () => {
        if (this.state.selectIndex === -1){
            return ;
        }
        if (this.state.selectIndex <= this.state.mentorData.length - 1) {
            let mentorData = this.state.mentorData[this.state.selectIndex];
            LoginAPI.mentorBind({
                code: mentorData.perfectNumberCode
            }).then(res => {
                bridge.$toast('选择成功');
                homeRegisterFirstManager.setShowRegisterModalUrl(res.data.give);
                this.$navigateBackToHome();
            }).catch(error => {
                this.$toastShow(error.msg);
                // homeRegisterFirstManager.setShowRegisterModalUrl(res.data.give);
            });
        }

    };
    jumpToWriteCodePage = () => {
        this.$navigate('login/login/InviteCodePage');
    };
    _createItemView = () => {
        console.log('选中索引' + this.state.selectIndex);
        this.itemViewArr = [];
        this.itemRefArr = [];
        this.state.mentorData.map((item, index) => {
                // let isTrueSelect = this.state.selectIndex === index ? true : false;
                this.itemViewArr.push(
                    <MentorItemView
                        ref={(eventView) => {
                            this.itemRefArr.push(eventView);
                        }
                        }
                        key={index}
                        clickItemAction={(itemData) => {
                            // this._toDetailPage(itemData);
                            // this.setState(
                            //     selectIndex:index
                            // );
                            this.changeSelectIndex(index);
                        }}
                        itemData={item}
                        isSelect={this.state.selectIndex === -1 ? true : (this.state.selectIndex === index)}
                    />
                );
            }
        );
        return this.itemViewArr;
    };
    changeSelectIndex = (index) => {
        this.setState({
            selectIndex: index
        });
    };
    _toDetailPage = (itemData) => {
        this.$navigate('login/login/MentorDetailPage', {
            itemData: itemData,
            give: this.params.give
        });
    };
    _renderTopText = () => {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: px2dp(80),
                    alignItems: 'center'
                }}
            >
                <Text
                    style={{
                        fontSize: 23,
                        color: DesignRule.textColor_mainTitle,
                        marginLeft: 15,
                        justifyContent: 'center'
                    }}
                >
                    请选择一个服务顾问
                </Text>

                {/*<TouchableOpacity>*/}
                {/*<View*/}
                {/*style={{*/}
                {/*flexDirection: 'row',*/}
                {/*justifyContent: 'center',*/}
                {/*alignItems: 'center',*/}
                {/*marginRight: 15*/}
                {/*}}*/}
                {/*>*/}
                {/*<Image*/}
                {/*style={{*/}
                {/*width: 16,*/}
                {/*height: 16*/}
                {/*}}*/}
                {/*source={refresh}*/}
                {/*/>*/}
                {/*<Text*/}
                {/*style={{*/}
                {/*fontSize: 13,*/}
                {/*color: DesignRule.textColor_secondTitle,*/}
                {/*marginLeft: 5*/}
                {/*}}*/}
                {/*onPress={*/}
                {/*() => this._changeMetorList()*/}
                {/*}*/}
                {/*>*/}
                {/*换一批*/}
                {/*</Text>*/}
                {/*</View>*/}
                {/*</TouchableOpacity>*/}
            </View>
        );
    };
    _changeMetorList = () => {
        this.state.selectIndex = -1;

        this.loadPageData();
    };
}
const SwichStyles = StyleSheet.create({
    bgStyle: {
        color: DesignRule.textColor_white,
        // justifyContent:'center'
        alignItems: 'center'
        // paddingLeft:ScreenUtils.width/5 * 2
    }

});
