import messaging from '@react-native-firebase/messaging';

export async function getFcmToken(userId: number) {
    const fcmToken = await messaging().getToken();

    if (fcmToken) {
        // console.log("Firebase token is: ", fcmToken);
        return { msg: 'success', fcmToken }
    } else {
        return { msg: 'no token' }
    }

};

export async function requestUserPermission(userId: number) {
    const authStatus = await messaging().requestPermission();

    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return { enabled, authStatus: authStatus };
};