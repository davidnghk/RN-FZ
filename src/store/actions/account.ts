import {ThunkDispatch} from '../store';
import {RootState} from '../store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Config} from '../../config/config';
import {Account, AccountMember} from '../reducers/account';
import {triggerLogout} from './helpers';
import * as RootNavigation from '../../navigation/RootNavigation';
import {actionTriggerShowModal} from './modal';
import {getUserInfo} from './user';

export function loadAccountInfo(accountInfo: Account) {
  return {
    type: '@@account/LOAD_ACCOUNT_INFO' as const,
    accountInfo: accountInfo,
  };
}

export function clearAccountInfo() {
  return {
    type: '@@account/CLEAR_ACCOUNT_INFO' as const,
  };
}

export function isLoading(isLoading: boolean) {
  return {
    type: '@@account/ACCOUNT_IS_LOADING' as const,
    isLoading: isLoading,
  };
}

export function loadAccounts(accounts: Account[]) {
  return {
    type: '@@account/LOAD_ACCOUNTS' as const,
    accounts,
  };
}

export type AccountActions =
  | ReturnType<typeof loadAccountInfo>
  | ReturnType<typeof clearAccountInfo>
  | ReturnType<typeof isLoading>
  | ReturnType<typeof loadAccounts>;

// Thunk Actions
export function getAccountInfo(accountId: number) {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    try {
      dispatch(isLoading(true));

      const token = await AsyncStorage.getItem('authToken');

      const res = await fetch(`${Config.api_server}/accounts/${accountId}`, {
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

      let accountInfo = await res.json();

      if (accountInfo.users && accountInfo.users.length > 0) {
        const sortedMembers = accountInfo.users.sort(
          (a: AccountMember, b: AccountMember) =>
            a.email! > b.email! ? 1 : -1,
        );
        accountInfo.users = sortedMembers;
      }

      dispatch(loadAccountInfo(accountInfo));
    } catch (err) {
      console.log('[Error: Get Account Info]', err);
      RootNavigation.navigate('NetworkErrorScreen', {}, {});
    } finally {
      dispatch(isLoading(false));
    }
  };
}

export function sendMemberInvitation(
  userId: number,
  accountId: number,
  email: string,
  name: string,
) {
  return async (dispatch: ThunkDispatch, getState: () => RootState) => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      let formData = new FormData();
      formData.append('account_id', accountId);
      formData.append('invited_by_id', userId);
      formData.append('name', name);
      formData.append('email', email);

      const res = await fetch(`${Config.api_server}/account_invitations`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
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

      if (response.Message === 'Invitation has been sent.') {
        dispatch(
          actionTriggerShowModal(
            true,
            'Account Member Invitaion',
            'Invitation has been sent',
          ),
        );
        RootNavigation.navigate('AccountMemberListScreen', {}, {});
        return;
      }

      if (response.Message === 'User not found.') {
        dispatch(
          actionTriggerShowModal(
            true,
            'Account Member Invitaion',
            'User not found.',
          ),
        );
        RootNavigation.navigate('AccountMemberListScreen', {}, {});
        return;
      }

      if (response.Message === 'Error: Invitation is not save') {
        dispatch(
          actionTriggerShowModal(
            true,
            'Account Member Invitaion',
            'Duplicated invitation',
          ),
        );
        RootNavigation.navigate('AccountMemberListScreen', {}, {});
        return;
      }
    } catch (err) {
      console.log('[Error: Send Memeber Invitation]', err);
      RootNavigation.navigate('NetworkErrorScreen', {}, {});
    }
  };
}

export function getAllAccounts() {
  return async (dispatch: ThunkDispatch) => {
    try {
      dispatch(isLoading(true));

      const token = await AsyncStorage.getItem('authToken');

      const res = await fetch(`${Config.api_server}/accounts`, {
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

      let accounts = await res.json();

      dispatch(loadAccounts(accounts));
    } catch (err) {
      console.log('[Error: Get Accounts]', err);
      RootNavigation.navigate('NetworkErrorScreen', {}, {});
    } finally {
      dispatch(isLoading(false));
    }
  };
}

export function switchAccount(userId: number, accountId: number) {
  return async (dispatch: ThunkDispatch) => {
    try {
      dispatch(isLoading(true));

      const token = await AsyncStorage.getItem('authToken');

      const createFormData = () => {
        const data = new FormData();
        data.append('default_account_id', accountId);
        return data;
      };

      const res = await fetch(
        `${Config.api_server}/users/${userId}/api_update`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: createFormData(),
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
        RootNavigation.navigate('ProfileScreen', {}, {});
      }
    } catch (err) {
      console.log('[Error: switch account] ', err);
      RootNavigation.navigate('NetworkErrorScreen', {}, {});
    } finally {
      dispatch(isLoading(false));
    }
  };
}
