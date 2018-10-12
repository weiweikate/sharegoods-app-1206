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
                        return <View>
                            <UIText
                                onPress={() => {
                                    this.itemClick(titleItemIndex);
                                }}
                                style={[SwichStyles.titleItemStyle,
                                    this.state.selectState === titleItemIndex ?
                                        {
                                            color: ColorUtil.mainRedColor
                                        }
                                        :
                                        { color: ColorUtil.Color_666666 }

                                ]}
                                value={titleItem.title}
                            />
                            {
                                this.state.selectState === titleItemIndex ?
                                    <View
                                        style={
                                            {
                                                marginTop:10,
                                                height:1,
                                                backgroundColor:ColorUtil.mainRedColor
                                            }
                                        }
                                    />
                                    :
                                    null
                            }

                        </View>;

                    })
                }
            </View>
        );

    };

    itemClick = (index) => {
        this.setState({
            selectState: index
        });
        this.props.navItemClick&&this.props.navItemClick(index)
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
