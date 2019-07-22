/**
 * @author xzm
 * @date 2019/7/19
 */

import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import { MRText } from '../../../components/ui';
const{px2dp} = ScreenUtils;

export default class WriterInfoView extends PureComponent {
  constructor(props) {
    super(props);

  }

  render(){
      return(
          <View style={[styles.wrapper,this.props.style]}>
              <View>
                  <MRText>
                      14
                  </MRText>
                  <MRText>
                      关注
                  </MRText>
              </View>
              <View>
                  <MRText>
                      14
                  </MRText>
                  <MRText>
                      关注
                  </MRText>
              </View>
              <View>
                  <MRText>
                      14
                  </MRText>
                  <MRText>
                      关注
                  </MRText>
              </View>
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

