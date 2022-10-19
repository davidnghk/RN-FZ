import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet } from 'react-native';

const ErrorScreen = (props: any) => {

    const { statusCode } = props.route.params;
    const {t} = useTranslation();

    return (
        <View style={styles.screen}>
            <Text style={{textAlign: 'center'}}>{t('sentence:oops')} {'\n'}</Text>
            <Text style={{textAlign: 'center'}}>Status Code: {statusCode}</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

});

export default ErrorScreen;
