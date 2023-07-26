import { ThunkDispatch } from '../store';
import { RootState } from '../store';
import { Location } from '../reducers/locations';
import { Config } from '../../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { triggerLogout } from './helpers';
import * as RootNavigation from '../../navigation/RootNavigation';
import { Platform } from 'react-native';

export function loadLocations(locations: Location[]) {
    return {
        type: '@@locations/LOAD_LOCATIONS' as const,
        locations: locations
    };
};

export function loadLocation(locationId: number, location: Location) {
    return {
        type: "@@locations/LOAD_LOCATION" as const,
        locationId: locationId,
        location: location
    }
}

export function locationIsLoading(isLoading: boolean) {
    return {
        type: '@@locations/LOCATION_IS_LOADING' as const,
        isLoading
    };
};

export function clearLocations() {
    return {
        type: '@@locations/CLEAR_LOCATIONS' as const,
    }
}

export function loadLocationfail(){
    return{
        type: '@@locations/LOCATION_LOAD_FAIL' as const,
    }
}

export type LocationsActions = ReturnType<typeof loadLocations> | ReturnType<typeof locationIsLoading> |
            ReturnType<typeof loadLocation> | ReturnType<typeof clearLocations> 

// Thunk Actions
export function fetchLocations() {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {

        try {

            dispatch(locationIsLoading(true));

            const token = await AsyncStorage.getItem('authToken');

            const res = await fetch(`${Config.api_server}/locations`, {
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

            const locations = await res.json();

            dispatch(loadLocations(locations));

        } catch (err) {
            console.log("[Error: Fetch locations]", err);
            RootNavigation.navigate('NetworkErrorScreen', {}, {});
        } finally {
            dispatch(locationIsLoading(false));
        }
    };
};

export function fetchLocation(locationId: number) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {

            dispatch(locationIsLoading(true));

            const token = await AsyncStorage.getItem('authToken');

            const res = await fetch(`${Config.api_server}/locations/${locationId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.status === 401) {
                triggerLogout(res);
                return;
            };

            if (res.status !== 200) {
                RootNavigation.navigate('ErrorScreen', { statusCode: res.status }, {})
                return
            };

            const data = await res.json();

            if (data) {
                dispatch(loadLocation(locationId, data));
            };


        } catch (err) {
            console.log('[Error: Fetch Location]', err);
            RootNavigation.navigate('NetworkErrorScreen', {}, {});
        } finally {
            dispatch(locationIsLoading(false));
        }
    };
}

export function updateLocation(locationId: number, name: string, code: string, photo: any) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {

            dispatch(locationIsLoading(true));

            const token = await AsyncStorage.getItem('authToken');

            const havePhoto = Object.keys(photo).length !== 0

            const createFormData = () => {
                const data = new FormData();
                data.append('location[name]', name)
                data.append('location[code]', code)

                if (havePhoto) {
                    data.append('location[photo]', {
                        name: photo.fileName,
                        type: photo.type,
                        uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
                    });
                }
                return data;
            };

            const res = await fetch(`${Config.api_server}/locations/${locationId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: createFormData(),
            });

            if (res.status === 401) {
                triggerLogout(res);
                return;
            };

            if (res.status !== 200) {
                RootNavigation.navigate('ErrorScreen', { statusCode: res.status }, {})
                return
            };

            const data = await res.json();

            if (data.Message == "Not Saved") {
                RootNavigation.navigate('ErrorScreen', { statusCode: res.status }, {})
                return
            }

            if (data.Message == "Saved") {
                dispatch(fetchLocation(locationId));
                RootNavigation.navigate('LocationDetailsScreen', { id: locationId }, {})
            };

        } catch (err) {
            console.log('[Error: Fetch Location]', err);
            RootNavigation.navigate('NetworkErrorScreen', {}, {});
        } finally {
            dispatch(locationIsLoading(false));
        }
    };
}
