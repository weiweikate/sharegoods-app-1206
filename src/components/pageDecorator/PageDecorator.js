/**
 * 页面修饰器.
 * 动态地在页面的原型链添加方法和属性,方法均带有jr_前缀，防止函数名或者变量名冲突。
 * 使用该修饰器，本质上会污染页面组件的命名空间。需要注意，避免冲突。
 *
 * demo examples:
 *
 * loading demo
 * this.jr_loadingShow();    //弹出loading 参数全部可省
 * this.jr_loadingDismiss(); //隐藏loading
 * this.jr_isLoadingShow();  //return loding是否在展示
 *
 * //参数配置 loading时间 背景颜色 超时回调
 * this.jr_loadingShow('加载中...');
 * this.jr_loadingShow('加载中...',{timeout: 1,bgColor: 'rgba(0,0,0,0.5)',loadingTimeout: ()=>{
 *     alert(1);
 * }});
 * this.jr_loadingDismiss(()=>{alert('隐藏结束')});
 *
 *
 * toast demo  参数：主标题，次标题，详细配置（持续时间，隐藏回调）
 * this.jr_toastShow('网络错误');
 * this.jr_toastShow('网络错误','请重新刷新');
 * this.jr_toastShow('网络错误','请重新刷新',{duration: 2 ,toastHiddenCallBack:()=>{
 *     alert(1);
 * }});
 * this.jr_toastDismiss();
 * this.jr_toastDismiss(()=>{alert('隐藏结束')});
 *
 *
 * page rewrite following API
 * jr_NavigationBarLeftPressed:      func,
 * jr_NavigationBarRightPressed:    func,
 * jr_NavigationBarLeftItem          func return react Component
 * jr_NavigationBarRightItem         func return react Component
 * jr_NavigationBarHiddenLeftItem()  func
 * jr_NavigationBarHiddenRightItem() func
 * jr_NavigationBarResetTitle('')    func 修改页面标题
 */

import React from 'react';
import {
    View,
    StyleSheet,
} from 'react-native';

import NavigatorBar from './NavigatorBar/index';
import {
    LoadingHub,
    ToastView,
} from 'jr-baseview';

import {renderViewByLoadingState} from './PageState';
import {NavigationActions} from "react-navigation";

const PageDecorator = (ComponentClass) => {

    // 防止修饰多次
    if (ComponentClass.hadInstallDecorator) {
        return ComponentClass;
    }

    const target = ComponentClass;
    if (!ComponentClass.jrPageOptions) {
        // 项目中大部分都未按照此种开发方式配置。因此，对于未配置的，先不进行修改。
        __DEV__ && console.warn('Error: YOU MAY MISS static jrPageOptions-->' + ComponentClass.name);
        return ComponentClass;

    }
    const jrPageOptions = ComponentClass.jrPageOptions || {};

    /* -------------toast-------------  */
    target.prototype.jr_toastShow = function (title, params) {
        if (!this.jr_toast) {
            return;
        }
        this.jr_toast.showToast(title, params || {});
    };
    target.prototype.jr_toastDismiss = function (callBack) {
        if (!this.jr_toast) {
            return;
        }
        this.jr_toast.dismiss(typeof callBack === 'function' ? callBack : null);
    };
    target.prototype.jr_isToastShow = function () {
        if (!this.jr_toast) {
            return false;
        }
        return this.jr_toast.isToastShow();
    };


    /* -------------loading----------  */
    target.prototype.jr_loadingShow = function (msg, params) {
        if (!this.jr_loadingHub) {
            return;
        }
        this.jr_toastDismiss();
        this.jr_loadingHub.loadingShow(msg, params || {});
    };
    target.prototype.jr_loadingDismiss = function (callBack) {
        if (!this.jr_loadingHub) {
            return;
        }
        this.jr_loadingHub.dismiss(typeof callBack === 'function' ? callBack : null);
    };
    target.prototype.jr_isLoadingShow = function () {
        if (!this.jr_loadingHub) {
            return false;
        }
        return this.jr_loadingHub.isLoadingShow();
    };


    /* -------------NavigatorBar-------------  */
    target.prototype.jr_NavigationBarHiddenLeftItem = function (hidden, callBack) {
        //隐藏左边item
        if (!this.jr_navigatorBar) {
            return;
        }
        this.jr_navigatorBar.hiddenLeftItem(hidden, callBack);
    };
    target.prototype.jr_NavigationBarHiddenRightItem = function (hidden, callBack) {
        //隐藏右边item
        if (!this.jr_navigatorBar) {
            return;
        }
        this.jr_navigatorBar.hiddenRightItem(hidden, callBack);
    };
    target.prototype.jr_NavigationBarResetRightTitle = function (newTitle, callBack) {
        //隐藏右边item
        if (!this.jr_navigatorBar) {
            return;
        }
        this.jr_navigatorBar.changeRightTitle(newTitle, callBack);
    };
    target.prototype.jr_NavigationBarResetTitle = function (newTitle, callBack) {
        //更换title
        if (!this.jr_navigatorBar) {
            return;
        }
        this.jr_navigatorBar.changeTitle(newTitle, callBack);
    };

    /* -------------Navigation------------- */
    //跳转
    target.prototype.jr_navigate = function (routeName, params) {
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
    target.prototype.jr_navigateBack = function (routerKey) {
        try {
            if (routerKey) {
                const backAction = NavigationActions.back({key: routerKey,});
                this.props.navigation.dispatch(backAction);
            } else {
                this.props.navigation.goBack();
            }
        } catch (e) {
            console.warn(`jr_navigateBack error: ${e.toString()}`);
        }
    };

    /*------------------所有函数的封装------------------*/
    target.prototype.jr_getAllFunc = function () {
        return {
            jr_toastShow: this.jr_toastShow.bind(this),
            jr_toastDismiss: this.jr_toastDismiss.bind(this),
            jr_isToastShow: this.jr_isToastShow.bind(this),

            jr_loadingShow: this.jr_loadingShow.bind(this),
            jr_loadingDismiss: this.jr_loadingDismiss.bind(this),
            jr_isLoadingShow: this.jr_isLoadingShow.bind(this),

            jr_alertShow: this.jr_alertShow.bind(this),
            jr_alertDismiss: this.jr_alertDismiss.bind(this),
            jr_isAlertShow: this.jr_isAlertShow.bind(this),

            jr_NavigationBarHiddenLeftItem: this.jr_NavigationBarHiddenLeftItem.bind(this),
            jr_NavigationBarHiddenRightItem: this.jr_NavigationBarHiddenRightItem.bind(this),
            jr_NavigationBarResetTitle: this.jr_NavigationBarResetTitle.bind(this),
        };
    };

    const targetRender = ComponentClass.prototype.render;

    ComponentClass.prototype.render = function () {

        const {renderByPageState} = jrPageOptions;

        const navigationBarOptions = jrPageOptions.navigationBarOptions || {};

        let controlParams = null;

        //需要进行页面状态管理
        if (renderByPageState) {
            try {
                controlParams = this.jr_getPageStateOptions();
            } catch (error) {
                console.warn('when you set true, you need implementation jr_getPageStateOptions function to return your page state');
            }
        }

        const that = this;

        return (<View style={styles.container}>

            {
                target.jrPageOptions && <NavigatorBar {...navigationBarOptions}
                                                      renderRight={this.jr_NavBarRenderRightItem || null}
                                                      navigation={this.props.navigation}
                                                      leftPressed={() => (this.jr_NavBarLeftPressed || jrNavigationBarDefaultLeftPressed).call(this)}
                                                      rightPressed={() => (this.jr_NavRightPressed || jrNavigationBarDefaultRightPressed).call(this)}
                                                      ref={(bar) => {
                                                          this.jr_navigatorBar = bar;
                                                      }}/>
            }

            {
                renderByPageState && controlParams ? renderViewByLoadingState(controlParams, () => {
                    return targetRender.call(that);
                }) : targetRender.call(this)
            }

            {(this.renderModal && typeof this.renderModal === 'function') ? this.renderModal() : null}

            <ToastView ref={(toast) => {
                this.jr_toast = toast;
            }}/>

            <LoadingHub ref={(loadingHub) => {
                this.jr_loadingHub = loadingHub;
            }}/>

        </View>);
    };
    target.hadInstallDecorator = true;
    return target;
};

// 左右按钮默认的点击效果
function jrNavigationBarDefaultLeftPressed(callBack) {
    try {
        this.props.navigation.goBack();
        callBack && typeof callBack === 'function' && callBack();
    } catch (error) {
        console.warn('jrNavigationBarDefaultLeftPressed error ' + error.toString());
    }
}

function jrNavigationBarDefaultRightPressed() {
    console.warn('mark sure you had set jrNavigationBarDefaultRightPressed func');
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F6F6',
    }
});

export default PageDecorator;
