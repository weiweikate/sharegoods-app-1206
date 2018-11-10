//拼店tab页面
import React from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import BasePage from '../../BasePage';

import { observer } from 'mobx-react';
import SpellStatusModel from './model/SpellStatusModel';
import RecommendPage from './recommendSearch/RecommendPage';
import MyShop_RecruitPage from './MyShop_RecruitPage';
import NoAccessPage from './NoAccessPage';

@observer
export default class SpellShopPage extends BasePage {
    constructor(props) {
        super(props);
    }

    $navigationBarOptions = {
        show: false
    };

    $getPageStateOptions = () => {
        return {
            loadingState: SpellStatusModel.loadingState,
            netFailedProps: {
                netFailedInfo: SpellStatusModel.netFailedInfo,
                reloadBtnClick: () => {
                    SpellStatusModel.getUser(2);
                }
            }
        };
    };
    _renderContainer = () => {
        //加入了店铺&&店铺状态不为关闭 1正常,2缴纳,3招募中
        if (SpellStatusModel.storeId && SpellStatusModel.storeStatus && SpellStatusModel.storeStatus !== 0) {
            return (<MyShop_RecruitPage navigation={this.props.navigation}/>);
        } else if (SpellStatusModel.canSeeGroupStore) {
            // 能看见推荐店铺页面
            return (<RecommendPage navigation={this.props.navigation} leftNavItemHidden={true}/>);
        } else {
            // 初始化的介绍页面
            return (
                <NoAccessPage navigation={this.props.navigation} leftNavItemHidden={true}/>
            );
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

