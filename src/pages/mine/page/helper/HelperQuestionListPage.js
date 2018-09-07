/**
 * Created by xiangchen on 2018/7/12.
 */
import React from 'react'
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
} from 'react-native'
import BasePage from '../../../../BasePage'
import UIText from '../../../../components/ui/UIText';
import { color} from "../../../../constants/Theme";
import ScreenUtils from "../../../../utils/ScreenUtils";
import arrow_right from '../../res/homeBaseImg/icon3_07.png';
export default class HelperQuestionListPage extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            data: [],
        }
    }

    renderContentView = ()=> {
        let arr = [];
        let isBottomLineWide = [false, false, true, false, false, true,];
        if (this.state.data.length > 0) {
            for (let i = 0; i < this.state.data.length; i++) {
                arr.push(
                    <View key={i} style={{width: ScreenUtils.width, height: 48}}>
                        <TouchableOpacity style={styles.containerStyles}
                                          onPress={()=>this.orderMenuJump(this.state.data[i].id)}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <UIText value={this.state.data[i].title}
                                        style={[styles.blackText, {marginLeft: 5}]}/>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Image source={arrow_right} style={{height: 10,}} resizeMode={'contain'}/>
                            </View>
                        </TouchableOpacity>
                        {isBottomLineWide[i] ? null :
                            <View style={{backgroundColor: color.line, height: 1}}/>}
                        {!isBottomLineWide[i] ? null :
                            <View style={{backgroundColor: color.page_background, height: 10}}/>}
                    </View>
                )
            }
            return arr
        } else {
            return null;
        }
    }

    renderFooter() {
        return (
            <View style={{
                width: ScreenUtils.width, height: 80, position: "absolute", bottom: 0,
                alignItems: 'center', justifyContent: 'center'
            }}>
                <Text style={{fontSize: 13, color: "#999999"}}>联系客服 8888-8888</Text>
                <Text style={{fontSize: 13, color: "#999999"}}>早9:00 - 18:00</Text>
            </View>
        )
    }

    orderMenuJump(i) {
        this.$navigate('mine/helper/HelperQuestionDetail', {id: i})
    }

    _render() {
        return (
            <View style={{backgroundColor: '#F6F6F6', flex: 1}}>
                <View style={{width: ScreenUtils.width, height: 10}}/>
                {this.renderContentView()}
                {this.renderFooter()}
            </View>
        )

    }

    loadPageData() {
        // MineApi.queryHelpQuestionList({typeid: this.params.typeid}).then(res => {
        //     if (res.ok&&StringUtils.isNoEmpty(res.data)) {
        //         this.setState({data: res.data})
        //     } else {
        //         $toastShow(res.msg);
        //     }
        // });
    }
}

const styles = StyleSheet.create({
    blackText: {
        fontFamily: "PingFang-SC-Medium",
        fontSize: 13,
        color: "#000000"
    },
    containerStyles:{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 44,
        paddingLeft: 21,
        paddingRight: 28,
        backgroundColor: color.white,
        flexDirection: 'row'
    }
});
