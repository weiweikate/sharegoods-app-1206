import React from 'react';
import {
    NativeModules,
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';
import BasePage from '../../../BasePage';
import {
    UIText, UIImage
} from '../../../components/ui';
import { color } from '../../../constants/Theme';
import StringUtils from '../../../utils/StringUtils';
import ScreenUtils from '../../../utils/ScreenUtils';
import {RefreshList} from '../../../components/ui';
import logisticsTop from '../res/logisticsTop.png';
import logisticsBottom from '../res/logisticsBottom.png';
import copy from '../res/copy.png';
import logisticsIcon from '../res/logisticsIcon.png';
import LogisticsDetailItem from '../components/LogisticsDetailItem';
// import tryIcon from '../res/car.png';
import Nowuliu from '../res/no_wuliu.png';
import Toast from '../../../utils/bridge';
import OrderApi from '../api/orderApi';

// import {PageLoadingState} from 'PageState';

class LogisticsDetailsPage extends BasePage {

    $getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: this._reload
            }
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            orderId: this.params.orderId ? this.params.orderId : 0,
            expressNo: this.params.expressNo ? this.params.expressNo : '',
            expressName: '',
            loadingState: 'loading',
            flags:false,
            viewData: []
        };
    }

    $navigationBarOptions = {
        title: '物流详情',
        show: true// false则隐藏导航
    };
    //**********************************ViewPart******************************************
    renderLogisticsNumber = () => {
        return (
            <TouchableOpacity style={styles.logisticsNumber} onPress={() => this.copyToClipboard()}>
                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                    <UIText value={this.state.expressName + '：' + this.state.expressNo}
                            style={{ color: color.yellow_FF7, marginLeft: 18 }}/>
                    <UIImage source={copy} style={{ height: 17, width: 17, marginRight: 15 }}/>
                </View>
            </TouchableOpacity>
        );
    };
    renderBaiShiHuiTong = () => {
        return (
            <View>
                <View style={{ position: 'absolute', width: ScreenUtils.width, marginTop: 8 }}>
                    <Image source={logisticsTop} style={{
                        resizeMode: 'stretch',
                        width: ScreenUtils.width - 20,
                        marginLeft: 10,
                        marginRight: 10
                    }}/>
                </View>
                <View style={{ flexDirection: 'row', paddingLeft: 15, height: 60, paddingTop: 5 }}>
                    <UIImage source={logisticsIcon} style={{ width: 20, height: 23, marginLeft: 10, marginTop: 15 }}/>
                    <Text style={{ fontSize: 13, color: color.black_222, marginTop: 15, marginLeft: 15 }}>本数据由</Text>
                    <Text style={{ fontSize: 13, color: color.deliveryIncludeBlue, marginTop: 15 }}>百世汇通</Text>
                    <Text style={{ fontSize: 13, color: color.black_222, marginTop: 15 }}>提供</Text>
                </View>

            </View>
        );
    };
    renderFootder = () => {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <UIImage source={logisticsBottom}
                         style={{ width: ScreenUtils.width - 20, resizeMode: 'contain', marginTop: -2 }}/>
            </View>

        );
    };
    renderHeader = () => {
        return (
            <View>

                {this.renderBaiShiHuiTong()}
            </View>
        );
    };
    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={{ elevation: 2, backgroundColor: color.white, marginLeft: 15, marginRight: 15 }}>
                <LogisticsDetailItem
                    time={item.time}
                    middleImage={item.middleImage}
                    title={item.title}
                    content1={item.content1}
                    content2={item.content2}
                    content3={item.content3}
                    isTop={index === 0}
                    isBottom={index + 1 === this.state.viewData.length}
                />
            </TouchableOpacity>
        );
    };

    _render() {
        return (
            <View style={styles.container}>
                {this.state.flags|| StringUtils.isEmpty(this.state.expressNo)?
                    this.renderEmpty() : this.renderSuccess()}
            </View>
        );
    }
    renderEmpty(){
        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Image source={Nowuliu} style={{width:92,height:61}}/>
                <Text style={{color:'#909090',fontSize:15,marginTop:25}}>暂无物流信息</Text>
            </View>
        )
    }
    renderSuccess(){
        return(
            <View style={styles.container}>
            {this.renderLogisticsNumber()}
        <RefreshList
            ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFootder}
            data={this.state.viewData}
            renderItem={this.renderItem}
            onRefresh={this.onRefresh}
            onLoadMore={this.onLoadMore}
            extraData={this.state}
            isEmpty={this.state.isEmpty}
            emptyTip={'暂无数据'}
        />
            </View>
        )
    }

    renderLine = () => {
        return (
            <View style={{ height: 1, backgroundColor: color.line, marginLeft: 48, marginRight: 48 }}/>
        );
    };

    componentDidMount(){
        this.loadPageData()
    }
    //**********************************BusinessPart******************************************
    loadPageData() {
        console.log(this.params);
        if(StringUtils.isNoEmpty(this.state.expressNo)){
            Toast.showLoading();
            OrderApi.findLogisticsDetail({ expNum: this.state.expressNo }).then((response) => {
                Toast.hiddenLoading();
                console.log(response);
                let arrData = [];
                if (!response.data.showapi_res_body.flag) {
                    // NativeModules.commModule.toast('查询出错');
                    this.setState({
                        flags:true,
                        loadingState: 'success'
                    })
                    // this.setState({
                    //     loadingState: 'fail'
                    // });
                    return;
                }
                response.data.showapi_res_body.data.map((item, index) => {
                    let time = item.time;
                    arrData.push({
                        time: time.replace(' ', '\n'),
                        content1: item.context
                    });
                });
                this.setState({
                    expressName: response.data.showapi_res_body.expTextName,
                    viewData: arrData,
                    loadingState: 'success'
                });
            }).catch(e => {
                Toast.hiddenLoading();
                this.$toastShow(e.msg)
                this.setState({
                    loadingState: 'fail'
                });
            });
        }else{
            this.setState({loadingState: 'success'})
        }

    }

    copyToClipboard = () => {
        StringUtils.clipboardSetString(this.state.expressNo);
        NativeModules.commModule.toast('快递单号已复制到剪切板');
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: color.page_background
    }, logisticsNumber: {
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        backgroundColor: color.white,
        borderWidth: 1,
        borderRadius: 10,
        height: 48,
        borderColor: color.white,
        elevation: 2,
        justifyContent: 'center'
    }
});

export default LogisticsDetailsPage;
