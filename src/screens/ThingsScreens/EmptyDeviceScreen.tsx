import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import CustomButton from '../../components/CustomButton';
import CustomText from '../../components/Text/CustomText';
import COLOR from '../../constants/Theme/color';

const EmptyDeviceScreen = (props: any) => {

    const { t } = useTranslation();

    return (
        <View style={styles.screen}>
            <View style={styles.imageContainer}>
                <Image style={styles.image} source={require('../../assets/images/screen_main_images/scan.jpg')} />
            </View>
            <CustomText style={{ textAlign: "center" }}>
                {t('sentence:youhaveNotRegisteredADeviceYet')} {'\n'}
                {t('sentence:pressBelowButtonToAddOne')}
            </CustomText>

            <View style={styles.bottomContainer}>
                <CustomButton onPress={props.onPress}>{t('buttons:scanDevice')}</CustomButton>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR.bgColor,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 30,
    },
    imageContainer: {
        width: 220,
        height: 220,
        borderRadius: 20,
        overflow: 'hidden',
        marginVertical: 20,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

export default EmptyDeviceScreen;