import { AppRegistry } from "react-native";
import App from "./src/App";
// import updateDemo from './src/updateDemo';



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
            return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
        };
    }
})();

if (!__DEV__) {
    global.console = {
        info: () => {
        },
        log: () => {
        },
        warn: () => {
        },
        debug: () => {
        },
        error: () => {
        }
    };
}

//console.ignoredYellowBox = ['Warning: BackAndroid is deprecated. Please use BackHandler instead.','source.uri should not be an empty string','Invalid props.style key'];

//console.disableYellowBox = true; // 关闭全部黄色警告

AppRegistry.registerComponent("sharegoods", () => App);
// AppRegistry.registerComponent("sharegoods", () => updateDemo);
