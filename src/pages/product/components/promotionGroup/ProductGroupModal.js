/**
 * @author 陈阳君
 * @date on 2019/09/05
 * @describe
 * @org 秀购
 * @email chenyangjun@meeruu.com
 */

import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Image, ScrollView, Alert } from 'react-native';
import UIImage from '@mr/image-placeholder';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import CommModal from '../../../../comm/components/CommModal';
import { GroupPersonItem, TimeLabelText } from './ProductGroupItemView';
import { MRText } from '../../../../components/ui';
import NoMoreClick from '../../../../components/ui/NoMoreClick';
import LinearGradient from 'react-native-linear-gradient';
import HTML from '@mr/react-native-render-html';
import StringUtils from '../../../../utils/StringUtils';
import { observer } from 'mobx-react';
import whoAreYou from './whoAreYou.png';
import morePerson from './morePerson.png';
import user from '../../../../model/user';
import { routeNavigate } from '../../../../navigation/RouterMap';
import RouterMap from '../../../../navigation/RouterMap';

const { px2dp } = ScreenUtils;

/*
* 正在凑团
* */
export class GroupPersonAllList extends Component {
    state = {
        modalVisible: false
    };

    show = () => {
        this.setState({
            modalVisible: true
        });
    };

    _close = () => {
        this.setState({
            modalVisible: false
        });
    };

    _renderItem = ({ item }) => {
        const { goToBuy, showGroupJoinView, requestGroupList } = this.props;
        return <GroupPersonItem style={stylesAll.itemView} itemData={item} goToBuy={goToBuy}
                                requestGroupList={requestGroupList}
                                close={this._close}
                                showGroupJoinView={showGroupJoinView}/>;
    };

    render() {
        const { modalVisible } = this.state;
        if (!modalVisible) {
            return null;
        }
        const { groupList } = this.props;
        return (
            <CommModal onRequestClose={this._close}
                       visible={this.state.modalVisible}
                       transparent={true}>
                <View style={stylesAll.containerView}>
                    <NoMoreClick style={{ flex: 1 }} onPress={this._close} activeOpacity={1}/>
                    <View style={stylesAll.container}>
                        <View style={stylesAll.topView}>
                            <MRText style={stylesAll.topLText}>正在凑团</MRText>
                            <MRText
                                style={stylesAll.topRText}>{groupList.length === 10 ? '仅显示10个正在拼团的人' : ''}</MRText>
                        </View>
                        <FlatList
                            style={stylesAll.flatList}
                            data={groupList || []}
                            keyExtractor={(item) => item.id + ''}
                            renderItem={this._renderItem}
                            showsHorizontalScrollIndicator={false}
                            initialNumToRender={5}
                        />
                    </View>
                </View>
            </CommModal>
        );
    }
}

const stylesAll = StyleSheet.create({
    containerView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: ScreenUtils.width
    },
    container: {
        height: ScreenUtils.autoSizeHeight(405),
        borderTopLeftRadius: 10, borderTopRightRadius: 10,
        backgroundColor: DesignRule.bgColor
    },
    topView: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        height: 54, paddingHorizontal: 15
    },
    topLText: {
        fontSize: 17, color: DesignRule.textColor_mainTitle, fontWeight: '500'
    },
    topRText: {
        fontSize: 12, color: DesignRule.textColor_instruction
    },
    itemView: {
        marginHorizontal: 15, backgroundColor: 'white', borderRadius: 10, marginBottom: 10
    }
});

/*
* 参加与...的拼单
* */
@observer
export class GroupJoinView extends Component {

    state = {
        modalVisible: false
    };

    show = ({ itemData, joinList }) => {
        this.setState({
            modalVisible: true,
            itemData,
            joinList
        });
    };

    _close = () => {
        this.setState({
            modalVisible: false
        });
    };

    renderItem = (item, index, length) => {
        if (index > 4) {
            return null;
        }
        const { userHeadImg, startGroupLeader } = item;
        let source;
        if (index === 3 && length > 3) {
            source = morePerson;
        }
        return (
            <View>
                {
                    source ? <Image style={[stylesJoin.icon, { marginLeft: index === 0 ? 0 : px2dp(20) }]}
                                    source={source}/> :
                        <UIImage key={index}
                                 isAvatar={true}
                                 style={[stylesJoin.icon, { marginLeft: index === 0 ? 0 : px2dp(20) }]}
                                 source={source ? source : { uri: userHeadImg }}>
                        </UIImage>
                }
                {startGroupLeader ? <View style={stylesJoin.leaderView}>
                    <MRText style={stylesJoin.leaderText}>团长</MRText>
                </View> : null}
            </View>

        );
    };

    render() {
        const { modalVisible } = this.state;
        if (!modalVisible) {
            return null;
        }
        const { itemData, joinList } = this.state;
        const { goToBuy } = this.props;
        const { groupNum, endTime, activityTag } = itemData || {};
        let leaderName;
        for (const item of (joinList || [])) {
            if (item.startGroupLeader) {
                leaderName = item.nickName;
                break;
            }
        }
        return (
            <CommModal onRequestClose={this._close}
                       visible={this.state.modalVisible}
                       transparent={true}>
                <NoMoreClick onPress={this._close} activeOpacity={1} style={stylesJoin.containerView1}>
                    <NoMoreClick style={stylesJoin.container} onPress={() => {
                    }} activeOpacity={1}>
                        <MRText style={stylesJoin.topText}>参与{leaderName}的拼单</MRText>
                        <MRText
                            style={stylesJoin.topText1}>仅剩{StringUtils.sub(groupNum, joinList.length)}个名额，<TimeLabelText
                            endTime={endTime}/>后结束</MRText>
                        <View style={stylesJoin.iconView}>
                            {
                                (joinList || []).map((item, index) => {
                                    return this.renderItem(item, index, joinList.length);
                                })
                            }
                            <Image style={[stylesJoin.icon, { marginLeft: px2dp(20) }]}
                                   source={whoAreYou}/>
                        </View>
                        <NoMoreClick onPress={() => {
                            this._close();
                            if (!user.isLogin) {
                                routeNavigate(RouterMap.LoginPage);
                                return;
                            }
                            if (activityTag === 101106 && user.newUser !== null && !user.newUser) {
                                setTimeout(() => {
                                    Alert.alert(
                                        '无法参团',
                                        '该团仅支持新用户参加，可以开个新团，\n立享优惠哦~',
                                        [
                                            {
                                                text: '知道了', onPress: () => {
                                                }
                                            },
                                            {
                                                text: '开新团', onPress: () => {
                                                    goToBuy && goToBuy(null);
                                                }
                                            }
                                        ]
                                    );
                                }, 500);
                                return;
                            }
                            goToBuy && goToBuy(itemData);
                        }}>
                            <LinearGradient style={stylesJoin.linearGradient}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            colors={['#FC5D39', '#FF0050']}>
                                <MRText style={stylesJoin.btnText}>一键参团</MRText>
                            </LinearGradient>
                        </NoMoreClick>
                    </NoMoreClick>
                </NoMoreClick>
            </CommModal>
        );
    }
}

const stylesJoin = StyleSheet.create({
    containerView1: {
        flex: 1, justifyContent: 'center', alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: ScreenUtils.width
    },
    container: {
        alignItems: 'center',
        width: px2dp(310), height: px2dp(225), backgroundColor: 'white', borderRadius: 10
    },
    topText: {
        fontSize: 17, color: DesignRule.textColor_mainTitle, marginTop: 15
    },
    topText1: {
        fontSize: 12, color: DesignRule.textColor_instruction
    },
    iconView: {
        alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'center', marginVertical: 33
    },
    icon: {
        width: px2dp(40), height: px2dp(40), borderRadius: px2dp(20), overflow: 'hidden'
    },
    linearGradient: {
        justifyContent: 'center', alignItems: 'center', marginBottom: 25,
        width: px2dp(260), height: 40, borderRadius: 20
    },
    btnText: {
        fontSize: 14, color: 'white'
    },

    leaderView: {
        width: 32, height: 15, borderRadius: 7.5, backgroundColor: DesignRule.mainColor,
        justifyContent: 'center', alignItems: 'center',
        position: 'absolute', bottom: 0, alignSelf: 'center'
    },
    leaderText: {
        fontSize: 11, color: 'white'
    }
});

/*
* 活动玩法
* */
export class GroupDescView extends Component {
    state = {
        modalVisible: false
    };

    show = () => {
        this.setState({
            modalVisible: true
        });
    };

    _close = () => {
        this.setState({
            modalVisible: false
        });
    };

    render() {
        const { modalVisible } = this.state;
        if (!modalVisible) {
            return null;
        }
        const { groupDesc } = this.props;
        return (
            <CommModal onRequestClose={this._close}
                       visible={this.state.modalVisible}
                       transparent={true}>
                <View style={stylesDesc.containerView}>
                    <NoMoreClick style={{ flex: 1 }} onPress={this._close} activeOpacity={1}/>
                    <View style={stylesDesc.container}>
                        <View style={stylesDesc.topView}>
                            <MRText style={stylesDesc.topText}>拼团玩法</MRText>
                        </View>
                        <ScrollView>
                            <HTML html={groupDesc}
                                  imagesMaxWidth={ScreenUtils.width - 30}
                                  imagesInitialDimensions={{ width: ScreenUtils.width, height: 0 }}
                                  containerStyle={{ backgroundColor: '#fff', paddingHorizontal: 15 }}/>
                        </ScrollView>
                    </View>
                </View>
            </CommModal>
        );
    }
}

const stylesDesc = StyleSheet.create({
    containerView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: ScreenUtils.width
    },
    container: {
        height: ScreenUtils.autoSizeHeight(405),
        borderTopLeftRadius: 10, borderTopRightRadius: 10,
        backgroundColor: DesignRule.bgColor
    },
    topView: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        height: 54
    },
    topText: {
        fontSize: 17, color: DesignRule.textColor_mainTitle, fontWeight: '500'
    },
    containerView1: {
        flex: 1, justifyContent: 'center', alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: ScreenUtils.width
    }
});
