import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Animated
} from 'react-native';
import UIText from '../../../comm/components/UIText';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';


export default class SubDownTimeView extends Component {
    state = {
        bottomLineMarginLeft: new Animated.Value((ScreenUtils.width - 70 * 2) / 4),
        selectState: 0
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    render() {
        return (
            <View style={SwichStyles.swichBgStyle}>
                <View style={SwichStyles.titleBgStyle}>
                    <UIText
                        onPress={() => {
                            this.itemClick(0);
                        }}
                        style={[SwichStyles.titleItemStyle,
                            this.state.selectState === 0 ?
                                { color: DesignRule.mainColor } :
                                { color: DesignRule.textColor_secondTitle }

                        ]}
                        value={'美容彩妆'}
                    />
                    <UIText
                        onPress={
                            () => {
                                this.itemClick(1);
                            }
                        }
                        style={[SwichStyles.titleItemStyle,
                            this.state.selectState === 0 ?
                                { color: DesignRule.textColor_secondTitle } :
                                { color: DesignRule.mainColor }
                        ]}
                        value={'个人护肤'}
                    />
                </View>
                <Animated.View
                    style={[SwichStyles.bottomLineViewStyle,
                        {
                            marginLeft: this.state.bottomLineMarginLeft
                        }]}
                />
            </View>
        );
    }

    itemClick = (index) => {
        this.setState({
            selectState: index
        });

        if (index === 0) {
            Animated.timing(
                this.state.bottomLineMarginLeft,
                {
                    toValue: (ScreenUtils.width - 70 * 2) / 4,
                    duration: 300
                }
            ).start();
        } else {
            Animated.timing(
                this.state.bottomLineMarginLeft,
                {
                    toValue: ScreenUtils.width - ((ScreenUtils.width - 70 * 2) / 4) - 70,
                    duration: 300
                }
            ).start();
        }

    };

}

const SwichStyles = StyleSheet.create({
        swichBgStyle: {
            width: ScreenUtils.width,
            height: 48
        },
        titleBgStyle: {
            width: ScreenUtils.width,
            height: 47,
            flexDirection: 'row',
            justifyContent: 'space-around'
        },
        titleItemStyle: {
            paddingTop: 15,
            color: DesignRule.mainColor,
            fontSize: 16
        },
        bottomLineViewStyle: {
            height: 2,
            backgroundColor: DesignRule.mainColor,
            width: 70,
            marginLeft: (ScreenUtils.width - 70 * 2) / 4
        }
    }
);
