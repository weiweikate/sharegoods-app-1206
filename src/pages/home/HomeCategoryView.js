import React, { Component } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Text } from 'react-native';
import ScreenUtils from '../../utils/ScreenUtils';
import { homeModule } from './Modules';
import { observer } from 'mobx-react';
import { categoryModule } from './HomeCategoryModel'

const { px2dp } = ScreenUtils;

export const categoryHeight = px2dp(44)

const CategoryItem = ({text, press, left}) => <TouchableWithoutFeedback onPress={()=> press && press()}>
  <View style={[styles.item, {marginLeft: left}]}>
    <Text style={styles.text}>{text}</Text>
  </View>
</TouchableWithoutFeedback>

@observer
export default class HomeCategoryView extends Component {

    _adAction(value) {
        const router = homeModule.homeNavigate(value.linkType, value.linkTypeCode);
        const { navigate } = this.props;
        const params = homeModule.paramsNavigate(value);
        navigate(router, { ...params, preseat: 'home_ad' });
    }

    render() {
        const { categoryList } = categoryModule;
        if (categoryList.length === 0) {
          return <View/>
        }

        let itemsArr = [];
        categoryList.map((value, index) => {
          itemsArr.push(
              <CategoryItem text={value.name} key={'category' + index} left={index === 0 ? 0 : px2dp(6)} press={() => this._adAction(value)}/>
            )
        });
        return <View style={styles.container}>
            {itemsArr}
        </View>;
    }
}

const itemBackground = '#eee'
const itemText = '#999'

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingTop: px2dp(12),
        paddingBottom: px2dp(12),
        paddingLeft: px2dp(15),
        paddingRight: px2dp(15),
        width: ScreenUtils.width,
        flexDirection: 'row',
        height: categoryHeight,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    item: {
      flex: 1,
      height: px2dp(20),
      borderRadius: px2dp(10),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: itemBackground
    },
    text: {
      color: itemText,
      fontSize: px2dp(12)
    }
});
