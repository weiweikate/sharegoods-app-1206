import React from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';

import BasePage from '../../BasePage';

import { observer } from 'mobx-react';
import MyShopPage from './myShop/MyShopPage';
import ShopRecruitPage from './shopRecruit/ShopRecruitPage';
import RecommendPage from './recommendSearch/RecommendPage';
import SpellShopApi from './api/SpellShopApi';
import { PageLoadingState ,renderViewByLoadingState} from '../../components/pageDecorator/PageState';
import spellStatusModel from './model/SpellStatusModel';
import NoAccessPage from './NoAccessPage';
import NavigatorBar from '../../components/pageDecorator/NavigatorBar'

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

    _getPageStateOptions = () => {
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
        let statust = this.params.storeId ? status : spellStatusModel.storeStatus;
        if (this.params.storeId ? spellStatusModel.canSeeGroupStore && this.state.login : this.state.login) {
            //首页搜索和推荐过来的this.params.storeId
            switch (statust) {
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
            return <NoAccessPage navigation={this.props.navigation}/>;
        }

    };

    _render() {
        let dic = this._getPageStateOptions();
        return (
            <View style={styles.container}>
                {dic.loadingState === PageLoadingState.fail ?
                    <NavigatorBar title={'店铺详情'} leftPressed={() => {
                        this.$navigateBack();
                    }} leftNavItemHidden={!this.params.storeId}/> : null}
                {renderViewByLoadingState(this._getPageStateOptions(),this._renderContainer)}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});

