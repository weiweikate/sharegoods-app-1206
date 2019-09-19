//店员信息
import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import SwipeOut from 'react-native-swipeout';
import DesignRule from '../../../../constants/DesignRule';
import {
    MRText as Text
} from '../../../../components/ui';
import AvatarImage from '../../../../components/ui/AvatarImage';
import UIImage from '@mr/image-placeholder';

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
        const { headImg, levelName, nickName, roleType, packageStatus, packageImg } = this.props.item;
        const { showActivityImage } = this.props;
        return (<TouchableWithoutFeedback onPress={this._clickAssistantDetail}>
            <View style={styles.rowContainer}>
                <AvatarImage source={{ uri: headImg }} style={styles.headerImg} borderRadius={14}/>
                <View style={styles.right}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
                        <Text style={styles.name} allowFontScaling={false}>{nickName || ' '}</Text>
                        {packageStatus && showActivityImage && roleType === 0 ?
                            <UIImage source={{ uri: packageImg }}
                                     style={{ width: 59, height: 16, marginLeft: 5 }}/> : null}
                    </View>
                    <Text style={styles.level} allowFontScaling={false}>{levelName || ' '}</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>);
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
    swipeCustomView: {
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: DesignRule.mainColor,
        borderRadius: 10
    },
    container: {
        backgroundColor: DesignRule.bgColor,
        marginTop: 10,
        marginHorizontal: 15
    },
    rowContainer: {
        height: 88,
        borderRadius: 10,
        backgroundColor: 'white',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 10,
        shadowOpacity: 1,
        flexDirection: 'row',
        overflow: 'hidden',
        backgroundColor: 'white'
    },
    headerImg: {
        width: 28,
        height: 28,
        borderRadius: 14,
        marginLeft: 20,
        marginTop: 15
    },
    right: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'center'
    },
    name: {
        fontSize: 14,
        color: DesignRule.textColor_secondTitle
    },
    level: {
        fontSize: 13,
        color: DesignRule.textColor_secondTitle,
        marginVertical: 3
    },
    desc: {
        fontSize: 12,
        color: DesignRule.textColor_secondTitle
    }
});

