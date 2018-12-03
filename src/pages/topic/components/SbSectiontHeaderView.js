import {
    View,
    Image,
    StyleSheet

} from 'react-native';

import React, { Component } from 'react';
import ScreenUtils from '../../../utils/ScreenUtils';
import PropTypes from 'prop-types';
import SubSwichView from './SubSwichView';
// import ImageLoad from '@mr/image-placeholder'
import DesignRule from 'DesignRule';
import PreLoadImage from '../../../components/ui/preLoadImage/PreLoadImage';

class SbSectiontHeaderView extends Component {

    static propTypes = {
        subjectType: PropTypes.number

    };

    constructor(props) {
        super(props);
    }

    render() {
        const { subjectType } = this.props;

        return (
            <View>
                <Image
                    style={SbSectiontHeaderViewStyles.topImageStyle}
                />
                {subjectType === 1 ?
                    <SubSwichView/> : null}

            </View>
        );
    }

}

const SbSectiontHeaderViewStyles = StyleSheet.create({
    topImageStyle: {
        width: ScreenUtils.width,
        height: ScreenUtils.width * 375 / 750,
        backgroundColor: DesignRule.mainColor
    }
});

/*活动类型one的view 只是测试 可能会有多种,再添加*/
class ActivityOneView extends Component {

    static propTypes = {
        imageUrl: PropTypes.string.isRequired,
        ratio: PropTypes.number
    };
    constructor(props){
        super(props)
        this.state={
            ratio:1
        }

        Image.getSize(this.props.imageUrl,(width,heigth)=>{
            this.setState({
                ratio:heigth/width
            })
        })
    }

    render() {
        const { imageUrl, ratio } = this.props;
        console.log(this.props);
        return (
            <View>
                <PreLoadImage
                    imageUri={imageUrl}
                    style={[
                        ActivityOneViewStyles.bgImageStyle,
                        ratio ?
                            {
                                height: ScreenUtils.width * this.state.ratio
                            }
                            :
                            {
                                height: ScreenUtils.width * this.state.ratio
                            }

                    ]}

                    resizeMode={'stretch'}

                />
            </View>
        );
    }
}

const ActivityOneViewStyles = StyleSheet.create({
    bgImageStyle: {
        // height: ScreenUtils.width * 16 / 75,
        width: ScreenUtils.width,
        backgroundColor: 'white'
    }
});

export { SbSectiontHeaderView, ActivityOneView };


