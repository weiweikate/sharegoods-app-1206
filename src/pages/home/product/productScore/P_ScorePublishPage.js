import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import BasePage from '../../../../BasePage';
import P_ScorePubItemView from './components/P_ScorePubItemView';
import ActionSheetView from '../../../spellShop/components/ActionSheetView';
import P_ScorePublishModel from './P_ScorePublishModel';
import { observer } from 'mobx-react';
import BusinessUtils from '../../../mine/components/BusinessUtils';

@observer
export class P_ScorePublishPage extends BasePage {

    p_ScorePublishModel = new P_ScorePublishModel();


    componentDidMount() {
        this.p_ScorePublishModel.setDefaultData();
    }

    _showActionSheetView = (itemIndex) => {
        this.ActionSheetView.show({
            items: ['小视频', '拍照', '我的相册']
        }, (value, index1) => {
            switch (index1) {
                case 0:
                    setTimeout(() => {
                        BusinessUtils.pickSingleWithCamera(true, (response) => {
                            // const { imageUrl } = response;
                        });
                    }, 500);
                    break;
                case 1:
                    setTimeout(() => {
                        BusinessUtils.pickSingleWithCamera(true, (response) => {
                            // const { imageUrl } = response;
                        });
                    }, 500);
                    break;
                case 2:
                    setTimeout(() => {
                        BusinessUtils.pickMultiple(3, (response) => {
                            // const { imageUrl } = response;
                        });
                    }, 500);
                    break;
            }
            // this.p_ScorePublishModel.addImgVideo(itemIndex);
        });
    };

    _renderItem = ({ item, index }) => {
        return <P_ScorePubItemView itemData={{ item, index }}
                                   p_ScorePublishModel={this.p_ScorePublishModel}
                                   showAction={this._showActionSheetView}/>;
    };

    _keyExtractor = (item, index) => {
        return `${item.id}${index}`;
    };

    _render() {
        const { productArr } = this.p_ScorePublishModel;
        return (
            <View style={styles.container}>
                <FlatList data={productArr}
                          renderItem={this._renderItem}
                          keyExtractor={this._keyExtractor}/>
                <ActionSheetView ref={(ref) => {
                    this.ActionSheetView = ref;
                }}/>
            </View>

        );
    }
}

export default P_ScorePublishPage;

const styles = StyleSheet.create({
    container: { flex: 1 }
});
