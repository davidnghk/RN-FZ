import React, { useEffect, useRef, useState } from 'react';
import { AppState, View, Text, AppStateStatus, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './RootNavigation';
import { RootState } from '../store/store';
import { useTranslation } from 'react-i18next';

// Actions
import * as AuthActions from '../store/actions/auth';
import * as UserActions from '../store/actions/user';

// Stacks
import { VisitorStackScreen } from './stack/VisitorStack';
import { AuthStackScreen } from './stack/AuthStack'
import LoadingScreen from '../screens/LoadingScreen';


const AppNavigator = () => {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const userIsAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    useEffect(() => {
        dispatch(AuthActions.checkLogin());
    }, [dispatch, userIsAuthenticated]);

    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    useEffect(() => {
        AppState.addEventListener('change', _handleAppStateChange);

        return () => {
            AppState.removeEventListener('change', _handleAppStateChange);
        };
    }, []);

    const _handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
            // console.log('1. App has come to the foreground!');

            // below is to check if user has unread alerts
            dispatch(UserActions.getUserInfo());
        };

        // if (nextAppState === 'background') {
        // };

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        // console.log('2. AppState', appState.current);
    };

    if (userIsAuthenticated === null) {
        return (
            <LoadingScreen />
        )
    };

    return (
        //@ts-ignore
        <NavigationContainer ref={navigationRef}>
            {userIsAuthenticated ?
                <AuthStackScreen />
                :
                <VisitorStackScreen />
            }
        </NavigationContainer>
    )
};

const styles = StyleSheet.create({
    loadingScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default AppNavigator;