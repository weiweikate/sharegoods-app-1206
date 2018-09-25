/**
 * Created by xiangchen on 2018/7/12.
 */
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import BasePage from '../../../../BasePage';
import ScreenUtils from '../../../../utils/ScreenUtils';
import { color } from '../../../../constants/Theme';
// const headerbar='<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <title>Title</title> </head> <body><div>';
// const botombar='</div></body></html>';
import MineApi from '../../api/MineApi';

export default class HelperQuestionDetail extends BasePage {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            content: ''
        };
    }

    $navigationBarOptions = {
        title: '问题详情',
        show: true // false则隐藏导航
    };

    componentDidMount() {
        MineApi.findHelpQuestionById({ id: this.params.id }).then(res => {
            if (res.code === 10000) {
                this.setState({
                    title: res.data.title,
                    content: res.data.content
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }

    _render() {
        return (
            <View style={{ backgroundColor: '#F6F6F6', flex: 1 }}>
                <View>
                    <Text style={{
                        fontWeight: 'bold',
                        fontSize: 18,
                        marginTop: 10,
                        marginBottom: 20
                    }}>{this.state.title}</Text>
                    <Text style={{ fontSize: 16 }}>  {this.state.content}</Text>
                </View>
                <View style={{
                    width: ScreenUtils.width,
                    height: 80,
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bottom: 109,
                    flexDirection: 'row',
                    paddingHorizontal: 33
                }}>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => this.feedbackNoUse()} style={{
                        width: 150,
                        height: 48,
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: color.red,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text style={{ fontSize: 16, color: color.red }}>没啥帮助?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => this.feedbackGoodUse()} style={{
                        width: 150,
                        height: 48,
                        borderRadius: 5,
                        backgroundColor: color.red,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text style={{ fontSize: 16, color: color.white }}>有用</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }

    loadPageData() {
    }

    feedbackNoUse() {
        MineApi.updateHelpQuestionToClick({id:this.params.id,hadHelp:0}).then(res=>{
            this.$toastShow(res.msg)
        }).catch(err=>{
            if(err.code==10009){
                this.$navigate('login/login/LoginPage')
            }
        })
    }

    feedbackGoodUse() {
        MineApi.updateHelpQuestionToClick({id:this.params.id,hadHelp:1}).then(res=>{
            this.$toastShow(res.msg)
        }).catch(err=>{
           if(err.code==10009){
               this.$navigate('login/login/LoginPage')
           }
        })
    }

}
