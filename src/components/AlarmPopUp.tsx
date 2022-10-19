import React from 'react';
import { View, StyleSheet, Modal, Text, Platform, Linking, Alert, Image, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from './CustomButton';
import { loadLatestAlert } from '../store/actions/alerts'
import { useTranslation } from 'react-i18next';
import { dialCall } from '../utils/resuableMethods';
import { resetUnread } from '../store/actions/user';


const AlarmPopUp = (props: any) => {

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const Alarm = () => {
        return (
            <View style={styles.modalScreen}>
                <View style={styles.modalContainer}>
                    <Text style={{ fontSize: 25, }}>{props.name}</Text>
                    <Text style={{ fontSize: 30 }}>{t('sentence:smokeDetected')}</Text>

                    <View style={styles.imageContainer}>
                        <Image style={styles.image} source={require('../assets/images/components/siren.jpg')} />
                    </View>

                    <View style={styles.buttonContainer}>
                        <CustomButton
                            style={styles.emergencyCallButton}
                            onPress={() => {
                                dispatch(loadLatestAlert(false, null));
                                dialCall('+852999')
                            }}>
                            <Text style={styles.emergencyCallButtonText}>{t('buttons:emergencyCall')}</Text>
                        </CustomButton>

                        <CustomButton style={{ width: '100%' }} onPress={() => {
                            dispatch(resetUnread());
                            dispatch(loadLatestAlert(false, null));
                            props.navigation.navigate('Alerts', { screen: 'AlertDetailsScreen', params: { id: props.id } });
                        }}>
                            {t('buttons:viewDetail')}
                        </CustomButton>

                        <CustomButton style={{ width: '100%' }} onPress={() => {
                            dispatch(resetUnread());
                            dispatch(loadLatestAlert(false, null))
                            props.navigation.navigate('Alerts', { screen: 'AlertsScreen' });
                        }}>
                            {t('buttons:close')}
                        </CustomButton>

                    </View>

                </View>
            </View>
        )

    }

    const Drill = () => {
        return (
            <View style={styles.modalScreen}>
                <View style={styles.modalContainer}>
                    <Text style={{ fontSize: 25, }}>{props.name}</Text>
                    <Text style={{ fontSize: 30 }}>{t('sentence:sensorTest')}</Text>

                    <View style={styles.imageContainer}>
                        <Image source={require('../assets/images/components/sensor-test.jpeg')} />
                    </View>

                    <View style={styles.buttonContainer}>

                        <CustomButton style={{ width: '100%' }} onPress={() => {
                            dispatch(resetUnread());
                            dispatch(loadLatestAlert(false, null));
                            props.navigation.navigate('Alerts', { screen: 'AlertDetailsScreen', params: { id: props.id } });
                        }}>
                            {t('buttons:viewDetail')}
                        </CustomButton>

                        <CustomButton style={{ width: '100%' }} onPress={() => {
                            dispatch(resetUnread());
                            dispatch(loadLatestAlert(false, null))
                            props.navigation.navigate('Alerts', { screen: 'AlertsScreen' });
                        }}>
                            {t('buttons:close')}
                        </CustomButton>

                    </View>

                </View>
            </View>
        )

    }

    return (
        <Modal
            visible={props.visible}
            animationType="fade"
            transparent={true}
        >

            {props.alertType == 'alarm' && <Alarm />}
            {props.alertType == 'drill' && <Drill />}

        </Modal>
    )
};

const styles = StyleSheet.create({
    modalScreen: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#00000065',
    },
    modalContainer: {
        margin: 10,
        backgroundColor: "#ffffff",
        borderRadius: 8,
        padding: 30,
        alignItems: "center",
        width: '90%',
    },

    buttonContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emergencyCallButton: {
        backgroundColor: 'red',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    emergencyCallButtonText: {
        color: 'white',
        //fontSize: 20,
        fontWeight: 'bold',
        paddingLeft: 5,
    },
    imageContainer: {
        height: 200,
        width: 200,
    },
    image: {
        height: '100%',
        width: '100%',
    },
    closeButtonContainer: {
        // position: 'absolute',
        // bottom: -30,
        // backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        overflow: 'visible',
    },
});

export default AlarmPopUp