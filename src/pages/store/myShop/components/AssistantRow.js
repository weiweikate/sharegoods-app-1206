//店员信息
import React, { Component } from 'react';
import {
    View,
    StyleSheet, Image
} from 'react-native';
import SwipeOut from 'react-native-swipeout';
import DesignRule from '../../../../constants/DesignRule';
import {
    MRText as Text
} from '../../../../components/ui';
import AvatarImage from '../../../../components/ui/AvatarImage';
import UIImage from '@mr/image-placeholder';
import NoMoreClick from '../../../../components/ui/NoMoreClick';
import LinearGradient from 'react-native-linear-gradient';
import res from '../../res';
import DateUtils from '../../../../utils/DateUtils';

const { close_icon } = res.button;

export default class AssistantRow extends Component {

    state = { open: false };

    _clickAssistantDetail = () => {
        const { userCode, tutorStatus, roleType } = this.props.item;
        const { onPress } = this.props;
        onPress && onPress(userCode, tutorStatus, roleType);
    };

    _onPressDelete = () => {
        const { userCode } = this.props.item;
        const { onPressDelete } = this.props;
        onPressDelete && userCode && onPressDelete(userCode);
    };


    renderContent = () => {
        const {
            headImg, levelName, nickName, roleType, tutorStatus,
            packageStatus, packageImg, status, waitDeadline
        } = this.props.item;
        const { showActivityImage, index } = this.props;
        return (
            <NoMoreClick style={[styles.rowContainer, index === 0 && { marginTop: 10 }]}
                         onPress={this._clickAssistantDetail}>
                <View style={styles.rowView}>
                    <AvatarImage source={{ uri: headImg }} style={styles.headerImg} borderRadius={14}/>
                    <View style={styles.right}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.name}>{nickName || ''}</Text>
                            {packageStatus && showActivityImage && roleType === 0 ?
                                <UIImage source={{ uri: packageImg }}
                                         style={{ width: 59, height: 16, marginLeft: 5 }}/> : null}
                            {roleType === 0 &&
                            <LinearGradient style={styles.roleView}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            colors={['#FFCB02', '#FF9502']}>
                                <Text style={styles.roleText}>店主</Text>
                            </LinearGradient>}
                            {tutorStatus === 1 &&
                            <LinearGradient style={styles.roleView}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            colors={['#FC5D39', '#FF0050']}>
                                <Text style={styles.roleText}>导师</Text>
                            </LinearGradient>}
                        </View>
                        <Text style={styles.level}>{levelName || ''}</Text>
                        {status === 10 &&
                        <Text
                            style={styles.desc}>若未扩容，此成员将在{waitDeadline ? DateUtils.formatDate(waitDeadline, 'yyyy-MM-dd HH:mm') : ''}离店</Text>}
                    </View>
                </View>
                {status === 10 && <LinearGradient style={styles.linearGradient}
                                                  start={{ x: 0, y: 0 }}
                                                  end={{ x: 1, y: 0 }}
                                                  colors={['#FF0050', '#FC5D39']}>
                    <Text style={{ fontSize: 13, color: 'white' }}>待扩容</Text>
                </LinearGradient>}
            </NoMoreClick>);
    };

    render() {
        if (this.props.roleType !== 0) {
            return this.renderContent();
        }
        const swipeOutButtons = [
            {
                onPress: this._onPressDelete,
                backgroundColor: DesignRule.bgColor,
                component: (
                    <View style={styles.swipeCustomView}>
                        <Text style={{ color: 'white', fontSize: 13 }} allowFontScaling={false}>删 除</Text>
                    </View>
                )
            }
        ];
        return (<SwipeOut style={styles.container} right={swipeOutButtons}
                          autoClose={true}>
            {this.renderContent()}
        </SwipeOut>);
    }
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 10, marginHorizontal: 15, backgroundColor: DesignRule.bgcolor
    },
    swipeCustomView: {
        flex: 1, marginLeft: 10, alignItems: 'center', justifyContent: 'center',
        backgroundColor: DesignRule.mainColor, borderRadius: 10
    },

    rowContainer: {
        borderRadius: 10, backgroundColor: 'white'
    },
    rowView: {
        flexDirection: 'row', alignItems: 'center', marginVertical: 15
    },
    headerImg: {
        width: 50, height: 50, borderRadius: 25, overflow: 'hidden',
        marginLeft: 15, marginRight: 10
    },
    right: {
        flex: 1, justifyContent: 'center'
    },
    name: {
        fontSize: 15, color: DesignRule.textColor_mainTitle
    },
    level: {
        fontSize: 13, paddingTop: 5, color: DesignRule.textColor_secondTitle
    },
    desc: {
        fontSize: 10, paddingTop: 5, color: DesignRule.textColor_redWarn
    },

    linearGradient: {
        justifyContent: 'center', alignItems: 'center', right: 0, top: 0,
        position: 'absolute',
        width: 50, height: 20, borderTopRightRadius: 10, borderBottomLeftRadius: 10
    },
    roleView: {
        alignItems: 'center', justifyContent: 'center', width: 40, height: 20, borderRadius: 10, marginRight: 5
    },
    roleText: {
        fontSize: 13, color: 'white'
    }
});

export class ExplainView extends Component {

    state = {
        showClose: true
    };

    render() {
        if (!this.state.showClose) {
            return null;
        }
        return (
            <View style={{ backgroundColor: 'white' }}>
                <Text style={stylesE.title}>温馨提示：</Text>
                <Text
                    style={stylesE.titleContent}>{`1. 扩容后，待扩容成员将成为正式成员；\n2. 待扩容期内，此成员可自由离店；\n3. 若指定时间内不扩容，此成员将自动离店。`}</Text>
                <NoMoreClick style={stylesE.closeBtn} onPress={() => {
                    this.setState({
                        showClose: false
                    });
                }}>
                    <Image source={close_icon} style={stylesE.closeIcon}/>
                </NoMoreClick>
            </View>
        );

    }
}

const stylesE = StyleSheet.create({
    title: {
        fontSize: 12, color: DesignRule.textColor_instruction, paddingHorizontal: 15
    },
    titleContent: {
        fontSize: 12, color: DesignRule.textColor_secondTitle, marginTop: 5, paddingHorizontal: 15, paddingBottom: 10
    },
    closeBtn: {
        position: 'absolute', top: 0, right: 15
    },
    closeIcon: {
        margin: 8, width: 12, height: 12
    }
});

