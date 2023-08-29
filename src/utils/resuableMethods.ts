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
        return '#DC143C'
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

export const getTitleForThingsScreen = (title: string) => {

    switch (title) {
        case "Temperature":
            return i18n.t('common:Temperature')
        case "battery":
            return i18n.t('common:Battery')
        case "Hunmidity":
            return i18n.t('common:Humidity')
        case "humidity":
            return i18n.t('common:Humidity')
        case "Barometer":
            return i18n.t('common:Barometer')
        case "Gas Resistance":
            return i18n.t('common:GasResistance')
        case "co2":
            return i18n.t('common:Co2')
        case "hcho":
            return i18n.t('common:Hcho')
        case "light_level":
            return i18n.t('common:LightLevel')
        case "pir":
            return i18n.t('common:Pir')
        case "pm10":
            return i18n.t('common:Pm10')
        case "pm2.5":
            return i18n.t('common:Pm2.5')
        case "tvoc":
            return i18n.t('common:tvoc')
        case "step":
            return i18n.t('common:Step')
        case "signal_%":
            return i18n.t('common:Signal Percentage')
        case "body_temp":
            return i18n.t('common:Body Temperature')
        case "voltage_%":
            return i18n.t('common:Voltage Percentage') 
        case "wrist_temp":
            return i18n.t('common:Wrist Temperature')   
        case "blood_oxygen":
            return i18n.t('common:Blood Oxygen')
        case "BP Low":
            return i18n.t('common:BP Low')
        case "BP High":
            return i18n.t('common:BP High')
        case "Body Temp":
            return i18n.t('common:Body Temperature')
        case "Skin Temp":
            return i18n.t('common:Skin Temperature')
        case "Heart Beat":
            return i18n.t('common:Heart Beat')
        case "Volt %":
            return i18n.t('common:Voltage Percentage')
    }
}

export const getUnitForThingsScreen = (target: string) => {

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
            return "ppm"
        case "hcho":
            return "ppb"
        case "light_level":
            return "lux"
        case "pir":
            return ""
        case "pm10":
            return "μg/m3"
        case "pm2_5":
            return "μg/m3"
        case "tvoc":
            return "ppb"
        case "step":
            return "steps"
        case "signal_%":
            return "%"
        case "body_temp":
            return "°C"
        case "voltage_%":
            return "%"
        case "wrist_temp":
            return "°C"
        case "blood_oxygen":
            return "%"
        case "BP Low":
            return "mmHg"
        case "BP High":
            return "mmHg"
        case "Body Temp":
            return "°C"
        case "Skin Temp":
            return "°C"
        case "Heart Beat":
            return "bpm"
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