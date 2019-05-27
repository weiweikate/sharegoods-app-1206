import React from 'react';
import { Animated, StyleSheet, Image,InteractionManager } from 'react-native';
import UIImage from '@mr/image-placeholder';
import NoMoreClick from '../../components/ui/NoMoreClick';
import ScreenUtils from '../../utils/ScreenUtils';
import { observable, action, autorun } from 'mobx';
import { observer } from 'mobx-react';
import { MRText } from '../../components/ui';
import res from '../res';
import DesignRule from '../../constants/DesignRule';
import StringUtils from '../../utils/StringUtils';

const { white_go } = res.button;
const { headerHeight, px2dp } = ScreenUtils;
const maxTextWidth = px2dp(120);
const { isEmpty } = StringUtils;
const maxY = maxTextWidth + 15 + 50;

class IntervalMsgModel {
    @observable msgList = [];
}

const intervalMsgModel = new IntervalMsgModel();
export default intervalMsgModel;

@observer
export class IntervalMsgView extends React.Component {

    IntervalMsgModel = new IntervalMsgViewModel();

    _onPress = () => {

    };

    render() {
        const { translateX, opacity, showItem } = this.IntervalMsgModel;
        const { style } = this.props;
        const { headImg, content, needForward, type } = showItem;
        if (isEmpty(type)) {
            return null;
        }
        return (
            <Animated.View
                style={[styles.container, { ...style, opacity, transform: [{ translateX }] }]}>
                <NoMoreClick style={styles.btn} onPress={needForward ? this._onPress : () => {
                }}>
                    <UIImage style={styles.image} source={{ uri: headImg }}
                             isAvatar={true}/>
                    <MRText style={styles.text}
                            numberOfLines={1}>{content || ''}</MRText>
                    {needForward && <Image style={styles.arrow} source={white_go}/>}
                </NoMoreClick>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute', left: 15, top: headerHeight + 60
    },
    btn: {
        flexDirection: 'row', alignItems: 'center',
        height: 20, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.5)'
    },
    image: {
        marginRight: 5, overflow: 'hidden',
        width: 20, height: 20, borderRadius: 10
    },
    text: {
        marginRight: 3, maxWidth: maxTextWidth,
        fontSize: 10, color: DesignRule.white
    },
    arrow: {
        marginRight: 5.5,
        width: 10, height: 10
    }
});

class IntervalMsgViewModel {
    showItems = intervalMsgModel.msgList;
    needUpdate = false;
    isAnimated = false;
    /*
    *{
    * content  ush:发布了新动态
    * forwardType  22
    * headImg
    * keyCode show001
    * needForward true
    * type 9
    * userName
    *}
    * */
    @observable showItem = {};
    @observable translateX = new Animated.Value(-maxY);
    @observable opacity = new Animated.Value(1);

    @action startAnimated = (index) => {
        this.isAnimated = true;
        if (this.needUpdate) {
            this.needUpdate = false;
            index = 0;
        }

        this.showItem = this.showItems[index] || {};
        const { type } = this.showItem;
        if (isEmpty(type)) {
            this.isAnimated = false;
            return;
        }
        Animated.sequence([
            Animated.delay(5000),
            Animated.timing(
                this.translateX,
                { toValue: 0, duration: 500, useNativeDriver: true }
            ),
            Animated.delay(5000),
            Animated.timing(
                this.opacity,
                { toValue: 0, duration: 1000, useNativeDriver: true }
            )
        ]).start(
            () => {
                /*复原*/
                this.translateX = new Animated.Value(-maxY);
                this.opacity = new Animated.Value(1);
                /*循环,准备下一位贵宾*/
                this.startAnimated(++index);
            }
        );
    };

    autorun = autorun(() => {
        /*有新数据*/
        this.showItems = intervalMsgModel.msgList || [];
        this.needUpdate = true;
        /*没有进行中的动画启动*/
        InteractionManager.runAfterInteractions(() => {
            !this.isAnimated && this.startAnimated(0);
        });
    });
}
