/**
 * @author 陈阳君
 * @date on 2019/09/05
 * @describe
 * @org 秀购
 * @email chenyangjun@meeruu.com
 */

import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import UIImage from '@mr/image-placeholder';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import CommModal from '../../../../comm/components/CommModal';
import { GroupPersonItem } from './ProductGroupItemView';
import { MRText } from '../../../../components/ui';
import NoMoreClick from '../../../../components/ui/NoMoreClick';
import LinearGradient from 'react-native-linear-gradient';

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

    show = ({ actionType }) => {
        this.setState({
            modalVisible: true,
            actionType
        });
    };

    _close = () => {
        this.setState({
            modalVisible: false
        });
    };

    render() {
        const { modalVisible, actionType } = this.state;
        if (!modalVisible) {
            return null;
        }
        return (
            <CommModal onRequestClose={this._close}
                       visible={this.state.modalVisible}
                       transparent={true}>
                {actionType === action_type.persons && <View style={styles.containerView}>
                    <NoMoreClick style={{ flex: 1 }} onPress={this._close} activeOpacity={1}/>
                    <GroupPersonAllList/>
                </View>}
                <NoMoreClick onPress={this._close} activeOpacity={1} style={styles.containerView1}>
                    <GroupJoinView/>
                </NoMoreClick>
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

class GroupPersonAllList extends Component {
    _renderItem = () => {
        return <GroupPersonItem/>;
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
                    data={[{}, {}, {}, {}, {}, {}]}
                    keyExtractor={(item) => item.prodCode + ''}
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
        height: 54, marginHorizontal: 15
    },
    topLText: {
        fontSize: 14, color: DesignRule.textColor_mainTitle
    },
    topRText: {
        fontSize: 14, color: DesignRule.textColor_mainTitle
    }
});

export class GroupJoinView extends Component {

    render() {
        return (
            <View style={stylesJoin.container}>
                <MRText style={stylesJoin.topText}>参与刘丽丽1…**2333的拼单</MRText>
                <MRText style={stylesJoin.topText1}>仅剩1个名额，23:23:23后结束</MRText>
                <View style={stylesJoin.iconView}>
                    {
                        ['', '', ''].map((item, index) => {
                            return <UIImage key={index}
                                            style={[stylesJoin.icon, { marginLeft: index === 0 ? 0 : px2dp(20) }]}
                                            borderRadius={px2dp(20)}
                                            source={{ uri: 'https://cdn.sharegoodsmall.com/sharegoods/cc49225d27ae4c35ac62b4fbe6718b55.png' }}/>;
                        })

                    }
                </View>
                <NoMoreClick onPress={() => {
                    this.requestGroupPerson();
                }}>
                    <LinearGradient style={stylesJoin.linearGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={['#FC5D39', '#FF0050']}>
                        <MRText style={stylesJoin.btnText}>一键参团</MRText>
                    </LinearGradient>
                </NoMoreClick>
            </View>
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
        width: px2dp(40), height: px2dp(40)
    },
    linearGradient: {
        justifyContent: 'center', alignItems: 'center', marginBottom: 25,
        width: px2dp(260), height: 40, borderRadius: 20
    },
    btnText: {
        fontSize: 14, color: 'white'
    }
});

