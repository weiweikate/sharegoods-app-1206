import {
    StyleSheet
} from 'react-native';
import ScreenUtils from '../../../utils/ScreenUtils';
import DesignRule from '../../../constants/DesignRule';

const styles = StyleSheet.create(
    {
        bgContent: {
            marginTop: ScreenUtils.px2dp(-2),
            flex: 1,
            backgroundColor: DesignRule.color_fff,
            justifyContent: 'space-between'
        },
        topBgContent: {
            flex: 1
        },
        topImageBgView: {
            justifyContent: 'center',
            alignItems: 'center'
        },
        topImageView: {
            marginTop:ScreenUtils.px2dp(20),
            width: ScreenUtils.px2dp(80),
            height: ScreenUtils.px2dp(80)
        },
        middleBgContent: {
            flex: 1,
        },
        bottomBgContent: {
            flex: 1,
            flexDirection:'column',
            justifyContent:'flex-end',
        },
        localNumBottomContent:{
            flex: 1,
            flexDirection:'column',
            justifyContent:'flex-end',
        }

    }
);
export default styles;
