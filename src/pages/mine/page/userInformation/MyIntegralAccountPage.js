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
import { observer } from 'mobx-react/native';

@observer
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
            viewData: [],
            blockMoney: 0.00,
            currentPage: 1,
            isEmpty: false
        };
        this.currentPage = 0;
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
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginRight: 15
                }}>
                    <View style={styles.viewStyle}>
                        <Text style={{
                            marginLeft: 25,
                            marginTop: 15,
                            fontSize: 13,
                            color: color.white
                        }}>秀豆账户(枚)</Text>
                        <Text style={{
                            marginLeft: 25,
                            fontSize: 25,
                            marginTop: 10,
                            color: color.white
                        }}>{user.userScore}</Text>
                    </View>
                    <TouchableOpacity style={styles.rectangleStyle} onPress={() => {
                        this.$navigate('home/signIn/SignInPage');
                    }}>
                        <Text style={{ fontSize: 15, color: color.white }}>兑换1元现金券</Text>
                    </TouchableOpacity>
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
        let use_type = ['', '注册赠送', '活动赠送', '秀豆消费', '1元券兑换', '签到'];

        let use_type_symbol = ['', '+', '+', '-', '-', '+'];
        let use_let_img = ['', registeredImg, activityPresent, xiaofei, xiaofei, activityPresent];
        let arrData = this.currentPage === 1 ? [] : this.state.viewData;
        Toast.showLoading();
        MineApi.userScoreQuery({
            page: this.currentPage,
            size: 20

        }).then((response) => {
            Toast.hiddenLoading();
            console.log(response);
            if (response.code == 10000) {
                let data = response.data;
                data.data.map((item, index) => {
                    arrData.push({
                        type: use_type[item.useType],
                        time: DataUtils.getFormatDate(item.createTime / 1000),
                        serialNumber: item.serialNo,
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
            this.setState({ viewData: arrData, isEmpty: true });

        });
    };
    onRefresh = () => {
        this.currentPage = 1;
        MineApi.getUser().then(res => {
            let data = res.data;
            user.saveUserInfo(data);
        }).catch(err => {
            if (err.code === 10009) {
                this.props.navigation.navigate('login/login/LoginPage');
            }
        });
        this.getDataFromNetwork();
    };
    onLoadMore = () => {
        this.currentPage++;
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
        width: 120,
        height: 44,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: color.white,
        marginLeft: 15,
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3
    }, viewStyle: {
        height: 95,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 15
    }
});


