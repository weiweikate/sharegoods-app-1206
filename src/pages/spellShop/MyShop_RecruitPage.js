import React from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Image,
    RefreshControl
} from 'react-native';

import BasePage from '../../BasePage';

import { observer } from 'mobx-react';
import MyShopPage from './myShop/MyShopPage';
import ShopRecruitPage from './shopRecruit/ShopRecruitPage';
import RecommendPage from './recommendSearch/RecommendPage';
import SpellShopApi from './api/SpellShopApi';
import { PageLoadingState } from '../../components/pageDecorator/PageState';
import spellStatusModel from './model/SpellStatusModel';
import IntroduceImg from './src/hhk_03.png';
import IntroduceImg1 from './src/hhk_031.png';
import NavigatorBar from '../../components/pageDecorator/NavigatorBar/NavigatorBar';
import ScreenUtils from '../../utils/ScreenUtils';

@observer
export default class MyShop_RecruitPage extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            loadingState: PageLoadingState.loading,
            netFailedInfo: {},
            data: {}
        };
    }

    $navigationBarOptions = {
        show: false
    };

    $getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: () => {
                    this._loadPageData();
                }
            }
        };
    };

    componentDidMount() {
        this._loadPageData();
    }

    _loadPageData = () => {
        //店铺信息   首页搜索和推荐过来的this.params.storeId
        SpellShopApi.getById({ id: this.params.storeId }).then((data) => {
            this.state.login = true;
            let dataTemp = data.data || {};
            this.setState({
                loadingState: PageLoadingState.success,
                data: dataTemp
            });
        }).catch((error) => {
            if (error.code === 10009) {
                this.state.login = false;
            } else {
                this.state.login = true;
            }
            this.setState({
                loadingState: error.code === 10009 ? PageLoadingState.success : PageLoadingState.fail,
                netFailedInfo: error
            });
        });
    };

    _renderContainer = () => {
        const { status, myStore } = this.state.data;
        if (this.params.storeId ? spellStatusModel.canSeeGroupStore && this.state.login : this.state.login) {
            //首页搜索和推荐过来的this.params.storeId
            switch (status) {
                case 0:
                case 1://店铺开启中
                    return <MyShopPage navigation={this.props.navigation}
                                       leftNavItemHidden={!this.params.storeId}
                                       storeId={this.params.storeId}
                                       propReload={myStore && this._loadPageData}/>;
                case 3://招募中的店铺
                    return <ShopRecruitPage navigation={this.props.navigation}
                                            leftNavItemHidden={!this.params.storeId}
                                            storeId={this.params.storeId}
                                            propReload={myStore && this._loadPageData}/>;
                case 2://店铺已缴纳保证金
                    return (
                        <RecommendPage navigation={this.props.navigation} leftNavItemHidden={!this.params.storeId}/>);
                default:
                    return (
                        <RecommendPage navigation={this.props.navigation} leftNavItemHidden={!this.params.storeId}/>);

            }
        } else {
            return <View>
                <NavigatorBar title={'拼店'} leftPressed={() => {
                    this.$navigateBack();
                }
                }/>
                <ScrollView refreshControl={<RefreshControl refreshing={spellStatusModel.refreshing}
                                                            onRefresh={this._onRefresh}/>}
                            showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1 }}>
                        <Image style={styles.levelLow} source={IntroduceImg} resizeMode='stretch'/>
                        <Image style={styles.levelLow1} source={IntroduceImg1} resizeMode='stretch'/>
                    </View>
                </ScrollView>
            </View>;
        }

    };

    _render() {
        return (
            <View style={styles.container}>
                {this._renderContainer()}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    levelLow: {
        width: ScreenUtils.width,
        height: ScreenUtils.height - ScreenUtils.headerHeight
    },
    levelLow1: {
        position: 'absolute',
        marginTop: ScreenUtils.isIOSX ? ScreenUtils.autoSizeHeight(78 + 60) : ScreenUtils.autoSizeHeight(78),
        width: ScreenUtils.autoSizeWidth(375 - 59 * 2),
        height: ScreenUtils.autoSizeWidth(257),
        alignSelf: 'center'
    }
});

