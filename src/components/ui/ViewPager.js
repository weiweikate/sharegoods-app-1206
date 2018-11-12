import React ,{Component}from 'react';
import PropTypes from 'prop-types';
import {  View ,} from 'react-native';
import Swiper from 'react-native-swiper';
import EmptyUtils from '../../utils/EmptyUtils';

// const ViewPager = props => {
//     const {
//         horizontal = true,
//         autoplay = false,
//         dotStyle,
//         activeDotStyle,
//         dotColor,
//         activeDotColor,
//         renderPagination,
//         arrayData,
//         renderItem,
//         swiperShow = false,
//         height,
//         showsPagination,
//         onIndexChanged,
//         index,
//         style,
//         ...attributes
//     } = props;
//
//     const styles = StyleSheet.create({
//         wrapper: style || {}
//     });
//
//     const renderItems = () => {
//         if (arrayData) {
//             let itemViews = [];
//             arrayData.map((item, index) => {
//                 itemViews.push(<View style={{ flex: 1 }} key={index}>
//                     {renderItem(item, index)}
//                 </View>);
//             });
//
//             return itemViews;
//         }
//     };
//     const renderSwiper = () => {
//         if (arrayData && arrayData.length > 0) {
//             if (renderPagination) {
//                 if (swiperShow) {
//                     return (
//                         <Swiper style={styles.wrapper}
//                                 height={height}
//                                 paginationStyle={{ marginBottom: -20 }}
//                                 horizontal={horizontal}
//                                 renderPagination={renderPagination}
//                                 autoplay={autoplay}
//                                 dotStyle={dotStyle}
//                                 activeDotStyle={activeDotStyle}
//                                 dotColor={dotColor}
//                                 activeDotColor={activeDotColor}
//                                 autoplayTimeout={5}
//                                 removeClippedSubviews={false}
//                                 showsPagination={showsPagination}
//                                 onIndexChanged={onIndexChanged}
//                                 index={index}
//                                 containerStyle={{
//                                     height: height
//                                 }}
//                                 {...attributes}>
//                             {renderItems()}
//                         </Swiper>);
//                 }
//             } else {
//                 if (swiperShow) {
//                     return (
//                         <Swiper style={styles.wrapper}
//                                 height={height}
//                                 paginationStyle={{ marginBottom: -20 }}
//                                 horizontal={horizontal}
//                                 autoplay={autoplay}
//                                 dotStyle={dotStyle}
//                                 activeDotStyle={activeDotStyle}
//                                 dotColor={dotColor}
//                                 activeDotColor={activeDotColor}
//                                 autoplayTimeout={5}
//                                 removeClippedSubviews={false}
//                                 showsPagination={showsPagination}
//                                 onIndexChanged={onIndexChanged}
//                                 index={index}
//                                 containerStyle={{
//                                     height: height
//                                 }}
//                                 {...attributes}>
//                             {renderItems()}
//                         </Swiper>);
//                 }
//             }
//         }
//     };
//
//     return (
//         <View>
//             {renderSwiper()}
//         </View>
//     );
// };


class ViewPager extends Component{
    constructor(props){
        super(props);
        this.state = {
            arrayData:this.props.arrayData
        }
    }


    componentWillReceiveProps(nextprops) {
        if(nextprops.arrayData !== this.props.arrayData){
            this.setState({
                arrayData:[]
            },()=>{
                this.setState({
                    arrayData:nextprops.arrayData
                })
            })
        }
    }


    renderSwiper = () => {
        let { ...props } = this.props;

        if (this.state.arrayData && this.state.arrayData.length > 0) {
            if (this.props.renderPagination) {
                if (this.props.swiperShow) {
                    return (
                        <Swiper
                            {...props}
                            style={this.props.styles ? this.props.styles.wrapper : {}}
                                height={this.props.height}
                                paginationStyle={{ marginBottom: -20 }}
                                horizontal={this.props.horizontal}
                                renderPagination={this.props.renderPagination}
                                autoplay={this.props.autoplay}
                                dotStyle={this.props.dotStyle}
                                activeDotStyle={this.props.activeDotStyle}
                                dotColor={this.props.dotColor}
                                activeDotColor={this.props.activeDotColor}
                                autoplayTimeout={5}
                                removeClippedSubviews={false}
                                showsPagination={this.props.showsPagination}
                                onIndexChanged={this.props.onIndexChanged}
                                index={this.props.index}
                                containerStyle={{
                                    height: this.props.height
                                }}
                               >
                            {this.renderItems()}
                        </Swiper>);
                }
            } else {
                if (this.props.swiperShow) {
                    return (
                        <Swiper
                            {...props}
                            style={this.props.styles ? this.props.styles.wrapper : {}}
                                height={this.props.height}
                                paginationStyle={{ marginBottom: -20 }}
                                horizontal={this.props.horizontal}
                                autoplay={this.props.autoplay}
                                dotStyle={this.props.dotStyle}
                                activeDotStyle={this.props.activeDotStyle}
                                dotColor={this.props.dotColor}
                                activeDotColor={this.props.activeDotColor}
                                autoplayTimeout={5}
                                removeClippedSubviews={false}
                                showsPagination={this.props.showsPagination}
                                onIndexChanged={this.props.onIndexChanged}
                                index={this.props.index}
                                containerStyle={{
                                    height: this.props.height
                                }}
                                >
                            {this.renderItems()}
                        </Swiper>);
                }
            }
        }
    };

    renderItems = () => {
        if (this.state.arrayData) {
            let itemViews = [];
            this.state.arrayData.map((item, index) => {
                itemViews.push(<View style={{ flex: 1 }} key={index}>
                    {this.props.renderItem(item, index)}
                </View>);
            });

            return itemViews;
        }
    };


    render(){
        if(EmptyUtils.isEmpty(this.state.arrayData) || this.state.arrayData.length === 0){
            return null;
        }

        return (
            <View>
                {this.renderSwiper()}
            </View>
        );
    }
}

ViewPager.propTypes = {
    arrayData: PropTypes.array,
    renderItem: PropTypes.func,
    dotStyle: PropTypes.any,
    activeDotStyle: PropTypes.any,
    renderPagination: PropTypes.func
};

export default ViewPager;
