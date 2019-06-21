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
    TouchableOpacity,
    Animated
} from 'react-native';

import ImageLoad from '@mr/image-placeholder';
import { homeType } from '../home/HomeTypes';
import HomeAPI from '../home/api/HomeAPI';
import { routePush } from '../../navigation/RouterMap';
import { homeModule } from '../home/model/Modules';
import { trackEvent, track } from '../../utils/SensorsTrack';

export default class LuckyIcon extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            x: new Animated.Value(25),
            show: false,
            data: {}
        };
        this.isOpen = false;
    }

    componentDidMount() {
    }

    getLucky = (showPage, showPageValue) => {
        HomeAPI.getHomeData({ type: homeType.float, showPage, showPageValue }).then((data) => {
            if (data.data && data.data.length > 0) {
                this.setState({ show: true });
                this.setState({ data: data.data[0] });

            } else {
                this.setState({ show: false });
            }
        }).catch(() => {
            this.setState({ show: false });
        });
    };

    open = () => {
        if (this.isOpen === false) {
            Animated.spring(
                // Animate value over time
                this.state.x, // The value to drive
                {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true
                }
            ).start();
        }
        this.isOpen = true;
    };

    close = () => {
        if (this.isOpen === true) {
            Animated.spring(
                // Animate value over time
                this.state.x, // The value to drive
                {
                    toValue: 25,
                    duration: 500,
                    useNativeDriver: true
                }
            ).start();
            this.isOpen = false;
        }
    };

    _onPress = () => {
        if (this.isOpen === false) {
            this.open();
            return;
        }

        track(trackEvent.ClickLotteryPage, { lotteryModuleSource: '1' }); //0：未知 1:app首页 100：其他
        let data = this.state.data;
        const router = homeModule.homeNavigate(data.linkType, data.linkTypeCode);
        let params = homeModule.paramsNavigate(data);
        if (router) {
            routePush(router, params);
        }
    };

    render() {
        if (this.state.show === false) {
            return <View/>;
        }

        return (
            <Animated.View
                style={{ position: 'absolute', right: 5, bottom: 40, transform: [{ translateX: this.state.x }] }}>
                <TouchableOpacity onPress={this._onPress}>
                    <ImageLoad
                        style={styles.image}
                        source={{ uri: this.state.data.image }}
                        resizeMode={'contain'}
                        isAvatar={true}
                    />
                </TouchableOpacity>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    image: {
        height: 50,
        width: 50
    }
});
