import { observable, computed, action, flow } from "mobx"
import ShowApi from './ShowApi'
import Toast from '../../utils/bridge'

//推广 1：精选 2：热门 3：推荐 4：最新 全部则不传
export const tag = {
    'Featured': 1,
    'Hot': 2,
    'Recommend': 3,
    'New': 4
}

export const tagName = {
    [tag.Featured]: '精选',
    [tag.Hot]: '热门',
    [tag.Recommend]: '推荐',
    [tag.New]: '最新'
}


export class HomeShowModules {
    @observable showList = []
    @computed get showImage() {
        if (this.showList.length > 0) {
            return this.showList[0].img
        } else {
            return ''
        }
     }

    @action loadShowList = flow(function * (params) {
        try {
            const result = yield ShowApi.showQuery()
            this.showList = result.data.data
        } catch (error) {
            console.log(error)
        }
    })
}

export class ShowBannerModules {
    @observable bannerList = []
    @computed get bannerCount() {
        return this.bannerList.length
    }
    @action loadBannerList = () => {
        this.bannerList = [
            {
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://imgsrc.baidu.com/imgad/pic/item/34fae6cd7b899e51ec89f83949a7d933c8950d9c.jpg'
            },
            {
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://img.zcool.cn/community/011ab85707229732f875a9446d74b5.jpg'
            },
            {
                remark: 'IPhone X 9月在美国加州福利院上市...',
                imgUrl: 'http://img.zcool.cn/community/011ab85707229732f875a9446d74b5.jpg'
            }
        ]
    }
}

export class ShowChoiceModules {
    @observable choiceList = []
    @computed get choiceCount() {
        return this.choiceList.length
    }
    @action loadChoiceList = flow(function * (params) {
        try {
            const result = yield ShowApi.showQuery({generalize: tag.Featured})
            this.choiceList = result.data.data
        } catch (error) {
            console.log(error)
        }
    })
}

export class ShowHotModules {
    @observable hotList = []
    @computed get hotCount() {
        return this.hotList.length
    }
    @action loadHotList = flow(function * (params) {
        try {
            const result = yield ShowApi.showQuery({generalize: tag.Hot})
            this.hotList = result.data.data
        } catch (error) {
            console.log(error)
        }
    })
}


export class ShowRecommendModules {
    @observable recommendList = []
    @observable selectedList = new Map()
    @observable page = 1
    @observable collectPage = 1
    @computed get recommendCount() {
        return this.recommendList.length
    }

    @action loadRecommendList = (params) => {
        let currentDate = new Date()
        this.page = 1
        return ShowApi.showQuery({...params, page: this.page}).then(result => {
            if (parseInt(result.code, 0) === 10000) {
                this.page += 1
                let data = result.data.data
                if (data && data.length > 0) {
                    data.map(value => {
                        value.currentDate = currentDate
                    })
                    return Promise.resolve(data)
                } else {
                    return Promise.resolve([])
                }
            } else {
                return Promise.reject('获取列表错误')
            }
        }).catch(error => {
            return Promise.reject(error)
        })
    }

    @action getMoreRecommendList = (params) => {
        let currentDate = new Date()
        return ShowApi.showQuery({page: this.page, ...params}).then(result => {
            if (parseInt(result.code, 0) === 10000) {
                let data = result.data.data
                if (data && data.length !== 0) {
                    this.page += 1
                    data.map(value => {
                        value.currentDate = currentDate
                    })
                    return Promise.resolve(data)
                } else {
                    return Promise.resolve([])
                }
            } else {
                return Promise.reject('获取列表错误')
            }
        }).catch(error => {
            return Promise.reject(error)
        })
    }

    @action selectedAction = (data) => {
        data.selected = !data.selected
        // let index = this.selectedList.findIndex((value) => data.id === value.id)
        // console.log('selectedAction', data, index)
        // if (this.selectedList.has(data.id)) {
        //     this.selectedList.delete(data.id)
        // } else {
        //     this.selectedList.set(data.id, true)
        // }
        // console.log('this.selectedList', this.selectedList.toJS())
    }

    @action loadCollect = () => {
        let currentDate = new Date()
        this.collectPage = 1
        return ShowApi.showCollectList({page: this.collectPage}).then(result => {
            if (parseInt(result.code, 0) === 10000) {
                this.collectPage += 1
                let data = result.data.data
                if (data && data.length !== 0) {
                    data.map(value => {
                        value.currentDate = currentDate
                    })
                    return Promise.resolve(data)
                } else {
                    return Promise.resolve([])
                }
            } else {
                return Promise.reject('获取列表错误')
            }
        }).catch(error => {
            return Promise.reject(error)
        })
    }

    @action getMoreCollect = () => {
        let currentDate = new Date()
        return ShowApi.showCollectList({page: this.collectPage}).then(result => {
            if (parseInt(result.code, 0) === 10000) {
                let data = result.data.data
                if (data && data.length !== 0) {
                    this.collectPage += 1
                    data.map(value => {
                        value.currentDate = currentDate
                    })
                    return Promise.resolve(data)
                } else {
                    return Promise.resolve([])
                }
            } else {
                return Promise.reject('获取列表错误')
            }
        }).catch(error => {
            return Promise.reject(error)
        })
    }

    batchCancelConnected = (selectedIds) =>  ShowApi.showCollectCancel({articleId: '', type: 1, articleIds: selectedIds})        
}

export class ShowDetail {
    @observable detail = ''
    @observable isGoodActioning = false     // 正在点赞
    @observable isCollecting = false        //正在收藏
    @action loadDetail = flow(function * (id) {
        try {
            const result = yield ShowApi.showDetail({id: id})
            console.log('result', result.data)
            this.detail = result.data
        } catch (error) {
            console.log(error)
        }
    })

    @action showGoodAction = flow(function *() {
        try {
            this.isGoodActioning = true
            let result = {}
            if (this.detail.hadLike) {
                result = yield ShowApi.showGoodCancel({articleId: this.detail.id, type: 2, articleIds: [this.detail.id]})
            } else {
                result = yield ShowApi.showGood({articleId: this.detail.id, type: 2, articleIds: [this.detail.id]})
            }
            this.isGoodActioning = false
            if (parseInt(result.code, 0) === 10000) {
                if (this.detail.hadLike) {
                    this.detail.likeCount -= 1
                } else {
                    this.detail.likeCount += 1
                }
                this.detail.hadLike = !this.detail.hadLike
            }
        } catch(error) {
            this.isGoodActioning = false
            console.log(error)
            Toast.$toast(error.msg)
        }
    })

    @action showConnectAction = flow(function *() {
        try {
            this.isCollecting = true
            let result = {}
            if (!this.detail.hadCollect) {
                result = yield ShowApi.showConnect({articleId: this.detail.id, type: 1, articleIds: [this.detail.id]})
            } else {
                result = yield ShowApi.showCollectCancel({articleId: this.detail.id, type: 1, articleIds: [this.detail.id]})
            }
            this.isCollecting = false
            if (parseInt(result.code, 0) === 10000) {
                if (this.detail.hadCollect) {
                    this.detail.collectCount -= 1
                } else {
                    this.detail.collectCount += 1
                }
                this.detail.hadCollect = !this.detail.hadCollect
            }
        } catch(error) {
            this.isCollecting = false
            console.log(error)
            Toast.$toast(error.msg)
        }
    })

}
