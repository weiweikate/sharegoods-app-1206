//招募中店铺的页面
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';


import RecruitMembersRow from './components/RecruitMembersRow';
import RecruitHeaderView from './components/RecruitHeaderView';
import BasePage from '../../../BasePage';
import SpellShopApi from '../api/SpellShopApi';
import ScreenUtils from '../../../utils/ScreenUtils';
import SpellStatusModel from '../model/SpellStatusModel';
import ActionSheetView from '../components/ActionSheetView';
import ReportAlert from '../components/ReportAlert';

// 图片资源
import ShopItemLogo from './src/dp_03.png';
import ItemLogo from './src/more_icon.png';
import StoreModel from '../model/StoreModel';

export default class ShopRecruitPage extends BasePage {

    // 导航配置
    $navigationBarOptions = {
        title: '店铺人员招募中',
        leftNavItemHidden: this.props.leftNavItemHidden
    };

    $NavBarRenderRightItem = () => {
        return <View style={styles.rightBarItemContainer}>
            {SpellStatusModel.canSeeGroupStore && <TouchableOpacity onPress={this._clickShopItem}>
                <Image style={{ marginRight: 11 }} source={ShopItemLogo}/>
            </TouchableOpacity>}

            {this.state.storeData.myStore && <TouchableOpacity onPress={this._clickSettingItem}>
                <Image style={{ marginRight: 20 }} source={ItemLogo}/>
            </TouchableOpacity>}
        </View>;
    };

    constructor(props) {
        super(props);
        this.state = {
            storeId: this.params.storeId,
            storeData: {},
            canOpen: false
        };
    }

    componentDidMount() {
        this._loadPageData();
    }

    _loadPageData = () => {
        SpellShopApi.getById({ id: this.state.storeId }).then((data) => {
            let dataTemp = data.data || {};
            let datalist = dataTemp.storeUserList || [];
            this.setState({
                storeData: dataTemp,
                canOpen: dataTemp.maxUser && dataTemp.maxUser <= datalist.length
            });
        }).catch((error) => {
            this.$toastShow(error.msg);
        });
    };

    _clickShopItem = () => {
        this.$navigate('spellShop/recommendSearch/RecommendPage');
    };

    _clickSettingItem = () => {
        this.actionSheetRef.show({
            items: ['分享店铺', '举报店铺']//
        }, (item, index) => {
            if (index === 0) {

            } else if (index === 1) {
                // 举报弹框
                setTimeout(() => {
                    this.reportAlert && this.reportAlert.show({
                        confirmCallBack: () => {
                            // SpellShopApi.addStoreReport({
                            //     content: '违法赌博',
                            //     storeId: storeModel.storeId
                            // }).then(response => {
                            //     if (response.ok) {
                            //         Toast.toast('举报成功');
                            //     } else {
                            //         Toast.toast(response.msg);
                            //     }
                            // });
                        }
                    });
                }, 500);
            }
        });
    };
    _closeStore = () => {
        this._loadPageData();
    };

    //开启店铺
    _openStore = () => {
        SpellShopApi.startStore({ status: 1 }).then((data) => {
            StoreModel.getById();
            this.$navigateBack();
        }).catch((error) => {
            this.$toastShow(error.msg);
        });
    };

    //加入店铺
    _joinStore = () => {
        SpellShopApi.addToStore({ storeId: this.state.storeId }).then((data) => {
            this._loadPageData();
            StoreModel.getById();
        }).catch((error) => {
            this.$toastShow(error.msg);
        });
    };

    //退出店铺
    _quitStore = () => {
        SpellShopApi.quitStore({ storeId: this.state.storeId }).then((data) => {
            StoreModel.getById();
            if (this.state.storeId) {
                this._loadPageData();
            } else {
                this.$navigateBack();
            }
        }).catch((error) => {
            this.$toastShow(error.msg);
        });
    };

    // 渲染头
    renderHeader = () => {
        return <RecruitHeaderView storeData={this.state.storeData}/>;
    };

    // 渲染店铺
    renderMembers = () => {
        return <RecruitMembersRow clickAllMembers={this._clickAllMembers} //点击全部成员
                                  storeData={this.state.storeData}/>;
    };

    renderOpenShopSetting = () => {
        //myStore 是否是店主
        //userStatus
        //0:不在店铺 1:以加入 2-申请中 3-邀请加入中 4-取消申请 5-邀请不加入 6-邀请取消 9-已经退出 10:店铺关闭
        const { myStore, userStatus } = this.state.storeData;
        if (myStore) {
            return (
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: ScreenUtils.autoSizeHeight(76)
                }}>
                    <TouchableOpacity onPress={this._closeStore}
                                      style={[styles.unOpen, {
                                          width: this.state.canOpen ? ScreenUtils.autoSizeWidth(168) : ScreenUtils.autoSizeWidth(345)
                                      }]}>
                        <Text style={{ fontSize: 16, color: '#e60012' }}>{'取消开启'}</Text>
                    </TouchableOpacity>
                    {
                        this.state.canOpen ? <TouchableOpacity onPress={this._openStore} style={styles.open}>
                            <Text style={{ fontSize: 16, color: 'white' }}>{'开启店铺'}</Text>
                        </TouchableOpacity> : null
                    }
                </View>
            );
        }

        return (
            <View style={{
                alignItems: 'center',
                marginTop: ScreenUtils.autoSizeHeight(76)
            }}>
                {
                    userStatus === 1 ?
                        <TouchableOpacity onPress={this._quitStore}
                                          style={[styles.unOpen, {
                                              width: ScreenUtils.autoSizeWidth(345)
                                          }]}>
                            <Text style={{ fontSize: 16, color: '#e60012' }}>{'退出拼店'}</Text>
                        </TouchableOpacity>
                        :

                        <TouchableOpacity onPress={this._joinStore}
                                          style={[styles.OutStore]}>
                            <Text style={{ fontSize: 16, color: 'white' }}>{'加入拼店'}</Text>
                        </TouchableOpacity>
                }

            </View>
        );
    };

    _render() {
        return (
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {this.renderHeader()}
                    {this.renderMembers()}
                    {this.renderOpenShopSetting()}
                </ScrollView>
                <ActionSheetView ref={ref => {
                    this.actionSheetRef = ref;
                }}/>
                <ReportAlert ref={ref => {
                    this.reportAlert = ref;
                }}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    rightBarItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    unOpen: {
        height: 48,
        borderRadius: 5,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#D51243',
        justifyContent: 'center',
        alignItems: 'center'
    },
    OutStore: {
        width: ScreenUtils.autoSizeWidth(345),
        height: 48,
        backgroundColor: '#D51243',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    open: {
        marginLeft: 10,
        width: ScreenUtils.autoSizeWidth(168),
        height: 48,
        backgroundColor: '#D51243',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    }

});
