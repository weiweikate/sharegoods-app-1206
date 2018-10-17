import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import Swiper from 'react-native-swiper';

const ViewPager = props => {
    const {
        horizontal = true,
        autoplay = false,
        dotStyle,
        activeDotStyle,
        dotColor,
        activeDotColor,
        renderPagination,
        arrayData,
        renderItem,
        swiperShow = false,
        height,
        showsPagination,
        onIndexChanged,
        index,
        ...attributes
    } = props;

    const styles = StyleSheet.create({
        wrapper: {}
    });

    const renderItems = () => {
        if (arrayData) {
            let itemViews = [];
            arrayData.map((item, index) => {
                itemViews.push(<View style={{ flex: 1 }} key={index}>
                    {renderItem(item, index)}
                </View>);
            });

            return itemViews;
        }
    };
    const renderSwiper = () => {
        if (arrayData && arrayData.length > 0) {
            if (renderPagination) {
                if (swiperShow) {
                    return (
                        <Swiper style={styles.wrapper}
                                height={height}
                                paginationStyle={{ marginBottom: -20 }}
                                horizontal={horizontal}
                                renderPagination={renderPagination}
                                autoplay={autoplay}
                                dotStyle={dotStyle}
                                activeDotStyle={activeDotStyle}
                                dotColor={dotColor}
                                activeDotColor={activeDotColor}
                                autoplayTimeout={5}
                                removeClippedSubviews={false}
                                showsPagination={showsPagination}
                                onIndexChanged={onIndexChanged}
                                index={index}
                                containerStyle={{
                                    height: height
                                }}>
                            {renderItems()}
                        </Swiper>);
                }
            } else {
                if (swiperShow) {
                    return (
                        <Swiper style={styles.wrapper}
                                height={height}
                                paginationStyle={{ marginBottom: -20 }}
                                horizontal={horizontal}
                                autoplay={autoplay}
                                dotStyle={dotStyle}
                                activeDotStyle={activeDotStyle}
                                dotColor={dotColor}
                                activeDotColor={activeDotColor}
                                autoplayTimeout={5}
                                removeClippedSubviews={false}
                                showsPagination={showsPagination}
                                onIndexChanged={onIndexChanged}
                                index={index}
                                containerStyle={{
                                    height: height
                                }}>
                            {renderItems()}
                        </Swiper>);
                }
            }
        }
    };

    return (
        <View  {...attributes}>
            {renderSwiper()}
        </View>
    );
};

ViewPager.propTypes = {
    arrayData: PropTypes.array,
    renderItem: PropTypes.func,
    dotStyle: PropTypes.any,
    activeDotStyle: PropTypes.any,
    renderPagination: PropTypes.func
};

export default ViewPager;
