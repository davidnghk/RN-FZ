import { LocationsActions } from "../actions/locations"
import { Thing } from "../reducers/things"

export interface Location {
    id: number | null,
    account_id: number | null,
    type_id: number | null,
    code: string | null,
    name: string | null,
    parent_id: string | null,
    description: string | null,
    created_at: string | null,
    updated_at: string | null,
    floorplan: string | null,
    children: Location[],
    things: Thing[],
};

export interface Locations {
    id: number | null,
    account_id: number | null,
    type_id: number | null,
    code: string ,
    name: string ,
    parent_id: string | null,
    floorplan: string | null,
    description: string ,
    created_at: string | null,
    updated_at: string | null,
};

export interface LocationsState {
    locations: Locations[],
    location: Location,
    isLoading: boolean,
};

const initialState = {
    locations: [],
    location: {
        id: null,
        account_id: null,
        type_id: null,
        code: '',
        name: '',
        parent_id: null,
        description: '',
        created_at: null,
        updated_at: null,
        floorplan: null,
        children: [],
        things: [],
    },
    isLoading: false,
};

export const locationsReducer = (state: LocationsState = initialState, action: LocationsActions) => {
    switch (action.type) {
        case '@@locations/LOAD_LOCATIONS':
            return {
                ...state,
                locations: action.locations
            };

        case '@@locations/LOAD_LOCATION':
            return {
                ...state,
                location: action.location
            };

        case '@@locations/LOCATION_IS_LOADING':
            const locationIsLoading = action.isLoading;
            return {
                ...state,
                isLoading: locationIsLoading,
            };

        case '@@locations/CLEAR_LOCATIONS':
            return initialState

        default:
            return state
    }
};