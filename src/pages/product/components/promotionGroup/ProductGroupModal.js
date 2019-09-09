/**
 * @author 陈阳君
 * @date on 2019/09/05
 * @describe
 * @org 秀购
 * @email chenyangjun@meeruu.com
 */

import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
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

const { px2dp } = ScreenUtils;

export const action_type = {
    persons: 0,
    join: 1,
    desc: 2
};

export default class ProductGroupModal extends Component {

    state = {
        modalVisible: false
    };

    show = ({ actionType, data, extraData, goToBuy }) => {
        setTimeout(() => {
            this.setState({
                modalVisible: true,
                actionType,
                data,
                extraData,
                goToBuy
            });
        }, 500);
    };

    _close = () => {
        this.setState({
            modalVisible: false
        });
    };

    render() {
        const { modalVisible, actionType, data, extraData, goToBuy } = this.state;
        if (!modalVisible) {
            return null;
        }
        return (
            <CommModal onRequestClose={this._close}
                       visible={this.state.modalVisible}
                       transparent={true}>
                {actionType === action_type.persons &&
                <View style={styles.containerView}>
                    <NoMoreClick style={{ flex: 1 }} onPress={this._close} activeOpacity={1}/>
                    <GroupPersonAllList data={data} goToBuy={goToBuy} showModal={this.show}/>
                </View>}
                {actionType === action_type.join &&
                <NoMoreClick onPress={this._close} activeOpacity={1} style={styles.containerView1}>
                    <GroupJoinView data={data} extraData={extraData} goToBuy={goToBuy} close={this._close}/>
                </NoMoreClick>}
                {actionType === action_type.desc &&
                <View style={styles.containerView}>
                    <NoMoreClick style={{ flex: 1 }} onPress={this._close} activeOpacity={1}/>
                    <GroupDescView data={data}/>
                </View>}
            </CommModal>
        );
    }
}

const styles = StyleSheet.create({
    containerView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: ScreenUtils.width
    },
    containerView1: {
        flex: 1, justifyContent: 'center', alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: ScreenUtils.width
    }
});

/*
* 正在凑团
* */
class GroupPersonAllList extends Component {

    _renderItem = ({ item }) => {
        return <GroupPersonItem itemData={item} style={stylesAll.itemView} goToBuy={this.props.goToBuy}
                                showModal={this.props.showModal}/>;
    };

    render() {
        return (
            <View style={stylesAll.container}>
                <View style={stylesAll.topView}>
                    <MRText style={stylesAll.topLText}>正在凑团</MRText>
                    <MRText style={stylesAll.topRText}>仅显示10个正在拼团的人</MRText>
                </View>
                <FlatList
                    style={stylesAll.flatList}
                    data={this.props.data || []}
                    keyExtractor={(item) => item.id + ''}
                    renderItem={this._renderItem}
                    showsHorizontalScrollIndicator={false}
                    initialNumToRender={5}
                />
            </View>
        );
    }
}

const stylesAll = StyleSheet.create({
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
                            {startGroupLeader ? <View style={stylesJoin.leaderView}>
                                <MRText style={stylesJoin.leaderText}>团长</MRText>
                            </View> : null}
                        </UIImage>
                }
            </View>

        );
    };

    render() {
        const { extraData, data, goToBuy, close } = this.props;
        const { groupNum, endTime, id } = extraData;
        let leaderName;
        for (const item of data) {
            if (item.startGroupLeader) {
                leaderName = item.nickName;
                break;
            }
        }
        return (
            <NoMoreClick style={stylesJoin.container} onPress={() => {
            }} activeOpacity={1}>
                <MRText style={stylesJoin.topText}>参与{leaderName}的拼单</MRText>
                <MRText
                    style={stylesJoin.topText1}>仅剩{StringUtils.sub(groupNum, data.length)}个名额，<TimeLabelText
                    endTime={endTime}/>后结束</MRText>
                <View style={stylesJoin.iconView}>
                    {
                        (data || []).map((item, index) => {
                            return this.renderItem(item, index, data.length);
                        })
                    }
                    <Image style={[stylesJoin.icon, { marginLeft: px2dp(20) }]}
                           source={whoAreYou}/>
                </View>
                <NoMoreClick onPress={() => {
                    close();
                    goToBuy && goToBuy(id);
                }}>
                    <LinearGradient style={stylesJoin.linearGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={['#FC5D39', '#FF0050']}>
                        <MRText style={stylesJoin.btnText}>一键参团</MRText>
                    </LinearGradient>
                </NoMoreClick>
            </NoMoreClick>
        );
    }
}

const stylesJoin = StyleSheet.create({
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
        width: px2dp(40), height: px2dp(40), borderRadius: px2dp(20)
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
        justifyContent: 'center', alignItems: 'center'
    },
    leaderText: {
        fontSize: 11, color: 'white'
    }
});

/*
* 活动玩法
* */
class GroupDescView extends Component {
    render() {
        return (
            <View style={stylesDesc.container}>
                <View style={stylesDesc.topView}>
                    <MRText style={stylesDesc.topText}>拼团玩法</MRText>
                </View>
                <HTML html={this.props.data}
                      imagesMaxWidth={ScreenUtils.width}
                      imagesInitialDimensions={{ width: ScreenUtils.width, height: 0 }}
                      containerStyle={{ backgroundColor: '#fff' }}/>
            </View>
        );
    }
}

const stylesDesc = StyleSheet.create({
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
    }
});
