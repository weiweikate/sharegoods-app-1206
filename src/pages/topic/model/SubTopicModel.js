import { observable, action, computed } from 'mobx';
import TopicAPI from '../api/TopicApi';
import bridge from '../../../utils/bridge';

class TotalTopicresultDataModel {
    @observable
    isShowLoading = true;
    @observable
    isFirstLoad = true;
    @observable
    checkIndex = 0;
    @observable
    id = '';
    @observable
    code = '';
    @observable
    name = '';
    @observable
    templateId = 1;
    @observable
    imgUrl = '';
    @observable
    remark = '';
    @observable
    status = '';
    @observable
    isRefresh = false
    @observable
    topicNavbarList = [];
    /*导航标题列表*/
    @observable
    topicNavTitleList = [];
    /*不同导航下的数据*/
    @observable
    sectionDataList = [];

    @computed
    get topicTitle() {
        return this.name || '专题';
    }
    @action
    setRefresh(statues){
        this.isRefresh = statues
    }

    /**
     * 存储专题数据
     * @param resultData
     */
    @action
    saveResultDataWith(resultData) {
        /**
         * 如果为第一次加载则启用服务其返回的索引
         */
        if (this.isFirstLoad) {
            this.checkIndex = resultData.checkIndex;
            this.isFirstLoad = false;
        }

        this.id = resultData.id;
        this.code = resultData.code;
        this.name = resultData.name;
        this.templateId = resultData.templateId;
        this.imgUrl = resultData.imgUrl;
        this.remark = resultData.remark;
        this.status = resultData.status;
        this.topicNavbarList = resultData.topicNavbarList;

        //组装导航字段
        this.packageNavTitle();
        //组装不同类目的导航数据
        this.packageSectionData();
    }

    /**
     * 组装专题数据
     */
    @action
    packageSectionData() {
        let tempArr = [];
        /*所有导航的数据源*/
        // let navListData = {
        //     navName: '',
        //     navSections: []
        // };
        //开始组装不同的nav下的sections数据
        const numberOfNav = this.topicNavbarList.slice().length;
        for (let indexOfNav = 0; indexOfNav < numberOfNav; indexOfNav++) {
            let topicNavListItemArr = this.topicNavbarList.slice();
            let topicNavListItem = topicNavListItemArr[indexOfNav];

            //单个导航的数据源
            // const { navName, topicBannerProducts, topicNavbarBannerList } = topicNavListItem;
            const { navName, topicBannerProducts, topicNavbarBannerList } = topicNavListItem;
            //为null的时候会终止函数,我也是醉了
            let BannerProducts = topicBannerProducts || [];
            //一个导航下的数据
            let sections = {
                navName: navName,
                sectionDataList: []
            };
            //创建导航的第一组,每一组的数据结构如下
            let firstSection = {
                key: 'one',
                //第一组的bannerImg为空
                bannerImg: '',
                data: BannerProducts.slice() || []
            };
            sections.sectionDataList.push(firstSection);
            /**
             * 第二个组开始
             */

            let topicNavbarBannerNormalList = topicNavbarBannerList || [];

            if (topicNavbarBannerNormalList.slice().length > 0) {
                topicNavbarBannerNormalList.slice().map((otherSection, otherSectionIndex) => {
                    const { topicBannerProductList } = otherSection;
                    let productlist = topicBannerProductList || [];
                    //组装从第二个开始的组
                    let otherSections = {
                        key: otherSectionIndex,
                        bannerImg: otherSection.bannerImg,
                        data: productlist.slice(),
                        aspectRatio:(otherSection.height / otherSection.width) || (16 / 75),
                    };
                    //开始加入从第二组开始的数据
                    sections.sectionDataList.push(otherSections);
                });
            }
            tempArr.push(sections);
              // console.log(tempArr);
        }
        this.sectionDataList = tempArr;
    }

    /**
     * 组装专题导航标题数据
     */
    @action
    packageNavTitle() {
        let [...tempArr] = this.topicNavbarList.slice();
        let titleArr = [];
        tempArr.map(item => {
            titleArr.push({
                title: item.navName,
                subTitle: item.desc
            });
        });
        this.topicNavTitleList = titleArr;
    }
    /**
     * 获取专题数据
     * @param topicID 专题id
     */
    @action
    loadTopicData(topicCode) {
        this.setRefresh(false)
        TopicAPI.findTopicById({
            code: topicCode
        }).then(result => {
            this.saveResultDataWith(result.data);
            bridge.hiddenLoading()
            this.setRefresh(false)
            console.log(result);
        }).catch(error => {
            this.setRefresh(false)
            bridge.hiddenLoading()
            bridge.$toast(error.msg);
        });
    }
}

export default TotalTopicresultDataModel;


