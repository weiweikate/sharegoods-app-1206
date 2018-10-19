import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import ColorUtil from '../../../utils/ColorUtil';
import BasePage from '../../../BasePage';
import ScreenUtils from '../../../utils/ScreenUtils';

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
                />
            </View>
        );
    }

    _renderTopText=()=>{
        return(
            <View
                style={{
                    flexDirection:'row',
                    justifyContent:'space-between',
                    marginTop:40,
                    backgroundColor:ColorUtil.Color_ffffff
                }}
            >
                <Text
                    style={{
                        fontSize:13,
                        color:'#333',
                        marginLeft:15
                    }}
                >
                    请选择一个红包
                </Text>

                <TouchableOpacity>
                    <View
                        style={{
                            flexDirection:'row',
                            justifyContent:'center',
                            alignItems:'center',
                            marginRight:15

                        }}
                    >
                        <Image
                            style={{
                                width:16,
                                height:16,
                                backgroundColor:'red',
                            }}
                        />
                        <Text
                            style={{
                                fontSize:13,
                                color:'#666',
                                marginLeft:5
                            }}
                        >
                            换一批
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    _renderRedPacketList=()=>{
        return(
            <View
            style={{
                flex:1,
                justifyContent:'center',
                alignItems:'center'

            }}
            >
                <View
                style={{
                    // flex:1,
                    width:240,
                    backgroundColor:'blue',
                    justifyContent:'space-between',
                    flexDirection:'row',
                    flexWrap: 'wrap',  //设置换行显示
                }}
                >
                    {
                        this._getredPackageListItem().map((redItemView,index)=>{
                            return redItemView
                            }
                        )
                    }

                </View>
            </View>
        )
    }

    _getredPackageListItem=()=>{
        let tempArr = [];
        for (let index = 0;index < 4;index++){
            tempArr.push(
                <TouchableOpacity
                key={index}
                >
                    <View
                    style={{
                        backgroundColor:'red',
                        width:90,
                        height:160,
                        marginTop:30
                    }}
                    >


                    </View>
                </TouchableOpacity>
            )

        }
        return tempArr;

    }


    /*跳过*/
    jump = () => {
        this.$navigate('login/login/RegistPage');
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
            backgroundColor: ColorUtil.Color_f7f7f7
        },
        rightTopTitleStyle: {
            fontSize: 15,
            color: '#666'
        },
        topViewStyle: {
            height: ScreenUtils.px2dp(430),
            backgroundColor:ColorUtil.Color_222222

        },
        bottomViewStyle: {
            backgroundColor: 'blue',
            height: 100
        },

    }
);

