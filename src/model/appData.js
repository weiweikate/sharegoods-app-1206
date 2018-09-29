import bridge from '../utils/bridge';

class AppData {

    // 固定高度，不需要监听
    androidStatusH = 0;


    // 状态栏高度
    setStatusBarHeight(height) {
        console.log(height);
        bridge.$toast('stateheight是'+height)
        // this.androidStatusH = height;
        this.statusBarHeight = height;
    }
}

const appData = new AppData();
export default appData;
