import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import {RecyclerListView } from 'recyclerlistview';

(function numberPolyfill() {
    //填充，弥补兼容性
    if (!Number.parseFloat) {
        Number.parseFloat = parseFloat;
    }
    if (!Number.parseInt) {
        Number.parseInt = parseInt;
    }
    if (!Number.isInteger) {
        Number.isInteger = function(value) {
            return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
        };
    }
})();

console.ignoredYellowBox = ['Warning: BackAndroid is deprecated. Please use BackHandler instead.', 'source.uri should not be an empty string', 'Invalid props.style key'];
console.disableYellowBox = true; // 关闭全部黄色警告

//scrollToIndex(index) 精度偏差能滑到指定位置上面一点位置，导致悬浮有问题.拓展一下原来的方法
RecyclerListView.prototype.scrollToIndex= function(index,animation,y,x){
    let _virtualRenderer = this.getVirtualRenderer();
    const layoutManager = _virtualRenderer.getLayoutManager();
    if (layoutManager) {
        const offsets = layoutManager.getOffsetForIndex(index);
        //往下再滑一点
        this.scrollToOffset(offsets.x+x, offsets.y+y, animation);
    }
}

AppRegistry.registerComponent(appName, () => App);
