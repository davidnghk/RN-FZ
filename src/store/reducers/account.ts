import { AccountActions } from '../actions/account';

export interface Account {
    id: number | null,
    name: string | null,
    owner_id: number | null,
    personal: boolean | null,
    created_at: string | null,
    updated_at: string | null,
    floorplan_url: string | null,
    users: AccountMember[] | null,
    modules: string[],
};

export interface AccountMember {
    id: number | null,
    email: string | null,
    name: string | null,
}

export interface AccountState {
    account: Account,
    isLoading: boolean,
};

const initialState = {
    account: {
        id: null,
        name: null,
        owner_id: null,
        personal: null,
        created_at: null,
        updated_at: null,
        floorplan_url: null,
        users: null,
        modules: [],
    },
    isLoading: false,
};

export const accountReducer = (state: AccountState = initialState, action: AccountActions) => {
    switch (action.type) {
        case '@@account/LOAD_ACCOUNT_INFO':
            const accountInfo = action.accountInfo;
            return {
                ...state,
                account: accountInfo,
            };

        case '@@account/CLEAR_ACCOUNT_INFO':
            return initialState
            
        default:
            return state
    }
};