import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import CommModal from '../../../comm/components/CommModal';
import ScreenUtils from '../../../utils/ScreenUtils';

const { px2dp } = ScreenUtils;

export default class BigImagesModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.modalVisible !== nextState.modalVisible) {
            return true;
        }
        return false;
    }

    show = () => {
        this.setState({
            modalVisible: true
        });
    };

    _close = () => {
        this.setState({
            modalVisible: false
        });
    };

    render() {
        return (
            <CommModal onRequestClose={this._close}
                       visible={this.state.modalVisible}
                       transparent={true}>
                <View style={styles.containerView}>
                    <TouchableOpacity style={styles.topCloseBtn} onPress={this._close}/>
                </View>
            </CommModal>
        );
    }
}

const styles = StyleSheet.create({
    containerView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: ScreenUtils.width
    },
    topCloseBtn: {
        height: px2dp(271)
    }
});

