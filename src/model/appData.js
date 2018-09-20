class AppData {

    // 固定高度，不需要监听
    androidStatusH = 0;


    // android状态栏高度
    setAndroidStatusHeight(height) {
        console.log(height);
        this.androidStatusH = height;
    }
}

const appData = new AppData();
export default appData;
