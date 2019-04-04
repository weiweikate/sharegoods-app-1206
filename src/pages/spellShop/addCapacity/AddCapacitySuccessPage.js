import React  from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import BasePage from '../../../BasePage';
import ScreenUtils from '../../../utils/ScreenUtils';
import NoMoreClick from '../../../components/ui/NoMoreClick';
import DesignRule from '../../../constants/DesignRule';
import RouterMap from '../../../navigation/RouterMap';
import res from '../res';

const { addCapacitySuccess } = res.addCapacity;
const { px2dp } = ScreenUtils;

export class AddCapacitySuccessPage extends BasePage {
    $navigationBarOptions = {
        title: '扩容成功'
    };

    $NavBarLeftPressed = () => {
        this.$navigateBackToStore();
    };

    _render() {
        return (
            <View style={{ alignItems: 'center' }}>
                <Image style={{ marginTop: px2dp(90), marginBottom: 10, width: px2dp(70), height: px2dp(70) }}
                       source={addCapacitySuccess}/>
                <Text style={{ color: DesignRule.textColor_mainTitle, fontSize: 23 }}>支付成功</Text>
                <View style={{ marginTop: px2dp(50), flexDirection: 'row' }}>
                    <NoMoreClick style={[styles.btn, { borderColor: DesignRule.textColor_placeholder }]}
                                 onPress={() => {
                                     this.$navigateBackToStore();
                                 }}>
                        <Text style={[styles.btnText, { color: DesignRule.textColor_instruction }]}>返回我的店铺</Text>
                    </NoMoreClick>
                    <NoMoreClick style={[styles.btn, { borderColor: DesignRule.mainColor, marginLeft: 20 }]}
                                 onPress={() => {
                                     this.$navigate(RouterMap.AddCapacityHistoryPage, { storeData: this.params.storeData });
                                 }}>
                        <Text style={[styles.btnText, { color: DesignRule.mainColor }]}>查看扩容记录</Text>
                    </NoMoreClick>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    btn: {
        justifyContent: 'center', alignItems: 'center',
        borderRadius: 20, height: 40, borderWidth: 1,
    },
    btnText: {
        fontSize: 15, paddingHorizontal: 15
    }
});

export default AddCapacitySuccessPage;
