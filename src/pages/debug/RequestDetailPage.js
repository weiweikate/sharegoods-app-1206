/**
 * Created by nuomi on 2018/7/18.
 */
import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import { formatDate } from '../../utils/DateUtils';
import BasePage from '../../BasePage';
import DesignRule from '../../constants/DesignRule';


export default class RequestDetailPage extends BasePage {

    // 页面配置
    $navigationBarOptions = {
        title: '请求详情',
        rightNavTitle: '收起全部',
    }

    _render() {

        /* this.props.request 数据结构
         * url                   请求的url
         * requestHeader         请求头信息
         * requestBody           请求body信息
         * status                状态
         * requestStamp          开始请求的时间戳
         * responseStamp         结束请求的时间戳
         * responseHeader        响应头信息
         * responseText          响应body转文本
         * responseJson          响应body转json
         * errorStamp            出错的时间
         * error                 请求出错，标准JS-Error对象，一般结构如下参数信息{
         *                           name：错误名称
         *                           message：错误提示信息
         *                           stack：错误栈
         *                           toString()
         *                       }
         * */
        const request = (this.props.navigation.state.params || {}).request || {};
        const {
            error,
            requestStamp,
            responseStamp,
            errorStamp,
            responseJson,
            responseText,
            responseHeader
        } = request;
        const keyArr = ['url', 'status', 'timeLine', 'requestHeader', 'requestBody'];
        if (responseHeader && typeof responseHeader === 'object') {
            keyArr.push('responseHeader');
        }
        if (responseJson && typeof responseJson === 'object') {
            keyArr.push('responseJson');
        } else if (responseText && typeof responseText === 'string') {
            keyArr.push('responseText');
        }
        if (error) {
            keyArr.push('error');
        }

        return (<ScrollView style={styles.container}>
            {
                keyArr.map((key, index) => {
                    let value = request[key];
                    if (key === 'timeLine' && requestStamp) {
                        value = `发起请求：${formatDate(requestStamp)}`;
                        if (responseStamp) {
                            value = `${value}\n收到响应：${formatDate(responseStamp)}`;
                        }
                        if (errorStamp) {
                            value = `${value}\n出错：${formatDate(errorStamp)}`;
                        }
                    } else if (key === 'error') {
                        if (error instanceof Error) {
                            const { name, message, stack } = error;
                            value = {
                                desc: error.toString(),
                                errorType: name,
                                message,
                                stack: stack
                            };
                        } else {
                            value = JSON.stringify(error, null, 4);
                        }
                    }
                    return this.renderRow(key, value, index);
                })
            }
            <View style={{ height: 8 }}/>
        </ScrollView>);
    }

    state = {
        openAll: true,
        3: true,
        5: true,
    };

    $NavBarRightPressed = () => {
        const obj = {};
        if (this.state.openAll) {
            obj[3] = true;
            obj[4] = true;
            obj[5] = true;
            obj[6] = true;
            obj[7] = true;
            obj[8] = true;
            obj[9] = true;
            obj[10] = true;
            this.setState({ openAll: !this.state.openAll, ...obj }, () => {
                this.$NavigationBarResetRightTitle('展开全部');
            });
        } else {
            obj[3] = false;
            obj[4] = false;
            obj[5] = false;
            obj[6] = false;
            obj[7] = false;
            obj[8] = false;
            obj[9] = false;
            obj[10] = false;
            this.setState({ openAll: !this.state.openAll, ...obj }, () => {
                this.$NavigationBarResetRightTitle('收起全部');
            });
        }
    };

    foldAtIndex = (index) => {
        if (index < 3) {return;}
        const obj = {};
        obj[index] = !this.state[index];
        this.setState({ ...obj });
    };

    renderRow = (key, value, index) => {
        const style = [styles.cell];
        if (index < 3) {
            style.push(styles.rowStyle);
        } else {

        }
        return (<View key={index} style={style}>
            <TouchableWithoutFeedback onPress={() => {
                this.foldAtIndex(index);
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: DesignRule.mainColor }}>{key}:</Text>
                    {
                        index < 3 ? null : <View>
                            <Text style={{ color: DesignRule.mainColor }}>{this.state[index] ? '展开' : '收起'}</Text>
                        </View>
                    }
                </View>
            </TouchableWithoutFeedback>
            {
                this.state[index] ? null :
                    <Text selectable={true} style={{ flex: 1, color: DesignRule.textColor_mainTitle, marginLeft: index < 3 ? 10 : 0 }}>{
                        typeof value === 'object' ? JSON.stringify(value, null, 4) : (key === 'status' && !value ? '请求异常，无法获取status状态' : value)
                    }</Text>
            }
        </View>);
    };

}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignRule.bgColor,
    },
    cell: {
        backgroundColor: 'white',
        marginBottom: 4,
        padding: 15,
        paddingVertical: 8,
    },
    rowStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});
