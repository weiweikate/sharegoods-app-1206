/**
 * @author xzm
 * @date 2019/7/11
 */

import React from 'react';
import {
    // StyleSheet,
    View,
    requireNativeComponent
} from 'react-native';
import BasePage from '../../BasePage';
import ShowApi from './ShowApi';
import { PageLoadingState } from '../../components/pageDecorator/PageState';
const ShowVideoListView = requireNativeComponent('MrShowVideoListView');
export default class ShowVideoPage extends BasePage {
    $navigationBarOptions = {
        title: '',
        show: false
    };

    constructor(props) {
        super(props);
        this.state = {
            pageState: PageLoadingState.loading
        };

    }

    $getPageStateOptions = () => {
        return {
            loadingState: this.state.pageState
        };
    };

    componentDidMount() {
        ShowApi.getTagWithCode({ showNo: this.params.data.showNo }).then((data) => {
            this.params.data.showTags = data.data || [];
            this.setState({
                pageState: PageLoadingState.success
            });
        }).catch((error) => {
            this.setState({
                pageState: PageLoadingState.success
            });
        });
    }


    _render() {
        if (this.state.pageState === PageLoadingState.success) {
            return (
                <View style={{ flex: 1 }}>
                    <ShowVideoListView style={{ flex: 1 }}
                                       params={JSON.stringify(this.params.data)}/>
                </View>
            );
        } else {
            return <View/>;
        }
    }
}

// var styles = StyleSheet.create({});

