//店铺评分页面 PASS
import React from 'react';
import {
    View,
    Image,
    Dimensions,
    StyleSheet,
    ScrollView
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const WhitePanelHeight = 128 / 375 * SCREEN_WIDTH;
import BasePage from '../../../BasePage';
import DesignRule from 'DesignRule';
import res from '../res';
import {
    MRText as Text
} from '../../../components/ui';

const StarIcon = res.shopSetting.wjx_03;
const store_level_1 = res.shopSetting.store_level_1;
const store_level_2 = res.shopSetting.store_level_2;
const store_level_3 = res.shopSetting.store_level_3;


export default class ShopScorePage extends BasePage {

    $navigationBarOptions = {
        title: '店铺评分'
    };

    _render() {
        const { storeStarId, starName } = this.params.storeData || {};
        const storeStar = storeStarId || 1;
        const starsArr = [];
        if (storeStar && typeof storeStar === 'number') {
            for (let i = 0; i < storeStar; i++) {
                i <= 2 && starsArr.push(i);
            }
        }

        const BgIcon = storeStar === 3 ? store_level_3 : (storeStar === 2 ? store_level_2 : store_level_1);

        return (
            <View style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.whitePanel}>
                        <View style={styles.starContainer}>
                            {
                                starsArr.map((item, index) => {
                                    return <Image key={index} style={[index ? { marginLeft: 35 } : null]}
                                                  source={StarIcon}/>;
                                })
                            }
                        </View>
                        <Text style={styles.shopLevel}
                              allowFontScaling={false}>{`${starName || ''}店铺`}</Text>
                    </View>
                    <Image style={styles.img} source={BgIcon}/>
                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    whitePanel: {
        marginTop: 10,
        width: SCREEN_WIDTH,
        height: WhitePanelHeight,
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: 'white'
    },
    starContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32 / 128 * WhitePanelHeight
    },
    shopLevel: {
        fontSize: 15,
        color: DesignRule.textColor_mainTitle,
        marginBottom: 16 / 128 * WhitePanelHeight
    },
    img: {
        marginTop: 24, marginLeft: 24,
        width: SCREEN_WIDTH - 48,
        height: 350 / 550 * (SCREEN_WIDTH - 48)
    }
});
