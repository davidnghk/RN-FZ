import React from "react";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, Image } from 'react-native';
import CustomButton from "../components/CustomButton";
import COLOR from "../constants/Theme/color";

const ErrorFallBackScreen = (props: { error: Error, resetError: Function }) => {

    const { t } = useTranslation();

    return (
        <View style={styles.screen}>
            <View style={styles.imageContainer}>
                <Image style={styles.image} source={require('../assets/images/screen_main_images/yellow_error.jpg')} />
            </View>
            <Text style={styles.errorMsg}>{t('sentence:errorMsg')}</Text>
            <CustomButton style={styles.button} onPress={props.resetError}> {t('buttons:tryAgain')} </CustomButton>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR.bgColor,
    },
    errorMsg: {
        fontSize: 17,
        fontWeight: 'bold',
    },
    button: {
        marginVertical: 20
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
})

export default ErrorFallBackScreen

