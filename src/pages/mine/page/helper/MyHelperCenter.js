/**
 * Created by chenweiwei on 2019/8/20.
 */

import React from 'react';
import { Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import BasePage from '../../../../BasePage';
import UIText from '../../../../components/ui/UIText';
import ScreenUtils from '../../../../utils/ScreenUtils';
import MineApi from '../../api/MineApi';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import { MRText as Text, NoMoreClick } from '../../../../components/ui';
import LinearGradient from 'react-native-linear-gradient';
import user from '../../../../model/user';
import { observer } from 'mobx-react';
import { SmoothPushPreLoadHighComponentFirstDelay } from '../../../../comm/components/SmoothPushHighComponent';
import RouterMap, { routeNavigate } from '../../../../navigation/RouterMap';
import CustomerServiceButton from '../../components/CustomerServiceButton';
import RefreshFlatList from '../../../../comm/components/RefreshFlatList';
import HelperLoadMoreComponent from '../../components/HelperLoadMoreComponent';

const {
    icon_tuikuan_2,
    icon_feedback_2,
    icon_auto_feedback_2
} = res.helperAndCustomerService;

const { px2dp } = ScreenUtils;
@SmoothPushPreLoadHighComponentFirstDelay
@observer
export default class MyHelperCenter extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    $navigationBarOptions = {
        title: '帮助中心',
        show: true // false则隐藏导航
    };
    refreshList = () => {
        this.helpHotList && this.helpHotList.onRefresh();
    };
    // 常见问题列表
    renderHotQuestionList = () => {
        return (
            <View style={{
                width: ScreenUtils.width,
                paddingLeft: px2dp(15),
                paddingRight: px2dp(15),
                flex: 1
            }}>
                <View style={{
                    marginTop: px2dp(25),
                    flex: 1
                }}>
                    <TouchableWithoutFeedback onPress={this.jumpToAllQuestionTypePage}>
                        <View style={styles.title}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View
                                    style={{ width: 2, height: 8, backgroundColor: '#FF0050', borderRadius: 1 }}/>
                                <UIText value={'常见问题'}
                                        style={{
                                            marginLeft: 10,
                                            fontSize: DesignRule.fontSize_threeTitle_28,
                                            color: DesignRule.textColor_mainTitle,
                                            fontWeight: '600'
                                        }}/>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <UIText value={'查看全部'}
                                        style={{
                                            fontSize: DesignRule.fontSize_24,
                                            color: DesignRule.textColor_instruction
                                        }}/>
                                <Image source={res.button.arrow_right_black}
                                       style={{ width: 5, height: 8, marginLeft: 6 }}/>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    <RefreshFlatList url={MineApi.queryHelpCenterDetailList}
                                     isSupportLoadingMore={false}
                                     ref={(ref) => {
                                         this.helpHotList = ref;
                                     }}
                                     nestedScrollEnabled={true}
                                     params={{
                                         type: 1,
                                         pageSize: 100,
                                         page: 1
                                     }}
                                     renderItem={this.renderItem}
                                     emptyHeight={ScreenUtils.autoSizeWidth(300)}
                                     defaultEmptyText={'还没内容哦'}
                                     style={{ flex: 1 }}
                                     renderLoadMoreComponent={(status) => <HelperLoadMoreComponent status={status}/>}
                                     renderFooter={() => <View style={{ marginTop: 30 }}>
                                         <CustomerServiceButton/>
                                     </View>}
                    />
                </View>
            </View>

        );
    };

    renderItem = ({ item, index }) => {
        const data = this.helpHotList ? this.helpHotList.getSourceData() : [];
        const {
            title
        } = item;
        return (
            <View key={index} style={[
                styles.hotQuestionStyle,
                index == 0 ? { borderTopLeftRadius: 5, borderTopRightRadius: 5 } : {},
                index == data.length - 1 ? { borderBottomLeftRadius: 5, borderBottomRightRadius: 5 } : {}
            ]}>
                {
                    index != 0 ?
                        <View style={{
                            borderBottomWidth: 0.5,
                            borderColor: '#dedede'
                        }}
                         />
                        : null
                }
                <NoMoreClick style={styles.hotQuestionItemStyle}
                             activeOpacity={0.6}
                             onPress={() => {
                                 this.jumpQuestionDetail(item);
                             }}>
                    <UIText value={title}
                            numberOfLines={1}
                            style={{
                                fontSize: DesignRule.fontSize_threeTitle,
                                color: DesignRule.textColor_secondTitle
                            }}/>
                    <Image source={res.button.arrow_right_black}
                           style={{ width: 5, height: 8, marginLeft: 6 }}/>
                </NoMoreClick>
            </View>
        );
    };

    renderFeedBackButton = (type, icon, name) => {
        return (
            <NoMoreClick activeOpacity={0.6}
                         onPress={() => this.questionFeedBack(type)}
                         style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            >
                <Image source={icon} style={{ width: 37, height: 37 }}/>
                <Text style={styles.textFontstyle} allowFontScaling={false}>{name}</Text>
            </NoMoreClick>
        );
    };

    renderBodyView = () => {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ backgroundColor: DesignRule.bgColor }}>
                    <View style={{
                        width: ScreenUtils.width,
                        height: px2dp(157)
                    }}>
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                        colors={['#FC5D39', '#FF0050']}
                                        style={{
                                            padding: 20,
                                            flex: 1
                                        }}
                        >
                            <UIText value={'您好,\n我们为你提供更多帮助...'}
                                    numberOfLines={2}
                                    style={{
                                        fontSize: 18,
                                        color: '#fff'
                                    }}/>
                        </LinearGradient>
                        <View style={{
                            width: ScreenUtils.width,
                            justifyContent: 'space-between',
                            paddingHorizontal: 15,
                            zIndex: 21,
                            position: 'absolute',
                            left: 0,
                            top: px2dp(87)
                        }}>
                            <View style={{
                                alignItems: 'center',
                                height: 87,
                                flexDirection: 'row',
                                backgroundColor: 'white',
                                borderRadius: 5
                            }}>
                                {this.renderFeedBackButton(3, icon_auto_feedback_2, '查看订单')}
                                {this.renderFeedBackButton(2, icon_feedback_2, '问题反馈')}
                                {this.renderFeedBackButton(1, icon_tuikuan_2, '售后进度')}
                            </View>
                        </View>
                    </View>
                </View>
                {this.renderHotQuestionList()}
                {/*<View style={{height:6, backgroundColor: DesignRule.bgColor}}/>*/}
                {/*联系客服按钮*/}
                {/*<CustomerServiceButton/>*/}
            </View>
        );
    };


    jumpToAllQuestionTypePage() {
        routeNavigate(RouterMap.HelperCenterQuestionTypeList);
    }

    questionFeedBack(type) {
        if (!user.isLogin) {
            this.gotoLoginPage();
            return;
        }
        if (type === 1) {
            this.$navigate(RouterMap.AfterSaleListPage);
        } else if (type === 2) {
            this.$navigate(RouterMap.HelperFeedbackPage);
        } else if (type === 3) {
            this.$navigate(RouterMap.MyOrdersListPage, { index: 0 });
        }

    }

    // 跳转到问题详情页面

    jumpQuestionDetail = (detail) => {
        this.$navigate(RouterMap.HelperCenterQuestionDetail, { detail, refreshList: this.refreshList });
    };

    // 初始化数据

    componentDidMount() {

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
        flex: 1,
        backgroundColor: DesignRule.bgColor,
        marginBottom: ScreenUtils.safeBottom
    },
    hotQuestionStyle: {
        paddingLeft: 15,
        paddingRight: 15,
        flex: 1,
        backgroundColor: 'white'
    },
    hotQuestionItemStyle: {
        paddingLeft: 5,
        paddingRight: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        height: 40
    },
    title: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40,
        flexDirection: 'row',
        paddingRight: 10
    },
    textFontstyle: {
        color: '#666666',
        fontSize: 13,
        marginTop: 4
    }
});

