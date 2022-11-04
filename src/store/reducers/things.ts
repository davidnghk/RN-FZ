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
    outOfService: string,
    sensor_fault: boolean,
    power_warning: boolean,
    warning_flag: boolean,
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
};

export interface ThingsState {
    things: Thing[],
    isLoading: boolean,
};

const initialState = {
    things: [],
    isLoading: false,
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
                things: sortedThingsByOnoff
            };

        case '@@things/THING_IS_LOADING':
            const thingIsLoading = action.isLoading;
            return {
                ...state,
                isLoading: thingIsLoading,
            };

        case '@@things/CLEAR_THINGS':
            return initialState

        default:
            return state
    }
};