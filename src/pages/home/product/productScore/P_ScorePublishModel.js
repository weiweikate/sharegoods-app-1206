import { observable, action } from 'mobx';

export default class P_ScorePublishModel {
    @observable productArr = [];

    /*{
    imgVideos,
    hasVideo,
    starCount,
    contentText
    }*/
    @observable itemDataS = [];

    @action setDefaultData = () => {
        this.productArr = [{}, {}, {}];
        for (let i = 0; i < this.productArr.length; i++) {
            this.itemDataS.push(
                { imgVideos: [], hasVideo: false, starCount: 5, contentText: '' }
            );
        }
    };

    @action changeText = (itemIndex, text) => {
        let itemData = this.itemDataS[itemIndex];
        itemData.contentText = text;
    };

    @action changeStar = (itemIndex, starIndex) => {
        let itemData = this.itemDataS[itemIndex];
        itemData.starCount = starIndex;
    };

    @action addImgVideo = (itemIndex) => {
        let itemData = this.itemDataS[itemIndex];
        itemData.imgVideos.push([]);
    };

    @action deleteImgVideo = (itemIndex, imgIndex) => {
        let itemData = this.itemDataS[itemIndex];
        itemData.imgVideos.splice(imgIndex, 1);
    };
}
