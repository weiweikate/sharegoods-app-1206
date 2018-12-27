/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JuRe Group Holding Ltd. All Rights Reserved
 *
 * @flow
 *
 * Created by huchao on 2018/10/18.
 *
 */
'use strict';
import React from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    TouchableWithoutFeedback,
    Image
} from 'react-native';
import BasePage from '../../../BasePage';
import {
    UIText
} from '../../../components/ui';
import ScreenUtils from '../../../utils/ScreenUtils';
import apiEnvironment from '../../../api/ApiEnvironment';
import taskApi from '../api/taskApi';
import CommShareModal from '../../../comm/components/CommShareModal';
import user from '../../../model/user';
import res from '../res';
import DesignRule from 'DesignRule';
const banner = res.banner;

type Props = {};
export default class ShareTaskIntroducePage extends BasePage<Props> {
    constructor(props) {
        super(props);
        this.state = {
            data: {}
        };
        this._bind();

    }

    $navigationBarOptions = {
        title: '任务说明',
        show: true// false则隐藏导航
    };

    _bind() {
        this.loadPageData = this.loadPageData.bind(this);
    }

    $isMonitorNetworkStatus() {
        return true;
    }

    componentDidMount() {
        this.loadPageData();
    }

    loadPageData() {
        taskApi.taskDetail({ jobId: this.params.jobId }).then((result) => {
                this.setState({ data: result.data });
            }
        ).catch((error) => {
            this.$toastShow(error.msg);
        });
    }

    _render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <UIText value={'任务说明'} style={styles.title}/>
                    <UIText value={this.state.data.remarks} style={styles.title}/>
                    <Image
                        source={banner}
                        style={styles.image}
                    />
                </ScrollView>
                {this.params.status === 1 ? <TouchableWithoutFeedback onPress={() => {
                    this.shareModal.open();
                }}>
                    <View style={{
                        backgroundColor: DesignRule.mainColor,
                        height: 50,
                        alignItems: 'center',
                         justifyContent: 'center',
                        marginHorizontal: DesignRule.margin_page,
                        borderRadius: 5,
                    }}>
                        <UIText value={'分享好友帮你点击'} style={{ color: 'white', fontSize: 16 }}/>
                    </View>
                </TouchableWithoutFeedback> : null}
                <CommShareModal ref={(ref) => this.shareModal = ref}
                                type={'task'}
                                // webJson={{
                                //     title: '邀请好友可获得品牌推广的现金奖励',
                                //     dec: '',
                                //     linkUrl: `${apiEnvironment.getCurrentH5Url()}/pages/my/task/task-share/task-share?inviteId=${user.id}&jobId=${this.params.jobId}`,
                                //     thumImage: 'logo.png'
                                // }}
                                // type={'miniProgram'}
                                miniProgramJson={{
                                    title: '邀请好友可获得品牌推广的奖励',
                                    dec: '',
                                    thumImage: 'logo.png',
                                    hdImageURL: '',
                                    linkUrl: `${apiEnvironment.getCurrentH5Url()}/pages/index/index`,
                                    miniProgramPath: `/pages/my/task/task-share/task-share?inviteId=${user.code}&jobId=${this.params.id}`
                                }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: ScreenUtils.safeBottom
    },
    title: {
        fontSize: 13,
        color: DesignRule.textColor_mainTitle,
        marginHorizontal: 15,
        marginTop: 10
    },
    detail: {
        fontSize: 12,
        color: DesignRule.textColor_mainTitle,
        marginHorizontal: 15,
        marginTop: 10
    },
    image: {
        marginLeft: 15,
        marginTop: 15,
        height: ScreenUtils.autoSizeWidth(460),
        width: ScreenUtils.autoSizeWidth(346)
    }

});
