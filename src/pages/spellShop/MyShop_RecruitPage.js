import React from 'react';
import {
    View,
    StyleSheet
} from 'react-native';

import BasePage from '../../BasePage';

import { observer } from 'mobx-react';
import MyShopPage from './myShop/MyShopPage';
import ShopRecruitPage from './shopRecruit/ShopRecruitPage';
import SpellShopApi from './api/SpellShopApi';
import StringUtils from '../../utils/StringUtils';
import { PageLoadingState } from '../../components/pageDecorator/PageState';

@observer
export default class MyShop_RecruitPage extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            loadingState: PageLoadingState.loading,
            netFailedInfo: {},
            status: null
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
        //店铺信息   搜索和推荐过来的this.params.storeId  首页直接展示的this.props.storeId
        SpellShopApi.getById({ id: this.params.storeId || this.props.storeId }).then((data) => {
            let dataTemp = data.data || {};
            this.setState({
                loadingState: PageLoadingState.success,
                status: dataTemp.status
            });
        }).catch((error) => {
            this.setState({
                loadingState: PageLoadingState.fail,
                netFailedInfo: error
            });
        });
    };

    _renderContainer = () => {
        if (StringUtils.isEmpty(this.state.status)) {
            return null;
        }
        if (this.state.status === 3) {
            return <ShopRecruitPage navigation={this.props.navigation}
                                    storeId={this.props.storeId}
                                    leftNavItemHidden={this.props.leftNavItemHidden}
                                    propReload={this.props.isHome && this._loadPageData}/>;
        } else {
            return <MyShopPage navigation={this.props.navigation}
                               storeId={this.props.storeId}
                               leftNavItemHidden={this.props.leftNavItemHidden}
                               propReload={this.props.isHome && this._loadPageData}/>;
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
    }
});

