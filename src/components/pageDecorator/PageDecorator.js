/**
 * 页面修饰器.
 * 动态地在页面的原型链添加方法和属性,方法均带有jr_前缀，防止函数名或者变量名冲突。
 * 使用该修饰器，本质上会污染页面组件的命名空间。需要注意，避免冲突。
 *
 * demo examples:
 *
 * loading demo
 * this.$loadingShow();    //弹出loading 参数全部可省
 * this.$loadingDismiss(); //隐藏loading
 * this.$isLoadingShow();  //return loding是否在展示
 *
 * //参数配置 loading时间 背景颜色 超时回调
 * this.$loadingShow('加载中...');
 * this.$loadingShow('加载中...',{timeout: 1,bgColor: 'rgba(0,0,0,0.5)',loadingTimeout: ()=>{
 *     alert(1);
 * }});
 * this.$loadingDismiss(()=>{alert('隐藏结束')});
 *
 *
 * toast demo  参数：主标题，次标题，详细配置（持续时间，隐藏回调）
 * this.$toastShow('网络错误');
 * this.$toastShow('网络错误','请重新刷新');
 * this.$toastShow('网络错误','请重新刷新',{duration: 2 ,toastHiddenCallBack:()=>{
 *     alert(1);
 * }});
 * this.$toastDismiss();
 * this.$toastDismiss(()=>{alert('隐藏结束')});
 *
 *
 * pages rewrite following API
 * jr_NavigationBarLeftPressed:      func,
 * jr_NavigationBarRightPressed:    func,
 * jr_NavigationBarLeftItem          func return react Component
 * jr_NavigationBarRightItem         func return react Component
 * jr_NavigationBarHiddenLeftItem()  func
 * $NavigationBarHiddenRightItem() func
 * $NavigationBarResetTitle('')    func 修改页面标题
 */

import React from 'react';
import {
    View,
    StyleSheet
} from 'react-native';

import NavigatorBar from './NavigatorBar/index';
import {
    LoadingHub,
    ToastView,
} from './BaseView';

import { renderViewByLoadingState } from './PageState';
import { NavigationActions } from 'react-navigation';
import DesignRule from 'DesignRule'

const PageDecorator = (ComponentClass) => {

    // 防止修饰多次
    if (ComponentClass.$hadInstallDecorator) {
        return ComponentClass;
    }

    const target = ComponentClass;
    if (!ComponentClass.$PageOptions) {
        // 项目中大部分都未按照此种开发方式配置。因此，对于未配置的，先不进行修改。
        __DEV__ && console.warn('Error: YOU MAY MISS static $PageOptions-->' + ComponentClass.name);
        return ComponentClass;

    }
    const $PageOptions = ComponentClass.$PageOptions || {};

    /* -------------toast-------------  */
    target.prototype.$toastShow = function(title, params) {
        if (!this.$toast) {
            return;
        }
        this.$toast.showToast(title, params || {});
    };
    target.prototype.$toastDismiss = function(callBack) {
        if (!this.$toast) {
            return;
        }
        this.$toast.dismiss(typeof callBack === 'function' ? callBack : null);
    };
    target.prototype.$isToastShow = function() {
        if (!this.$toast) {
            return false;
        }
        return this.$toast.isToastShow();
    };


    /* -------------loading----------  */
    target.prototype.$loadingShow = function(msg, params) {
        if (!this.$loadingHub) {
            return;
        }
        this.$toastDismiss();
        this.$loadingHub.loadingShow(msg, params || {});
    };
    target.prototype.$loadingDismiss = function(callBack) {
        if (!this.$loadingHub) {
            return;
        }
        this.$loadingHub.dismiss(typeof callBack === 'function' ? callBack : null);
    };
    target.prototype.$isLoadingShow = function() {
        if (!this.$loadingHub) {
            return false;
        }
        return this.$loadingHub.isLoadingShow();
    };


    /* -------------NavigatorBar-------------  */
    target.prototype.$NavigationBarHiddenLeftItem = function(hidden, callBack) {
        //隐藏左边item
        if (!this.$navigatorBar) {
            return;
        }
        this.$navigatorBar.hiddenLeftItem(hidden, callBack);
    };
    target.prototype.$NavigationBarHiddenRightItem = function(hidden, callBack) {
        //隐藏右边item
        if (!this.$navigatorBar) {
            return;
        }
        this.$navigatorBar.hiddenRightItem(hidden, callBack);
    };
    target.prototype.$NavigationBarResetRightTitle = function(newTitle, callBack) {
        //隐藏右边item
        if (!this.$navigatorBar) {
            return;
        }
        this.$navigatorBar.changeRightTitle(newTitle, callBack);
    };
    target.prototype.$NavigationBarResetTitle = function(newTitle, callBack) {
        //更换title
        if (!this.$navigatorBar) {
            return;
        }
        this.$navigatorBar.changeTitle(newTitle, callBack);
    };

    /* -------------Navigation------------- */
    //跳转
    target.prototype.$navigate = function(routeName, params) {
        try {
            if (!routeName) {
                return;
            }
            params = params || {};
            if (this.props.screenProps) {
                this.props.screenProps.rootNavigation.navigate(routeName, {
                    preRouteName: this.props.screenProps.rootNavigation.state.routeName,
                    ...params
                });
            } else {
                this.props.navigation.navigate(routeName, {
                    preRouteName: this.props.navigation.state.routeName,
                    ...params
                });
            }
        } catch (e) {
            console.warn(`js_navigate error: ${e.toString()}`);
        }
    };
    //返回
    target.prototype.$navigateBack = function(routerKey) {
        try {
            if (routerKey) {
                const backAction = NavigationActions.back({ key: routerKey });
                this.props.navigation.dispatch(backAction);
            } else {
                this.props.navigation.goBack();
            }
        } catch (e) {
            console.warn(`$navigateBack error: ${e.toString()}`);
        }
    };

    /*------------------所有函数的封装------------------*/
    target.prototype.$getAllFunc = function() {
        return {
            $toastShow: this.$toastShow.bind(this),
            $toastDismiss: this.$toastDismiss.bind(this),
            $isToastShow: this.$isToastShow.bind(this),

            $loadingShow: this.$loadingShow.bind(this),
            $loadingDismiss: this.$loadingDismiss.bind(this),
            $isLoadingShow: this.$isLoadingShow.bind(this),

            $NavigationBarHiddenLeftItem: this.$NavigationBarHiddenLeftItem.bind(this),
            $NavigationBarHiddenRightItem: this.$NavigationBarHiddenRightItem.bind(this),
            $NavigationBarResetTitle: this.$NavigationBarResetTitle.bind(this)
        };
    };

    const targetRender = ComponentClass.prototype.render;

    ComponentClass.prototype.render = function() {

        const { renderByPageState } = $PageOptions;

        const navigationBarOptions = $PageOptions.navigationBarOptions || {};
        const isShowBar = navigationBarOptions.show !== undefined ? navigationBarOptions.show : true;
        let controlParams = null;

        // 需要进行页面状态管理
        if (renderByPageState) {
            try {
                controlParams = this.$getPageStateOptions();
            } catch (error) {
                console.warn('when you set true, you need implementation $getPageStateOptions function to return your pages state');
            }
        }


        return (<View style={styles.container}>

            {
                isShowBar && <NavigatorBar {...navigationBarOptions}
                                           renderRight={this.$NavBarRenderRightItem || null}
                                           navigation={this.props.navigation}
                                           leftPressed={() => (this.$NavBarLeftPressed || $NavigationBarDefaultLeftPressed).call(this)}
                                           rightPressed={() => (this.$NavBarRightPressed || $NavigationBarDefaultRightPressed).call(this)}
                                           ref={(bar) => {
                                               this.$navigatorBar = bar;
                                           }}/>
            }

            {
                renderByPageState && controlParams ? renderViewByLoadingState(controlParams, () => {
                    return targetRender.call(this);
                }) : targetRender.call(this)
            }

            {(this.renderModal && typeof this.renderModal === 'function') ? this.renderModal() : null}

            <ToastView ref={(toast) => {
                this.$toast = toast;
            }}/>

            <LoadingHub ref={(loadingHub) => {
                this.$loadingHub = loadingHub;
            }}/>

        </View>);
    };
    target.$hadInstallDecorator = true;
    return target;
};

// 左右按钮默认的点击效果
function $NavigationBarDefaultLeftPressed(callBack) {
    try {
        this.props.navigation.goBack();
        callBack && typeof callBack === 'function' && callBack();
    } catch (error) {
        console.warn('$NavigationBarDefaultLeftPressed error ' + error.toString());
    }
}

function $NavigationBarDefaultRightPressed() {
    console.warn('mark sure you had set $NavigationBarDefaultRightPressed func');
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DesignRule.bgColor
    }
});

export default PageDecorator;
