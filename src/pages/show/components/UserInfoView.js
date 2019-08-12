/**
 * @author xzm
 * @date 2019/7/22
 */

import React, { PureComponent } from 'react';
import { Image, ImageBackground, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import user from '../../../model/user';
import ScreenUtils from '../../../utils/ScreenUtils';
import res from '../../mine/res';
import showRes from '../res';
import EmptyUtils from '../../../utils/EmptyUtils';
import DesignRule from '../../../constants/DesignRule';
import WriterInfoView from './WriterInfoView';
import { AvatarImage, MRText as Text } from '../../../components/ui';
import RouterMap, { routePush } from '../../../navigation/RouterMap';
import LinearGradient from 'react-native-linear-gradient';
import ShowApi from '../ShowApi';
import ShowUtils from '../utils/ShowUtils';
import bridge from '../../../utils/bridge';

const { px2dp } = ScreenUtils;

const {
    showHeaderBg
} = showRes;
export default class UserInfoView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            attentions: 0,
            fans: 0,
            hot: 0,
            relationType: -1,
            userType: 0
        };
    }

    componentDidMount() {
        if (this.props.userType === 'mineWriter' || this.props.userType === 'mineNormal') {
            ShowApi.getMineInfo().then((data) => {
                const { fansCount, followCount, likeCount, collectCount } = data.data;
                this.setState({
                    attentions: followCount,
                    fans: fansCount,
                    hot: likeCount + collectCount
                });
            }).catch((err) => {

            });
        } else {
            const { userNo = '' } = this.props.userInfo || {};
            ShowApi.getOthersInfo({ userCode: userNo }).then((data) => {
                const { fansCount, followCount, likeCount, collectCount, relationType, userType } = data.data;
                this.setState({
                    relationType,
                    attentions: followCount,
                    fans: fansCount,
                    hot: likeCount + collectCount,
                    userType
                });
            }).catch((err) => {

            });
        }
    }

    _attentionButton = () => {
        const { userNo = '' } = this.props.userInfo || {};
        const { relationType, fans = 0 } = this.state;

        let text = '';
        if (relationType === 0) {
            text = '关注';
        } else if (relationType === 1) {
            text = '已关注';
        } else if (relationType === 2) {
            text = '相互关注';
        }

        return (
            <TouchableWithoutFeedback onPress={() => {
                if (relationType === 0) {
                    ShowApi.userFollow({ userNo }).then(() => {
                        this.setState({
                            relationType: 1,
                            fans: fans + 1
                        });
                    }).catch((error) => {
                        bridge.$toast(error.msg);
                    });
                } else {
                    ShowApi.cancelFollow({ userNo }).then(() => {
                        this.setState({
                            relationType: 0,
                            fans: fans > 0 ? fans - 1 : fans
                        });
                    }).catch((error) => {
                        bridge.$toast(error.msg);
                    });
                }

            }}>
                <LinearGradient
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    colors={['#FFCB02', '#FF9502']}
                    style={{
                        width: px2dp(65),
                        height: px2dp(22),
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: px2dp(11),
                        marginTop: px2dp(-11)
                    }}>
                    <Text style={{ color: DesignRule.white, fontSize: DesignRule.fontSize_threeTitle }}>
                        {text}
                    </Text>
                </LinearGradient>
            </TouchableWithoutFeedback>);
    };

    render() {
        const { userNo = '' } = this.props.userInfo || {};

        const { userImg, userName } = this.props.userInfo || {};
        let img = (this.props.userType === 'mineNormal' || this.props.userType === 'mineWriter') ? user.headImg : userImg;
        let name = '';
        if (this.props.userType === 'mineNormal' || this.props.userType === 'mineWriter') {
            name = EmptyUtils.isEmpty(user.nickname) ? user.phone : user.nickname;
        } else {
            name = userName;
        }
        if (name.length > 6) {
            name = name.substring(0, 6) + '...';
        }
        let icon = (!EmptyUtils.isEmpty(img)) ?
            <AvatarImage source={{ uri: img }} style={styles.userIcon}
                         borderRadius={px2dp(75 / 2)}/> :
            <Image source={res.placeholder.avatar_default} style={styles.userIcon}
                   borderRadius={px2dp(75 / 2)}/>;


        //布局不能改，否则android不能显示
        return (
            <View style={{
                flex: 1,
                position: 'absolute',
                left: 0,
                top: 0,
                width: DesignRule.width,
                height: this.props.userType === 'mineNormal' ? px2dp(235) : px2dp(270),
                backgroundColor: '#F7F7F7',
                marginBottom: px2dp(ScreenUtils.isIOS ? 10 : 0)
            }}>
                <ImageBackground source={EmptyUtils.isEmpty(img) ? showHeaderBg : { uri: img }}
                                 style={styles.headerContainer} blurRadius={EmptyUtils.isEmpty(img) ? 0 : 20}>
                    {icon}
                    {(this.state.relationType !== -1 && this.props.userType !== 'mineNormal' && this.props.userType !== 'mineWriter' && this.state.userType !== 0) ?
                        this._attentionButton() : null
                    }

                    <Text style={styles.nameStyle}>
                        {name}
                    </Text>
                    {
                        this.props.userType === 'mineNormal' ?
                            <TouchableWithoutFeedback onPress={() => {
                                routePush(RouterMap.FansListPage, { type: 1 });
                            }}>
                                <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: px2dp(12) }}>
                                    <Text style={{
                                        color: DesignRule.white,
                                        fontSize: px2dp(15)
                                    }}>
                                        我的关注
                                    </Text>
                                    <Text style={{
                                        color: DesignRule.white,
                                        fontSize: px2dp(17),
                                        marginLeft: px2dp(10)
                                    }}>
                                        {ShowUtils.formatShowNum(this.state.attentions)}
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback> : null
                    }
                </ImageBackground>
                {
                    this.props.userType !== 'mineNormal' ?
                        <WriterInfoView
                            attentions={this.state.attentions}
                            fans={this.state.fans}
                            hot={this.state.hot}
                            userType={this.props.userType}
                            userNo={userNo}
                            style={{
                                marginLeft: DesignRule.margin_page,
                                marginTop: px2dp(-35)
                            }}/> : null
                }
            </View>
        );

    }
}

var styles = StyleSheet.create({
    headerContainer: {
        width: DesignRule.width,
        height: px2dp(235),
        alignItems: 'center'
    },
    userIcon: {
        width: px2dp(75),
        height: px2dp(75),
        marginTop: px2dp(64)
    },
    waterfall: {
        backgroundColor: DesignRule.bgColor
    },
    left: {
        paddingHorizontal: 15
    },
    nameStyle: {
        marginTop: px2dp(15),
        color: DesignRule.white,
        fontSize: px2dp(17)
    }
});

