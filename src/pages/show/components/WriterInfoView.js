/**
 * @author xzm
 * @date 2019/7/19
 */

import React, { PureComponent } from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import { MRText } from '../../../components/ui';
import { routePush } from '../../../navigation/RouterMap';
import RouterMap from '../../../navigation/RouterMap';
import ShowApi from '../ShowApi';

const { px2dp } = ScreenUtils;

export default class WriterInfoView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            attentions: 0,
            fans: 0,
            hot: 0
        };
    }

    componentDidMount() {
        if(this.props.userType === 'mineWriter' || this.props.userType === 'mineNormal'){
            ShowApi.getMineInfo().then((data)=>{
                const {fansCount,followCount,likeCount,collectCount} = data.data;
                this.setState({
                    attentions: followCount,
                    fans: fansCount,
                    hot: likeCount+collectCount
                })
            }).catch((err)=>{

            })
        }
    }

    render() {
        return (
            <View style={[styles.wrapper, this.props.style]}>
                <TouchableWithoutFeedback onPress={() => {
                    routePush(RouterMap.FansListPage, { type: 1 });
                }}>
                    <View style={styles.itemWrapper}>
                        <MRText style={styles.numStyle}>
                            {this.state.attentions}
                        </MRText>
                        <MRText style={styles.textStyle}>
                            关注
                        </MRText>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => {
                    routePush(RouterMap.FansListPage, { type: 0 });
                }}>
                    <View style={styles.itemWrapper}>
                        <MRText style={styles.numStyle}>
                            {this.state.fans}
                        </MRText>
                        <MRText style={styles.textStyle}>
                            粉丝
                        </MRText>
                    </View>
                </TouchableWithoutFeedback>

                <View style={styles.itemWrapper}>
                    <MRText style={styles.numStyle}>
                        {this.state.hot}
                    </MRText>
                    <MRText style={styles.textStyle}>
                        收藏与获赞
                    </MRText>
                </View>

            </View>
        );
    }
}

var styles = StyleSheet.create({
    wrapper: {
        height: px2dp(70),
        width: DesignRule.margin_width,
        backgroundColor: DesignRule.white,
        borderRadius: px2dp(5),
        paddingHorizontal: px2dp(30),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    itemWrapper: {
        alignItems: 'center'
    },
    numStyle: {
        color: DesignRule.textColor_mainTitle,
        fontSize: DesignRule.fontSize_bigBtnText,
        fontWeight: '400'
    },
    textStyle: {
        color: DesignRule.textColor_secondTitle,
        fontSize: DesignRule.fontSize_24
    }
});

