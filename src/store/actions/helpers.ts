import { store } from '../store';
import { clearAccountInfo } from './account';
import { clearAlerts } from './alerts';
import { clearThings } from './things';
import { clearUserInfo } from './user';
import { logout } from './auth';
import { clearAmbienceDevices } from './ambience';
import { actionTriggerShowModal } from './modal';

export async function triggerLogout(res: any) {

        const message = await res.json();

        store.dispatch(actionTriggerShowModal(
                true,
                'Authentication',
                message.error,
        ))
        
        store.dispatch<any>(logout());
        store.dispatch(clearAccountInfo());
        store.dispatch(clearUserInfo());
        store.dispatch(clearAlerts());
        store.dispatch(clearThings());
        store.dispatch(clearAmbienceDevices());

};