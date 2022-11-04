import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '../../components/CustomButton';
import LanguageSelectorButtons from '../../components/LanguageSelectorButtons';
import MessagePopUp from '../../components/MessagePopUp';

import { closeModal } from '../../store/actions/modal';
import { RootState } from '../../store/store';

const LandingScreen = (props: any) => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const forceLogoutShowModal = useSelector((state: RootState) => state.modal.showModal);
    const forceLogoutMsg = useSelector((state: RootState) => state.modal.messages);
    const [isForceLogoutPopUp, setIsForceLogoutPopUp] = useState(false);

    useEffect(() => {
        if (forceLogoutShowModal) {
            setIsForceLogoutPopUp(forceLogoutShowModal)
        };

        if (!forceLogoutShowModal) {
            // dispatch(closeModal());
        };

    }, [forceLogoutShowModal])

    return (
        <View style={styles.screen}>

            {isForceLogoutPopUp && forceLogoutMsg === 'New Device login!' &&
                <MessagePopUp
                    visible={isForceLogoutPopUp}
                    title={t('sentence:youHaveBeenLoggedOut')}
                    text={t('sentence:reason')}
                    buttonText={t('alert:ok')}
                    onPress={() => { dispatch(closeModal()), setIsForceLogoutPopUp(false) }}
                    buttonNumber="1"
                />
            }

            {isForceLogoutPopUp && forceLogoutMsg === 'Account not supported for app' &&
                <MessagePopUp
                    visible={isForceLogoutPopUp}
                    title={t('sentence:youHaveBeenLoggedOut')}
                    text={t('sentence:accountNotSupportedForApp')}
                    buttonText={t('alert:ok')}
                    onPress={() => { dispatch(closeModal()), setIsForceLogoutPopUp(false) }}
                    buttonNumber="1"
                />
            }

            {isForceLogoutPopUp && forceLogoutMsg === 'Please register!' &&
                <MessagePopUp
                    visible={isForceLogoutPopUp}
                    title={t('sentence:youHaveBeenLoggedOut')}
                    // text={t('sentence:reason')}
                    buttonText={t('alert:ok')}
                    onPress={() => { dispatch(closeModal()), setIsForceLogoutPopUp(false) }}
                    buttonNumber="1"
                />
            }

            {isForceLogoutPopUp && forceLogoutMsg === 'Access denied' &&
                <MessagePopUp
                    visible={isForceLogoutPopUp}
                    title={t('sentence:youHaveBeenLoggedOut')}
                    // text={t('sentence:reason')}
                    buttonText={t('alert:ok')}
                    onPress={() => { dispatch(closeModal()), setIsForceLogoutPopUp(false) }}
                    buttonNumber="1"
                />
            }

            <View style={styles.imageContainer}>
                <Image style={styles.image} source={require('../../assets/images/company_logo/SmartWatchLogo.png')} />
            </View>
            <View>
                <CustomButton onPress={() => { props.navigation.navigate('LoginScreen') }} >{t('buttons:login')}</CustomButton>
                <CustomButton onPress={() => { props.navigation.navigate('SignUpScreen') }} >{t('buttons:signup')}</CustomButton>
            </View>

            <LanguageSelectorButtons />
        </View>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    imageContainer: {
        height: 200,
        width: 200,
        marginBottom: 50,
    },
    image: {
        width: '100%',
        height: '100%',
    },

});

export default LandingScreen;