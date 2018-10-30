import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ImageBackground
} from 'react-native';
import ColorUtil from '../../../utils/ColorUtil';
import BasePage from '../../../BasePage';
import ScreenUtils from '../../../utils/ScreenUtils';
import LoginAndRegistRes from '../res/LoginAndRegistRes';
import bridge from '../../../utils/bridge';

export default class GetRedpacketPage extends BasePage {
    constructor(props) {
        super(props);
    }

    // 导航配置
    $navigationBarOptions = {
        title: '领取红包',
        gesturesEnabled: false
    };
    /*render右上角*/
    $NavBarRenderRightItem = () => {
        return (
            <Text style={Styles.rightTopTitleStyle} onPress={this.jump}>
                跳过
            </Text>
        );
    };


    _render() {
        return (
            <View style={Styles.contentStyle}>
                <View
                    style={Styles.topViewStyle}
                >
                    {this._renderTopText()}
                    {this._renderRedPacketList()}
                </View>
                <View
                    style={Styles.bottomViewStyle}
                >
                    <Text
                        onPress={
                            ()=>this.jumpToWriteCodePage()
                        }
                        style={{
                            color:'#979797',
                            height:20,
                            width:100,
                            fontSize:13,
                            borderWidth:1,
                            borderRadius:10,
                            textAlign:'center',
                            borderColor:'#979797',
                            paddingTop:2,
                        }}

                    >
                        填写授权码
                    </Text>
                </View>
            </View>
        );
    }

    _renderTopText = () => {
        return (
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 40,
                    backgroundColor: ColorUtil.Color_f7f7f7
                }}
            >
                <Text
                    style={{
                        fontSize: 13,
                        color: '#333',
                        marginLeft: 15
                    }}
                >
                    请选择一个红包
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
                            source={LoginAndRegistRes.reg_Refresh}
                        />
                        <Text
                            style={{
                                fontSize: 13,
                                color: '#666',
                                marginLeft: 5
                            }}
                            onPress={
                                ()=>this._changeRedpacket()
                            }
                        >
                            换一批
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };
    /**
     *
     */
    _changeRedpacket=()=>{
        bridge.$toast('换一批');
    }
    /**
     * 渲染红包列表
     * @return {*}
     * @private
     */
    _renderRedPacketList = () => {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'

                }}
            >
                <View
                    style={{
                        // flex:1,
                        width: 240,
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        flexWrap: 'wrap'  //设置换行显示
                    }}
                >
                    {
                        this._getredPackageListItem().map((redItemView, index) => {
                                return redItemView;
                            }
                        )
                    }

                </View>
            </View>
        );
    };
    /**
     * 渲染红包item
     * @return {Array}
     * @private
     */
    _getredPackageListItem = () => {
        let tempArr = [];
        for (let index = 0; index < 4; index++) {
            tempArr.push(
                <TouchableOpacity
                    key={index}
                    onPress={
                        ()=>{
                          this.redPacketClick(index)
                        }
                    }
                >
                    <View
                        style={{
                            width: 100,
                            height: 142,
                            marginTop: 30
                        }}
                    >
                        <ImageBackground
                            style={
                                {
                                    flex: 1,
                                    // justifyContent:'center',

                                    alignItems: 'center'
                                }
                            }
                            source={LoginAndRegistRes.reg_norRedPacketBg}
                        >
                            <Text
                                style={{
                                    marginTop: 20,
                                    height: 30,
                                    color: ColorUtil.Color_ffffff,
                                    textAlign:'center'
                                }}
                            >
                                赠送红包
                            </Text>
                            <Text
                                style={{
                                    width: 30,
                                    height: 30,
                                    marginTop: 35,
                                    color: '#80522A',
                                    fontSize: 13,
                                    textAlign:'center',
                                }}

                            >
                                领
                            </Text>
                        </ImageBackground>
                    </View>
                </TouchableOpacity>
            );

        }
        return tempArr;

    };

    //Action
    /**
     * 跳过函数
     */
    jump = () => {
        this.$navigate('login/login/RegistPage');
    };
    jumpToWriteCodePage=()=>{
        bridge.$toast('跳转填写邀请码页面');
    }
    redPacketClick=(redPacketIndex)=>{
      bridge.$toast('点击了第' + redPacketIndex + '红包');
    }
}

const Styles = StyleSheet.create(
    {
        contentStyle: {
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            margin: 0,
            marginTop: -2,
            backgroundColor: ColorUtil.Color_f7f7f7
        },
        rightTopTitleStyle: {
            fontSize: 15,
            color: '#666'
        },
        topViewStyle: {
            height: ScreenUtils.px2dp(430)
            // backgroundColor:ColorUtil.Color_222222

        },
        bottomViewStyle: {
            height: 100,
            justifyContent:'center',
            alignItems:'center'
        }

    }
);

