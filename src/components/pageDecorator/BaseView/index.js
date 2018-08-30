/**
 * 基础组件
 * @providesModule jr-baseview
 */
import LoadingHub from './LoadingHub';
import ToastView from './ToastView';
import EmptyView from './EmptyView';
import NetFailedView from './NetFailedView';
import NullView from './NullView';
import LoadingView from './LoadingView';
import GeneralButton from './GeneralButton';
import NavigatorBar from '../NavigatorBar';

export {
    LoadingHub,     //loading指示器
    ToastView,      //toast指示器
    // 通用组件
    EmptyView,      //为空页
    NullView,       //什么都不展示的页面
    LoadingView,    //加载页面
    GeneralButton,  //按钮(内含节流)
    NetFailedView,  //网络加载失败页
    // 顶部导航条
    NavigatorBar,   //导航条
};
