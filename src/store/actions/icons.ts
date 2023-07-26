import { ThunkDispatch } from '../store';
import { RootState } from '../store';
import { Icon } from '../reducers/icons';
import { Config } from '../../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { triggerLogout } from './helpers';
import * as RootNavigation from '../../navigation/RootNavigation';

export function loadIcons(icons: Icon[]) {
    return {
        type: '@@icons/LOAD_ICONS' as const,
        icons: icons
    };
};

export type IconsActions = ReturnType<typeof loadIcons>

// Thunk Actions
export function fetchIcons() {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {

        try {

            const token = await AsyncStorage.getItem('authToken');

            const res = await fetch(`${Config.api_server}/icons`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.status === 401) {
                triggerLogout(res);
                return;
            };

            if (res.status !== 200) {
                RootNavigation.navigate('ErrorScreen', {statusCode: res.status}, {})
                return
            };
    
            const icons = await res.json();

            dispatch(loadIcons(icons));

        } catch (err) {
            console.log("[Error: Fetch icons]", err)
        };
    };
};