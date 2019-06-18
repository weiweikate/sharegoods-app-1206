import { observable } from 'mobx';

const EmptyViewTypes = {
    topEmptyItem: 'topEmptyItem',
    recommendListItem: 'recommendListItem'
};

class ShopCartEmptyModel {
    emptyViewList = [];

    constructor(props) {

        this.createData();
    }

    createData = () => {

        for (let i = 0; i < 10; i++) {
            let radomNum = Math.round(Math.random());

            let ImageHeight = radomNum>0?radomNum * 168:0.5*168;
            let ramdomHeight = ImageHeight + 98;
            this.emptyViewList.push(
                {
                    id: 0,
                    type: EmptyViewTypes.recommendListItem,
                    height: ramdomHeight,
                    imageHeight: ImageHeight
                }
            );
        }
    };
    @observable
    isRefreshing = false;


}

const shopCartEmptyModel = new ShopCartEmptyModel();

export { shopCartEmptyModel, EmptyViewTypes };
