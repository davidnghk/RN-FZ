import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, Button } from 'react-native';
import CustomButton from '../../components/CustomButton';

const SignUpConfirmScreen = (props: any) => {

    const { t } = useTranslation();

    return (
        <View style={styles.screen}>
            <View>
                <Text style={styles.title}>{t('navigate:confirmEmail')}</Text>
            </View>

            <View style={styles.msgContainer}>
                <Text>
                    {t('sentence:p1')} {"\n"}
                </Text>
                <Text>
                   {t('sentence:p2')}
                </Text>
            </View>

            <View>
                <CustomButton onPress={() => { props.navigation.navigate('LoginScreen') }} >{t('buttons:login')}</CustomButton>
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

export default SignUpConfirmScreen;