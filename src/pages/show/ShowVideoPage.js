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
import EmptyUtils from '../../utils/EmptyUtils';
import user from '../../model/user';
import RouterMap,{routeNavigate} from '../../navigation/RouterMap';
import { observer } from 'mobx-react';
import CommShareModal from '../../comm/components/CommShareModal';
import apiEnvironment from '../../api/ApiEnvironment';
import { trackEvent } from '../../utils/SensorsTrack';
import ShowListIndexModel from './model/ShowListIndexModel';
import ProductListModal from './components/ProductListModal';
const ShowVideoListView = requireNativeComponent('MrShowVideoListView');
@observer
export default class ShowVideoPage extends BasePage {
    $navigationBarOptions = {
        title: '',
        show: false
    };

    constructor(props) {
        super(props);
        this.data = {}
        this.state = {
            detail:null,
            pageState: PageLoadingState.loading,
            productModalVisible:false
        };

    }

    $getPageStateOptions = () => {
        return {
            loadingState: this.state.pageState
        };
    };

    componentDidMount() {
        ShowApi.showDetail({ showNo: this.params.data.showNo }).then((data) => {
            this.data = data.data || {};
            this.setState({
                pageState: PageLoadingState.success
            });
        }).catch((error) => {
            this.setState({
                pageState: PageLoadingState.fail
            });
        });
    }


    _render() {
        if (this.state.pageState === PageLoadingState.success) {
            const {detail } = this.state;

            return (
                <View style={{ flex: 1 }}>
                    <ShowVideoListView style={{ flex: 1 }}
                                       onAttentionPress={()=>{
                                           if(user.isLogin){

                                           }else {
                                               routeNavigate(RouterMap.LoginPage);
                                           }
                                       }}
                                       userCode={user.code}
                                       onBack={()=>{
                                           this.$navigateBack(1);
                                       }}
                                       onPressTag={({nativeEvent})=>{
                                           this.$navigate(RouterMap.TagDetailPage, nativeEvent);
                                       }}
                                       onSharePress={({nativeEvent})=>{
                                           this.setState({ detail: null }, () => {
                                               this.setState({
                                                   detail:nativeEvent
                                               }, () => {
                                                   this.shareModal && this.shareModal.open();
                                               });
                                           });
                                       }}
                                       onBuy={({nativeEvent})=>{
                                           this.setState({ detail: null }, () => {
                                               this.setState({
                                                   detail:nativeEvent,
                                                   productModalVisible:true
                                               });
                                           });
                                       }}
                                       onDownloadPress={({nativeEvent})=>{
                                       }}
                                       onCollectPress={({nativeEvent})=>{
                                           alert(JSON.stringify(nativeEvent))
                                           if(user.isLogin){
                                               if(!nativeEvent.collect){
                                                   ShowApi.reduceCountByType({showNo:nativeEvent.showNo,type:2}).then(()=>{

                                                   }).catch(()=>{

                                                   })
                                               }else {
                                                   ShowApi.incrCountByType({showNo:nativeEvent.showNo,type:2}).then(()=>{

                                                   }).catch(()=>{

                                                   })
                                               }
                                           }else {
                                               routeNavigate(RouterMap.LoginPage);
                                           }
                                       }}
                                       onLikePress={({nativeEvent})=>{
                                       }}

                                       isLogin={!EmptyUtils.isEmpty(user.token)}
                                       params={this.data}/>
                    {detail ?
                        <CommShareModal ref={(ref) => this.shareModal = ref}
                                        type={'Show'}
                                        trackEvent={trackEvent.XiuChangShareClick}
                                        trackParmas={{
                                            articleCode: detail.code,
                                            author: (detail.userInfoVO || {}).userNo,
                                            xiuChangBtnLocation: '1',
                                            xiuChangListType: ShowListIndexModel.pageIndex + 1
                                        }}
                                        imageJson={{
                                            imageType: 'show',
                                            imageUrlStr: detail.resource[0] ? detail.resource[0].url : '',
                                            titleStr: detail.showType === 1 ? detail.content : detail.title,
                                            QRCodeStr: `${apiEnvironment.getCurrentH5Url()}/discover/newDetail/${detail.showNo}?upuserid=${user.code || ''}`,
                                            headerImage: (detail.userInfoVO && detail.userInfoVO.userImg) ? detail.userInfoVO.userImg : null,
                                            userName: (detail.userInfoVO && detail.userInfoVO.userName) ? detail.userInfoVO.userName : '',
                                            dec: '好物不独享，内有惊喜福利~'
                                        }}
                                        taskShareParams={{
                                            uri: `${apiEnvironment.getCurrentH5Url()}/discover/newDetail/${detail.showNo}?upuserid=${user.code || ''}`,
                                            code: detail.showType === 1 ? 22 : 25,
                                            data: detail.showNo
                                        }}
                                        webJson={{
                                            title: detail.title || '秀一秀 赚到够',//分享标题(当为图文分享时候使用)
                                            linkUrl: `${apiEnvironment.getCurrentH5Url()}/discover/newDetail/${detail.showNo}?upuserid=${user.code || ''}`,//(图文分享下的链接)
                                            thumImage: detail.resource && detail.resource[0] && detail.resource[0].url
                                                ? detail.resource[0].url : '',//(分享图标小图(https链接)图文分享使用)
                                            dec: '好物不独享，内有惊喜福利~'
                                        }}
                        /> : null}
                    {(detail&&detail.products) ? <ProductListModal visible={this.state.productModalVisible}
                                                         pressProduct={(prodCode) => {
                                                             this.setState({
                                                                 productModalVisible: false
                                                             });
                                                             this.$navigate(RouterMap.ProductDetailPage, {
                                                                 productCode: prodCode,
                                                                 trackType: 3,
                                                                 trackCode: detail.showNo
                                                             });
                                                         }}
                                                         addCart={this.addCart}
                                                         products={detail.products} requestClose={() => {
                        this.setState({
                            productModalVisible: false
                        });
                    }}/> : null}
                </View>
            );
        } else {
            return <View/>;
        }
    }
}

// var styles = StyleSheet.create({});

