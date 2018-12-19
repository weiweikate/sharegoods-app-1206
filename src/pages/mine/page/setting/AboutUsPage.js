import React from 'react';
import {
    ScrollView, Image, View
} from 'react-native';
import BasePage from '../../../../BasePage';
import res from '../../res';
import DesignRule from 'DesignRule';
const Logo = res.other.tongyong_logo_nor;
import ScreenUtils from '../../../../utils/ScreenUtils'
import {MRText as Text} from '../../../../components/ui'

export default class AboutUsPage extends BasePage {

    $navigationBarOptions = {
        title: '关于我们'
    };

    constructor(props) {
        super(props);
        this.state = {
            height: null
        }
    }

    _onLayout(e){
      let height = e.nativeEvent.layout.height;
      if (height < ScreenUtils.height - ScreenUtils.headerHeight) {
          this.setState({height: ScreenUtils.height - ScreenUtils.headerHeight});
      }
}
    _render() {
        return (<ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <View style={{ flexDirection: 'column', alignItems: 'center', backgroundColor: 'white' , height: this.state.height}}
                  onLayout={this._onLayout.bind(this)}
            >
                <Image source={Logo} style={{ height: 70, width: 70, marginTop: 30 }}/>
                <Text style={{ color: DesignRule.textColor_mainTitle, fontSize: 15, marginTop: 30 }}>公司简介</Text>
                <Text style={{
                    color: DesignRule.textColor_mainTitle,
                    fontSize: 12,
                    marginTop: 14,
                    marginRight: 15,
                    marginLeft: 15
                }}>秀购是一款全新的互联网社交电商平台，致力于打造互联网时代社交电子商务新模式，为消费者提供集购物、分享、赚钱为一体的全新社交电商生态圈。秀购涵盖了诸多领域各大品类的国内外品牌及商品，为消费者带去优秀的购物体验及赚钱的全新方式，也不断的激励用户向好友分享优质的生活理念，建立良好的社交氛围。
                </Text>
                <Text style={{
                    color: DesignRule.textColor_mainTitle,
                    fontSize: 12,
                    marginTop: 18,
                    marginRight: 15,
                    marginLeft: 15
                }}>
                    秀购成立于2017年，由一群来自传统制造业、零售业、互联网、电商领域的领袖大咖们共同组建。我们希望以开放、共享的思维，将好的产品、服务、体验带给秀购的用户，同时带来分享经济下新的赚钱方式。
                </Text>
                <Text style={{
                    color: DesignRule.textColor_mainTitle,
                    fontSize: 12,
                    marginTop: 18,
                    marginRight: 15,
                    marginLeft: 15
                }}>
                    秀购精选上千种商品，涉及针织品、母婴、文娱、宠物、美妆、个护、日化、家居、食品等几十个类目。每一件商品都经过平台和第三方进行品质监管。与国际大牌制造商合作，对制造商有12层严格管控，360度品控。强大的供应链资源，提供100%正品保障，同时确保在售商品都安全、合法。
                </Text>
                <Text style={{
                    color: DesignRule.textColor_mainTitle,
                    fontSize: 12,
                    marginTop: 18,
                    marginRight: 15,
                    marginLeft: 15
                }}>
                    不仅如此，秀购的社交电商模式与政府倡导的新型电商模式不谋而合，不仅有政府政策的支持，还获得优质资本的大力支持，同时与银行有深度合作，每一笔资金都清晰可查。
                </Text>
                <Text style={{
                    color: DesignRule.textColor_mainTitle,
                    fontSize: 12,
                    marginTop: 18,
                    marginRight: 15,
                    marginLeft: 15
                }}>
                    秀购独创的分享赚取佣金模式，不管是线上发发朋友圈，还是线下朋友聚会聊聊天，只要你把秀购上的好货分享给别人，在分享生活和快乐的同时，每卖出一件商品，秀购就帮你向品牌商争取一份佣金。
                </Text>
                <View style={{flex: 1}} />
                <Text style={{
                    color: DesignRule.textColor_instruction,
                    fontSize: 11,
                    marginTop: 52
                }}>杭州名融网络有限公司版权所有</Text>
                <Text
                    style={{
                        color: DesignRule.textColor_instruction,
                        fontSize: 11,
                        marginTop: 10,
                        marginBottom: 24
                    }}>Copyright@2018杭州名融网络有限公司版权所有</Text>
            </View>
        </ScrollView>);
    }
}
