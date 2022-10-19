import { AuthActions } from '../actions/auth';

export interface AuthState {
    isAuthenticated: boolean | null,
    token: string | null,
    tempCredentials: {email: string, password: string},
    tutorialSeen: boolean,
    isLoading: boolean | null,
};

const initialState = {
    isAuthenticated: null,
    token: '',
    tempCredentials: {email: '', password: ''},
    tutorialSeen: true,
    isLoading: false,
};

export const authReducer = (state: AuthState = initialState, action: AuthActions) => {
    switch (action.type) {
        case '@@auth/LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                token: action.token,
                tutorialSeen: action.tutorialSeen
            };

        case '@@auth/LOGIN_FAIL':
            return {
                ...state,
                isAuthenticated: false,
            }

        case '@@auth/LOGOUT_SUCCESS':
            return {
                isAuthenticated: false,
                token: '',
                tempCredentials: {email: '', password: ''},
                tutorialSeen: true,
                isLoading: false,
            };

        case '@@auth/IS_LOADING':
            return {
                ...state,
                isLoading: action.isLoading,
            }

        case '@@auth/LOAD_TUTOIRAL_SEEN':
            return {
                ...state,
                tutorialSeen: action.tutorialSeen
            }

        case '@@auth/LOAD_TEMP_CREDENTIALS':
            return {
                ...state,
                tempCredentials: {email: action.tempCredentials.email, password: action.tempCredentials.password}
            }

        default:
            return state
    }
};