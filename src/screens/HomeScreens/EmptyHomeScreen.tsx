import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import CustomButton from '../../components/CustomButton';
import CustomText from '../../components/Text/CustomText';
import COLOR from '../../constants/Theme/color';
import { formatName } from '../../utils/resuableMethods';

const EmptyHomeScreen = (props: any) => {

    const { t } = useTranslation();

    return (
        <View style={styles.screen}>

            <View>{props.MessagePopUp}</View>

            <View style={styles.topBar}>
            </View>

            <View style={styles.welcomeMsg}>
                <Text style={{ fontSize: 28, color: COLOR.greetingColor, fontWeight: 'bold' }} numberOfLines={1} ellipsizeMode='head' >
                    {t('sentence:hello')} {formatName(props.username)}
                </Text>
                <CustomText style={{ color: COLOR.greetingColor }}>{t('sentence:greeting')}</CustomText>
            </View>

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
    topBar: {
        height: 120,
        width: '100%',
        backgroundColor: COLOR.primaryColor,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        position: 'absolute',
        top: 0,
    },
    welcomeMsg: {
        marginVertical: 20,
        width: '85%',
        position: 'absolute',
        top: 0,
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

export default EmptyHomeScreen;