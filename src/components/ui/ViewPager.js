import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Swiper from 'react-native-swiper';
import EmptyUtils from '../../utils/EmptyUtils';
import _ from 'lodash';

class ViewPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrayData: this.props.arrayData
        };
    }


    componentWillReceiveProps(nextprops, nextState) {
        let deff = _.differenceWith(nextprops.arrayData, this.props.arrayData, _.isEqual);
        if (deff && deff.length > 0) {
            this.setState({
                arrayData: []
            }, () => {
                this.setState({
                    arrayData: nextprops.arrayData
                });
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        let deffProps = _.differenceWith(nextProps.arrayData, this.props.arrayData, _.isEqual);
        let deffState = _.differenceWith(nextState.arrayData, this.state.arrayData, _.isEqual);
        if ((deffProps && deffProps.length > 0) || (deffState && deffState.length > 0)) {
            return true;
        } else {
            return false;
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
                            }}>
                            {this.renderItems()}
                        </Swiper>);
                }
                return null;
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


    render() {
        if (EmptyUtils.isEmpty(this.state.arrayData) || this.state.arrayData.length === 0) {
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
