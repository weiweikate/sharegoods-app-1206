/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2018/10/18.
 *
 */
'use strict';

import React from 'react';

import {
    StyleSheet,
    View,
    Animated,
    TouchableWithoutFeedback
} from 'react-native';

import Modal from '../../../comm/components/CommModal';

export default class ShareTaskAnimation extends React.Component {

    constructor(props) {
        super(props);

        this._bind();

        this.state = {
            modalVisible: false,
            scale: new Animated.Value(1)
        };
    }

    _bind() {
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    open() {
        this.setState({ modalVisible: true });
        this.modal && this.modal.open();
        this.state.scale.setValue(0);
        Animated.spring(
            this.state.scale, // The value to drive
            {
                toValue: 1,
                duration: 500
            }
        ).start();
    }

    close() {
        this.setState({ modalVisible: false });
    }


    componentDidMount() {
    }

    render() {
        return (
            <Modal onRequestClose={this.close}
                   ref={(ref) => {
                       this.modal = ref;
                   }}
                   visible={this.state.modalVisible}
            >
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.close();
                    }}
                >
                    <View style={styles.container}>
                        <Animated.View style={[
                            { transform: [{ scale: this.state.scale }] },
                            this.props.contentStyle]}
                        >
                            <TouchableWithoutFeedback>
                                <View>
                                    {this.props.children}
                                </View>
                            </TouchableWithoutFeedback>
                        </Animated.View>
                    </View>
                </TouchableWithoutFeedback>

            </Modal>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
