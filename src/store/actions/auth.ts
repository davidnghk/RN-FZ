import { ThunkDispatch } from '../store';
import { RootState } from '../store';
import { Config } from '../../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RootNavigation from '../../navigation/RootNavigation';
import * as Keychain from 'react-native-keychain';
import { getUserInfo } from './user';
import { actionTriggerShowModal } from './modal';

export function loginSuccess(token: string, tutorialSeen: boolean) {
    return {
        type: '@@auth/LOGIN_SUCCESS' as const,
        token: token,
        tutorialSeen
    };
};

export function loginFail() {
    return {
        type: '@@auth/LOGIN_FAIL' as const,
    };
};

export function logoutSuccess() {
    return {
        type: '@@auth/LOGOUT_SUCCESS' as const,
    };
};

export function isLoading(isLoading: boolean) {
    return {
        type: '@@auth/IS_LOADING' as const,
        isLoading,
    }
}

export function loadTutorialSeen(tutorialSeen: boolean) {
    return {
        type: '@@auth/LOAD_TUTOIRAL_SEEN' as const,
        tutorialSeen: tutorialSeen
    }
}

export function loadTempCredentials(email: string, password: string) {
    return {
        type: '@@auth/LOAD_TEMP_CREDENTIALS' as const,
        tempCredentials: { email: email, password: password }
    }
}

export type AuthActions = ReturnType<typeof loginSuccess> | ReturnType<typeof loginFail> |
    ReturnType<typeof logoutSuccess> | ReturnType<typeof isLoading> |
    ReturnType<typeof loadTutorialSeen> | ReturnType<typeof loadTempCredentials>

// Thunk Actions
export function login(email: string, password: string, deviceId: string) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {

            dispatch(isLoading(true));

            const res = await fetch(`${Config.api_server}/auth.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    mobile_device_id: "bf7833937394fc70"
                })
            });

            if (res.status === 401) {
                dispatch(loginFail());
                dispatch(actionTriggerShowModal(true, 'Login', 'Login fail'));
                return;
            };

            if (res.status !== 200) {
                RootNavigation.navigate('ErrorScreen', { statusCode: res.status }, {})
                return
            };
            
            const authData = await res.json();
        
            if (authData.token) {
                console.log('token success');
                await AsyncStorage.setItem('authToken', authData.token);

                // to remove state credential
                dispatch(loadTempCredentials("", ""));

                dispatch(getUserInfo());
                // const tutorialSeen = await AsyncStorage.getItem('tutorialSeen');

                // if (tutorialSeen) {
                //     // console.log('Tutorial seen')
                //     dispatch(loginSuccess(authData.token, true));

                // } else {
                //     // console.log('Tutorial not yet seen')
                //     dispatch(loginSuccess(authData.token, false));
                // }

                dispatch(loginSuccess(authData.token, true));

            };

        } catch (err) {
            RootNavigation.navigate('NetworkErrorScreen', {}, {});
        } finally {
            dispatch(isLoading(false));
            console.log("login success");
        }
    };
};

export function logout() {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {

            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('user');
            dispatch(logoutSuccess());

        } catch (err) {
            RootNavigation.navigate('NetworkErrorScreen', {}, {});
        }
    }
};

export function checkLogin() {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            const authToken = await AsyncStorage.getItem('authToken');

            if (!authToken) {
                dispatch(logoutSuccess());
                return;
            };

            // const tutorialSeen = await AsyncStorage.getItem('tutorialSeen');

            // if (tutorialSeen) {
            //     // console.log('Tutorial seen')
            //     dispatch(loginSuccess(authToken, true));
            // } else {
            //     // console.log('Tutorial not yet seen')
            //     dispatch(loginSuccess(authToken, false));
            // }

            dispatch(loginSuccess(authToken, true));


        } catch (err) {
            RootNavigation.navigate('NetworkErrorScreen', {}, {});
        }
    }
};

export function signUp(name: string, email: string, password: string, checked: boolean) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {

            dispatch(isLoading(true));

            const res = await fetch(`${Config.api_server}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    name: name,
                    terms_of_service: checked
                })
            });

            if (res.status !== 200) {
                RootNavigation.navigate('ErrorScreen', { statusCode: res.status }, {})
                return
            };

            const data = await res.json();

            if (data.errors) {
                const errorMsg = data.errors;

                if (errorMsg.email) {
                    // dispatch(showModal(true, `Email ${errorMsg.email[0]}`));
                    dispatch(actionTriggerShowModal(true, 'Signup', `Email ${errorMsg.email[0]}`));
                };

                if (errorMsg.password) {
                    // dispatch(showModal(true, `Password ${errorMsg.email[0]}`));
                    dispatch(actionTriggerShowModal(true, 'Signup', `Email ${errorMsg.password[0]}`));
                };

                return
            };

            if (data.user) {
                RootNavigation.navigate('SignUpConfirmScreen', {}, {});
            };

        } catch (err) {
            dispatch(loginFail());
            // dispatch(showModal(true, ''));
            RootNavigation.navigate('NetworkErrorScreen', {}, {});
        } finally {
            dispatch(isLoading(false))
        };
    };
};

export function setTutorialSeen(tutorialSeen: boolean) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {

            // console.log(tutorialSeen);

            await AsyncStorage.setItem('tutorialSeen', String(tutorialSeen));

            dispatch(loadTutorialSeen(tutorialSeen));

        } catch (err) {
            console.log('[Error: Set Tutorial Seen]', err);
            RootNavigation.navigate('NetworkErrorScreen', {}, {});
        };
    };
};

export function rememeberCredentials(email: string, password: string) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {

            await Keychain.setGenericPassword(email, password);

        } catch (err) {
            console.log('[Error: Remember Credentials]', err);
        };
    };
}

export function removeCredentials() {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {

            // const response = await Keychain.resetGenericPassword()
            await Keychain.resetGenericPassword()

        } catch (err) {
            console.log('[Error: Remove Credentials]', err);
            RootNavigation.navigate('NetworkErrorScreen', {}, {});
        };
    };
}

export function getCredentials() {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {
            const credentials = await Keychain.getGenericPassword();

            if (!credentials) {
                return;
            }

            dispatch(loadTempCredentials(credentials.username, credentials.password));

        } catch (err) {
            console.log('[Error: Get Remember Credentials]', err);
            RootNavigation.navigate('NetworkErrorScreen', {}, {});
        };
    };
}

export function forgotPassword(email: string) {
    return async (dispatch: ThunkDispatch, getState: () => RootState) => {
        try {

            dispatch(isLoading(true));

            const res = await fetch(`${Config.api_server}/users/forgot`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            });

            if (res.status !== 200) {
                const response = await res.json();

                RootNavigation.navigate('ForgotPasswordConfirmationScreen', { email: email }, {});

                return
            };

            const response = await res.json();

            RootNavigation.navigate('ForgotPasswordConfirmationScreen', { email: email }, {});

        } catch (err) {
            console.log('[Error: Forgot Password]', err);
        } finally {
            dispatch(isLoading(false));
        };

    }
}
