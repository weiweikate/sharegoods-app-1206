import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import BasePage from '../../BasePage'
import {observer} from 'mobx-react';
import fetchHistory from '../../model/FetchHistory'


@observer
export default class DemoLoginPage extends BasePage {
    $navigationBarOptions = {
        title:'我是标题11'
    }

    constructor(props) {
        super(props);
        this.state = {
            name:11,
            loadingState: 'loading',
            refreshing: false,
            netFailedInfo: null,
        };
    }

    componentDidMount() {
        console.log('DemoLoginPage',this.state);
        setTimeout(()=>{
            this.setState({
                loadingState:'success'
            })
        },2000)

    }

    _render() {
        return (
            <ScrollView style={styles.container}>
                <View>
                    <Text onPress={this.login}>点击登录</Text>
                    <Text onPress={this.goBack}>返回</Text>
                    <Text>{this.state.name}</Text>


                    {
                        fetchHistory.history.map(function (item,idx) {
                            return (<Text key={ idx }>{item.time}</Text>)
                        })
                    }


                </View>
            </ScrollView>
        );
    }

    goBack = () => {
        this.$navigateBack();
    };
    login = () => {
        fetchHistory.insertData({
            name:1,
            time:+new Date()
        });

        console.log(fetchHistory.history.length)
        /*API.apiDemoList({a: 1}).then(result => {
            console.log('result', result);
        }).catch(error => {
            console.log('catch error', error);
        });

        API.apiDemoList({a: 1}).then(result => {
            console.log('result', result);
        }).catch(error => {
            console.log('catch error', error);
        });*/
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
