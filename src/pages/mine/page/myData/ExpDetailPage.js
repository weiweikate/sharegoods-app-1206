import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableWithoutFeedback,
    Image
} from "react-native";
import { PageLoadingState, renderViewByLoadingState } from "../../../../components/pageDecorator/PageState";
import MineApi from "../../api/MineApi";
// 图片资源
import BasePage from "../../../../BasePage";
import { RefreshList} from "../../../../components/ui";
import ScreenUtils from "../../../../utils/ScreenUtils";
import DesignRule from "../../../../constants/DesignRule";
import AccountItem from '../../components/AccountItem';
import res from "../../res";
import user from "../../../../model/user";
import StringUtils from "../../../../utils/StringUtils";
const account_bg = res.bankCard.account_bg;
const account_bg_white = res.bankCard.account_bg_white;
const { px2dp } = ScreenUtils;

 const detailData ={
    1:{title:"邀请注册奖励",icon:res.myData.invite_icon},
    2:{title:"邀请注册奖励",icon:res.myData.invite_icon},
     3:{title:"交易奖励",icon:res.myData.trading_icon},
    4:{title:"交易奖励",icon:res.myData.trading_icon},
    5:{title:"交易奖励",icon:res.myData.trading_icon},
     6:{title:"交易奖励",icon:res.myData.trading_icon},
     7:{title:"交易奖励",icon:res.myData.trading_icon},
     8:{title:"交易奖励",icon:res.myData.trading_icon},
     9:{title:"签到奖励",icon:res.myData.signIn_icon},
     10:{title:"分享奖励",icon:res.myData.share_icon},
     11:{title:"分享奖励",icon:res.myData.share_icon},
     12:{title:"会员奖励",icon:res.myData.members_icon},
     13:{title:"交易奖励",icon:res.myData.trading_icon},
     14:{title:"交易奖励",icon:res.myData.trading_icon},
     15:{title:"其他",icon:res.myData.activity_icon},
     16:{title:"其他",icon:res.myData.activity_icon},
     17:{title:"秀购奖励",icon:res.myData.xiugou_present},
     18:{title:"秀购惩罚",icon:res.myData.xiugou_punishment},
     19:{title:"抽奖奖励",icon:res.myData.xiugou_reword},
     30:{title:"30天未登录扣除",icon:res.myData.xiugou_punishment},
     31:{title:"周交易额未达标扣除",icon:res.myData.xiugou_punishment},
 }
export default class ExpDetailPage extends BasePage{
    constructor(props){
        super(props);
        this.state = {
            id: user.code,
            viewData: [],
            experience: this.params.experience||0,
            levelExperience:this.params.levelExperience||0,
            isEmpty: false,
            loadingState: PageLoadingState.loading,
        };
        this.currentPage = 0;
    }

    $navigationBarOptions = {
        show: false, // false则隐藏导航
        title: "Exp明细"
    };
    $getPageStateOptions = () => {
        return {
            loadingState: this.state.loadingState,
            netFailedProps: {
                netFailedInfo: this.state.netFailedInfo,
                reloadBtnClick: this.getDataFromNetwork
            }
        };
    };
    componentDidMount(){
        this.getDataFromNetwork()
    }

    _render(){
        return(
            <View style={styles.container}>
                {renderViewByLoadingState(this.$getPageStateOptions(), this._renderContent)}
            </View>
        )
    }

    renderHeader = () => {
        return (
            <ImageBackground resizeMode={'stretch'} source={account_bg} style={styles.headerContainer}>
                <View style={styles.headerWrapper}>
                    <TouchableWithoutFeedback onPress={() => {
                        this.$navigateBack();
                    }}>
                        <Image source={res.button.white_back}/>
                    </TouchableWithoutFeedback>
                </View>
            </ImageBackground>
        );
    };

    _accountInfoRender() {
        const progress = this.state.experience / this.state.levelExperience;
        const marginLeft =  ScreenUtils.px2dp(315) * progress;
        return (
            <ImageBackground source={account_bg_white} resizeMode={'stretch'} style={{
                position: 'absolute',
                top: px2dp(80),
                height: px2dp(205),
                width:DesignRule.width,
                left: 0,
                paddingHorizontal: DesignRule.margin_page
            }}>

                <View style={styles.withdrawWrapper}>
                    <Text style={styles.countTextStyle}>
                        经验值（Exp）
                    </Text>
                </View>
                <Text style={{
                    color: DesignRule.textColor_mainTitle,
                    fontSize: 48,
                    marginLeft: DesignRule.margin_page,
                    marginTop: px2dp(15),
                }}>
                    {this.state.experience || 0}
                    <Text style={{
                        color: DesignRule.textColor_secondTitle,
                        fontSize: 25
                    }}>
                        /
                    </Text>
                    <Text style={{
                        color: DesignRule.textColor_secondTitle,
                        fontSize: 16
                    }}>
                        {this.state.levelExperience}
                    </Text>
                </Text>
                <View style={{
                    overflow: "hidden",
                    marginTop: px2dp(26),
                    height: px2dp(8),
                    width: ScreenUtils.px2dp(315),
                    alignSelf:'center',
                    backgroundColor: 'rgba(104,0,0,0.1)',
                    borderRadius:px2dp(4)
                }}>
                    <Image source={res.myData.jdt_05} style={{
                        marginRight: -0.5,
                        width: marginLeft,
                        height: px2dp(8),
                        borderRadius:px2dp(4),
                        backgroundColor: 'rgba(104,0,0,0.1)',
                    }} resizeMode={'stretch'}/>
                </View>

                <Text style={{
                    marginTop: px2dp(10),
                    color: DesignRule.textColor_instruction,
                    fontSize: 12,
                    marginLeft:DesignRule.margin_page
                }} allowFontScaling={false}>距离晋升还差
                    <Text style={{
                        color: DesignRule.textColor_instruction,
                        fontSize: 13
                    }}>
                        {(parseFloat(this.state.levelExperience) - parseFloat(this.state.experience)) > 0 ? `${StringUtils.formatDecimal(this.state.levelExperience - this.state.experience)}Exp` : '0Exp'}
                    </Text>
                    {(this.state.levelExperience - this.state.experience) > 0 ? null :
                        <Text style={{ color: DesignRule.mainColor, fontSize: 11 }} allowFontScaling={false}>(Exp已满)</Text>
                    }
                </Text>
            </ImageBackground>
        );
    }

    _renderContent=()=>{
        return(
            <View style={styles.contentStyle}>
                {this.renderHeader()}
                <RefreshList
                    data={this.state.viewData}
                    renderItem={this.renderItem}
                    onRefresh={this.onRefresh}
                    onLoadMore={this.onLoadMore}
                    extraData={this.state}
                    isEmpty={this.state.isEmpty}
                    emptyTip={"暂无数据"}
                />
                {this._accountInfoRender()}
            </View>
        )
    }
    renderItem = ({ item, index }) => {
        return (
                <AccountItem
                    type={item.type}
                    time={item.time}
                    serialNumber={""}
                    capital={item.capital}
                    iconImage={item.iconImage}
                    clickItem={() => {}}
                    capitalRed={item.capitalRed}
                />
        );
    };
    getDataFromNetwork = () => {
        console.log("getDataFromNetwork",this.params.experience)
        // let use_type = ['', '邀请注册奖励', '邀请注册奖励', '交易奖励', '交易奖励', '交易奖励', '交易奖励',"交易奖励","交易奖励","签到奖励","分享奖励","分享奖励","会员奖励","交易奖励","交易奖励","秀购活动奖励","30天未登录扣除","秀购赠送","秀购惩罚","活动奖励"];
        // let use_let_img = ['',invite_icon,invite_icon,trading_icon,trading_icon,trading_icon,trading_icon,trading_icon,trading_icon,signIn_icon,share_icon,share_icon,members_icon,trading_icon,trading_icon,activity_icon,activity_icon,xiugou_present,xiugou_punishment,xiugou_reword ];
        let arrData = this.currentPage === 1 ? [] : this.state.viewData;
        MineApi.expDetail({
            page: this.currentPage,
            size: 10
        }).then((response) => {
            console.log(response);
                let data = response.data;
                data.data.map((item, index) => {
                    arrData.push({
                        type: detailData[parseInt(item.sourceCode)].title,
                        time: item.createTime,
                        capital: `${parseInt(item.sourceType)===1?"+":"-"}${item.experience}`,
                        iconImage: detailData[parseInt(item.sourceCode)].icon,
                        capitalRed:parseInt(item.sourceType)===1

                    });
                });
                this.setState({ loadingState:PageLoadingState.success ,viewData: arrData, isEmpty: data.data && data.data.length !== 0 ? false : true,});
        }).catch(e => {
            this.setState({ loadingState:PageLoadingState.fail,netFailedInfo:e,viewData: arrData, isEmpty: true ,});

        });
    };
    onRefresh = () => {
        this.currentPage = 1;
        this.getDataFromNetwork();
    };
    onLoadMore = () => {
        if(!this.state.isEmpty){
            this.currentPage++;
            this.getDataFromNetwork();
        }
    };
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: ScreenUtils.safeBottom
    },
    contentStyle:{
        backgroundColor:DesignRule.bgColor,
        flex:1
    },
    headerBg: {
        height: 95,
        backgroundColor: "#FFFFFF",
        width: ScreenUtils.width - 30,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 15
    },
    headerContainer:{
        height: px2dp(188),
        width: ScreenUtils.width
    },
    withdrawButtonWrapper: {
        height: px2dp(28),
        borderRadius: px2dp(14),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: DesignRule.white,
        borderColor: DesignRule.mainColor,
        borderWidth: 1,
        paddingHorizontal: px2dp(7)
    },
    withdrawWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: DesignRule.margin_page,
        marginTop: px2dp(22)
    },
    countTextStyle: {
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_threeTitle
    },
    headerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: DesignRule.margin_page,
        marginTop: ScreenUtils.statusBarHeight,
        height: 44
    }

});
