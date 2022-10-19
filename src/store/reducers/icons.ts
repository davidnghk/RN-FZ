import { IconsActions } from "../actions/icons";

export interface Icon {
    id: number,
    account_id: number,
    code: string,
    name: string,
    description: string,
    created_at: string,
    updated_at: string,
    proprietary_reading: boolean,
};

export interface IconState {
    icons: Icon[],
};

const initialState = {
    icons: []
};

export const iconsReducer = (state: IconState = initialState, action: IconsActions) => {
    switch (action.type) {
        case '@@icons/LOAD_ICONS':
            const sortedIcons = action.icons.sort((a, b) => (a.id > b.id) ? 1 : -1)
            return {
                ...state,
                icons: action.icons
            };

        default:
            return state
    }
};