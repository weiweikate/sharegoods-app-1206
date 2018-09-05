/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import {NavigationActions, StackNavigator} from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';
import RouterMap from './RouterMap';

import Router from './Router';
import DebugButton from './components/debug/DebugButton';
import apiEnvironment from './api/ApiEnvironment';
import CONFIG from '../config';

type Props = {};
export default class App extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            load: false
        };
    }

    async componentDidMount() {
        await apiEnvironment.loadLastApiSettingFromDiskCache();
        global.$navigator = this.refs.Navigator;
    }

    render() {

        const Navigator = StackNavigator(Router,
            {
                initialRouteName: 'Tab',
                initialRouteParams: {},
                headerMode: 'none',
                transitionConfig: () => ({
                    screenInterpolator: CardStackStyleInterpolator.forHorizontal
                }),
                navigationOptions: {
                    gesturesEnabled: true,
                },
            }
        );
        // goBack 返回指定的router
        const defaultStateAction = Navigator.router.getStateForAction;
        Navigator.router.getStateForAction = (action, state) => {
            //console.log(action,state)
            if (state && action.type === NavigationActions.BACK && state.routes.length === 1) {
                console.log("退出RN页面");
                const routes = [...state.routes];
                return {
                    ...state,
                    ...state.routes,
                    index: routes.length - 1,
                };
            }
            return defaultStateAction(action, state);
        };
        const getCurrentRouteName = (navigationState) => {
            if (!navigationState) {
                return null;
            }
            const route = navigationState.routes[navigationState.index];
            if (route.routes) {
                return getCurrentRouteName(route);
            }
            return route.routeName;
        };

        return (
            <View style={styles.container}>
                <Navigator screenProps={this.props.params} ref='Navigator'
                           onNavigationStateChange={(prevState, currentState) => {
                               let curRouteName = getCurrentRouteName(currentState);
                               console.log(curRouteName);
                               const currentScreen = getCurrentRouteName(currentState);
                               const prevScreen = getCurrentRouteName(prevState);
                               if (prevScreen !== currentScreen) {
                                   console.log('从页面' + prevScreen + '跳转页面' + currentScreen);
                               }
                           }}/>
                {
                    CONFIG.showDebugPanel ? <DebugButton onPress={this.showDebugPage}><Text
                        style={{color: 'white'}}>调试页</Text></DebugButton> : null
                }

            </View>
        );
    }

    showDebugPage = () => {
        const navigationAction = NavigationActions.navigate({
            routeName: RouterMap.DebugPanelPage
            //routeName:'shopCart/demo1111/AddressBookPage'
        });
        this.refs.Navigator.dispatch(navigationAction);
    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF'
    },
    debugBtn: {
        width: 60,
        height: 35,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
