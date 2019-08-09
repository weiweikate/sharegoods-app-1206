/**
 * @author xzm
 * @date 2019/7/11
 */

import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    requireNativeComponent
} from 'react-native';
import BasePage from '../../BasePage';
import ShowApi from './ShowApi';
import { PageLoadingState } from '../../components/pageDecorator/PageState';
import EmptyUtils from '../../utils/EmptyUtils';
import user from '../../model/user';
import RouterMap, { routeNavigate, routePop } from '../../navigation/RouterMap';
import { observer } from 'mobx-react';
import apiEnvironment from '../../api/ApiEnvironment';
import { trackEvent } from '../../utils/SensorsTrack';
import ProductListModal from './components/ProductListModal';
import WhiteModel from './model/WhiteModel';
import DesignRule from '../../constants/DesignRule';
import res from './res';
import ScreenUtils from '../../utils/ScreenUtils';
import NetFailedView from '../../components/pageDecorator/BaseView/NetFailedView';
import ShareUtil from '../../utils/ShareUtil';
import CommShowShareModal from '../../comm/components/CommShowShareModal';
import ShowUtils from './utils/ShowUtils';
import DownloadUtils from './utils/DownloadUtils';
const {px2dp} = ScreenUtils;
const ShowVideoListView = requireNativeComponent('MrShowVideoListView');
@observer
export default class ShowVideoPage extends BasePage {
    $navigationBarOptions = {
        title: '',
        show: false
    };

    constructor(props) {
        super(props);
        this.data = {};
        this.state = {
            detail: null,
            pageState: PageLoadingState.loading,
            productModalVisible: false,
            errorMsg:'网络错误'

        };

    }

    _renderNormalTitle() {
        return (
            <View style={styles.navTitle}>
                <TouchableOpacity style={styles.backView} onPress={() => routePop()}>
                    <Image source={res.back}/>
                </TouchableOpacity>
            </View>
        );
    }

    componentDidMount() {
        ShowApi.showDetail({ showNo: this.params.code }).then((data) => {
            this.data = data.data || {};
            if(this.params.isPersonal){
                this.data.isPersonal = this.params.isPersonal;
                this.data.isCollect = this.params.isCollect;
            }else {
                this.data.isPersonal = false;
            }

            if(this.params.tabType){
                this.data.tabType = this.params.tabType + '';
            }
            this.setState({
                pageState: PageLoadingState.success
            });
        }).catch((error) => {
            this.setState({
                pageState: PageLoadingState.fail,
                errorMsg:error.msg
            });
        });
    }

    _render() {
        const { pageState } = this.state;
        if (pageState === PageLoadingState.fail) {
            return <View style={styles.container}>
                <NetFailedView netFailedInfo={{ msg: this.state.errorMsg }}/>
                {this._renderNormalTitle()}
            </View>;
        }
        if (pageState === PageLoadingState.loading) {
            return <View style={styles.container}>
                {this._renderNormalTitle()}
            </View>;
        }

        if (pageState === PageLoadingState.success) {
            const { detail } = this.state;

            return (
                <View style={{ flex: 1 }}>
                    <ShowVideoListView style={{ flex: 1 }}
                                       onAttentionPress={({nativeEvent}) => {
                                           if (user.isLogin) {
                                               ShowApi.userFollow({userNo:nativeEvent.userInfoVO.userNo}).then().catch();
                                           } else {
                                               routeNavigate(RouterMap.LoginPage);
                                           }
                                       }}
                                       isPersonal={true}
                                       isCollect={false}
                                       userCode={user.code}
                                       onBack={() => {
                                           this.$navigateBack(1);
                                       }}
                                       onSeeUser={({nativeEvent})=>{
                                           let userNo = nativeEvent.userInfoVO.userNo;
                                           if(user.code === userNo){
                                               routeNavigate(RouterMap.MyDynamicPage, { userType: WhiteModel.userStatus === 2 ? 'mineWriter' : 'mineNormal' });
                                           }else {
                                               routeNavigate(RouterMap.MyDynamicPage,{userType:'others',userInfo:nativeEvent.userInfoVO});
                                           }
                                       }}
                                       onPressTag={({ nativeEvent }) => {
                                           this.$navigate(RouterMap.TagDetailPage, nativeEvent);
                                       }}
                                       onSharePress={({ nativeEvent }) => {
                                           this.setState({ detail: null }, () => {
                                               this.setState({
                                                   detail: nativeEvent
                                               }, () => {
                                                   this.shareModal && this.shareModal.open();
                                               });
                                           });
                                       }}
                                       onBuy={({ nativeEvent }) => {
                                           this.setState({ detail: null }, () => {
                                               this.setState({
                                                   detail: nativeEvent,
                                                   productModalVisible: true
                                               });
                                           });
                                       }}
                                       onDownloadPress={({ nativeEvent }) => {
                                           if (user.isLogin) {
                                               let callback=()=>{
                                                   ShowApi.incrCountByType({
                                                       showNo: nativeEvent.showNo,
                                                       type: 4
                                                   });
                                                   this.setState({ detail: null }, () => {
                                                       this.setState({
                                                           detail: nativeEvent
                                                       }, () => {
                                                           this.shareModal && this.shareModal.open();
                                                       });
                                                   });
                                               }
                                               DownloadUtils.downloadShow(nativeEvent,callback);
                                           } else {
                                               routeNavigate(RouterMap.LoginPage);
                                           }
                                       }}
                                       onCollection={({ nativeEvent }) => {
                                           if (user.isLogin) {
                                               if (!nativeEvent.collect) {
                                                   ShowApi.reduceCountByType({
                                                       showNo: nativeEvent.showNo,
                                                       type: 2
                                                   }).then(() => {

                                                   }).catch(() => {

                                                   });
                                               } else {
                                                   ShowApi.incrCountByType({
                                                       showNo: nativeEvent.showNo,
                                                       type: 2
                                                   }).then(() => {

                                                   }).catch(() => {

                                                   });
                                               }
                                           } else {
                                               routeNavigate(RouterMap.LoginPage);
                                           }
                                       }}
                                       onZanPress={({ nativeEvent }) => {
                                           if (!nativeEvent.like) {
                                               ShowApi.reduceCountByType({
                                                   showNo: nativeEvent.showNo,
                                                   type: 1
                                               }).then(() => {

                                               }).catch(() => {

                                               });
                                           } else {
                                               ShowApi.incrCountByType({
                                                   showNo: nativeEvent.showNo,
                                                   type: 1
                                               }).then(() => {

                                               }).catch(() => {

                                               });
                                           }
                                       }}

                                       isLogin={!EmptyUtils.isEmpty(user.token)}
                                       params={this.data}/>
                    {detail ?
                        <CommShowShareModal ref={(ref) => this.shareModal = ref}
                                            type={ShareUtil.showSharedetailDataType(detail && detail.showType)}
                                            trackEvent={trackEvent.XiuChangShareClick}
                                            trackParmas={{
                                                articleCode: detail.code,
                                                author: (detail.userInfoVO || {}).userNo,
                                                xiuChangBtnLocation: '2',
                                                xiuChangListType: ''
                                            }}
                                            imageJson={{
                                                imageType: 'show',
                                                imageUrlStr: ShowUtils.getCover(detail),
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
                                                thumImage:ShowUtils.getCover(detail),//(分享图标小图(https链接)图文分享使用)
                                                dec: '好物不独享，内有惊喜福利~'
                                            }}
                        /> : null}
                    {(detail && detail.products) ? <ProductListModal visible={this.state.productModalVisible}
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

var styles = StyleSheet.create({
    navTitle: {
        height: px2dp(44),
        width: ScreenUtils.width,
        flexDirection: 'row',
        alignItems: 'center',
        top: ScreenUtils.statusBarHeight,
        position: 'absolute',
        left: 0,
        backgroundColor: DesignRule.white
    },
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    backView: {
        width: px2dp(44),
        height: px2dp(44),
        alignItems: 'center',
        justifyContent: 'center'
    },
});

