import i18n from 'i18next'
import { Alert, Linking, Platform } from 'react-native';
import moment, * as moments from 'moment';
import COLOR from '../constants/Theme/color';

export function getTranslateType(alertType: string | null | undefined) {

    let type = alertType?.toLowerCase();

    if (type == null) {
        return i18n.t('common:null')
    };

    return i18n.t(`common:${type}`)
};

export const dialCall = (number: string) => {
    let phoneNumber = '';
    if (Platform.OS === 'android') { phoneNumber = `tel:${number}`; }
    else { phoneNumber = `telprompt:${number}`; }

    Linking.canOpenURL(phoneNumber)
        .then(supported => {
            if (!supported) {
                Alert.alert('Phone call is not supported.');
            } else {
                return Linking.openURL(phoneNumber);
            }
        })
        .catch(err => console.log(err));
};

export const formatDateTime = (dateTime: string | null | undefined) => {

    if (dateTime === null || dateTime === undefined) {
        return null
    }

    return moment(dateTime).local().format('YYYY-MM-DD, hh:mma')
}

export function validateEmail(email: string) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function getColorFromStatusOrWarning(onoffStatus: string, warningFlag: boolean) {

    const status = onoffStatus.toString().toLowerCase();

    if (status === 'offline') {
        return COLOR.offlineItemColor
    } else if (status !== 'offline' && warningFlag) {
        return COLOR.warningItemCOlor
    } else {
        return '#ffffff'
    }

}

export function fireSensorGetColorFromStatusOrWarning(alertStatus: string, onoffStatus: string, warningFlag: boolean) {

    const alertType = alertStatus.toString().toLowerCase();
    const status = onoffStatus.toString().toLowerCase();

    if (alertType === 'drill') {
        return COLOR.drillItemColor
    } else if (alertType.toLowerCase() === 'alarm') {
        return 'red'
    } else if (status === 'offline') {
        return COLOR.offlineItemColor
    } else if (status !== 'offline' && warningFlag) {
        return COLOR.warningItemCOlor
    } else {
        return '#ffffff'
    }

}

export const getTitleForAmbienceScreen = (title: string) => {

    switch (title) {
        case "temperature":
            return i18n.t('common:temperature')
        case "battery":
            return i18n.t('common:battery')
        case "humidity":
            return i18n.t('common:humidity')
        case "barometer":
            return i18n.t('common:barometer')
        case "gasResistance":
            return i18n.t('common:gasResistance')
        case "gas_resistance":
            return i18n.t('common:gasResistance')
        case "co2":
            return i18n.t('common:co2')
        case "hcho":
            return i18n.t('common:hcho')
        case "light_level":
            return i18n.t('common:lightLevel')
        case "pir":
            return i18n.t('common:pir')
        case "pm10":
            return i18n.t('common:pm10')
        case "pm2_5":
            return i18n.t('common:pm2_5')
        case "tvoc":
            return i18n.t('common:tvoc')
    }
}

export const getUnitForAmbienceScreen = (target: string) => {

    switch (target) {
        case "temperature":
            return "°C"
        case "battery":
            return "V"
        case "humidity":
            return "%RH"
        case "barometer":
            return "hPa"
        case "gasResistance":
            return "KΩ"
        case "gas_resistance":
            return "KΩ"
        case "co2":
            return ""
        case "hcho":
            return ""
        case "light_level":
            return ""
        case "pir":
            return ""
        case "pm10":
            return ""
        case "pm2_5":
            return ""
        case "tvoc":
            return ""
    }
}

export const formatName = (name: string) => {
    if (name?.includes('@')) {
        return name.substring(0, name.indexOf('@'));
    } else {
        return name
    }
}