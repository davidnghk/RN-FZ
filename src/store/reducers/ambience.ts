import { AmbienceActions } from '../actions/ambience'

export interface AmbienceDevice {
    id: number;
    name: string;
    icon_id: number;
    code: string;
    onoff_status: string,
    sensor_fault: boolean,
    power_warning: boolean,
    warning_flag: boolean,
    // Data Params
    temperature: null,
    humidity: string,
    barometer: string,
    gas_resistance: string,
    battery: string,
    reading_datetime: string,
    // AIM 319 Extra Params
    co2: number,
    hcho: string,
    light_level: number,
    pir: string,
    pm10: number,
    pm2_5: number,
    tvoc: number,
}

export interface AmbienceDeviceDataSet {
    id: number,
    dataSet: {
        temperatureData: null,
        batteryData: null,
        humidityData: null,
        barometerData: null,
        gas_resistanceData: null,
        co2Data: null,
        hchoData: null,
        light_levelData: null,
        pirData: null,
        pm10Data: null,
        pm2_5Data: null,
        tvocData: null,
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

export interface AmbienceState {
    ambienceDevices: AmbienceDevice[],
    ambienceDevicesDataSet: AmbienceDeviceDataSet[],
    isLoading: { isLoading: boolean, deviceId: number | null }
    listIsLoading: boolean,
}

const initialState = {
    ambienceDevices: [],
    ambienceDevicesDataSet: [],
    isLoading: { isLoading: false, deviceId: null },
    listIsLoading: false,
};

export const ambienceReducer = (state: AmbienceState = initialState, action: AmbienceActions) => {
    switch (action.type) {
        case "@@ambience/LOAD_AMBIENCE_DEVICES":
            // const devices = action.ambienceDevices;
            const sortedDevicesByName = action.ambienceDevices.sort((a, b) => (a.name! > b.name!) ? 1 : -1);
            const sortedDeviceByWarningFlag = sortedDevicesByName.sort(function (a, b) {
                //@ts-ignore
                return b.warning_flag - a.warning_flag;
            })

            const sortedDevicesByOnoff = sortedDeviceByWarningFlag.sort((a, b) => {
                const onoffOrder = ['quiet', 'alarm', 'drill', '', 'Offline'];

                const aOnoffIndex = onoffOrder.indexOf(a.onoff_status);
                const bOnoffIndex = onoffOrder.indexOf(b.onoff_status);

                if (aOnoffIndex === bOnoffIndex)
                    //@ts-ignore
                    return a.onoff_status - b.onoff_status;

                return aOnoffIndex - bOnoffIndex;
            });

            return {
                ...state,
                ambienceDevices: sortedDevicesByOnoff,
            }

        case "@@ambience/LOAD_CHART_DATA":
            const dataSet = { id: action.deviceId, dataSet: action.dataSet };
            let copyDeviceDataSet = state.ambienceDevicesDataSet.slice();

            let newDeviceDataSet = copyDeviceDataSet.filter(function (data) {
                return data.id != action.deviceId;
            });

            newDeviceDataSet.push(dataSet);

            return {
                ...state,
                ambienceDevicesDataSet: newDeviceDataSet
            }

        case '@@ambience/AMBIENCE_DATA_IS_LOADING':
            return {
                ...state,
                isLoading: action.isLoading,
            }

        case '@@ambiecne/AMBIENCE_DEVICE_LIST_IS_LOADING':
            return {
                ...state,
                listIsLoading: action.isLoading
            }

        case '@@ambience/LOAD_AMBIENCE_DEVICE_DETAIL':

            const newDeviceList = state.ambienceDevices.slice();

            const updatedDeviceList = newDeviceList.map(function (device) {

                if (device.id === action.ambienceDeviceDetail.id) {
                    device = action.ambienceDeviceDetail
                }

                return device

            })

            return {
                ...state,
                ambienceDevices: updatedDeviceList
            }

        case '@@ambience/CLEAR_AMBIENCE_DEVICES':
            return initialState

        default:
            return state
    }
};

