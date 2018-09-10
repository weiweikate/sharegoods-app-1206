//招募中店铺的页面
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity
} from 'react-native';


import RecruitMembersRow from './components/RecruitMembersRow';
import RecruitHeaderView from './components/RecruitHeaderView';
import BasePage from '../../../BasePage';

export default class ShopRecruitPage extends BasePage {

    // 导航配置
    $navigationBarOptions = {
        title: '店铺人员招募中'
    };

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            canOpen: true
        };
    }


    // 渲染头
    renderHeader = () => {
        return <RecruitHeaderView/>;
    };

    // 渲染店铺
    renderMembers = () => {
        return <RecruitMembersRow clickAllMembers={this._clickAllMembers} //点击全部成员
                                  clickAddMembers={this._clickAddMembers}
                                  originDealerList={this.state.originDealerList}
                                  dealerList={this.state.dealerList}/>;
    };

    renderOpenShopSetting = () => {
        if (this.state.loading || this.state.netFailedInfo || !this.state.isYourStore || !this.state.store) {
            return null;
        }
        const { isYourStore } = this.state;
        if (!isYourStore) {
            return (<View style={styles.bottomRow}>
                <View style={{ flex: 1 }}/>
                <TouchableOpacity style={styles.joinBtn}>
                    <Text style={styles.joinText}>加入</Text>
                </TouchableOpacity>
            </View>);
        }

        return (<View style={{ alignItems: 'center' }}>
            <TouchableOpacity onPress={this._cancelStore}
                              style={[styles.unOpen, { marginBottom: this.state.canOpen ? 0 : 30 }]}>
                <Text style={{
                    fontSize: 16,
                    color: '#e60012'
                }}>取消开启</Text>
            </TouchableOpacity>
            {
                this.state.canOpen ? <TouchableOpacity onPress={this._openStore} style={styles.open}>
                    <Text style={{
                        fontSize: 16,
                        color: '#fff'
                    }}>开启店铺</Text>
                </TouchableOpacity> : null
            }
        </View>);
    };

    _render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh}/>}
                    showsVerticalScrollIndicator={false}>
                    {this.renderHeader()}
                    {this.renderMembers()}
                    <View style={{ height: 15 }}/>
                    {this.renderOpenShopSetting()}
                </ScrollView>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    unOpen: {
        width: 150,
        height: 48,
        marginTop: 48,
        borderRadius: 5,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#e60012',
        justifyContent: 'center',
        alignItems: 'center'
    },
    open: {
        width: 150,
        height: 48,
        marginTop: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e60012',
        marginBottom: 20
    },

    bottomRow: {
        height: 48,
        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'center'
    },
    joinBtn: {
        width: 110,
        height: 48,
        backgroundColor: '#e60012',
        justifyContent: 'center',
        alignItems: 'center'
    },
    joinText: {
        fontFamily: 'PingFang-SC-Medium',
        fontSize: 16,
        color: '#ffffff'
    }
});
