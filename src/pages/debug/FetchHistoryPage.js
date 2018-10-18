/**
 * Created by nuomi on 2018/7/18.
 */
import React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import fetchHistory from '../../model/FetchHistory';
import { PageLoadingState } from '../../components/pageDecorator/PageState';
import { observer } from 'mobx-react/native';
import { formatDate } from '../../utils/DateUtils';
import BasePage from '../../BasePage';

@observer
export default class FetchHistoryPage extends BasePage {

    // 页面配置
    $navigationBarOptions =  {
        title: '请求记录',
    };

    $getPageStateOptions = () => {
        return {
            loadingState: fetchHistory.history.length ? PageLoadingState.success : PageLoadingState.empty,
            emptyProps: {
                isScrollViewContainer: true,
                description: '暂无记录'
            }
        };
    };

    // 查看具体请求详细数据
    _clickRequestDetail = (item) => {
        this.props.navigation.navigate('debug/RequestDetailPage', {
            request: item,
            preRouteName: this.props.navigation.state.routeName
        });
    };

    // 渲染行
    _renderItem = ({ item }) => {
        const { responseJson, status, url, requestStamp } = item;
        const isWrong = status !== 200;
        return (<TouchableWithoutFeedback onPress={() => {
            this._clickRequestDetail(item);
        }}>
            <View style={[styles.row, isWrong ? {
                flexDirection: 'column',
                justifyContent: 'flex-start'
            } : {
                flexDirection: 'row',
                alignItems: 'center',
                height: 55,
            }]}>
                <Text numberOfLines={2}>{url}<Text
                    style={{ color: 'gray' }}>   {formatDate(requestStamp)}</Text></Text>
                {
                    (isWrong) ? <Text style={{ color: 'red', marginTop: 8 }}>
                        {JSON.stringify(responseJson)}
                    </Text> : null
                }
            </View>
        </TouchableWithoutFeedback>);
    };

    _keyExtractor = (item, index) => `${index}`;

    _render() {
        return (<FlatList data={fetchHistory.history}
                          keyExtractor={this._keyExtractor}
                          renderItem={this._renderItem}/>);
    }

}


const styles = StyleSheet.create({
    row: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginBottom: 8,
        backgroundColor: 'white',
    }
});
