import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import navBack from '../../../../components/pageDecorator/NavigatorBar/source/icon_header_back.png';
import verticalRow from '../res/verticalRow.png';
import horizontalRow from '../res/horizontalRow.png';

export default class ResultSearchNav extends Component {

    static propTypes = {
        goBack: PropTypes.func.isRequired,
        value: PropTypes.string,
        changeLayout: PropTypes.func.isRequired,
        isHorizontal: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    _selectedLayoutType = () => {
        if (this.props.changeLayout) {
            this.props.changeLayout();
        }
    };

    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                <View style={styles.contentView}>
                    <TouchableOpacity style={styles.navBackBtn} onPress={this.props.goBack}>
                        <Image source={navBack}/>
                    </TouchableOpacity>
                    <View style={styles.inputView}>
                        <Text style={{ marginLeft: 24 ,color:'#212121'}}>{this.props.value}</Text>
                    </View>
                    <TouchableOpacity style={styles.styleTypeBtn} onPress={this._selectedLayoutType}>
                        <Image source={this.props.isHorizontal ? horizontalRow : verticalRow}/>
                    </TouchableOpacity>
                </View>
            </View>);
    }

}

const styles = StyleSheet.create({
    container: {
        height: ScreenUtils.headerHeight,
        width: ScreenUtils.width,
        backgroundColor: 'white'
    },
    contentView: {
        marginTop: ScreenUtils.statusBarHeight,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },

    navBackBtn: {
        alignItems: 'center',
        width: 42
    },
    styleTypeBtn: {
        alignItems: 'center',
        width: 58
    },

    inputView: {
        height: 30,
        borderRadius: 15,
        backgroundColor: '#F7F7F7',
        justifyContent: 'center',
        flex: 1,
        marginRight: 10
    }


});

