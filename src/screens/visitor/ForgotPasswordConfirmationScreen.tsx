import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Button } from 'react-native';
import CustomButton from '../../components/CustomButton';
import COLOR from '../../constants/Theme/color';

const ForgotPasswordConfirmationScreen = (props: any) => {

    const { t } = useTranslation();
    const { email } = props.route.params;

    return (
        <View style={styles.screen}>
            <View>
                <Text style={styles.title}>{t('navigate:checkYourEmail')}</Text>
            </View>

            <View style={styles.msgContainer}>
                <Text>
                    {t('sentence:paswordResetSentence1')} {"\n"}
                </Text>

                <Text style={{ color: COLOR.primaryColor, fontWeight: 'bold' }}> {email} {"\n"}</Text>

                <Text>
                    {t('sentence:paswordResetSentence2')}
                </Text>

            </View>

            <View>
                <CustomButton onPress={() => { props.navigation.navigate('LoginScreen') }} >{t('buttons:login')}</CustomButton>
                <CustomButton onPress={() => { props.navigation.navigate('ForgotPasswordScreen') }} >{t('buttons:sendAgain')}</CustomButton>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
    },
    msgContainer: {
        margin: 20,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 8,

    }
});

export default ForgotPasswordConfirmationScreen;