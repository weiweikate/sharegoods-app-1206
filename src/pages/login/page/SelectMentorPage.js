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
import DesignRule from 'DesignRule';
import MentorItemView from '../components/MentorItemView';
// import { NavigationActions } from 'react-navigation';
import ScreenUtils from '../../../utils/ScreenUtils';
import res from '../res';
import LoginAPI from '../api/LoginApi';
import bridge from '../../../utils/bridge';
import UIText from '../../../components/ui/UIText';
import Styles from '../style/SelectMentorPage.style';
import { homeRegisterFirstManager } from '../../home/model/HomeRegisterFirstManager';
import {MRText as Text} from '../../../components/ui'

const {
    refresh
} = res;

export default class SelectMentorPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            selectIndex: 2,
            mentorData: [],
            isFirstLoad: true
        };
        this.scrView = null;
        this.itemViewArr = [];
        this.itemRefArr = [];
    }

    // 禁用某个页面的手势
    static navigationOptions = {
        gesturesEnabled: false
    };

    $NavBarLeftPressed = () => {
        this.$toastShow('注册成功');
        this.$navigateBackToHome();
    };
    $navigationBarOptions = {
        title: '选择顾问',
        show: true// false则隐藏导航
    };
    /*render右上角*/
    $NavBarRenderRightItem = () => {
        return (
            <Text style={Styles.rightTopTitleStyle} onPress={this.jump}>
                跳过
            </Text>
        );
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
     * 更新坐标
     */
    componentDidUpdate() {
        // this._testScro();
    }

    /**
     * 拉取数据
     */
    loadPageData() {
        this.$loadingShow();
        LoginAPI.queryInviterList({}).then(response => {
            this.$loadingDismiss();
            console.log(response);
            if (response.data.length < 3) {
                this.setState({
                    mentorData: response.data,
                    selectIndex: response.data.length - 1
                }, () => {
                    setTimeout(() => {
                        this.scrView.scrollTo({
                            x: this.state.selectIndex * ScreenUtils.width / 5,
                            y: 0,
                            animated: false
                        });

                    }, 300);
                });
            } else {
                this.setState({
                    mentorData: response.data
                }, () => {
                    setTimeout(() => {
                        this.scrView.scrollTo({
                            x: this.state.selectIndex * ScreenUtils.width / 5,
                            y: 0,
                            animated: false
                        });

                    }, 300);
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
                </View>
                <View
                    style={Styles.bottomViewStyle}
                >
                    <View
                        style={{
                            borderWidth: 1,
                            borderRadius: 10,
                            height: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 100,
                            borderColor: DesignRule.textColor_instruction
                        }}
                    >
                        <Text
                            onPress={
                                () => this.jumpToWriteCodePage()
                            }
                            style={{
                                color: '#979797',
                                fontSize: 13

                            }}
                        >
                            填写授权码
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    _testScro = () => {
        this.scrView.scrollTo({ x: this.state.selectIndex * ScreenUtils.width / 5, y: 0, animated: true });

    };
    _renderMentorListView = () => {
        return (
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center'
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
                        marginTop: 150
                    }}
                >
                    <View
                        style={
                            [{
                                height: 49,
                                width: ScreenUtils.width - 80,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 25
                            },
                                this.state.mentorData && this.state.mentorData.length > 0 ?
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
                        color: DesignRule.textColor_instruction
                    }}
                    value={'暂无顾问请填写授权码或跳过该步骤~'}
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
                    marginTop: 80,
                    width: ScreenUtils.width,
                    height: 140
                }}
                contentContainerStyle={
                    SwichStyles.bgStyle
                }
                contentOffset={{ x: this.state.selectIndex * ScreenUtils.width / 5, y: 0 }}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                    // this.scrView && this.scrView.scrollTo({ x: (index-1) * ScreenUtils.width/5, y: 0, animated: true });
                    if (this.itemRefArr.length > 0 && this.itemRefArr.length > 0) {
                        let offsetX = event.nativeEvent.contentOffset.x;
                        let index = parseInt(offsetX / (ScreenUtils.width / 5));
                        if (offsetX % (ScreenUtils.width / 5) > 0) {
                            index = index + 1;
                        }
                        console.log('索引------' + index);
                        if (index === this.selectIndex) {
                            return;
                        }
                        if (this.itemViewArr.length > 0 && this.itemViewArr.length > index) {
                            this.setState({
                                selectIndex: index
                            });
                        }
                        if (this.itemViewArr.length > 0 && index >= this.itemRefArr.length) {
                            // this.itemRefArr[this.itemRefArr.length - 1]&& this.itemRefArr[this.itemRefArr.length - 1]._startAnimation();
                            // this.itemRefArr[this.selectIndex]._resetAnimation();
                            // this.selectIndex = this.itemRefArr.length - 1;
                            let newSelectIndex = this.itemRefArr.length - 1;
                            this.setState({
                                selectIndex: newSelectIndex
                            });
                        }
                        console.log('state' + this.state.selectIndex);
                    }
                }}
                onScrollEndDrag={(event) => {
                    if (this.itemRefArr.length > 0 && this.itemRefArr.length > 0) {
                        let offsetX = event.nativeEvent.contentOffset.x;
                        let index = parseInt(offsetX / (ScreenUtils.width / 5));
                        if (offsetX % (ScreenUtils.width / 5) > 0) {
                            index = index + 1;
                        }
                        console.log('索引------' + index);
                        if (index === this.selectIndex) {
                            return;
                        }
                        if (this.itemViewArr.length > 0 && this.itemViewArr.length > index) {
                            // this.itemRefArr[this.selectIndex]._resetAnimation();
                            // this.itemRefArr[index]&& this.itemRefArr[index]._startAnimation();
                            // this.selectIndex = index;
                            this.setState({
                                selectIndex: index
                            });
                        }
                        if (this.itemViewArr.length > 0 && index >= this.itemRefArr.length) {
                            // this.itemRefArr[this.itemRefArr.length - 1]&& this.itemRefArr[this.itemRefArr.length - 1]._startAnimation();
                            // this.itemRefArr[this.selectIndex]._resetAnimation();
                            // this.selectIndex = this.itemRefArr.length - 1;
                            let newSelectIndex = this.itemRefArr.length - 1;
                            this.setState({
                                selectIndex: newSelectIndex
                            });
                        }
                    }
                }}
            >
                <View
                    style={{
                        width: ScreenUtils.width / 5 * 2
                    }}
                />
                {
                    this._createItemView().map(itemView => {
                        return (itemView);
                    })

                }
                <View
                    style={{
                        width: ScreenUtils.width / 5 * 2
                    }}
                />

            </ScrollView>
        );
    };
    /*
    * 绑定导师
    * */
    _bindMentor = () => {
        if (this.state.selectIndex <= this.state.mentorData.length - 1) {
            let mentorData = this.state.mentorData[this.state.selectIndex];
            LoginAPI.mentorBind({
                code: mentorData.perfectNumberCode
            }).then(res => {
                bridge.$toast('选择成功');
                homeRegisterFirstManager.setShowRegisterModalUrl(res.data.give);
                this.$navigateBackToHome();
            }).catch(error => {
                this.$toastShow(error.msg)
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
                let isTrueSelect = this.state.selectIndex === index ? true : false;
                this.itemViewArr.push(
                    <MentorItemView
                        ref={(eventView) => {
                            this.itemRefArr.push(eventView);
                        }
                        }
                        key={index}
                        clickItemAction={(itemData) => {
                            this._toDetailPage(itemData);
                        }}
                        itemData={item}
                        isSelect={isTrueSelect}
                    />
                );
            }
        );
        return this.itemViewArr;
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
                    justifyContent: 'space-between',
                    marginTop: 40,
                    backgroundColor: DesignRule.textColor_white
                }}
            >
                <Text
                    style={{
                        fontSize: 13,
                        color: DesignRule.textColor_mainTitle,
                        marginLeft: 15
                    }}
                >
                    请选择一个顾问
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
                                color: DesignRule.textColor_secondTitle,
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
    _changeMetorList = () => {
        this.loadPageData();
    };
}

// const Styles = StyleSheet.create(
//     {
//         contentStyle: {
//             flexDirection: 'column',
//             justifyContent: 'space-between',
//             flex: 1,
//             margin: 0,
//             marginTop: -2,
//             backgroundColor: DesignRule.textColor_white
//         },
//         rightTopTitleStyle: {
//             fontSize: 15,
//             color: DesignRule.textColor_secondTitle
//         },
//         topViewStyle: {
//             height: ScreenUtils.px2dp(430)
//             // backgroundColor:ColorUtil.Color_222222
//
//         },
//         bottomViewStyle: {
//             height: 100,
//             justifyContent: 'center',
//             alignItems: 'center'
//         }
//     }
// );
const SwichStyles = StyleSheet.create({
    bgStyle: {
        color: DesignRule.textColor_white,
        // justifyContent:'center'
        alignItems: 'center'
        // paddingLeft:ScreenUtils.width/5 * 2
    }

});
