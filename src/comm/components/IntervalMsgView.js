import React from 'react';
import { Animated, StyleSheet, Image } from 'react-native';
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
const { headerHeight } = ScreenUtils;
const maxTextWidth = 100;
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
        const { headImg, content, needForward, type } = showItem || {};
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
        marginRight: 5,
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
    @observable translateX = new Animated.Value(-maxY);
    @observable opacity = new Animated.Value(1);
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
    @observable showItems = intervalMsgModel.msgList;
    @observable showIndex = 0;
    @observable showItem = {};

    @action startAnimated = () => {
        this.opacity = new Animated.Value(1);
        const item = this.showItems[this.showIndex];
        this.showItem = item;
        const { type } = item || {};
        if (isEmpty(type)) {
            return;
        }
        setTimeout(() => {
            this.showIndex++;
            Animated.timing(
                this.translateX,
                { toValue: 0, duration: 500, useNativeDriver: true }
            ).start(
                () => {
                    setTimeout(() => {
                        Animated.timing(
                            this.opacity,
                            { toValue: 0, duration: 500, useNativeDriver: true }
                        ).start(
                            () => {
                                this.startAnimated();
                                this.translateX = new Animated.Value(-maxY);
                            }
                        );
                    }, 5000);
                }
            );
        }, 5000);
    };

    autorun = autorun(() => {
        this.showItems = intervalMsgModel.msgList;
        this.showIndex = 0;
        this.startAnimated();
    });
}
