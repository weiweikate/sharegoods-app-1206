import React from 'react';
import {
    View,
    ScrollView
} from 'react-native';
import BasePage from '../../../../BasePage';
import ScreenUtils from '../../../../utils/ScreenUtils';
import HTML from 'react-native-render-html';
import MineApi from '../../api/MineApi';
import DesignRule from '../../../../constants/DesignRule';
import {MRText as Text,NoMoreClick} from '../../../../components/ui'
/**
 * @author chenxiang
 * @date on 2018/9/21
 * @describe 设置页面
 * @org www.sharegoodsmall.com
 * @email chenxiang@meeruu.com
 */
export default class HelperQuestionDetail extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: '',
            noHelpNum: 0,
            useHelpNum: 0,
            type: null
        };
    }

    $navigationBarOptions = {
        title: '问题详情',
        show: true // false则隐藏导航
    };

    componentDidMount() {
        MineApi.findHelpQuestionById({ id: this.params.id }).then(res => {
            this.setState({
                title: res.data.title,
                content: res.data.content,
                type: res.data.type
            });
        }).catch(err => {
            console.log(err);
        });
        this.loadPageData();
    }

    _render() {
        return (
            <View  style={{ backgroundColor: DesignRule.bgColor, flex: 1 }}>
            <ScrollView  style={{marginBottom:209}}>
                {this.state.content ? <HTML html={this.state.content} imagesMaxWidth={ScreenUtils.width}
                                            containerStyle={{ backgroundColor: DesignRule.bgColor ,padding:5}}/> : null}
            </ScrollView>
                <View style={{
                    width: ScreenUtils.width,
                    height: 80,
                    position:'absolute',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bottom: 109,
                    flexDirection: 'row',
                    paddingHorizontal: 33
                }}>
                    <NoMoreClick activeOpacity={0.6} onPress={() => this.feedbackNoUse()} style={{
                        width: 140,
                        height: 48,
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: this.state.type === null || this.state.type === 1 ? DesignRule.mainColor : 'white',
                        backgroundColor: this.state.type === null || this.state.type === 1 ? 'white' : DesignRule.mainColor,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text style={{
                            fontSize: 16,
                            color: this.state.type === null || this.state.type === 1 ? DesignRule.mainColor : 'white'
                        }} allowFontScaling={false}>{`没啥帮助?  (${this.state.noHelpNum > 9999 ? '9999+' : this.state.noHelpNum})`}</Text>
                    </NoMoreClick>
                    <NoMoreClick activeOpacity={0.6} onPress={() => this.feedbackGoodUse()} style={{
                        width: 140,
                        height: 48,
                        borderRadius: 5,
                        backgroundColor: this.state.type === null || this.state.type === 0 ? 'white' : DesignRule.mainColor,
                        borderColor: this.state.type === null || this.state.type === 0 ? DesignRule.mainColor : 'white',
                        borderWidth: 1,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text style={{
                            fontSize: 16,
                            color: this.state.type === null || this.state.type === 0 ? DesignRule.mainColor : 'white'
                        }} allowFontScaling={false}>{`有用  (${this.state.useHelpNum > 9999 ? '9999+' : this.state.useHelpNum})`}</Text>
                    </NoMoreClick>
                </View>
            </View>
        );
    }

    loadPageData() {
        MineApi.findQuestionEffectById({ id: this.params.id }).then(res => {
            console.log(res);
            this.setState({
                useHelpNum: res.data.isHelp,
                noHelpNum: res.data.notHelp,
                type: res.data.type
            });
        }).catch(err => {
            console.log(err);
        });
    }

    feedbackNoUse() {
        MineApi.updateHelpQuestionToClick({ id: this.params.id, hadHelp: 0 }).then(res => {
            this.$toastShow('' + res.data);
            this.loadPageData();
        }).catch(err => {
            if (err.code === 10009) {
                this.gotoLoginPage()
            }
        });
    }

    feedbackGoodUse() {
        MineApi.updateHelpQuestionToClick({ id: this.params.id, hadHelp: 1 }).then(res => {
            this.$toastShow('' + res.data);
            this.loadPageData();
        }).catch(err => {
            if (err.code === 10009) {
                this.$navigate('login/login/LoginPage');
            }
        });
    }
}
