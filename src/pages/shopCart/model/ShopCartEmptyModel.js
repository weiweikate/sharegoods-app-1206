const EmptyViewTypes = {
    topEmptyItem: 'topEmptyItem',
    recommendListItem:'recommendListItem',
};

class ShopCartEmptyModel {
    emptyViewList=[
        {
            id: 0,
            type: EmptyViewTypes.topEmptyItem
        },
        {
            id: 1,
            type: EmptyViewTypes.topEmptyItem
        }
    ];
}

const shopCartEmptyModel = new ShopCartEmptyModel();

export default shopCartEmptyModel;
