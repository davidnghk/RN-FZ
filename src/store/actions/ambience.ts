import { ThunkDispatch } from '../store';
import { RootState } from '../store';
import { AmbienceDevice } from '../reducers/ambience';
import { Config } from '../../config/config';
import { AmbienceConfig } from '../../config/ambienceConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RootNavigation from '../../navigation/RootNavigation';
import AmbienceData from '../../utils/ambienceDataProcessor';
import { triggerLogout } from './helpers';


export function loadAmbienceDevices(ambienceDevices: AmbienceDevice[]) {
    return {
        type: '@@ambience/LOAD_AMBIENCE_DEVICES' as const,
        ambienceDevices: ambienceDevices
    };
};

export function loadDeviceChartDataSet(id: number, dataSet: any) {
    return {
        type: '@@ambience/LOAD_CHART_DATA' as const,
        deviceId: id,
        dataSet: dataSet,
    }
}

export function ambienceDataIsLoading(isLoading: boolean, deviceId: number) {
    return {
        type: '@@ambience/AMBIENCE_DATA_IS_LOADING' as const,
        isLoading: { isLoading: isLoading, deviceId: deviceId }
    }
}

export function ambienceDeviceListIsLoading(isLoading: boolean) {
    return {
        type: '@@ambiecne/AMBIENCE_DEVICE_LIST_IS_LOADING' as const,
        isLoading: isLoading
    }
}

export function loadAmbienceDeviceDetails(ambienceDeviceDetail: AmbienceDevice) {
    return {
        type: '@@ambience/LOAD_AMBIENCE_DEVICE_DETAIL' as const,
        ambienceDeviceDetail: ambienceDeviceDetail,
    }
}

export function clearAmbienceDevices() {
    return {
        type: '@@ambience/CLEAR_AMBIENCE_DEVICES' as const,
    }
}

export type AmbienceActions = ReturnType<typeof loadAmbienceDevices> | ReturnType<typeof loadDeviceChartDataSet> |
    ReturnType<typeof ambienceDataIsLoading> | ReturnType<typeof ambienceDeviceListIsLoading> |
    ReturnType<typeof loadAmbienceDeviceDetails> | ReturnType<typeof clearAmbienceDevices>

// Thunk Actions
export function fetchAmbienceDevices() {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {

            dispatch(ambienceDeviceListIsLoading(true));

            const token = await AsyncStorage.getItem('authToken');

            const res = await fetch(`${Config.api_server}/things?category=Ambient`, {
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
                dispatch(loadAmbienceDevices(data));
            };

        } catch (err) {
            console.log('[Error: Fetch ambience devices]', err);
            RootNavigation.navigate('NetworkErrorScreen', {}, {});
        } finally {
            dispatch(ambienceDeviceListIsLoading(false));
        }
    };
};

export function fetchRecord(deviceId: number) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {

            dispatch(ambienceDataIsLoading(true, deviceId));

            const token = await AsyncStorage.getItem('authToken');
            const res = await fetch(`${Config.api_server}/messages?thing_id=${deviceId}`, {
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

            if (!data) {
                return
            }

            let ambienceData = new AmbienceData(data);
            let ambienceDataObject = AmbienceConfig.ambienceParamDataObject;

            for (let ambienceParam of AmbienceConfig.ambienceParamList) {
                const dataName = ambienceParam + 'Data';
                const dataObject = ambienceData.getDataAndMinMaxObject(ambienceParam);
                ambienceDataObject[dataName] = dataObject;
            };

            dispatch(loadDeviceChartDataSet(deviceId, ambienceDataObject));

        } catch (err) {
            console.log('[Error: Fetch ambience record]', err);
            RootNavigation.navigate('NetworkErrorScreen', {}, {})
        } finally {
            dispatch(ambienceDataIsLoading(false, deviceId));
            
        }
    };
};

export function fetchAmbienceDevice(id: number) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {

            const token = await AsyncStorage.getItem('authToken');

            const res = await fetch(`${Config.api_server}/things/${id}`, {
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
                dispatch(loadAmbienceDeviceDetails(data));
            };

        } catch (err) {
            console.log('[Error: Fetch ambience device]', err);
            RootNavigation.navigate('NetworkErrorScreen', {}, {})
        } finally {
            dispatch(ambienceDeviceListIsLoading(false));
        }
    };
};

