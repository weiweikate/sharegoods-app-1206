import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Text,
    ScrollView
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import SelectionSectionView from './components/SelectionSectionView';
import SelectionHeaderView from './components/SelectionHeaderView';

export default class SelectionPage extends Component {

    static propTypes = {
        selectionViewConfirm: PropTypes.func.isRequired,
        selectionViewClose: PropTypes.func.isRequired,
        selectionData: PropTypes.object.isRequired
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

                    <SelectionHeaderView/>

                    <ScrollView contentContainerStyle={styles.contentContainer}>
                        <SelectionSectionView listData={this.state.recentData0}
                                              clickItemAction={this._clickItemAction}/>
                        <SelectionSectionView listData={this.state.recentData1}
                                              clickItemAction={this._clickItemAction}/>
                        <SelectionSectionView listData={this.state.recentData2}
                                              clickItemAction={this._clickItemAction}/>

                        <View>

                        </View>
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

