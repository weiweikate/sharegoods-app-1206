/*
* 横向展示的row
* */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Image
} from 'react-native';
import ScreenUtils from '../../../../utils/ScreenUtils';
import DesignRule from '../../../../constants/DesignRule';
import res from '../../res';
import UIImage from '@mr/image-placeholder';
import { MRText as Text } from '../../../../components/ui';

const gwc = res.search.gwc;

const imgHeight = (ScreenUtils.width - 30 - 5) / 2;

export default class ResultHorizontalRow extends Component {

    static propTypes = {
        onPressAtIndex: PropTypes.func.isRequired,
        storeProduct: PropTypes.func.isRequired,
        itemData: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { isActivity } = this.props;
        let { minPrice, promotionMinPrice, name, imgUrl } = this.props.itemData || {};
        return (
            <TouchableWithoutFeedback onPress={() => {
                this.props.onPressAtIndex(this.props.itemData || {});
            }}>
                <View style={[styles.container, this.props.style]}>
                    <ReuserImage style={styles.img} source={{ uri: imgUrl }}/>

                    <Text style={{
                        color: DesignRule.textColor_mainTitle,
                        fontSize: 13,
                        paddingHorizontal: 10,
                        marginTop: 9
                    }}
                          numberOfLines={2} allowFontScaling={false}>{`${name || ''}`}</Text>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: 10,
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        left: 10
                    }}>
                        <Text
                            style={{ color: DesignRule.mainColor, fontSize: 17 }}
                            allowFontScaling={false}>{`￥${isActivity ? promotionMinPrice : minPrice}起`}</Text>

                        <TouchableWithoutFeedback onPress={() => {
                            this.props.storeProduct(this.props.itemData);
                        }}>
                            <View style={{
                                width: 35,
                                height: 35,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Image source={gwc}/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }

}

class ReuserImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imagePath: this.props.source.uri
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.source && nextProps.source &&
            this.props.source.uri !== nextProps.source.uri
        ) {
            this.fetchImage(nextProps.source.uri);
        }
    }

    fetchImage(url) {
        this.setState({
            imagePath: ''
        }, () => {
            this.setState({
                imagePath: url
            });
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.imagePath !== nextState.imagePath;
    }

    render() {
        return <UIImage
            {...this.props}
            source={{ uri: this.state.imagePath }}
            showPlaceholder={false}
        />;
    }
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        borderRadius: 5,
        marginTop: 5,
        height: imgHeight + 82,
        backgroundColor: 'white',
        width: imgHeight
    },
    img: {
        height: imgHeight,
        width: imgHeight
    }
});

