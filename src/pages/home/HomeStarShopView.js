import React, { Component } from "react";
import { View, StyleSheet, TouchableWithoutFeedback, ImageBackground } from "react-native";
import ScreenUtil from "../../utils/ScreenUtils";

const { px2dp, onePixel } = ScreenUtil;
import { observer } from "mobx-react";
import { homeModule } from "./Modules";
import { starShopModule } from "./HomeStarShopModel";
import User from "../../model/user";
import DesignRule from '../../constants/DesignRule';
import ImageLoad from "@mr/image-placeholder";
import res from "./res";
import {MRText as Text} from '../../components/ui';

const starImg = res.star;

/**
 * @author chenyangjun
 * @date on 2018/9/7
 * @describe 明星店铺
 * @org www.sharegoodsmall.com
 * @email chenyangjun@meeruu.com
 */


const Banner = ({ backImage, title, press }) => <TouchableWithoutFeedback onPress={() => press && press()}><View style={styles.bannerContainer}>
    <ImageLoad style={styles.bannerImg} source={backImage} cacheable={true}/>
</View></TouchableWithoutFeedback>;

const Line = () => <View style={styles.line}/>;

const Profile = ({ avatar, name, level, member, income, allIncome }) => <View style={styles.profile}>
    <ImageLoad style={styles.avatar} source={avatar}/>
    <View style={styles.nameBox}>
        <View style={styles.nameView}>
            {name ? <Text numberOfLines={1}
                          allowFontScaling={false}
                          style={styles.name}>{name.length > 5 ? name.slice(0, 5) + "..." : name}</Text> : null}
            <ImageBackground style={styles.level} source={starImg}>
                <Text style={styles.levelText}  allowFontScaling={false}>{level}</Text>
            </ImageBackground>
        </View>
        <View style={styles.space}/>
        <Text style={styles.text}  allowFontScaling={false}>成员：<Text style={styles.member}  allowFontScaling={false}>{member}</Text></Text>
    </View>
    <Line/>
    <View style={styles.incomeBox}>
        <Text style={styles.text}  allowFontScaling={false}>店铺本月收入</Text>
        <View style={{ height: px2dp(6) }}/>
        <Text style={styles.income}  allowFontScaling={false}>{income}</Text>
    </View>
    <Line/>
    <View style={styles.allIncomeBox}>
        <Text style={styles.text}  allowFontScaling={false}>店铺累计收入</Text>
        <View style={{ height: px2dp(6) }}/>
        <Text style={styles.income}  allowFontScaling={false}>{allIncome}</Text>
    </View>
</View>;

const Cell = ({ data, store, press }) => <View style={styles.cell}>
    <Banner backImage={{ uri: data.imgUrl ? data.imgUrl : "" }} title={data.title} press={() => press && press()}/>
    <Profile avatar={{ uri: store.headUrl ? store.headUrl : "" }} name={store.name}
             level={store.starName ? store.starName : 0} member={store.storeUserNum} income={store.tradeBalance}
             allIncome={store.totalTradeBalance}/>
</View>;


@observer
export default class HomeStarShopView extends Component {
    _shopPress(shop) {
        const { navigate } = this.props;
        if (!User.isLogin) {
            navigate("login/login/LoginPage");
            return;
        }
        let route = homeModule.homeNavigate(8);
        let params = homeModule.paramsNavigate(shop);
        navigate(route, {...params, preseat:'starShop'})
    }

    render() {
        let cells = [];
        const { shopList } = starShopModule;
        if (!shopList || (shopList && shopList.length <= 0)) {
            return <View/>;
        }
        shopList.map((shop, index) => {
            if (shop.storeDTO) {
                cells.push(<Cell key={index} data={shop} store={shop.storeDTO} press={() => this._shopPress(shop)}/>);
            }
        });
        return <View style={styles.container}>
            <View style={styles.titleView}><Text style={styles.title}>明星店铺</Text></View>
            {cells}
        </View>;
    }
}

let styles = StyleSheet.create({
    container: {
        marginLeft: px2dp(15),
        marginRight: px2dp(15)
    },
    titleView: {
        height: px2dp(58),
        alignItems: "center",
        justifyContent: "center"
    },
    title: {
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(19),
        fontWeight: "600"
    },
    bannerContainer: {
        height: px2dp(110)
    },
    cell: {
        height: px2dp(175),
        borderRadius: px2dp(5),
        backgroundColor: "#fff",
        overflow: "hidden",
        marginBottom: px2dp(10)
    },
    bannerImg: {
        height: px2dp(110),
        width: ScreenUtil.width - px2dp(30)
    },
    bannerTitle: {
        fontSize: px2dp(22),
        color: "#fff",
        fontWeight: "700",
        marginTop: px2dp(47)
    },
    profile: {
        flexDirection: "row",
        alignItems: "center",
        height: px2dp(67)
    },
    avatar: {
        width: px2dp(45),
        height: px2dp(45),
        borderRadius: px2dp(45 / 2),
        marginLeft: px2dp(10),
        overflow: "hidden"
    },
    name: {
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(12)
    },
    level: {
        width: px2dp(14),
        height: px2dp(14),
        marginLeft: px2dp(5),
        alignItems: "center",
        justifyContent: "center"
    },
    levelText: {
        color: "#AB8433",
        fontSize: px2dp(8)
    },
    nameBox: {
        marginLeft: px2dp(10),
        flex: 1
    },
    nameView: {
        flexDirection: "row",
        alignItems: "center"
    },
    text: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(9)
    },
    member: {
        color: DesignRule.textColor_mainTitle,
        fontSize: px2dp(10)
    },
    line: {
        width: onePixel,
        height: px2dp(35),
        backgroundColor: "#e5e5e5"
    },
    incomeBox: {
        width: px2dp(95),
        justifyContent: "center",
        alignItems: "center"
    },
    income: {
        fontSize: px2dp(11),
        color: DesignRule.textColor_mainTitle
    },
    allIncomeBox: {
        justifyContent: "center",
        alignItems: "center",
        width: px2dp(85)
    },
    space: {
        height: px2dp(5)
    },
    joinBtn: {
        marginTop: px2dp(-86),
        width: px2dp(67),
        height: px2dp(16),
        borderRadius: px2dp(16) / 2,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        backgroundColor: DesignRule.mainColor
    },
    join: {
        color: "#fff",
        fontSize: 10
    }
});
