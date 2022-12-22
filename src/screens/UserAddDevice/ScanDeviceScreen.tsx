import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { RootState } from '../../store/store';
import { searchThing } from '../../store/actions/things';
import { closeModal } from '../../store/actions/modal';
// Components
import CustomButton from '../../components/CustomButton';
import MessagePopUp from '../../components/MessagePopUp';
import Loader from '../../components/Loader';


const ScanDeviceScreen = () => {

    const { t } = useTranslation();

    const dispatch = useDispatch();
    const [eui, setEui] = useState('null');

    const isLoading = useSelector((state: RootState) => state.things.isLoading);
    const isShowModal = useSelector((state: RootState) => state.modal.showModal);
    const showModalMsg = useSelector((state: RootState) => state.modal.messages);


    useEffect(() => {

        if (eui == 'null') {
            return;
        };

        dispatch(searchThing(eui));

    }, [eui, dispatch]);

    let scanner;

    const startScan = () => {
        setEui('null');
        if (scanner) {
            scanner._setScanning(false);
        };
    };

    function getEui(e: any) {
        setEui(e.data);
    };

    return (

        <View style={styles.scannerContainer}>

            {isLoading && <Loader />}

            {isShowModal && showModalMsg === 'Device not found' &&
                <MessagePopUp
                    visible={isShowModal}
                    title={t('alert:deviceIsNotFound')}
                    buttonText={t('alert:ok')}
                    // onPress={() => { dispatch(showModal(!isShowModal)) }}
                    onPress={() => { dispatch(closeModal()) }}
                    buttonNumber="1"
                />
            }

            <QRCodeScanner
                onRead={(e) => getEui(e)}
                containerStyle={styles.cameraContainer}
                cameraStyle={styles.camera}
                flashMode={RNCamera.Constants.FlashMode.auto}
                ref={(camera) => scanner = camera}
                topContent={
                    <View style={styles.imageContainer}>
                        <Image style={styles.image} source={require('../../assets/images/QRScanSample.jpeg')} />
                    </View>
                }
            />

            <View style={styles.bottomContainer}>
                <CustomButton onPress={() => startScan()}>{t('buttons:scanAgain')}</CustomButton>
            </View>

        </View>
    )
};


const styles = StyleSheet.create({
    scannerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        width: 300,
        height: 300,
        borderRadius: 10,
        overflow: 'hidden',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 30,
    },
    imageContainer: {
        width: '95%',
        height: '95%',
        // backgroundColor: 'pink'    
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },

});

export default ScanDeviceScreen;
