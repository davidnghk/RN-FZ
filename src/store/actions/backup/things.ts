import { ThunkDispatch } from '../store';
import { RootState } from '../store';
import { Thing } from '../reducers/things';
import { Config } from '../../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RootNavigation from '../../navigation/RootNavigation';
import { Alert, Platform } from 'react-native';
import { triggerLogout } from './helpers';
import { actionTriggerShowModal } from './modal';
import { fetchLocation } from '../actions/locations'

export function loadThings(things: Thing[]) {
    return {
        type: '@@things/LOAD_THINGS' as const,
        things: things
    };
};

export function thingIsLoading(isLoading: boolean) {
    return {
        type: '@@things/THING_IS_LOADING' as const,
        isLoading
    };
};

export function clearThings() {
    return {
        type: '@@things/CLEAR_THINGS' as const
    }
};

export function loadThing(thingId: number, thing: Thing) {
    return {
        type: "@@things/LOAD_THING" as const,
        thingId: thingId,
        thing: thing
    }
}

export type ThingsActions = ReturnType<typeof loadThings> | ReturnType<typeof loadThing> |
    ReturnType<typeof thingIsLoading> | ReturnType<typeof clearThings>

// Thunk Actions
export function fetchThings() {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {

            dispatch(thingIsLoading(true));

            const token = await AsyncStorage.getItem('authToken');

            const res = await fetch(`${Config.api_server}/things`, {
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

            dispatch(loadThings(data));

        } catch (err) {
            console.log('[Error: Fetch things]', err);
            RootNavigation.navigate('NetworkErrorScreen', {}, {});
        } finally {
            dispatch(thingIsLoading(false));
        }
    };
};

export function fetchThing(thingId: number) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {

            dispatch(thingIsLoading(true));

            const token = await AsyncStorage.getItem('authToken');

            const res = await fetch(`${Config.api_server}/things/${thingId}`, {
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
                dispatch(loadThing(thingId, data));
            };


        } catch (err) {
            console.log('[Error: Fetch thing]', err);
            RootNavigation.navigate('NetworkErrorScreen', {}, {});
        } finally {
            dispatch(thingIsLoading(false));
        }
    };
}

export function searchThing(eui: string) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {

            dispatch(thingIsLoading(true));

            const token = await AsyncStorage.getItem('authToken');

            const res = await fetch(`${Config.api_server}/things?dev_eui=${eui}`, {
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

            if (data.length === 0) {
                dispatch(actionTriggerShowModal(true, 'Scan device', 'Device not found'));
                return;
            };

            const id = data[0].id;

            RootNavigation.navigate('RegisterDeviceScreen', { thingId: id }, {});

        } catch (err) {
            console.log('[Error: Search device]', err);
            RootNavigation.navigate('NetworkErrorScreen', {}, {});

        } finally {
            dispatch(thingIsLoading(false));
        };
    };
};

// export function registerDeviceWithoutPhoto(thingId: string, name: string, fromScreen?: string) {
//     return async (dispatch: ThunkDispatch, getState: () => RootState) => {
//         try {

//             dispatch(thingIsLoading(true));

//             const token = await AsyncStorage.getItem('authToken');

//             let formData = new FormData();
//             formData.append('name', name);

//             const res = await fetch(`${Config.api_server}/things/${thingId}/api_update`, {
//                 method: 'PUT',
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: formData
//             });

//             if (res.status === 401) {
//                 triggerLogout(res);
//                 return;
//             };

//             if (res.status !== 200) {
//                 RootNavigation.navigate('ErrorScreen', { statusCode: res.status }, {})
//                 return
//             };

//             const response = await res.json();

//             if (!response.Message) {
//                 return;
//             };

//             if (response.Message != 'The things was claimed') {
//                 return;
//             };

//             dispatch(fetchThings());

//             if (fromScreen === 'register') {
//                 RootNavigation.navigate('AddDeviceCompletedScreen', {}, {})
//             } else {
//                 RootNavigation.navigate('ThingDetailsScreen', { id: thingId }, {})
//             }

//         } catch (err) {
//             console.log('[Error: register device without photo]', err)
//             RootNavigation.navigate('NetworkErrorScreen', {}, {});
//         } finally {
//             dispatch(thingIsLoading(false));
//         }
//     };
// };

export function registerDevice(thingId: string, name: string, photo: any, xCoordinate: number, yCoordinate: number, fromScreen: string) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {

            dispatch(thingIsLoading(true));

            const havePhoto = Object.keys(photo).length !== 0

            const token = await AsyncStorage.getItem('authToken');

            const createFormData = (name: string, floorplan: any, xCoordinate: number, yCoordinate: number) => {

                const data = new FormData();

                data.append('name', name)
                data.append('x_coordinate', xCoordinate);
                data.append('y_coordinate', yCoordinate);

                if (havePhoto) {
                    data.append('floorplan', {
                        name: floorplan.fileName,
                        type: floorplan.type,
                        uri: Platform.OS === 'ios' ? floorplan.uri.replace('file://', '') : floorplan.uri,
                    });
                }

                return data;
            };

            const res = await fetch(`${Config.api_server}/things/${thingId}/api_update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: createFormData(name, photo, xCoordinate, yCoordinate),
            });

            if (res.status === 401) {
                triggerLogout(res);
                return;
            };

            if (res.status !== 200) {
                RootNavigation.navigate('ErrorScreen', { statusCode: res.status }, {})
                return
            };

            const response = await res.json();

            if (!response.Message) {
                return;
            };

            if (response.Message != 'The things was claimed') {
                return;
            }

            dispatch(fetchThings())

            if (fromScreen === 'register') {
                RootNavigation.navigate('AddDeviceCompletedScreen', {}, {})
            } else {
                RootNavigation.navigate('ThingDetailsScreen', { id: thingId }, {})
            }


        } catch (err) {
            console.log('[Error: register device]', err)
            RootNavigation.navigate('NetworkErrorScreen', {}, {});
        } finally {
            dispatch(thingIsLoading(false));
        }
    };
};

export function editDeviceToRemovePhoto(thingId: string, name: string, photoUri: any) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {

            dispatch(thingIsLoading(true));

            const token = await AsyncStorage.getItem('authToken');

            const createFormData = (name: string, photoUri: any,) => {

                const data = new FormData();
                data.append('name', name)
                data.append('floorplan', {
                    name: 'default_empty_image.jpeg',
                    type: 'image/jpg',
                    uri: photoUri,
                });
                return data;
            };

            const res = await fetch(`${Config.api_server}/things/${thingId}/api_update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: createFormData(name, photoUri),
            });

            if (res.status === 401) {
                triggerLogout(res);
                return;
            };

            if (res.status !== 200) {
                RootNavigation.navigate('ErrorScreen', { statusCode: res.status }, {})
                return
            };

            const response = await res.json();

            if (!response.Message) {
                return;
            };

            if (response.Message != 'The things was claimed') {
                return;
            }

            dispatch(fetchThings())

            RootNavigation.navigate('ThingDetailsScreen', { id: thingId }, {})

        } catch (err) {
            console.log('[Error: register device]', err)
            RootNavigation.navigate('NetworkErrorScreen', {}, {});
        } finally {
            dispatch(thingIsLoading(false));
        }
    };
};

export function editDeviceNameOnlyAndKeepCoordinate(thingId: number, name: string, xCoordinate: number, yCoordinate: number) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {

            // dispatch(thingIsLoading(true));

            const token = await AsyncStorage.getItem('authToken');

            let formData = new FormData();
            formData.append('name', name);
            formData.append('x_coordinate', xCoordinate);
            formData.append('y_coordinate', yCoordinate);

            const res = await fetch(`${Config.api_server}/things/${thingId}/api_update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            if (res.status === 401) {
                triggerLogout(res);
                return;
            };

            if (res.status !== 200) {
                RootNavigation.navigate('ErrorScreen', { statusCode: res.status }, {})
                return
            };

            const response = await res.json();

            if (response.Message === 'The things was claimed') {
                dispatch(fetchThings())
                RootNavigation.navigate('ThingDetailsScreen', { params: { id: thingId } }, {})
            }

        } catch (err) {
            console.log('[Error: Edit Device Info]', err);
            RootNavigation.navigate('NetworkErrorScreen', {}, {});
        } finally {
            dispatch(thingIsLoading(false));
        }
    };
}

export function editDevice(thingId: number, name: string, locationId: number | null, xCoordinate: number | null, yCoordinate: number | null) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {

            dispatch(thingIsLoading(true));

            const token = await AsyncStorage.getItem('authToken');

            if (!locationId) {
                xCoordinate = null;
                yCoordinate = null;
            }

            const createFormData = () => {
                const data = new FormData();
                data.append('name', name)
                data.append('location_id', locationId)
                data.append('x_coordinate', xCoordinate);
                data.append('y_coordinate', yCoordinate);
                return data;
            };

            const res = await fetch(`${Config.api_server}/things/${thingId}/api_update`, {
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

            const response = await res.json();

            if (!response.Message) {
                return;
            };

            if (response.Message != 'The things was claimed') {
                return;
            }

            dispatch(fetchThings());

            if (locationId) {
                dispatch(fetchLocation(locationId));
            }

            RootNavigation.navigate('ThingDetailsScreen', { id: thingId }, {})

        } catch (err) {
            console.log('[Error: edit device]', err)
            RootNavigation.navigate('NetworkErrorScreen', {}, {});
        } finally {
            dispatch(thingIsLoading(false));
        }
    }
}

export function registerDeviceWithoutCoord(thingId: number, name: string, locationId: number | null ) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {

            dispatch(thingIsLoading(true));

            const token = await AsyncStorage.getItem('authToken');

            let formData = new FormData();
            formData.append('name', name);
            formData.append('location_id', locationId);

            const res = await fetch(`${Config.api_server}/things/${thingId}/api_update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (res.status === 401) {
                triggerLogout(res);
                return;
            };

            if (res.status !== 200) {
                RootNavigation.navigate('ErrorScreen', { statusCode: res.status }, {})
                return
            };

            const response = await res.json();

            if (!response.Message) {
                return;
            };

            if (response.Message != 'The things was claimed') {
                return;
            };

            dispatch(fetchThings());

        RootNavigation.navigate('AddDeviceCompletedScreen', {}, {})
         

        } catch (err) {
            console.log('[Error: register device without photo]', err)
            RootNavigation.navigate('NetworkErrorScreen', {}, {});
        } finally {
            dispatch(thingIsLoading(false));
        }
    };
};