/**
 *
 * Copyright 2018 杭州飓热科技有限公司   版权所有
 * Copyright 2018 JURE Group Holding Ltd. All Rights Reserved
 *
 * @flow
 * @format
 * Created by huchao on 2019/8/13.
 *
 */

'use strict';
// 管理下拉刷新， 加载更多
import { observable, action } from 'mobx';
import bridge from './bridge';

export default class LoadMoreDataUtil{

    @observable
    footerStatus = 'hidden' // idle  loading  noMoreData hidden
    @observable
    refreshing = false
    @observable
    data = []

    isRefreshing = true
    isLoadMore = false
    page = 1
    /** 下面值可以外面传入*/
    API = null
    pageSize = 10
    defaultPage = 1
    pageKey = 'page'
    pageSizeKey = 'pageSize'
    handleData = (data)=>{return data.data.data}
    asyncHandleData = null;
    paramsFunc = ()=>{return {}} //请求参数
    isMoreFunc = (data)=>{return data.data.isMore}

    @action
    onRefresh = ()=>{
        if (!this.API){
            return;
        }
        if (this.isLoadMore || this.refreshing){
            return;
        }
        this.refreshing = true;
        this.isRefreshing = true;
        let params = this.paramsFunc();
        params[this.pageKey] = this.defaultPage;
        params[this.pageSizeKey] = this.pageSize;

        this.API(params).then((result)=> {
            this.refreshing = false;
            this.isRefreshing = false;
            this.page = this.defaultPage;
            if (this.asyncHandleData){
                this.asyncHandleData(result).then((r)=>{
                    this.data = r;
                })
            } else {
                this.data = this.handleData(result);
            }
            this.footerStatus = this.isMoreFunc(result) ? 'idle': 'noMoreData'
        }).catch((err) => {
            this.refreshing = false;
            this.isRefreshing = false;
            bridge.$toast(err.msg);
        })

    }

    @action
    getMoreData = () => {
        if (!this.API){
            return;
        }
        if (this.isLoadMore || this.refreshing || this.isRefreshing || this.footerStatus === 'noMoreData'){
            return;
        }
        this.isLoadMore = true;
        this.footerStatus = 'loading';
        let params = this.paramsFunc();
        this.page++;
        params[this.pageKey] = this.page;
        params[this.pageSizeKey] = this.pageSize;

        this.API(params).then((result)=> {
            this.isLoadMore = false;
            if (this.asyncHandleData){
                this.asyncHandleData(result).then((r)=>{
                    this.data = this.data.concat(this.handleData(r));
                })
            } else {
                this.data = this.data.concat(this.handleData(result));
            }
            this.footerStatus = this.isMoreFunc(result) ? 'idle': 'noMoreData'
        }).catch((err) => {
            this.footerStatus = 'idle'
            this.isLoadMore = false;
            this.page--;
            bridge.$toast(err.msg);
        })
    }
}
