import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { RootState } from '../../store/store';
import { AppState, AppStateStatus } from 'react-native';
import { fetchAllAlerts } from '../../store/actions/alerts';
import { fetchThings } from '../../store/actions/things';
import { notificationManager } from '../../utils/NotificationManager';

import AuthTabs from './AuthTabs';
import TutorialScreen from '../../screens/TutorialScreen';
import ErrorBoundary from 'react-native-error-boundary';
import ErrorFallBackScreen from '../../screens/ErrorFallBackScreen';

const AuthStack = createStackNavigator();

export const AuthStackScreen = (props: any) => {
    const tutorialSeen = useSelector((state: RootState) => state.auth.tutorialSeen);

    const dispatch = useDispatch();
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    useEffect(() => {
        AppState.addEventListener("change", _handleAppStateChange);

        return () => {
            AppState.removeEventListener("change", _handleAppStateChange);
        };
    }, []);

    const _handleAppStateChange = (nextAppState: AppStateStatus) => {

        if (appState.current.match(/inactive|background/) && nextAppState === "active") {
            // ("App has come to the foreground!");
            dispatch(fetchThings());
            dispatch(fetchAllAlerts());

            notificationManager.cancelAllNotification();
            notificationManager.iOSSetBadgeNumber(0);

        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        // console.log("AppState", appState.current);
    };

    return (
        <ErrorBoundary FallbackComponent={ErrorFallBackScreen}>

            <AuthStack.Navigator>
                {!tutorialSeen ?
                    <AuthStack.Screen name="TutorialScreen" component={TutorialScreen} options={{ headerShown: false }} />
                    :
                    <AuthStack.Screen name="AuthTabsScreen" component={AuthTabs} options={{ headerShown: false }} />
                }
            </AuthStack.Navigator>
        </ErrorBoundary>

    )
};

