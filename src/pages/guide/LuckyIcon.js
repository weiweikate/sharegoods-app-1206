/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2019/3/7.
 *
 */


'use strict';

import React from 'react';

import {
    StyleSheet,
    View,
    TouchableOpacity
} from 'react-native';

import ImageLoad from '@mr/image-placeholder';
import GuideApi from './GuideApi';
import { navigate } from '../../navigation/RouterMap';
import { homeModule } from '../home/Modules';

export default class LuckyIcon extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            show: false,
            data: {}
        };
    }

    componentDidMount() {
    }

    getLucky = () =>{
        GuideApi.getLucky({}).then((data) => {
            if (data.data && data.data.linkTypeCode){
                this.open();
                this.setState({data: data.data})
            } else {
                this.close();
            }
        }).catch(() => {
        })
    }

    open = () => {
        this.setState({show: true});
    }

    close = () => {
        this.setState({show: false});
    }

    _onPress = () => {
        let data = this.state.data;
        const router = homeModule.homeNavigate(data.linkType, data.linkTypeCode);
        let params = homeModule.paramsNavigate(data);
        if (router){
            navigate(router, params);
        }
    }

    render() {
        if (this.state.show === false) {
            return <View/>;
        }

        return (
            <View style={{position: 'absolute', right: 0, bottom: 40}}>
                <TouchableOpacity onPress={this._onPress}>
                    <ImageLoad
                        style={styles.image}
                        source={{uri: this.state.data.icon}}
                        resizeMode={'contain'}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        height: 50,
        width: 50,
        backgroundColor: 'red'
    }
});
