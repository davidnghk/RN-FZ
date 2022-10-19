import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import CustomText from '../../components/Text/CustomText';
import CustomTitle from '../../components/Text/CustomTitle';
import { fetchThings } from '../../store/actions/things';
import { useDispatch } from 'react-redux';
import COLOR from '../../constants/Theme/color';

const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'zhHK', label: '繁體中文' },
    {code: 'zhCN', label: '簡體中文'}
];

const LanguageSettingScreen= () => {

    const { t, i18n } = useTranslation();
    const selectedLanguageCode = i18n.language;
    const dispatch=useDispatch();

    const setLanguage = (code: string) => {
        return i18n.changeLanguage(code);
    };

    return (
        <View style={styles.screen}>

            <CustomTitle style={styles.title}>{t('sentence:selectLanguage')}</CustomTitle>

            {LANGUAGES.map(language => {
                const selectedLanguage = language.code === selectedLanguageCode;

                return (
                    <TouchableOpacity
                        key={language.code}
                        style={[selectedLanguage ? styles.selectedPressableContainer : styles.pressableContainer]}
                        disabled={selectedLanguage}
                        onPress={() => {
                            [
                                setLanguage(language.code),
                                dispatch(fetchThings()),
                            ]
                        }}
                    >
                        <CustomText >
                            {language.label}
                        </CustomText>
                    </TouchableOpacity>
                );
            })}

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
    title: {
        fontWeight: 'bold',
        marginVertical: 20,
        textAlign: 'center',
    },
    pressableContainer: {
        backgroundColor: 'white',
        width: '80%',
        height: 50,
        marginVertical: 5,
        marginHorizontal: 20,
        paddingHorizontal: 20,
        justifyContent: 'center',
        borderRadius: 5,
    },
    selectedPressableContainer: {
        backgroundColor: COLOR.primaryColor,
        width: '80%',
        height: 50,
        marginVertical: 10,
        marginHorizontal: 20,
        paddingHorizontal: 20,
        justifyContent: 'center',
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#ffffff',
    },
});

export default LanguageSettingScreen;