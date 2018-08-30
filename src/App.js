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
        this.setState({load: true});
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

        return (
            <View style={styles.container}>
                <Navigator screenProps={this.props.params} ref='Navigator'/>
                {
                    CONFIG.showDebugPanel ? <DebugButton onPress={this.showDebugPage}><Text style={{color: 'white'}}>调试页</Text></DebugButton> : null
                }

            </View>
        );
    }

    showDebugPage = () => {
        const navigationAction = NavigationActions.navigate({
            routeName: RouterMap.DebugPanelPage,
            params: {},

            // navigate can have a nested navigate action that will be run inside the child router
            action: NavigationActions.navigate({routeName: RouterMap.DebugPanelPage})
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
