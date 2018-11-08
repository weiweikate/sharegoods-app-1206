import button from './button';
import placeholder from './placeholder';
import share from './share';
import tab from './tab';
import other from './other';

const res = {
    button: {//按钮图片
        ...button
    },
    placeholder:{//网络错误。占未图
        ...placeholder
    },
    share: {//分享相关图片
        ...share
    },
    tab: {//tabbar图标
        ...tab
    },
    other: {//背景图片、线的图片
        ...other
    }
};
export default res;
