import { observable, computed, action } from 'mobx';

class TotalTopicresultDataModel {
    @observable
    id = '';
    @observable
    code = '';
    @observable
    name = '';
    @observable
    templateId = '';
    @observable
    imgUrl = '';
    @observable
    remark = '';
    @observable
    status = '';
    @observable
    topicNavbarList = [];
    @observable
    topicNavTitleList = [];

    /*不同导航下的数据*/
    @observable
    sectionDataList = [];

    @action
    saveResultDataWith(resultData) {
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
    @action
    packageSectionData() {

        let tempArr = [];

        /*所有导航的数据源*/
        let navListData = {
            navName: '',
            navSections: []
        };
        //开始组装不同的nav下的sections数据
        this.topicNavbarList.slice().map((topicNavListItem, index) => {
            // sections={[{
            //             title: 'one',
            //             key: 'one',
            //             data: [
            //                 { key: 'Devin' },
            //                 { key: 'Jackson' },
            //                 { key: 'James' },
            //                 { key: 'Joel' },
            //                 { key: 'John' },
            //                 { key: 'Jillian' }
            //             ]
            //         }]};
           //单个导航的数据源
            const {navName,topicBannerProducts,topicNavbarBannerList} = topicNavListItem

            let sections = {
                navName:navName,
                sectionDataList:[],
            };
            //创建导航的第一组
            let firstSection = {
                key:'first',
                data:topicBannerProducts,
            };
            sections.sectionDataList.push(firstSection)
            //判断从第二个section开始的数据是否有数据
            if (topicNavbarBannerList instanceof Array &&
                topicNavbarBannerList.length > 0
            ) {
                topicNavbarBannerList.map((otherSection, otherSectionIndex)=>{
                    //组装从第二个开始的组
                    let otherSections = {
                        key:otherSectionIndex,
                        bannerImg:otherSection.bannerImg,
                        data:otherSection.topicBannerProductList||[],
                    };
                    sections.sectionDataList.push(otherSections);
                })
            }
            navListData.navSections.push(sections)
            tempArr.push(navListData);

        });
        this.sectionDataList=tempArr;
        console.log(this.sectionDataList);
    }

    @action
    packageNavTitle() {
        let [...tempArr] = this.topicNavbarList.slice();
        let titleArr = [];
        tempArr.map(item => {
            titleArr.push(item.navName);
        });
        this.topicNavTitleList = titleArr;
    }
}

export default TotalTopicresultDataModel;


