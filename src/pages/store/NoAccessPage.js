import React, { Component } from 'react';
import {
    View, ScrollView,
    RefreshControl
} from 'react-native';
import SpellStatusModel from './SpellStatusModel';
import NavigatorBar from '../../components/pageDecorator/NavigatorBar/NavigatorBar';
import DesignRule from '../../constants/DesignRule';
import HomeAPI from '../home/api/HomeAPI';
import { homeLinkType, homeType } from '../home/HomeTypes';
import HtmlPage from '../../components/web/HtmlView';
import { BannersVerticalView } from '../../comm/components/BannersVerticalView';

export default class NoAccessPage extends Component {

    state = {
        bannerList: [],
        uri: null
    };

    componentDidMount() {
        this.fetchStore28();

        this.willFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                const { state } = payload;
                console.log('willFocus', state);
                this.fetchStore28();
            }
        );
    }

    componentWillUnmount() {
        this.willFocusSubscription && this.willFocusSubscription.remove();
    }

    fetchStore28 = () => {
        HomeAPI.getHomeData({ type: homeType.store28 }).then((data) => {
            const dataTemp = data.data || [];
            //有自定义专题显示自定义专题
            let uri = null;
            for (const item of dataTemp) {
                const { linkType, linkTypeCode } = item;
                if (linkType === homeLinkType.showHtml) {
                    uri = linkTypeCode;
                    break;
                }
            }
            this.setState({
                bannerList: dataTemp,
                uri: uri
            });
        });
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <NavigatorBar leftNavItemHidden={true}
                              title={'拼店'}/>
                {this.state.uri ?
                    <HtmlPage params={{ uri: this.state.uri, unShow: true }}
                              navigation={this.props.navigation}/>
                    :
                    <ScrollView showsVerticalScrollIndicator={false}
                                refreshControl={<RefreshControl title="下拉刷新"
                                                                tintColor={DesignRule.textColor_instruction}
                                                                titleColor={DesignRule.textColor_instruction}
                                                                refreshing={false}
                                                                colors={[DesignRule.mainColor]}
                                                                onRefresh={() => {
                                                                    this.fetchStore28();
                                                                    SpellStatusModel.requestHome();
                                                                }}/>}>
                        <BannersVerticalView bannerList={this.state.bannerList}/>
                    </ScrollView>}
            </View>
        );
    }
}
