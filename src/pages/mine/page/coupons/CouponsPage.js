import React from 'react';
import {
    View, StyleSheet
} from 'react-native';
import BasePage from '../../../../BasePage';
import ScrollableTabView ,{ScrollableTabBar}from 'react-native-scrollable-tab-view';
import ScreenUtils from '../../../../utils/ScreenUtils'
import MyCouponsItems from './../../components/MyCouponsItems';
export default class CouponsPage extends BasePage {

    constructor(props) {
        super(props);
        this.state={
            selectTab:10
        }
    }

    $navigationBarOptions = {
        title: '优惠券',
        show: true // false则隐藏导航
    };

    _render() {
        return (
            <View style={styles.container}>
                <ScrollableTabView
                    onChangeTab={(obj)=>{
                        this.setState({selectTab:obj.i})
                    }}
                    style={{width:ScreenUtils.width,justifyContent:'center',marginTop:1,backgroundColor:'#f7f7f7'}}
                    //进界面的时候打算进第几个
                    initialPage={2}
                    tabBarBackgroundColor='#fff'
                    tabBarActiveTextColor='red'
                    tabBarInactiveTextColor='#999999'
                    locked={true}
                    tabBarTextStyle={{fontSize:15}}
                    tabBarUnderlineStyle={{backgroundColor: 'red',height:2}}
                    renderTabBar={() => <ScrollableTabBar />}
                >
                    <MyCouponsItems  tabLabel={'未使用'} pageStatus={0} nav={this.navigate} selectTab={this.state.selectTab} isgiveup={false} />
                    <MyCouponsItems  tabLabel={'已失效'} pageStatus={1} nav={this.navigate} selectTab={this.state.selectTab} isgiveup={false}/>
                    <MyCouponsItems  tabLabel={'已使用'} pageStatus={2} nav={this.navigate} selectTab={this.state.selectTab}  isgiveup={false}/>
                </ScrollableTabView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7'
    }
});
