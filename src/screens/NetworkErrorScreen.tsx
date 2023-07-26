import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet } from 'react-native';

const NetworkErrorScreen = () => {

    const {t} = useTranslation();

    return (
        <View style={styles.screen}>
            <Text style={{textAlign: 'center'}}>{t('sentence:oops')} {'\n'} {t('sentence:pleaseTryAgain')}</Text>
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

export default NetworkErrorScreen;
