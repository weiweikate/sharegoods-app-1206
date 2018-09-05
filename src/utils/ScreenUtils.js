import {Dimensions, Platform, PixelRatio} from 'react-native'


const MAX_SCREENT = Math.max(Dimensions.get('window').width, Dimensions.get('window').height);
const MIN_SCREENT = Math.min(Dimensions.get('window').width, Dimensions.get('window').height);
const __ISIPHONEX__ = Platform.OS === 'ios' && (MIN_SCREENT === 375.0 && MAX_SCREENT === 812.0);

function autoSizeWidth(dp) {
    return PixelRatio.roundToNearestPixel(dp * Dimensions.get('window').width / 375);
}
function autoSizeHeight(dp) {
    return PixelRatio.roundToNearestPixel(dp * Dimensions.get('window').height / 750);
}

export default {
    autoSizeWidth:autoSizeWidth,
    autoSizeHeight:autoSizeHeight,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    pixelRatio:PixelRatio.get(),
    onePixel: 1 / PixelRatio.get(),
    statusBarHeight: Platform.OS === 'ios' ? (__ISIPHONEX__ ? 44 : 20) : 0,// (Platform.OS === 'ios' ? 20 : 0),
    headerHeight:Platform.OS === 'ios' ? (__ISIPHONEX__ ? 88 : 64) : 48,
    tabBarHeight:Platform.OS === 'ios' ? (__ISIPHONEX__ ? 83 : 49) : 49,
    isIOS:Platform.OS === 'ios',
    isIOSSmall:Platform.OS === 'ios' && Dimensions.get('window').height === 568,// phoneSE,phone4,phone5,phone5s
    isIOSNomarl:Platform.OS === 'ios' && Dimensions.get('window').height === 667,// phone6,phone7,phone8
    isIOSP:Platform.OS === 'ios' && Dimensions.get('window').height === 736,//phone6p,phone7p,phone8p
    isIOSX:Platform.OS === 'ios' && Dimensions.get('window').height === 812
}
