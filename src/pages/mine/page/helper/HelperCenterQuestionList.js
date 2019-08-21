/**
 * Created by chenweiwei on 2019/8/20.
 */

import React from 'react';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import BasePage from '../../../../BasePage';
import UIText from '../../../../components/ui/UIText';
import ScreenUtils from '../../../../utils/ScreenUtils';
import MineApi from '../../api/MineApi';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import { NoMoreClick} from '../../../../components/ui';
import {observer} from 'mobx-react';
import {SmoothPushPreLoadHighComponentFirstDelay} from '../../../../comm/components/SmoothPushHighComponent';
import RouterMap from '../../../../navigation/RouterMap';
import CustomerServiceButton from '../../components/CustomerServiceButton';

const {px2dp} = ScreenUtils;
@SmoothPushPreLoadHighComponentFirstDelay
@observer
export default class HelperCenterQuestionTypeList extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            typeList: [],
            visible: false
        };
    }

    $navigationBarOptions = {
        title: '问题列表',
        show: true // false则隐藏导航
    };
    // 常见问题列表
    renderHotQuestionList = () => {
        return (
            <View style={{
                width: ScreenUtils.width,
                paddingLeft: px2dp(15),
                paddingRight: px2dp(15)
            }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop:px2dp(10),
                    marginBottom:px2dp(10),
                }}>
                    <View style={{width: 2, height: 8, backgroundColor: '#FF0050', borderRadius: 1}}/>
                    <UIText value={'问题列表'}
                            style={{
                                marginLeft: 10,
                                fontSize: DesignRule.fontSize_threeTitle_28,
                                color: DesignRule.textColor_mainTitle,
                                fontWeight: '600'
                            }}/>
                </View>
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: px2dp(5)
                }}>
                    {this.state.typeList.map((item, index) => {
                        return (
                            <NoMoreClick activeOpacity={0.6}
                                         onPress={() => this.jumpToAllQuestionDetail()}
                                         key={index}
                                         style={styles.hotQuestionStyle}
                            >
                                {
                                    index != 0 ?
                                        <View style={{
                                            borderBottomWidth: 0.5,
                                            borderColor: '#dedede',
                                        }}
                                        >
                                        </View>
                                        : null
                                }
                                <View style={styles.hotQuestionItemStyle}>
                                    <UIText value={item.name}
                                            numberOfLines={1}
                                            style={{
                                                fontSize: DesignRule.fontSize_threeTitle,
                                                color: DesignRule.textColor_secondTitle,
                                            }}/>
                                    <Image source={res.button.arrow_right}
                                           style={{width: 4, height: 8, marginLeft: 6}}/>
                                </View>
                            </NoMoreClick>
                        );
                    })}
                </View>

            </View>
        );
    };
    renderBodyView = () => {
        return (
            <View style={{flex: 1}}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {this.renderHotQuestionList()}
                </ScrollView>
                <View style={{height: 20, backgroundColor: DesignRule.bgColor}}/>
                {/*联系客服按钮*/}
                <CustomerServiceButton/>
            </View>
        );
    };


    // 跳转到问题详情页面

    jumpToAllQuestionDetail(id) {
        this.$navigate(RouterMap.HelperCenterQuestionDetail, {id});
    }

    // 初始化数据

    componentDidMount() {
        let list = [];
        MineApi.queryHelpQuestionList().then(res => {
            console.log(res);
            res.data.forEach(item => {
                list.push({
                    name: item.name,
                    list: item.helpQuestionExtList,
                    typeid: item.id,
                    imgUrl: item.imgUrl
                });
            });
            console.log('componentDidMount', list);
            this.setState({
                typeList: list
            });
        }).catch(error => {
            this.$toastShow(error.msg);
            console.log(error);
        });
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
        flex: 1, backgroundColor: DesignRule.bgColor,
        marginBottom: ScreenUtils.safeBottom
    },
    hotQuestionStyle: {
        paddingLeft: 15,
        paddingRight: 15,
        flex: 1
    },
    hotQuestionItemStyle: {
        paddingLeft: 5,
        paddingRight: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        height: 40,
    }
});

