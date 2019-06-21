import { observable ,action} from 'mobx';
import ShopCartAPI from '../api/ShopCartApi';

const EmptyViewTypes = {
    topEmptyItem: 'topEmptyItem',
    recommendListItem: 'recommendListItem'
};

class ShopCartEmptyModel {
    @observable
    emptyViewList = [];
    pageSize=10;
    page=1;

    constructor(props) {
        this.createData();
    }
    createData = () => {
        for (let i = 0; i < 10; i++) {
            // let radomNum = Math.round(Math.random());
            // let ImageHeight = radomNum>0?radomNum * 168:0.5*168;
            // let ramdomHeight = ImageHeight +
            if (i === 0){
                this.emptyViewList.push(
                    {
                        id: i,
                        type: EmptyViewTypes.topEmptyItem,
                        height: 168 + 98,
                        imageHeight: 168
                    }
                );
            } else {
                this.emptyViewList.push(
                    {
                        id: i,
                        type: EmptyViewTypes.recommendListItem,
                        height: 168 + 98,
                        imageHeight: 168
                    }
                );
            }
        }
    };
    @observable
    isRefreshing = false;
    @action
    getRecommendProducts=()=>{
        ShopCartAPI.recommendProducts({
            page:this.page,
            pageSize:10
        }).then(result=>{
            console.log(result);
        }).catch(error=>{

        })
    }


}

const shopCartEmptyModel = new ShopCartEmptyModel();

export { shopCartEmptyModel, EmptyViewTypes };
