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
const{px2dp} = ScreenUtils;

export default class WriterInfoView extends PureComponent {
    constructor(props) {
        super(props);

    }

    render(){
        return(
            <View style={[styles.wrapper,this.props.style]}>
                <TouchableWithoutFeedback onPress={()=> {routePush(RouterMap.FansListPage,{type:1})}}>
                    <View>
                        <MRText>
                            14
                        </MRText>
                        <MRText>
                            关注
                        </MRText>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={()=> {routePush(RouterMap.FansListPage,{type:0})}}>
                    <View>
                        <MRText>
                            11
                        </MRText>
                        <MRText>
                            粉丝
                        </MRText>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={()=> {routePush(RouterMap.FansListPage,{type:2})}}>
                    <View>
                        <MRText>
                            14
                        </MRText>
                        <MRText>
                            关注
                        </MRText>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    wrapper:{
        height:px2dp(70),
        width:DesignRule.margin_width,
        backgroundColor:DesignRule.white,
        borderRadius:px2dp(5),
        paddingHorizontal:px2dp(30),
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    }
});

