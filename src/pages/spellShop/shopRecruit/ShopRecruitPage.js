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
import ActionSheetView from '../components/ActionSheetView';
import ReportAlert from '../components/ReportAlert';

// 图片资源
import icons8_Shop_50px from './src/icons8_Shop_50px.png';
import icons9_shop from './src/icons9_shop.png';
import spellStatusModel from '../model/SpellStatusModel';
import ConfirmAlert from '../../../components/ui/ConfirmAlert';
import CommShareModal from '../../../comm/components/CommShareModal';

export default class ShopRecruitPage extends BasePage {

    // 导航配置
    $navigationBarOptions = {
        title: '店铺人员招募中',
        leftNavItemHidden: this.props.leftNavItemHidden
    };

    $NavBarRenderRightItem = () => {
        return <View style={styles.rightBarItemContainer}>
            <TouchableOpacity onPress={() => {
                this.$navigate('spellShop/recommendSearch/RecommendPage');
            }
            }>
                <Image style={{ marginRight: 20 }} source={icons8_Shop_50px}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._clickSettingItem}>
                <Image style={{ marginRight: 20 }} source={icons9_shop}/>
            </TouchableOpacity>
        </View>;
    };

    constructor(props) {
        super(props);
        this.state = {
            storeId: this.params.storeId || this.props.storeId,
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
                storeId: dataTemp.id,
                canOpen: dataTemp.maxUser && dataTemp.maxUser <= datalist.length
            });
        }).catch((error) => {
            this.$toastShow(error.msg);
        });
    };

    _clickSettingItem = () => {
        let arr = ['分享店铺', '举报'];
        if (this.state.storeData.myStore) {
            arr = ['分享店铺'];
        }
        this.actionSheetRef.show({
            items: arr
        }, (item, index) => {
            if (index === 0) {
                this.shareModal.open();
            } else if (index === 1) {
                // 举报弹框
                setTimeout(() => {
                    this.reportAlert && this.reportAlert.show({
                        confirmCallBack: (text) => {
                            SpellShopApi.storeTipOffInsert({
                                content: text,
                                storeId: this.state.storeId
                            }).then(() => {
                                this.$toastShow('举报成功');
                            }).catch((error) => {
                                this.$toastShow(error.msg);
                            });
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
            //首页开店 直接刷新
            if (this.props.propReload) {
                this.props.propReload();
            } else {
                this.$navigateBack();
            }
        }).catch((error) => {
            this.$toastShow(error.msg);
        });
    };

    //加入店铺
    _joinStore = () => {
        this.refs['delAlert'] && this.refs['delAlert'].show({
            title: `·该店铺为新发起店铺，需满足人员招募后才会正式开启;\n·如开启成功，则自动加入;\n·如开启不成功，则可以选择加入其他店铺`,
            confirmCallBack: () => {
                this.$loadingShow();
                SpellShopApi.addToStore({ storeId: this.state.storeId }).then((data) => {
                    if (!this.props.propReload) {
                        //不是首页刷新当前页面
                        this._loadPageData();
                    }
                    //刷新首页
                    spellStatusModel.getUser(2);
                    this.$loadingDismiss();
                }).catch((error) => {
                    this.$toastShow(error.msg);
                    this.$loadingDismiss();
                });
            },
            alignType: 'left'
        });
    };

    //退出店铺
    _quitStore = () => {
        this.$loadingShow();
        SpellShopApi.quitStore({ storeId: this.state.storeId }).then((data) => {
            if (!this.props.propReload) {
                //不是首页刷新当前页面
                this._loadPageData();
            }
            //刷新首页
            spellStatusModel.getUser(2);
            this.$loadingDismiss();
        }).catch((error) => {
            this.$toastShow(error.msg);
            this.$loadingDismiss();
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
                <ConfirmAlert ref="delAlert"/>

                <CommShareModal ref={(ref) => this.shareModal = ref}
                                type={'Image'}
                                imageJson={{
                                    imageUrlStr: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1539577593172&di=c87eead9eb2e2073b50758daf6194c62&imgtype=0&src=http%3A%2F%2Fi2.hdslb.com%2Fbfs%2Farchive%2F59c914525c484566292f8d8d3d29c964ca59c7ca.jpg',
                                    titleStr: '商品标题',
                                    priceStr: '¥100.00',
                                    QRCodeStr: '分享的链接'
                                }}
                                webJson={{
                                    title: '分享标题(当为图文分享时候使用)',
                                    dec: '内容(当为图文分享时候使用)',
                                    linkUrl: '(图文分享下的链接)',
                                    thumImage: '(分享图标小图(http链接)图文分享使用)'
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
