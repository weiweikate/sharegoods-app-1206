/**
 * @author 陈阳君
 * @date on 2019/09/24
 * @describe
 * @org 秀购
 * @email chenyangjun@meeruu.com
 */

import React from 'react';
import { View } from 'react-native';
import BasePage from '../../BasePage';
import spellStatusModel from './SpellStatusModel';
import MyShop_RecruitPage from '../spellShop/MyShop_RecruitPage';
import MyShop_RecruitPageNew from './MyShop_RecruitPage';
import { observer } from 'mobx-react';
import { PageLoadingState } from '../../components/pageDecorator/PageState';

@observer
export default class IsShowNewStore extends BasePage {

    $navigationBarOptions = {
        show: false
    };

    state = {
        loadingState: PageLoadingState.loading,
        netFailedInfo: {}
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
        this.willFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                const { state } = payload;
                console.log('willFocus', state);
                this._loadPageData();
            }
        );
    }

    _loadPageData = () => {
        spellStatusModel.requestShow().then(() => {
            this.setState({
                loadingState: PageLoadingState.success
            });
        }).catch((e) => {
            this.setState({
                loadingState: PageLoadingState.fail,
                netFailedInfo: e
            });
        });
    };


    componentWillUnmount() {
        this.willFocusSubscription && this.willFocusSubscription.remove();
    }

    _render() {
        return (
            <View style={{ flex: 1 }}>
                {
                    spellStatusModel.showNewStore ? <MyShop_RecruitPageNew navigation={this.props.navigation}/> :
                        <MyShop_RecruitPage navigation={this.props.navigation}/>
                }
            </View>
        );
    }
}
