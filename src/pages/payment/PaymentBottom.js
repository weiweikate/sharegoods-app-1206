import React from 'react';
import DesignRule from '../../constants/DesignRule';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils'
const { px2dp } = ScreenUtils
import {MRText as Text} from '../../components/ui'
export default ({shouldPayMoney, onPress}) => <View style={styles.container}>
<View style={styles.line}/>
<View style={styles.row}>
    <View style={styles.bottomStyleContainer}>
        <Text style={styles.bottomUiText} allowFontScaling={false}>合计: </Text>
        <Text style={styles.bottomUitext1} allowFontScaling={false}>{ shouldPayMoney || 0 }元</Text>
    </View>
    <TouchableOpacity style={styles.bottom} onPress={() => onPress && onPress()}>
        <Text style={styles.pay} allowFontScaling={false}>去支付</Text>
    </TouchableOpacity>
</View>
</View>

const styles = StyleSheet.create({
  container: {
    paddingBottom: ScreenUtils.safeBottom,
    backgroundColor: DesignRule.white
  },
  bottomUiText: {
    fontSize: px2dp(15),
    color: DesignRule.textColor_mainTitle,
    marginRight: px2dp(12),
    marginLeft: px2dp(12)
  },
  bottomUitext1: {
      fontSize: px2dp(15),
      color: DesignRule.mainColor,
      marginRight: px2dp(12)
  },
  bottomStyleContainer: {
    width: px2dp(264),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  line: {
    height: ScreenUtils.onePixel,
    backgroundColor: DesignRule.lineColor_inColorBg
  },
  row: {
    height: ScreenUtils.px2dp(49),
    flexDirection: 'row'
  },
  bottom: {
    flex: 1,
    backgroundColor: DesignRule.mainColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pay: {
    fontSize: px2dp(16),
    color: 'white'
  }
})
