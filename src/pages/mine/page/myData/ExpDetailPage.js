import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
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
// import Toast from "../../../../utils/bridge";
 const {
     jdt_05,
     invite_icon,
     trading_icon,
     signIn_icon,
     share_icon,
     members_icon,
     activity_icon,
 } =res.myData;
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
        show: true, // false则隐藏导航
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
    renderHeader=()=>{
        const progress = this.state.experience / this.state.levelExperience;
        const marginLeft =  ScreenUtils.px2dp(315) * progress;
        const radius = marginLeft > 4 ? -0.5 : 4;

        return(
           <View style={styles.headerBg}>
               <View style={{ flex: 1, justifyContent: "center",alignItems:'flex-start',marginLeft:14 }}>
                   <Text style={{
                       marginTop: 5,
                       color: DesignRule.mainColor,
                       fontSize: 24
                   }} allowFontScaling={false}>{this.state.experience || 0}<Text style={{
                       color: DesignRule.textColor_secondTitle,
                       fontSize:10
                   }}>
                       /{this.state.levelExperience}
                   </Text></Text>

                   <ImageBackground source={jdt_05} style={{
                       overflow: "hidden",
                       marginTop: 5,
                       height: 8,
                       width: ScreenUtils.px2dp(315)
                   }}>
                       <View style={{
                           marginRight: -0.5,
                           marginLeft: marginLeft,
                           height: 8,
                           borderBottomRightRadius: 4,
                           borderTopRightRadius: 4,
                           backgroundColor: DesignRule.lineColor_inGrayBg,
                           borderBottomLeftRadius: radius,
                           borderTopLeftRadius: radius
                       }}/>
                   </ImageBackground>

                   <Text style={{
                       marginTop: 10,
                       color: DesignRule.textColor_instruction,
                       fontSize: 12
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
               </View>
           </View>
        )
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
        let use_type = ['', '邀请注册奖励', '邀请注册奖励', '交易奖励', '交易奖励', '交易奖励', '交易奖励',"交易奖励","交易奖励","签到奖励","分享奖励","分享奖励","会员奖励","交易奖励","交易奖励","秀购活动奖励","其他","其他"];
        let use_let_img = ['',invite_icon,invite_icon,trading_icon,trading_icon,trading_icon,trading_icon,trading_icon,trading_icon,signIn_icon,share_icon,share_icon,members_icon,trading_icon,trading_icon,activity_icon,activity_icon,activity_icon ];
        let arrData = this.currentPage === 1 ? [] : this.state.viewData;
        MineApi.expDetail({
            page: this.currentPage,
            size: 10
        }).then((response) => {
            console.log(response);
                let data = response.data;
                data.data.map((item, index) => {
                    arrData.push({
                        type: use_type[parseInt(item.sourceCode)],
                        time: item.createTime,
                        capital: "+"+item.experience,
                        iconImage: use_let_img[parseInt(item.sourceCode)],
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
        MineApi.getUser().then(resp => {
            let data = resp.data;
            user.saveUserInfo(data);
        }).catch(err => {
            if (err.code === 10009) {
                this.gotoLoginPage();
            }
        });
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
});
