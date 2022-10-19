import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import CustomButton from '../../components/CustomButton';
import CustomText from '../../components/Text/CustomText';
import CustomTitle from '../../components/Text/CustomTitle';
import COLOR from '../../constants/Theme/color';

const AddDeviceCompletedScreen = (props: any) => {

    const { t } = useTranslation();

    return (
        <View style={styles.screen}>

            <View style={{ height: 20 }}></View>

            <View style={styles.imageContainer}>

                <Image style={styles.image} source={require('../../assets/images/product_icons/SITERWELL-GS529A.jpeg')} />

                <View style={styles.checkContainer}>
                    <Image style={styles.image} source={require('../../assets/images/components/GreenCheck.png')} />
                </View>
            </View>

            <View style={styles.message}>
                <CustomTitle>{t('sentence:addedToYourAccount')}</CustomTitle>
                <CustomText style={{ textAlign: 'center' }}>{t('sentence:ifhaveAnotherDevice')} {t('sentence:otherwise')}</CustomText>
            </View>

            <View style={styles.bottomContainer}>
                <CustomButton style={styles.button} onPress={() => { props.navigation.navigate('ScanDeviceScreen') }}>
                    {t('buttons:addAnother')}
                </CustomButton>

                <CustomButton style={styles.button} onPress={() => { props.navigation.navigate('ThingsScreen') }}>{t('buttons:next')}</CustomButton>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: COLOR.bgColor,
    },
    imageContainer: {
        height: 300,
        width: 300,
        borderRadius: 8,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '90%',
        height: '90%',
    },
    checkContainer: {
        height: 50,
        width: 50,
        position: 'absolute',
        bottom: -30,
        left: 120, // containerWidth/2 - this.containerWidth/2
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 30,
        flexDirection: 'row',
    },
    button: {
        width: 150,
        marginHorizontal: 10,
    },
    message: {
        paddingHorizontal: 30,
        alignItems: 'center',
        marginTop: 20,
    },
})

export default AddDeviceCompletedScreen;