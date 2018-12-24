import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { paymentType } from './Payment';
import DesignRule from '../../constants/DesignRule';
import res from './res';
import ScreenUtils from '../../utils/ScreenUtils'
const { px2dp } = ScreenUtils
import {MRText as Text} from '../../components/ui'

export default ({ data, isSelected, balance, press, selectedTypes, disabled }) => {
  let selected = isSelected;
  if (data && data.type !== paymentType.balance && selectedTypes) {
      selected = selectedTypes.type === data.type;
  }
  return <TouchableOpacity style={styles.cell} disabled={disabled} onPress={() => press && press()}>
      <View style={styles.left}>
          <Image source={data.icon} style={styles.image} resizeMode={'contain'}/>
          <Text style={styles.blackText} allowFontScaling={false}>{data.name}</Text>
      </View>
      {
          data.hasBalance
              ?
              <Text style={styles.blance} allowFontScaling={false}>可用余额: {balance ? balance : 0}</Text>
              :
              null
      }
      <Image source={selected ? res.button.selected_circle_red : res.button.unselected_circle} style={styles.checkImg} resizeMode={'stretch'}/>
  </TouchableOpacity>;
}

const styles = StyleSheet.create({
  cell: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: px2dp(44),
    paddingLeft: px2dp(21),
    paddingRight: px2dp(28),
    backgroundColor: 'white',
    marginTop: px2dp(10)
  },
  checkImg: {
    height: px2dp(22),
    width: px2dp(22)
  },
  blance: {
    marginLeft: px2dp(5),
    marginRight: px2dp(7),
    color: DesignRule.textColor_instruction,
    fontSize: px2dp(13)
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  blackText: {
    fontSize: px2dp(13),
    lineHeight: px2dp(18),
    marginLeft: px2dp(5),
    color: DesignRule.textColor_mainTitle
  },
  image: {
    height: px2dp(33)
  }
})
