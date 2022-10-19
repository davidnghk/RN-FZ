import { UserActions } from "../actions/user";

export interface User {
    id: number | null,
    name: string | null,
    email: string | null,
    phone: string | null,
    avatar_url: string | null,
    unread: number | null,
    last_read_datetime: string | null,
    notification_platform: string | null,
    notification_token: string | null,
    default_account_id: number | null,
};

export interface EmergencyContact {
    id: number,
    user_id: number,
    name: string,
    phone_no: string,
    email: string,
}

export interface UserState {
    user: User,
    emergencyContacts: EmergencyContact[],
    isUserReceiveEmail: { isUserReceiveEmail: boolean, userEmailId: number | null },
    hasUnread: boolean,
    fontSizeSetting: string,
    isLoading: boolean,
    profilePicIsLoading: boolean,
    contactIsLoading: boolean,
    passwordIsLoading: boolean,
}

const initialState = {
    user: {
        id: null,
        name: '',
        email: '',
        phone: null,
        avatar_url: null,
        unread: null,
        last_read_datetime: null,
        notification_platform: null,
        notification_token: null,
        default_account_id: null,
    },
    emergencyContacts: [],
    isUserReceiveEmail: { isUserReceiveEmail: false, userEmailId: null },
    hasUnread: false,
    fontSizeSetting: 'size2',
    isLoading: false,
    profilePicIsLoading: false,
    contactIsLoading: false,
    passwordIsLoading: false,
};

export const userReducer = (state: UserState = initialState, action: UserActions) => {
    switch (action.type) {

        case '@@user/LOAD_USER_INFO':
            return {
                ...state,
                user: action.userInfo,
            };

        case '@@user/CLEAR_USER_INFO':
            return initialState;

        case '@@user/HAS_UNREAD':
            return {
                ...state,
                hasUnread: true,
            };

        case '@@user/CLEAR_UNREAD':
            return {
                ...state,
                hasUnread: false,
            };

        case '@@user/LOAD_FONT_SIZE':
            return {
                ...state,
                fontSizeSetting: action.fontSizeSetting,
            }

        case '@@user/UPDATE_PROFILE_IS_LAODING':
            const profileIsLoading = action.isLoading;
            return {
                ...state,
                isLoading: profileIsLoading
            }

        case '@@user/PROFILE_PIC_IS_SAVING':
            const profilePicIsLoading = action.isLoading;
            return {
                ...state,
                profilePicIsLoading: profilePicIsLoading
            }

        case '@@user/LOAD_EMERGENCY_CONTACTS':
            const contacts = action.contacts;
            return {
                ...state,
                emergencyContacts: contacts
            }

        case '@@user/LOAD_IS_USER_RECEIVE_EMAIL':
            return {
                ...state,
                isUserReceiveEmail: action.isUserReceiveEmail,
            }

        case '@@user/CONTACT_IS_LOADING':
            return {
                ...state,
                contactIsLoading: action.isLoading
            }

        case '@@user/PASSWORD_IS_LOADING':
            return {
                ...state,
                passwordIsLoading: action.isLoading
            }

        default:
            return state
    }
};