import React from 'react';
import {
    View,
    StyleSheet
} from 'react-native';

import BasePage from '../../BasePage';

import { observer } from 'mobx-react';
import StoreModel from './model/StoreModel';
import MyShopPage from './myShop/MyShopPage';
import ShopRecruitPage from './shopRecruit/ShopRecruitPage';
import SpellStatusModel from './model/SpellStatusModel';

@observer
export default class MyShop_RecruitPage extends BasePage {

    constructor(props) {
        super(props);
    }

    $navigationBarOptions = {
        show: false
    };

    $getPageStateOptions = () => {
        return {
            loadingState: StoreModel.loadingState,
            netFailedProps: {
                netFailedInfo: StoreModel.netFailedInfo,
                reloadBtnClick: () => {
                    this._loadPageData();
                }
            },
            // emptyProps: {
            //     isScrollViewContainer: true,
            //     description: '暂无拼店消息'
            // }
        };
    };

    componentDidMount() {
        this._loadPageData();
    }

    _loadPageData = () => {
        StoreModel.getById(2, this.params.id || SpellStatusModel.storeId);
    };


    _renderContainer = () => {
        if (StoreModel.status === 3) {
            return <ShopRecruitPage navigation={this.props.navigation} leftNavItemHidden = {true}/>;
        } else {
            return <MyShopPage navigation={this.props.navigation} leftNavItemHidden = {true}/>;
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
        flex: 1,
    }
});

