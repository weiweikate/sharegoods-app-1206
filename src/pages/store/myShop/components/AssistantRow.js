//店员信息
import React, { Component } from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import SwipeOut from 'react-native-swipeout';
import DesignRule from '../../../../constants/DesignRule';
import {
    MRText as Text
} from '../../../../components/ui';
import AvatarImage from '../../../../components/ui/AvatarImage';
import UIImage from '@mr/image-placeholder';
import NoMoreClick from '../../../../components/ui/NoMoreClick';

export default class AssistantRow extends Component {

    state = { open: false };

    _clickAssistantDetail = () => {
        const { userCode } = this.props.item;
        const { onPress } = this.props;
        onPress && onPress(userCode);
    };

    _onPressDelete = () => {
        const { userCode } = this.props.item;
        const { onPressDelete } = this.props;
        onPressDelete && userCode && onPressDelete(userCode);
    };


    renderContent = () => {
        const { headImg, levelName, nickName, roleType, packageStatus, packageImg, status } = this.props.item;
        const { showActivityImage } = this.props;
        return (
            <NoMoreClick style={styles.rowContainer} onPress={this._clickAssistantDetail}>
                <View style={styles.rowView}>
                    <AvatarImage source={{ uri: headImg }} style={styles.headerImg} borderRadius={14}/>
                    <View style={styles.right}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.name}>{nickName || ''}</Text>
                            {packageStatus && showActivityImage && roleType === 0 ?
                                <UIImage source={{ uri: packageImg }}
                                         style={{ width: 59, height: 16, marginLeft: 5 }}/> : null}
                        </View>
                        <Text style={styles.level}>{levelName || ''}</Text>
                        {status === 10 && <Text style={styles.desc}>若未扩容，此成员将在{levelName || ''}离店</Text>}
                    </View>
                </View>
            </NoMoreClick>);
    };

    render() {
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
    }
});

