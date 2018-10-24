/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by huchao on 2018/10/19.
 *
 */
'use strict';
import React from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';
import BasePage from '../../../BasePage';
import ShareTaskResultAlert from '../components/ShareTaskResultAlert';
// import RefreshLargeList from 'RefreshLargeList';

type Props = {};
export default class ShareTaskListPage extends BasePage<Props> {
    constructor(props) {
        super(props);
        this.state = {};
        this._bind();
    }

    $navigationBarOptions = {
        title: '我的任务',
        show: true// false则隐藏导航
    };

    _bind() {
        this.loadPageData = this.loadPageData.bind(this);
    }

    componentDidMount() {
        this.loadPageData();
        // this.shareModal.open();
    }

    loadPageData() {
    }

    _render() {
        return (
            <View style={styles.container}>
                {/*<RefreshLargeList*/}
                {/*style={{height: 400, width: 100, marginTop: 100}}*/}
                {/*ref = {(ref) => {this.list = ref}}*/}
                {/*heightForSection={() => 50}*/}
                {/*renderSection={this._renderSection}*/}
                {/*heightForCell={() => 50}*/}
                {/*renderItem={this._renderIndexPath}*/}
                {/*/>*/}
                <ShareTaskResultAlert ref={(ref) => this.shareModal = ref}
                                      success={true}
                                      money={25}
                                      shareValue={18}
                                      onPress={() => {
                                          this.$navigate('mine/userInformation/MyCashAccountPage');
                                      }}/>
            </View>
        );
    }


    _renderSection = ({section}) => {
        return (
            <View style={styles.section}>
                <Text>
                    {section}
                </Text>
            </View>
        );
    };

    _renderIndexPath = ({section, row}) => {
        return (
            <View style={styles.row}>
                <Text>
                    {'section' + section + ',row:' + row}
                </Text>
                <View style={styles.line}/>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    section: {
        flex: 1,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center'
    },
    row: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
