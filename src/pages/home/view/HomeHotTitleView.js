import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenUtil from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';
import { subjectModule } from '../model/HomeSubjectModel';
import { observer } from 'mobx-react';

const { px2dp } = ScreenUtil;

const HomeHotTitleView = ({ title }) => {

    const { subjectList } = subjectModule;
    if (subjectList.length === 0) {
        return null;
    }

    return <View style={styles.titleView}>
        <View style={styles.flag}/>
        <Text style={styles.title}>{title}</Text>
    </View>;
};

const styles = StyleSheet.create({
    flag: {
        backgroundColor: DesignRule.mainColor,
        width: px2dp(2),
        height: px2dp(8),
        borderRadius: px2dp(1)
    },
    titleView: {
        height: px2dp(42),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        marginTop: px2dp(18),
        marginHorizontal: px2dp(15),
        borderTopLeftRadius: px2dp(5),
        borderTopRightRadius: px2dp(5)
    },
    title: {
        color: DesignRule.textColor_secondTitle,
        fontSize: px2dp(16),
        marginLeft: px2dp(10),
        fontWeight: '600'
    }
});
export default observer(HomeHotTitleView);
