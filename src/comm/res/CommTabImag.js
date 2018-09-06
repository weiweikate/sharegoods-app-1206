/*
* 次文件问公共image对象,即各个模块都可能用到的image
* 如:tab 标签栏的imag  nav的返回image
* 各模块下的imag添加到各自模块下的res中,不要向此文件中添加
* */
const CommTabImag = {

    home_Tab_img: {
        img_Nor: require("./home_tab_unselected.png"),
        img_Sel: require("./home_tab_selected.png")
    },
    spellShop_Tab_img: {
        img_Nor: require("./group_tab_unselected.png"),
        img_Sel: require("./group_tab_selected.png")
    },
    shopCart_Tab_img: {
        img_Nor: require("./cart_tab_unselected.png"),
        img_Sel: require("./cart_tab_selected.png")
    },
    mine_Tab_img: {
        img_Nor: require("./mine_tab_unselected.png"),
        img_Sel: require("./mine_tab_selected.png")
    }
};

export default CommTabImag;
