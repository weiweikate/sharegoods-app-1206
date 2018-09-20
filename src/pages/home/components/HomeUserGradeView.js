/**
 * 首页头部分类view
 */

import React, { Component } from 'react';
import {
    // StyleSheet,
    View
    // TouchableHighlight,
    // Image,
    // Text
} from 'react-native';
// import PropTypes from 'prop-types';
// import ScreenUtils from '../../../utils/ScreenUtils';
import CustomProgress from './CustomProgress';

export default class HomeUserGradeView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            progress: 0
        };
        this.currProgress = 1;
        this.currBuffer = 0.5;
    }

    render() {
        return (
            <View>
                <CustomProgress
                    ref="progressBar"
                    style={{
                        marginTop: 100
                    }}
                    progress={this.currProgress}
                    buffer={this.currBuffer}
                />
            </View>
        );
    }


}





