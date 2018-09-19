import React from 'react';
import {
    NativeModules,
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity
} from 'react-native';
import BasePage from '../../../../BasePage';
import { RefreshList } from '../../../../components/ui';
import AccountItem from '../../components/AccountItem';
import { color } from '../../../../constants/Theme';
import ScreenUtils from '../../../../utils/ScreenUtils';
import registeredImg from '../../res/userInfoImg/list_icon_zhucei.png';
import activityPresent from '../../res/userInfoImg/list_icon_hedong.png';
import xiaofei from '../../res/userInfoImg/list_icon_xiaofe.png';
import consumePointPage from '../../res/userInfoImg/consumePointPage.png';
import DataUtils from '../../../../utils/DateUtils';
import user from '../../../../model/user';
import MineApi from '../../api/MineApi';
import Toast from '../../../../utils/bridge' ;

export default class MyIntegralAccountPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            id: user.id,
            phone: '',
            pwd: '',
            thirdType: 1,
            passwordDis: false,
            phoneError: false,
            passwordError: false,
            viewData: [
                {
                    type: '秀豆消费',

                    time: '2018-05-25 12:15:45',
                    serialNumber: '流水号：123456787653234567',
                    capital: '-200',
                    iconImage: xiaofei,
                    capitalRed: true


                },
                {
                    type: '秀豆消费',

                    time: '2018-05-25 12:15:45',
                    serialNumber: '流水号：123456787653234567',
                    capital: '-200',
                    iconImage: xiaofei,
                    capitalRed: true
                }


            ],
            restMoney: this.params.userScore,

            blockMoney: 256.00,
            currentPage: 1,
            isEmpty: false
        };
    }

    $navigationBarOptions = {
        title: '秀豆账户',

        show: true // false则隐藏导航
    };

    //**********************************ViewPart******************************************
    _render() {
        return (
            <View style={styles.mainContainer}>
                {this.renderHeader()}
                <RefreshList
                    ListFooterComponent={this.renderFootder}
                    data={this.state.viewData}
                    renderItem={this.renderItem}
                    onRefresh={this.onRefresh}
                    onLoadMore={this.onLoadMore}
                    extraData={this.state}
                    isEmpty={this.state.isEmpty}
                    emptyTip={'暂无数据！'}
                />
            </View>
        );
    }

    renderHeader = () => {
        return (
            <View style={styles.container}>
                <Image style={styles.imageBackgroundStyle} source={consumePointPage}/>
                <View style={styles.viewStyle}>
                    <Text style={{
                        marginLeft: 25,
                        marginTop: 15,
                        fontSize: 13,
                        color: color.white,
                        fontFamily: 'PingFangSC-Light'
                    }}>秀豆账户</Text>
                    <Text style={{
                        marginLeft: 25,
                        fontSize: 25,
                        marginTop: 10,
                        color: color.white
                    }}>{this.state.restMoney}</Text>

                </View>
            </View>

        );
    };
    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity>
                <AccountItem
                    type={item.type}
                    time={item.time}
                    serialNumber={item.serialNumber}
                    capital={item.capital}
                    iconImage={item.iconImage}
                    clickItem={() => {
                        this.clickItem(index);
                    }}
                    capitalRed={item.capitalRed}
                />
            </TouchableOpacity>
        );
    };
    renderLine = () => {
        return (
            <View style={{ height: 1, backgroundColor: color.line, marginLeft: 48, marginRight: 48 }}/>

        );
    };

    //**********************************BusinessPart******************************************
    componentDidMount() {

        this.getDataFromNetwork();
    }

    clickItem = (index) => {
        // alert(index);
    };
    getDataFromNetwork = () => {
        let use_type = ['', '注册赠送', '活动赠送', '秀豆消费'];

        let use_type_symbol = ['', '+', '+', '-'];
        let use_let_img = ['', registeredImg, activityPresent, xiaofei];
        Toast.showLoading();
        MineApi.userScoreQuery({
            page: 1,
            size: 20

        }).then((response) => {
            Toast.hiddenLoading();
            console.log(response);
            if (response.code == 10000) {
                let data = response.data;
                let arrData = this.state.currentPage === 1 ? [] : this.state.viewData;
                data.data.map((item, index) => {
                    arrData.push({
                        type: use_type[item.useType],
                        time: DataUtils.getFormatDate(item.createTime / 1000),
                        serialNumber: '',
                        capital: use_type_symbol[item.useType] + item.userScore,
                        iconImage: use_let_img[item.useType],
                        capitalRed: use_type_symbol[item.useType] === '-'


                    });
                });
                this.setState({ viewData: arrData, isEmpty: data.data && data.data.length !== 0 ? false : true });
            } else {
                NativeModules.commModule.toast(response.msg);
            }
        }).catch(e => {
            Toast.hiddenLoading();
        });
    };
    onRefresh = () => {
        this.setState({
            currentPage: 1
        });
        this.getDataFromNetwork();
    };
    onLoadMore = () => {
        this.setState({
            currentPage: this.state.currentPage + 1
        });
        this.getDataFromNetwork();
    };
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, backgroundColor: color.page_background
    },
    container: {}, imageBackgroundStyle: {
        position: 'absolute',
        height: 95,

        width: ScreenUtils.width - 30,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 15
    }, rectangleStyle: {
        width: 100,
        height: 44,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: color.white,
        marginRight: 15,
        justifyContent: 'center',
        marginTop: 20,
        alignItems: 'center'
    }, viewStyle: {
        height: 95,

        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 15
    }
});


