import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Animated
} from 'react-native';
import UIText from '../../../comm/components/UIText';
import ScreenUtils from '../../../utils/ScreenUtils';
import ColorUtil from '../../../utils/ColorUtil';
import PropTypes from 'prop-types';


export default class SubSwichView extends Component {

    static propTypes = {
        subjectType: PropTypes.number,
        headerData: PropTypes.object.isRequired,
        navItemClick: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        // const {topicNavTitleList} = this.props
        // const titleWith = ScreenUtils.width/topicNavTitleList.slice().length
        this.state = {
            bottomLineMarginLeft: new Animated.Value(0),
            selectState: 0
        };
    }
    render() {
        // const { headerData } = this.props;
        return (
            <View style={SwichStyles.swichBgStyle}>
                {this._renderTitleItem()}
                <Animated.View
                    style={[SwichStyles.bottomLineViewStyle,
                        {
                            marginLeft: this.state.bottomLineMarginLeft
                        }]}
                >
                </Animated.View>
            </View>
        );
    }

    _renderTitleItem = () => {
        const { topicNavTitleList } = this.props.headerData || [];
        let tempTitleArr = topicNavTitleList || [];
        return (
            <View style={SwichStyles.titleBgStyle}>
                {
                    tempTitleArr.slice().map((titleItem, titleItemIndex) => {

                    return  <UIText
                            onPress={() => {
                                this.itemClick(titleItemIndex);
                            }}
                            style={[SwichStyles.titleItemStyle,
                                this.state.selectState === titleItemIndex ?
                                    {
                                        borderBottomWidth:1,
                                        borderColor:ColorUtil.mainRedColor
                                    } :
                                    { color: ColorUtil.Color_666666 }

                            ]}
                            value={titleItem.title}
                        />;
                    })
                }
            </View>
        );

    };

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
            color: ColorUtil.Color_d51243,
            fontSize: 16
        },
        bottomLineViewStyle: {
            height: 2,
            backgroundColor: ColorUtil.Color_d51243,
            width: 50,
            marginLeft: (ScreenUtils.width - 70 * 2) / 4
        }
    }
);
