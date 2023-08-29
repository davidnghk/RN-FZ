import { NullLiteral } from '@babel/types';
import { ThingsActions } from '../actions/things';

export interface Thing {
    id: number,
    account_id: number,
    location_id: number,
    code: string,
    model: string | null,
    name: string | null,
    local_name: string | null,
    dev_eui: string,
    icon_id: number,
    icon_url: string,
    floorplan_url: string | null,
    x_coordinate: number,
    y_coordinate: number,
    status: string | null,
    state: string | null,
    onoff_status: string,
    outOfService: string | null,
    sensor_fault: boolean | null,
    power_warning: boolean | null,
    warning_flag: boolean | null,
    reading_datetime: string | null,
    created_at: string | null,
    updated_at: string | null,
    bp_heart: number | null,
    bp_high: number | null,
    bp_low: number | null,
    latitude: number | null,
    longitude: number | null,
    body_temp: number | null,
    skin_temp: number | null,
    rssi: number | null,
    snr: number | null,
    uuid: string | null,
    dev_id: string | null,
    alert_list: [] | null,
    readings:{} | null,
    mode: string | null,
    warning_list: [] | null,
    category: string | null,
    payload:{} | null ,
    battery_percentage: number | null,
    photo_url: string | null,
    floorplan_url: string | null,
};

export interface thingsDevicesDataSet {
    id: number,
    dataSet: {
        batteryData: string | null,
        humidityData: string | null,
        barometerData: string | null,
        temperatureData: string | null,
        gasResistanceData: string | null,
        co2Data: number | null,
        pirData: string | null,
        hchoData: number | null,
        pm10Data: number | null,
        tvocData: number | null,
        pm2_5Data: number | null,
        pressureData: number | null,
        light_levelData: number | null,
        msgData: number | null,
        rawData: number | null,
        stateData: number | null,
        bp_lowData: number | null,
        bp_highData: number | null,
        messageData: number | null,
        bp_heartData: number | null,
        stepData: number | null,
        signal_pctData: number | null,
        body_tempData: number | null,
        voltage_pctData: number | null,
        wrist_tempData: number | null,
        blood_oxygenData: number | null,
        body_TempData: number | null,
        skin_TempData: number | null,
    }
}

export interface ChartData {
    x: string,
    y: number | null,
}

export interface MinMax {
    min: number,
    max: number,
}

export interface DataSet {
    chartData: ChartData[],
    minMax: MinMax,
}

export interface ThingsState {
    things: Thing[],
    thingsDevicesDataSet: ThingsDeviceDataSet[],
    isLoading: boolean,
    isLocated: boolean,
};

const initialState = {
    things: [],
    thingsDevicesDataSet: [],
    isLoading: false,
    isLocated: false,
    readings:[],
};

export const thingsReducer = (state: ThingsState = initialState, action: ThingsActions) => {
    switch (action.type) {
        case '@@things/LOAD_THINGS':
            const sortedThingsByName = action.things.sort((a, b) => (a.name! > b.name!) ? 1 : -1);
            const sortedThingsByWarningFlag = sortedThingsByName.sort(function (a, b) {
                //@ts-ignore
                return b.warning_flag - a.warning_flag;
            })

            const sortedThingsByOnoff = sortedThingsByWarningFlag.sort((a, b) => {
                const onoffOrder = ['quiet', 'alarm', 'drill', 'Offline', 'offline'];

                const aOnoffIndex = onoffOrder.indexOf(a.onoff_status);
                const bOnoffIndex = onoffOrder.indexOf(b.onoff_status);

                if (aOnoffIndex === bOnoffIndex)
                    //@ts-ignore
                    return a.onoff_status - b.onoff_status;

                return aOnoffIndex - bOnoffIndex;
            });

            return {
                ...state,
                things: sortedThingsByOnoff,
                readings: action.readings
            };

        case '@@things/THING_IS_LOADING':
            const thingIsLoading = action.isLoading;
            return {
                ...state,
                isLoading: thingIsLoading,
            };

        case "@@things/LOAD_CHART_DATA":
            const dataSet = { id: action.deviceId, dataSet: action.dataSet };
            let copyDeviceDataSet = state.thingsDevicesDataSet.slice();

            let newDeviceDataSet = copyDeviceDataSet.filter(function (data) {
                return data.id != action.deviceId;
            });

            newDeviceDataSet.push(dataSet);

            return {
                ...state,
                thingsDevicesDataSet: newDeviceDataSet
            }

        case '@@things/CLEAR_THINGS':
            return initialState

        default:
            return state
    }
};