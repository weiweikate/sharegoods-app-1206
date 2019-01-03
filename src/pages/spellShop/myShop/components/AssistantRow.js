//店员信息
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Image,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import SwipeOut from 'react-native-swipeout';
import DesignRule from 'DesignRule';
import StringUtils from '../../../../utils/StringUtils';
import {
    MRText as Text
} from '../../../../components/ui';

export default class AssistantRow extends Component {

    static propTypes = {
        item: PropTypes.object,     //数据
        style: PropTypes.any,       //样式
        onPress: PropTypes.func,    //点击回调
        onPressDelete: PropTypes.func,//删除的回调
        isYourStore: PropTypes.bool  //是否是自己的店铺
    };

    static defaultProps = {
        item: {},
        isYourStore: false
    };

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


    renderContent = (style) => {
        let { headImg, levelName, nickName, contribution } = this.props.item;
        let { tradeBalance } = this.props;
        tradeBalance = StringUtils.isEmpty(tradeBalance) ? 0 : parseFloat(tradeBalance);
        contribution = StringUtils.isEmpty(contribution) ? 0 : parseFloat(contribution);
        const sty = [styles.rowContainer];
        // TODO 等待后台确定贡献度 计算方式
        sty.push(style);
        sty.push({ backgroundColor: 'white' });
        return (<TouchableWithoutFeedback onPress={this._clickAssistantDetail}>
            <View style={sty}>
                {
                    headImg ? <Image source={{ uri: headImg }} style={styles.headerImg}/> :
                        <View style={[styles.headerImg, { backgroundColor: DesignRule.lineColor_inColorBg }]}/>
                }
                <View style={styles.right}>
                    <Text style={styles.name} allowFontScaling={false}>{nickName || ' '}</Text>
                    <Text style={styles.level} allowFontScaling={false}>{levelName || ' '}</Text>
                    <Text
                        style={styles.desc} allowFontScaling={false}>贡献度：{tradeBalance === 0 ? 0 : ((contribution / tradeBalance) * 100).toFixed(2)}%</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>);
    };

    render() {
        if (!this.props.isYourStore) {
            return this.renderContent(styles.container);
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
        return (<SwipeOut style={styles.container} onOpen={this._onOpen} onClose={this._onClose} right={swipeOutButtons}
                          autoClose={true}>
            {this.renderContent()}
        </SwipeOut>);
    }

    _onOpen = () => {
        // if(this.state.open)return;
        // this.setState({open: true});
    };

    _onClose = () => {
        // if(!this.state.open)return;
        // this.setState({open: false});
    };
}

const styles = StyleSheet.create({
    swipeCustomView: {
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: DesignRule.mainColor,
        borderRadius: 10
        // borderTopRightRadius: 10,
        // borderBottomRightRadius: 10,
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
        overflow: 'hidden'
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

