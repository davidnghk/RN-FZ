import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import CustomText from './Text/CustomText';
import COLOR from '../constants/Theme/color';

const LANGUAGES = [
    { code: 'zhHK', label: '中文' },
    { code: 'en', label: 'English' }
];

const LanguageSelectorButtons = () => {

    const { t, i18n } = useTranslation();
    const selectedLanguageCode = i18n.language;

    const setLanguage = (code:string) => {
        return i18n.changeLanguage(code);
    };

    return (
        <View style={styles.container}>

            {LANGUAGES.map(language => {
                const selectedLanguage = language.code === selectedLanguageCode;

                return (
                    <TouchableOpacity
                        key={language.code}
                        style={styles.pressableContainer}

                        disabled={selectedLanguage}
                        onPress={() => setLanguage(language.code)}
                    >
                        <CustomText style={selectedLanguage ? styles.selectedText : styles.text}>
                            {language.label}
                        </CustomText>
                    </TouchableOpacity>
                );
            })}

        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 30,
    },

    pressableContainer: {
        width: 100,
        height: 50,
        margin: 10,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    selectedText: {
        color: '#000000',
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    text: {
        color: COLOR.primaryColor,
        textAlign: 'center',
    }
});

export default LanguageSelectorButtons;