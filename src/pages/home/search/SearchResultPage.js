import React from 'react';
import {
    View,
    FlatList
} from 'react-native';
import BasePage from '../../../BasePage';
import ResultSearchNav from './components/ResultSearchNav';
import ResultSegmentView from './components/ResultSegmentView';
import ResultHorizontalRow from './components/ResultHorizontalRow';
import ResultVerticalRow from './components/ResultVerticalRow';

export default class SearchResultPage extends BasePage {


    $navigationBarOptions = {
        show: false
    };

    constructor(props) {
        super(props);
        this.state = {
            isHorizontal: true
        };
    }

    _goBack = () => {
        this.$navigateBack();
    };

    _changeLayout = () => {
        this.setState({
            isHorizontal: !this.state.isHorizontal
        });
    };

    _onSubmitEditing = () => {

    };
    _onPressAtIndex = () => {

    };
    _storeProduct = () => {

    };

    _renderItem = (item) => {
        if (this.state.isHorizontal) {
            return (<ResultHorizontalRow onPressAtIndex={this._onPressAtIndex} storeProduct={this._storeProduct}/>);
        } else {
            return (<ResultVerticalRow onPressAtIndex={this._onPressAtIndex} storeProduct={this._storeProduct}/>);
        }
    };

    _render() {
        return (
            <View style={{ flex: 1 }}>
                <ResultSearchNav goBack={this._goBack}
                                 onSubmitEditing={this._onSubmitEditing}
                                 changeLayout={this._changeLayout} isHorizontal={this.state.isHorizontal}/>
                <ResultSegmentView onPressAtIndex={this._onPressAtIndex}/>
                <FlatList
                    style={this.state.isHorizontal ? { marginLeft: 10, marginRight: 15 } : null}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => `${index}`}
                    numColumns={this.state.isHorizontal ? 2 : 1}
                    key={this.state.isHorizontal ? 'hShow' : 'vShow'}
                    data={[{}, {}, {}, {}]}>
                </FlatList>
            </View>
        );
    }
}
