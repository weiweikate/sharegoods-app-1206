import { NativeModules, Dimensions, Platform, PixelRatio  } from 'react-native';

const { RNDeviceInfo } = NativeModules;


const MAX_SCREENT = Math.max(Dimensions.get('window').width, Dimensions.get('window').height);
const MIN_SCREENT = Math.min(Dimensions.get('window').width, Dimensions.get('window').height);

const __ISIPHONEX__ = Platform.OS === 'ios' && (MIN_SCREENT === 375.0 && MAX_SCREENT === 812.0);
const __ISIPHONEXSMAX__ = Platform.OS === 'ios' && (MIN_SCREENT === 414.0 && MAX_SCREENT === 896.0);

export const deviceWidth = Dimensions.get('window').width;      //设备的宽度
export const deviceHeight = Dimensions.get('window').height;    //设备的高度
let fontScale = PixelRatio.getFontScale();                      //返回字体大小缩放比例

let pixelRatio = PixelRatio.get();      //当前设备的像素密度
const defaultPixel = 2;                           //iphone6的像素密度
//px转换成dp
const w_2 = 750 / defaultPixel;
const h_2 = 1334 / defaultPixel;
const scale = Math.min(deviceHeight / h_2, deviceWidth / w_2);   //获取缩放比例
/**
 * 设置text为sp
 * @param size sp
 * return number dp
 */
export function setSpText(size: number) {
    size = Math.round((size * scale + 0.5) * pixelRatio / fontScale);
    return size / defaultPixel;
}

export function scaleSize(size: number) {

    size = Math.round(size * scale + 0.5);
    return size / defaultPixel;
}


function autoSizeWidth(dp) {
    return PixelRatio.roundToNearestPixel(dp * Dimensions.get('window').width / 375);
}

function autoSizeHeight(dp) {
    return PixelRatio.roundToNearestPixel(dp * Dimensions.get('window').height / 750);
}


/**
 * 屏幕工具类
 * ui设计基准,iphone 6
 * width:750
 * height:1334
 */
let screenW = Dimensions.get('window').width;
const r2 = 2;
const w2 = 750 / r2;

var isNavigationBarShow = true;
var hasNotchScreen = false;

function setBarShow(isShow) {
    isNavigationBarShow = isShow;
}

function getBarShow() {
    return isNavigationBarShow;
}

function isNavigationBarExist(callback = ()=>{}) {
    if(Platform.OS === 'ios'){
        return;
    }
    RNDeviceInfo.isNavigationBarExist(callback)
}

function setHasNotchScreen(isNotch) {
    hasNotchScreen = isNotch;
}

function getHasNotchScreen() {
    return hasNotchScreen;
}

function checkhasNotchScreen(callback = ()=>{}) {
    if(Platform.OS === 'ios'){
        return;
    }
    // RNDeviceInfo.hasNotchScreen(callback)
}

export const DEFAULT_DENSITY = 1;

/**
 * 屏幕适配,缩放size
 * @param size
 * @returns {Number}
 * @constructor
 */
function px2dp(size) {
    let scaleWidth = screenW / w2;
    size = Math.round((size * scaleWidth + 0.5));
    return size / DEFAULT_DENSITY;
}

export type Size = {
    width: number;
    height: number;
};

function getImgHeightWithWidth(size: Size, width: number = screenW): number {
    if (!size || !size.width || !size.height) {
        return 0;
    }
    return size.height * width / size.width;
}

export default {
    px2dp,
    setBarShow,
    getBarShow,
    isNavigationBarExist,
    setHasNotchScreen,
    getHasNotchScreen,
    checkhasNotchScreen,
    getImgHeightWithWidth,
    autoSizeWidth: autoSizeWidth,
    autoSizeHeight: autoSizeHeight,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    pixelRatio: PixelRatio.get(),
    onePixel: 1 / PixelRatio.get(),
    statusBarHeight: Platform.OS === 'ios' ? (__ISIPHONEX__ || __ISIPHONEXSMAX__ ? 44 : 20) : RNDeviceInfo.statusBarHeight,
    // 44为头部不包含状态栏高度
    headerHeight: (Platform.OS === 'ios' ? (__ISIPHONEX__ || __ISIPHONEXSMAX__ ? 44 : 20) : RNDeviceInfo.statusBarHeight) + 44,
    tabBarHeight: Platform.OS === 'ios' ? (__ISIPHONEX__ || __ISIPHONEXSMAX__ ? 83 : 49) : 49,
    tabBarHeightMore: this.tabBarHeight - 49,
    isIOS: Platform.OS === 'ios',
    isIOSSmall: Platform.OS === 'ios' && Dimensions.get('window').height === 568,// phoneSE,phone4,phone5,phone5s
    isIOSNomarl: Platform.OS === 'ios' && Dimensions.get('window').height === 667,// phone6,phone7,phone8
    isIOSP: Platform.OS === 'ios' && Dimensions.get('window').height === 736,//phone6p,phone7p,phone8p
    isIOSX: Platform.OS === 'ios' && Dimensions.get('window').height === 812,
    safeBottomMax: Platform.OS === 'ios' ? (__ISIPHONEXSMAX__ ? 37 : 0) : 0,
    safeBottomX: Platform.OS === 'ios' ? (__ISIPHONEX__ ? 37 : 0) : 0,
    safeBottom: Platform.OS === 'ios' ? (__ISIPHONEX__ || __ISIPHONEXSMAX__ ? 37 : 0) : 0,
    isIphoneMax: __ISIPHONEXSMAX__,
    // saveMarginBottom: Platform.OS === 'ios' && (Dimensions.get('window').height === 812 || Dimensions.get('window').height === 736) ? 34 : 0
    isAllScreenDevice:Platform.OS === 'ios' ? false:RNDeviceInfo.isAllScreenDevice,
    // isNavigationBarShow:Platform.OS === 'ios' ? false:RNDeviceInfo.isNavigationBarShow,
    isAnroidNotchScreen:Platform.OS === 'ios' ? false:RNDeviceInfo.isAnroidNotchScreen,
};
