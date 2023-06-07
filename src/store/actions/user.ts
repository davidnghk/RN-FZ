import {Platform} from 'react-native';
import {ThunkDispatch} from '../store';
import {RootState} from '../store';
import {User, EmergencyContact} from '../reducers/user';
import {Config} from '../../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RootNavigation from '../../navigation/RootNavigation';
import {triggerLogout} from './helpers';
import {getAccountInfo} from './account';
import {actionTriggerShowModal} from './modal';

export function loadUserInfo(userInfo: User) {
  return {
    type: '@@user/LOAD_USER_INFO' as const,
    userInfo: userInfo,
  };
}

export function loadEmergencyContacts(contacts: EmergencyContact[]) {
  return {
    type: '@@user/LOAD_EMERGENCY_CONTACTS' as const,
    contacts: contacts,
  };
}

export function clearUserInfo() {
  return {
    type: '@@user/CLEAR_USER_INFO' as const,
  };
}

export function hasUnread() {
  return {
    type: '@@user/HAS_UNREAD' as const,
  };
}

export function clearUnread() {
  return {
    type: '@@user/CLEAR_UNREAD' as const,
  };
}

export function loadUserFontSetting(sizeSetting: string) {
  return {
    type: '@@user/LOAD_FONT_SIZE' as const,
    fontSizeSetting: sizeSetting,
  };
}

export function profileUpdateIsLoading(isLoading: boolean) {
  return {
    type: '@@user/UPDATE_PROFILE_IS_LAODING' as const,
    isLoading,
  };
}

export function profilePicIsSaving(isLoading: boolean) {
  return {
    type: '@@user/PROFILE_PIC_IS_SAVING' as const,
    isLoading,
  };
}

// export function showModal(showModal: boolean) {
//     return {
//         type: '@@user/SHOW_MODAL' as const,
//         showModal
//     };
// };

export function contactIsLoading(isLoading: boolean) {
  return {
    type: '@@user/CONTACT_IS_LOADING' as const,
    isLoading,
  };
}

export function passwordIsLoading(isLoading: boolean) {
  return {
    type: '@@user/PASSWORD_IS_LOADING' as const,
    isLoading,
  };
}

export function loadIsUserReceiveEmail(
  isUserReceiveEmail: boolean,
  userEmailId: number | null,
) {
  return {
    type: '@@user/LOAD_IS_USER_RECEIVE_EMAIL' as const,
    isUserReceiveEmail: {isUserReceiveEmail, userEmailId},
  };
}

export type UserActions =
  | ReturnType<typeof loadUserInfo>
  | ReturnType<typeof hasUnread>
  | ReturnType<typeof clearUnread>
  | ReturnType<typeof clearUserInfo>
  | ReturnType<typeof loadUserFontSetting>
  | ReturnType<typeof profileUpdateIsLoading>
  | ReturnType<typeof profilePicIsSaving>
  | ReturnType<typeof loadEmergencyContacts>
  | ReturnType<typeof contactIsLoading>
  | ReturnType<typeof loadIsUserReceiveEmail>
  | ReturnType<typeof passwordIsLoading>;

// Thunk Actions
export function getUserInfo() {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        console.log('[Error: Get user info -no token]');
        return;
      }

      const res = await fetch(`${Config.api_server}/me.json`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        triggerLogout(res);
        return;
      }

      if (res.status !== 200) {
        RootNavigation.navigate('ErrorScreen', {statusCode: res.status}, {});
        return;
      }

      const userInfo = await res.json();

      const userToBeSaved = {
        id: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        accountId: userInfo.default_account_id,
      };

      await AsyncStorage.setItem('user', JSON.stringify(userToBeSaved));

      dispatch(getAccountInfo(userInfo.default_account_id));

      if (userInfo.unread > 0) {
        dispatch(hasUnread());
      }

      dispatch(loadUserInfo(userInfo));
    } catch (err) {
      console.log('[Error: Get user info]', err);
      RootNavigation.navigate('NetworkErrorScreen', {}, {});
    }
  };
}

export function updateUserNotificationSetting(
  userId: number,
  fcmToken: string,
  platform: string,
) {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      const res = await fetch(
        `${Config.api_server}/users/${userId}/api_update?notification_token=${fcmToken}&&notification_platform=${platform}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.status === 401) {
        triggerLogout(res);
        return;
      }

      if (res.status !== 200) {
        RootNavigation.navigate('ErrorScreen', {statusCode: res.status}, {});
        return;
      }

      const response = await res.json();

      if (!response.Message) {
        console.log('[Error: Fail to update user notification setting]');
      }

      if (response.Message == 'User Profile Saved') {
        // console.log('UserAction: Noti Token & Platform uploaded to server successfully.')
      }
    } catch (err) {
      console.log('[Error: Update user notification setting]', err);
      RootNavigation.navigate('NetworkErrorScreen', {}, {});
    }
  };
}

export function resetUnread() {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    try {
      const today = new Date();
      const token = await AsyncStorage.getItem('authToken');

      const existingUser = await AsyncStorage.getItem('user');
      let user = JSON.parse(existingUser!);

      const res = await fetch(
        `${Config.api_server}/users/${
          user.id
        }/api_update?unread=0&&last_read_datetime=${today.toISOString()}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.status === 401) {
        triggerLogout(res);
        return;
      }

      if (res.status !== 200) {
        RootNavigation.navigate('ErrorScreen', {statusCode: res.status}, {});
        return;
      }

      const updatedUserInfo = await res.json();

      if (updatedUserInfo) {
        dispatch(clearUnread());
        // dispatch(loadUserInfo(updatedUserInfo));
      }
    } catch (err) {
      console.log('[Error: reset unread]', err);
      // RootNavigation.navigate('NetworkErrorScreen', {}, {});
    }
  };
}

export function getUserFontSizeSetting() {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    try {
      const sizeSetting = await AsyncStorage.getItem('fontSizeSetting');

      if (!sizeSetting) {
        dispatch(setUserFontSizeSetting('size2'));
        return;
      }

      dispatch(loadUserFontSetting(sizeSetting));
    } catch (err) {
      console.log('[Error: Retrieve user font size setting]', err);
      RootNavigation.navigate('NetworkErrorScreen', {}, {});
    }
  };
}

export function setUserFontSizeSetting(size: string) {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    try {
      await AsyncStorage.setItem('fontSizeSetting', size);

      dispatch(loadUserFontSetting(size));
    } catch (err) {
      console.log('[Error: Setting User Font Size]', err);
      RootNavigation.navigate('NetworkErrorScreen', {}, {});
    }
  };
}

export function updateProfile(userId: number, name: string, phone: string) {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    try {
      dispatch(profileUpdateIsLoading(true));

      const token = await AsyncStorage.getItem('authToken');

      const createFormData = (name: string, phone: string) => {
        const data = new FormData();

        data.append('name', name);
        data.append('phone', phone);

        return data;
      };

      const res = await fetch(
        `${Config.api_server}/users/${userId}/api_update`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: createFormData(name, phone),
        },
      );

      if (res.status === 401) {
        triggerLogout(res);
        return;
      }

      if (res.status !== 200) {
        RootNavigation.navigate('ErrorScreen', {statusCode: res.status}, {});
        return;
      }

      const response = await res.json();

      if (!response.Message) {
        return;
      }

      if (response.Message === 'User Profile Saved') {
        dispatch(getUserInfo());
      }
    } catch (err) {
      console.log('[Error: Update user profile] ', err);
      RootNavigation.navigate('NetworkErrorScreen', {}, {});
    } finally {
      dispatch(profileUpdateIsLoading(false));
    }
  };
}

export function updateProfilePic(userId: number, photo: any) {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    try {
      dispatch(profilePicIsSaving(true));

      if (!userId) {
        console.log('[Error: update profile pic - no userId]');
        return;
      }

      const token = await AsyncStorage.getItem('authToken');

      const createFormData = (photo: any) => {
        const data = new FormData();

        data.append('avatar', {
          name: photo.fileName,
          type: photo.type,
          uri:
            Platform.OS === 'ios'
              ? photo.uri.replace('file://', '')
              : photo.uri,
        });

        return data;
      };

      const res = await fetch(
        `${Config.api_server}/users/${userId}/api_update`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: createFormData(photo),
        },
      );

      if (res.status === 401) {
        triggerLogout(res);
        return;
      }

      if (res.status !== 200) {
        RootNavigation.navigate('ErrorScreen', {statusCode: res.status}, {});
        return;
      }

      const response = await res.json();

      if (!response.Message) {
        return;
      }

      if (response.Message === 'User Profile Saved') {
        dispatch(getUserInfo());
      }
    } catch (err) {
      console.log('[Error: Update profile picture]', err);
      RootNavigation.navigate('NetworkErrorScreen', {}, {});
    } finally {
      dispatch(profilePicIsSaving(false));
    }
  };
}

export function updatePassword(password: string) {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    try {
      dispatch(passwordIsLoading(true));

      const token = await AsyncStorage.getItem('authToken');

      const data = new FormData();
      data.append('password', password);

      const res = await fetch(`${Config.api_server}/auth`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (res.status === 401) {
        triggerLogout(res);
        return;
      }

      if (res.status !== 200) {
        RootNavigation.navigate('ErrorScreen', {statusCode: res.status}, {});
        return;
      }

      const response = await res.json();

      if (response.status !== 'ok') {
        dispatch(
          actionTriggerShowModal(
            true,
            'Update password',
            'Update password fail',
          ),
        );
        return;
      }

      if (response.status === 'ok') {
        dispatch(
          actionTriggerShowModal(
            true,
            'Update password',
            'Update password success',
          ),
        );
        // RootNavigation.navigate('ProfileScreen', {}, {})
      }
    } catch (err) {
      console.log('[Error: Update Password]', err);
      RootNavigation.navigate('NetworkErrorScreen', {}, {});
    } finally {
      dispatch(passwordIsLoading(false));
    }
  };
}

export function getEmergencyContacts() {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        console.log('[Error: Get user info -no token]');
        return;
      }

      const existingUser = await AsyncStorage.getItem('user');
      const user = JSON.parse(existingUser!);

      const res = await fetch(`${Config.api_server}/stakeholders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        triggerLogout(res);
        return;
      }

      if (res.status !== 200) {
        RootNavigation.navigate('ErrorScreen', {statusCode: res.status}, {});
        return;
      }

      const contacts: EmergencyContact[] = await res.json();

      const userEmail = contacts.filter(
        contact => contact.email === user.email,
      );

      if (userEmail.length > 0) {
        dispatch(loadIsUserReceiveEmail(true, userEmail[0].id));
      } else {
        dispatch(loadIsUserReceiveEmail(false, null));
      }

      const filterContacts = contacts.filter(
        contact => contact.email != user.email,
      );

      dispatch(loadEmergencyContacts(filterContacts));
    } catch (err) {
      console.log('[Error: Get emergency contacts]', err);
      RootNavigation.navigate('NetworkErrorScreen', {}, {});
    }
  };
}

export function removeEmergencyContact(id: number) {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    try {
      dispatch(contactIsLoading(true));

      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        console.log('[Error: Get user info -no token]');
        return;
      }

      const res = await fetch(`${Config.api_server}/stakeholders/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        triggerLogout(res);
        return;
      }

      if (res.status !== 200) {
        RootNavigation.navigate('ErrorScreen', {statusCode: res.status}, {});
        return;
      }

      const response = await res.json();

      if (response.Message === 'The Stakeholderss was deleted') {
        dispatch(
          actionTriggerShowModal(true, 'Remove Contact', `${response.Message}`),
        );
        dispatch(contactIsLoading(false));
        dispatch(getEmergencyContacts());
        RootNavigation.navigate('EmergencyContactsScreen', {}, {});
      }
    } catch (err) {
      console.log('[Error: Remove emergency contact]', err);
      RootNavigation.navigate('NetworkErrorScreen', {}, {});
    }
  };
}

export function updateEmergencyContact(
  contactId: number,
  name: string,
  phone: string,
  email: string,
) {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    try {
      if (!contactId) {
        console.log('[Error: update emergency contact - no contactId]');
        return;
      }

      const token = await AsyncStorage.getItem('authToken');

      const createFormData = (name: string, phone: string, email: string) => {
        const data = new FormData();

        data.append('name', name);
        data.append('phone_no', phone);
        data.append('email', email);

        return data;
      };

      const res = await fetch(
        `${Config.api_server}/stakeholders/${contactId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: createFormData(name, phone, email),
        },
      );

      if (res.status === 401) {
        triggerLogout(res);
        return;
      }

      if (res.status !== 200) {
        RootNavigation.navigate('ErrorScreen', {statusCode: res.status}, {});
        return;
      }

      const response = await res.json();

      if (!response.Message) {
        return;
      }

      if (response.Message === 'Error in the claim') {
        console.log('[Error: Emergency contact update]');
        return;
      }

      if (response.Message === 'The Stakeholderss was claimed') {
        dispatch(getEmergencyContacts());
        RootNavigation.navigate('EmergencyContactsScreen', {}, {});
      }
    } catch (err) {
      console.log('[Error: Update Emergency Contact]', err);
      RootNavigation.navigate('NetworkErrorScreen', {}, {});
    } finally {
      // dispatch(profilePicIsSaving(false));
    }
  };
}

export function createEmergencyContact(
  name: string,
  phone: string,
  email: string,
) {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      const createFormData = (name: string, phone: string, email: string) => {
        const data = new FormData();

        data.append('name', name);
        data.append('phone_no', phone);
        data.append('email', email);

        return data;
      };

      const res = await fetch(`${Config.api_server}/stakeholders`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: createFormData(name, phone, email),
      });

      if (res.status === 401) {
        triggerLogout(res);
        return;
      }

      if (res.status !== 200) {
        RootNavigation.navigate('ErrorScreen', {statusCode: res.status}, {});
        return;
      }

      const response = await res.json();

      if (!response.Message) {
        return;
      }

      if (response.Message === 'Error in the stakeholder creation') {
        console.log('[Error: Create emergency contact ]');
        return;
      }

      if (response.Message === 'The Stakeholderss was created') {
        dispatch(getEmergencyContacts());
        RootNavigation.navigate('EmergencyContactsScreen', {}, {});
      }
    } catch (err) {
      console.log('[Error: Create Emergency Contact]', err);
      RootNavigation.navigate('NetworkErrorScreen', {}, {});
    } finally {
      // dispatch(profilePicIsSaving(false));
    }
  };
}

export function setUserReceiveEmail(
  userReceiveEmail: boolean,
  userEmailId: number | null,
) {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      const existingUser = await AsyncStorage.getItem('user');
      let user = JSON.parse(existingUser!);

      let url = '';
      let httpObject = {};

      if (userReceiveEmail) {
        let formData = new FormData();
        formData.append('email', user.email);
        formData.append('name', user.name);

        url = `${Config.api_server}/stakeholders`;
        httpObject = {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        };
      } else {
        url = `${Config.api_server}/stakeholders/${userEmailId}`;
        httpObject = {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      }

      const res = await fetch(`${url}`, httpObject);

      if (res.status === 401) {
        triggerLogout(res);
        return;
      }

      if (res.status !== 200) {
        RootNavigation.navigate('ErrorScreen', {statusCode: res.status}, {});
        return;
      }

      const response = await res.json();

      if (!response.Message) {
        return;
      }

      if (response.Message === 'Error in the stakeholder creation') {
        console.log('[Error: Set user email in emergency contact ]');
        return;
      }

      if (response.Message === 'The Stakeholderss was created') {
        dispatch(
          actionTriggerShowModal(
            true,
            'Set user receive email',
            `${response.Message}`,
          ),
        );
        dispatch(getEmergencyContacts());
      }

      if (response.Message === 'The Stakeholderss was deleted') {
        dispatch(
          actionTriggerShowModal(
            true,
            'Set user receive email',
            `${response.Message}`,
          ),
        );
        dispatch(getEmergencyContacts());
      }
    } catch (err) {
      console.log('[Error: Set user in Emergency Contact]', err);
      RootNavigation.navigate('NetworkErrorScreen', {}, {});
    } finally {
    }
  };
}
