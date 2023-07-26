import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import CustomButton from '../../components/CustomButton';
import CustomText from '../../components/Text/CustomText';
import COLOR from '../../constants/Theme/color';

const EmptyContactScreen = (props: any) => {

    const { t } = useTranslation();

    return (
        <View style={styles.screen}>
            <View style={styles.imageContainer}>
                <Image style={styles.image} source={require('../../assets/images/screen_main_images/messages.jpg')} />
            </View>
            <CustomText style={{ textAlign: "center" }}>
                {t('sentence:haveNoEmergencyContact')} {'\n'}
                {t('sentence:pressBelowButtonToAddContact')}
            </CustomText>

            <View style={styles.buttonContainer}>
                <CustomButton onPress={props.onPress}>{t('buttons:addContact')}</CustomButton>
            </View>

            <View style={styles.bottomContainer}>
                <Text style={{ fontSize: 10 }}>{t('sentence:reminder')}</Text>
                <Text style={{ fontSize: 10 }}>{t('sentence:emergenceyContactsReminder1')}</Text>
                <Text style={{ fontSize: 10 }}>{t('sentence:emergenceyContactsReminder2')}</Text>
                <Text style={{ fontSize: 10 }}>{t('sentence:emergenceyContactsReminder3')}</Text>
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
    buttonContainer: {
        marginVertical: 20,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 10,
        left: 10,
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

export default EmptyContactScreen;