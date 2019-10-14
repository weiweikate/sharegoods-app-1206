//店员详情页面
import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import UIImage from '@mr/image-placeholder';
import { MRText as Text } from '../../../components/ui';
import BasePage from '../../../BasePage';
import DateUtils from '../../../utils/DateUtils';
import SpellShopApi from '../api/SpellShopApi';
import DesignRule from '../../../constants/DesignRule';
import ScreenUtils from '../../../utils/ScreenUtils';
import res from '../res';

const NavLeft = res.button.back_black;

export default class ShopAssistantDetailPage extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            userInfo: {}
        };
    }

    $navigationBarOptions = {
        show: false
    };

    _NavBarRenderRightItem = () => {
        return (<View style={styles.transparentView}>
                <View style={styles.leftBarItemContainer}>
                    <TouchableOpacity onPress={() => {
                        this.$navigateBack();
                    }} style={{ width: 40, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={NavLeft} style={{ width: 30, height: 30 }}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    componentDidMount() {
        this.loadPageData();
    }

    loadPageData() {
        const { userCode, storeCode } = this.params;
        SpellShopApi.findUserDetail({ userCode, storeCode }).then((data) => {
            this.setState({
                userInfo: data.data || {}
            });
        }).catch((error) => {
            this.$toastShow(error.msg);
        });
    }

    _renderRow = (title, desc) => {
        return (<View style={styles.row}>
            <Text style={styles.title} allowFontScaling={false}>{title}</Text>
            <Text style={styles.desc} allowFontScaling={false}>{desc}</Text>
        </View>);
    };

    renderContent = () => {
        const { userInfo } = this.state;
        const { updateTime, userBonus, createTime, roleType } = this.state.userInfo;
        const timeShow = roleType === 0 ? createTime : updateTime;
        return (
            <ScrollView>
                <View style={styles.imgBg}>
                    <UIImage
                        style={styles.headImg}
                        source={{ uri: userInfo.headImg }}
                        isAvatar={true}
                        borderRadius={34}/>
                    <Text style={{
                        fontSize: 16,
                        color: DesignRule.textColor_mainTitle,
                        marginBottom: 7
                    }}>{userInfo.nickName || ''}</Text>
                    <Text style={{
                        fontSize: 12,
                        color: DesignRule.textColor_secondTitle
                    }}>{userInfo.levelName || ''}</Text>
                </View>
                {this._renderRow('会员号', `${userInfo.code || ''}`)}
                {this._renderRow('手机号', `${userInfo.phone || ''}`, null)}
                {this._renderRow('加入时间', timeShow ? DateUtils.formatDate(timeShow, 'yyyy年MM月dd日') : '')}
                {this._renderRow('已获奖励总额', `${userBonus || 0}元`)}
            </ScrollView>);
    };

    _render() {
        return (
            <View style={styles.container}>
                {this._NavBarRenderRightItem()}
                {this.renderContent()}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    transparentView: {
        top: ScreenUtils.statusBarHeight,
        height: 44,
        backgroundColor: 'transparent',
        position: 'absolute',
        left: 5,
        right: 15,
        zIndex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    leftBarItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: 88
    },
    imgBg: {
        height: 156 + ScreenUtils.headerHeight, marginBottom: 15,
        alignItems: 'center', backgroundColor: 'white'
    },

    headImg: {
        marginTop: ScreenUtils.headerHeight, marginBottom: 15,
        width: 76, height: 76, borderRadius: 38
    },

    row: {
        height: 44, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
        justifyContent: 'space-between', borderRadius: 10, marginHorizontal: 15, marginBottom: 10
    },

    title: {
        fontSize: 13, color: DesignRule.textColor_secondTitle, marginLeft: 15
    },
    desc: {
        fontSize: 13, color: DesignRule.textColor_mainTitle, marginRight: 15
    }
});
