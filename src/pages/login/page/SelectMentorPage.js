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
    Text,
    TouchableOpacity,
    Image,
    ScrollView
} from 'react-native';
import BasePage from '../../../BasePage';
import DesignRule from 'DesignRule';
import MentorItemView from '../components/MentorItemView';
import { NavigationActions } from 'react-navigation';
import ScreenUtils from '../../../utils/ScreenUtils';
import res from '../res';

const {
    refresh
} = res;

export default class SelectMentorPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            selectIndex : 0
        };
        this.scrView = null;
        this.itemViewArr = [];
        this.itemRefArr = [];

    }

    $navigationBarOptions = {
        title: '选择导师',
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
        let resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'Tab' })//要跳转到的页面名字
            ]
        });
        this.props.navigation.dispatch(resetAction);
    };

    _bind() {
        this.loadPageData = this.loadPageData.bind(this);
    }

    componentDidMount() {
        this.loadPageData();
    }

    loadPageData() {

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
                    <Text
                        onPress={
                            () => this.jumpToWriteCodePage()
                        }
                        style={{
                            color: '#979797',
                            height: 20,
                            width: 100,
                            fontSize: 13,
                            borderWidth: 1,
                            borderRadius: 10,
                            textAlign: 'center',
                            borderColor: '#979797',
                            paddingTop: 2
                        }}

                    >
                        填写授权码
                    </Text>
                </View>
                {/*{this._renderCouponModal()}*/}
            </View>
        );
    }

    _renderMentorListView = () => {

        let arrList = [
            {
                image: '',
                name: '',
                isSelected: false
            },
            {
                image: '',
                name: '',
                isSelected: false
            },
            {
                image: '',
                name: '',
                isSelected: false
            },
            {
                image: '',
                name: '',
                isSelected: false
            },
            {
                image: '',
                name: '',
                isSelected: false
            },
            {
                image: '',
                name: '',
                isSelected: false
            },
            {
                image: '',
                name: '',
                isSelected: false
            },
            {
                image: '',
                name: '',
                isSelected: false
            }
        ];
        return (
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <ScrollView
                    ref={
                        (ref) => {
                            this.scrView = ref;
                        }
                    }
                    style={{
                        marginTop: 80,
                        width: ScreenUtils.width,
                        backgroundColor: 'gray',
                        height: 140
                    }}
                    contentContainerStyle={
                        SwichStyles.bgStyle
                    }
                    contentOffset= {{x: this.state.selectIndex * ScreenUtils.width/5, y: 0}}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    // onMomentumScrollEnd={(event)=>{
                    //     // this.scrView && this.scrView.scrollTo({ x: (index-1) * ScreenUtils.width/5, y: 0, animated: true });
                    //     // if (this.itemRefArr.length > 0 && this.itemRefArr.length > 0) {
                    //     //     let offsetX = event.nativeEvent.contentOffset.x;
                    //     //     let index = parseInt(offsetX / (ScreenUtils.width / 5));
                    //     //     if (offsetX / (ScreenUtils.width / 5) > 0) {
                    //     //         index = index + 1;
                    //     //     }
                    //     //     console.log('索引------' + index);
                    //     //     // this._resetSizeItemView();
                    //     //     console.log(this.itemRefArr);
                    //     //     if (index === this.selectIndex){
                    //     //         return;
                    //     //     }
                    //     //     this.setState({
                    //     //         selectIndex:index
                    //     //     })
                    //         // if (this.itemViewArr.length > 0 && this.itemViewArr.length > index) {
                    //         //     this.itemRefArr[this.selectIndex]._resetAnimation();
                    //         //     this.itemRefArr[index]&& this.itemRefArr[index]._startAnimation();
                    //         //     this.selectIndex = index;
                    //         // }
                    //         // if (this.itemViewArr.length > 0 && index > this.itemRefArr.length -1){
                    //         //     this.itemRefArr[this.itemRefArr.length - 1]&& this.itemRefArr[this.itemRefArr.length - 1]._startAnimation();
                    //         //     this.itemRefArr[this.selectIndex]._resetAnimation();
                    //         //     this.selectIndex = this.itemRefArr.length - 1;
                    //         // }
                    //         // this.scrView && this.scrView.scrollTo({ x: (index) * ScreenUtils.width/5, y: 0, animated: true });
                    //     // }
                    //
                    //
                    // }}
                    // onScrollEndDrag={(event)=>{
                    // }}
                    // onScroll={(event) => {
                    //
                    // }}
                >
                    <View
                        style={{
                            width: ScreenUtils.width / 5 * 2
                        }}
                    />
                    {
                        this._createItemView(arrList).map(itemView => {
                            return (itemView);
                        })

                    }
                    <View
                        style={{
                            width: ScreenUtils.width / 5 * 2
                        }}
                    />
                </ScrollView>
                <TouchableOpacity
                    style={{
                        marginTop: 170
                    }}
                >
                    <View
                        style={{
                            height: 49,
                            width: 290,
                            backgroundColor: DesignRule.mainColor,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 25
                        }}
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
    _resetSizeItemView = () => {
        this.itemRefArr.map(obj => {
            obj._resetAnimation();
        });
    };
    _createItemView = (arrList) => {
        this.itemViewArr = [];
        this.itemRefArr = [];
        arrList.map((item, index) => {
            // let isTrueSelect = this.state.isSelect === index?true:false
                this.itemViewArr.push(
                    <MentorItemView
                        ref={(eventView) => {
                            this.itemRefArr.push(eventView);
                        }
                        }
                        key={index}
                        clickItemAction={this._toDetailPage}
                        itemData={item}
                        // isSelect={isTrueSelect}
                    />
                );
            }
        );
        return this.itemViewArr;
    };
    _toDetailPage = () => {
        this.$navigate('login/login/MentorDetailPage');
    };
    _renderTopText = () => {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 40,
                    backgroundColor: DesignRule.bgColor
                }}
            >
                <Text
                    style={{
                        fontSize: 13,
                        color: DesignRule.textColor_mainTitle,
                        marginLeft: 15
                    }}
                >
                    请选择一个导师
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
                                () => this._changeRedpacket()
                            }
                        >
                            换一批
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };
}

const Styles = StyleSheet.create(
    {
        contentStyle: {
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            margin: 0,
            marginTop: -2,
            backgroundColor: DesignRule.bgColor
        },
        rightTopTitleStyle: {
            fontSize: 15,
            color: DesignRule.textColor_secondTitle
        },
        topViewStyle: {
            height: ScreenUtils.px2dp(430)
            // backgroundColor:ColorUtil.Color_222222

        },
        bottomViewStyle: {
            height: 100,
            justifyContent: 'center',
            alignItems: 'center'
        }
    }
);
const SwichStyles = StyleSheet.create({
    bgStyle: {
        color: DesignRule.bgColor,
        // justifyContent:'center'
        alignItems: 'center'
        // paddingLeft:ScreenUtils.width/5 * 2
    }

});
