import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Text,
    ScrollView,
    Image
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import SelectionSectionView from './components/SelectionSectionView';

export default class SelectionPage extends Component {

    static propTypes = {
        selectionViewConfirm: PropTypes.func.isRequired,
        selectionViewClose: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            recentData0: ['金色', '红色', '土豪金', '玫瑰金', '金色', '红色', '土豪金', '玫瑰金', '金色', '红色', '土豪金', '玫瑰金', '金色', '红色', '土豪金', '玫瑰金'],
            recentData1: ['32g', '64g', '128g', '256g'],
            recentData2: ['大陆', '国外', '港版']
        };
    }

    _clickItemAction = () => {

    };

    render() {
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={this.props.selectionViewClose}>
                    <View style={{ height: ScreenUtils.autoSizeHeight(175) }}/>
                </TouchableWithoutFeedback>
                <View style={{ backgroundColor: 'white', flex: 1 }}>
                    <View style={{ flexDirection: 'row',backgroundColor:'blue' }}>
                        <View style={{
                            marginLeft: 10,
                            marginTop: -20,
                            height: 110,
                            width: 110,
                            borderColor: '#EEEEEE',
                            borderWidth: 1,
                            borderRadius: 5,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Image style={{ width: 108, height: 108, backgroundColor: 'red', borderRadius: 5 }}/>
                        </View>
                        <View style={{ flex: 1, marginLeft: 16}}>
                            <Text style={{
                                color: '#D51243',
                                fontSize: 18,
                                fontFamily: 'PingFang-SC-Medium',
                                marginTop: 10,
                                backgroundColor: 'red'
                            }}>￥455.50</Text>
                            <Text style={{ color: '#222222', fontSize: 15, marginTop: 10 ,backgroundColor: 'yellow'}}>库存454654件</Text>
                            <Text style={{ color: '#222222', fontSize: 15, marginTop: 10,backgroundColor: 'red' }}>银色</Text>
                        </View>
                        <TouchableWithoutFeedback onPress={this.props.selectionViewClose}>
                            <Image style={{ marginRight: 16, marginTop: 19, width: 23, height: 23,backgroundColor:'red' }}/>
                        </TouchableWithoutFeedback>

                    </View>
                    <ScrollView contentContainerStyle={styles.contentContainer}>
                        <SelectionSectionView listData={this.state.recentData0}
                                              clickItemAction={this._clickItemAction}/>
                        <SelectionSectionView listData={this.state.recentData1}
                                              clickItemAction={this._clickItemAction}/>
                        <SelectionSectionView listData={this.state.recentData2}
                                              clickItemAction={this._clickItemAction}/>
                    </ScrollView>
                    <TouchableWithoutFeedback onPress={this.props.selectionViewClose}>
                        <View style={{
                            height: 49,
                            backgroundColor: '#D51243',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Text style={{ fontSize: 16, color: '#FFFFFF' }}>确认</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(59, 59, 59, 0.7)',
        flex: 1
    }

});

