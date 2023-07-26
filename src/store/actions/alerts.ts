import { ThunkDispatch } from '../store';
import { RootState } from '../store';
import { Alert } from '../reducers/alerts';
import { Config } from '../../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RootNavigation from '../../navigation/RootNavigation';
import { triggerLogout } from './helpers';
import { Linking, Platform, PermissionsAndroid } from 'react-native';
import { NativeModules } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import moment from 'moment';

export function loadAllAlerts(alerts: Alert[]) {
    return {
        type: '@@alerts/LOAD_ALL_ALERTS' as const,
        alerts: alerts
    };
};

export function alertIsLoading(isLoading: boolean) {
    return {
        type: '@@alerts/ALERT_IS_LAODING' as const,
        isLoading
    };
};

export function clearAlerts() {
    return {
        type: '@@alerts/CLEAR_ALERTS' as const,
    };
};

export function loadLatestAlert(showAlarmPopUp: boolean, alert: Alert | null,) {
    return {
        type: '@@alerts/LOAD_LATEST_ALERT' as const,
        alert: alert,
        showAlarmPopUp: showAlarmPopUp,
    }
};

export function loadAlert(alertId: number, alert: any) {
    return {
        type: '@@alerts/LOAD_ALERT' as const,
        alertId: alertId,
        alert: alert,
    }
}

export type AlertsActions = ReturnType<typeof loadAllAlerts> | ReturnType<typeof alertIsLoading> |
    ReturnType<typeof clearAlerts> | ReturnType<typeof loadLatestAlert> |
    ReturnType<typeof loadAlert>

// Thunk Actions
export function fetchAllAlerts() {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {

            dispatch(alertIsLoading(true));

            const token = await AsyncStorage.getItem('authToken');

            const res = await fetch(`${Config.api_server}/alerts`, {
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

            if (data.no_of_records === 0) {
                dispatch(loadAllAlerts([]));
                return
            };

            if (data) {
                dispatch(loadAllAlerts(data));
            };

            const latestAlert = data[0];
            const alertStatus = latestAlert.status.toLowerCase();
            const alertType = latestAlert.alert_type;

            // console.log(latestAlert);

            if (alertStatus === 'set' && (alertType === 'alarm' || alertType === 'drill')) {
                dispatch(loadLatestAlert(true, latestAlert));
            };


        } catch (err) {
            console.log('[Error: Fetch all alerts]', err);
            RootNavigation.navigate('NetworkErrorScreen', {}, {})
        } finally {
            dispatch(alertIsLoading(false));
        }
    };
};


export function fetchAlert(alertId: number) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {

            dispatch(alertIsLoading(true));

            const token = await AsyncStorage.getItem('authToken');

            const res = await fetch(`${Config.api_server}/alerts/${alertId}`, {
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

            if (data) {
                dispatch(loadAlert(alertId, data));
            };

        } catch (err) {
            console.log('[Error: Fetch single alert]', err);
            RootNavigation.navigate('NetworkErrorScreen', {}, {})
        } finally {
            dispatch(alertIsLoading(false));
        }
    };
};


export function updateAlertDetails(alert_id: number, data: FormData) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {

            const token = await AsyncStorage.getItem('authToken');

            const res = await fetch(`${Config.api_server}/alerts/${alert_id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: data
            });

            if (res.status === 401){
                return;
            }

            if(res.status !== 200) {
                return
            }

            const resdata = await res.json();

            if (!resdata) {
                return
            }

            if (resdata) {
                dispatch(loadAlert(alert_id, resdata));
                RootNavigation.navigate("Alerts", { screen: 'AlertsScreen' }, {});
            };
            

            

        } catch (err) {
            console.log('[Error: Fetch single alert]', err);
            RootNavigation.navigate('NetworkErrorScreen', {}, {})
        } finally {
            dispatch(alertIsLoading(false));
        }
}
}

export function generatePdf(alert_id: number) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {

            dispatch(alertIsLoading(true));
            let date = moment(new Date()).format('DD-MM-YYYY hh mm a')
            const token = await AsyncStorage.getItem('authToken');
            const { dirs } = RNFetchBlob.fs;
            RNFetchBlob.config({
                fileCache: true,
                path: `${dirs.DocumentDir}/Alert ${alert_id} ${date}.pdf`,
                addAndroidDownloads:{
                    useDownloadManager: true,
                    notification: true,
                    mediaScannable: true,
                    path: `${dirs.DownloadDir}/Alert ${alert_id} ${date}.pdf`,
                    description: "Downloading file from app",
                },

            })
            .fetch("GET", `${Config.api_server}/alerts/${alert_id}/generate_pdf_report.pdf`, {
                'Authorization': `Bearer ${token}`,
            })
            .then((res) => {

                if (Platform.OS === 'ios') {
                    RNFetchBlob.ios.openDocument(res.path())
                }


                    let base64Str = res.base64();
                    let path = res.path();


            })

        }
        catch(err) {
            console.log("Error: ", err)
            RootNavigation.navigate('NetworkErrorScreen', {}, {})
        }
        finally {
            dispatch(alertIsLoading(false));
        }
    }         
          
}