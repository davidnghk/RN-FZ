import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import COLOR from '../constants/Theme/color';

const CustomHeaderBackground = (props: any) => {

    // No need to use background image to display logo, use Title image instead
    if (props.platform === 'ios') {
        return (
            <View style={styles.headerBgContainer}>
            </View>
        )
    }

    return (
        <View style={styles.headerBgContainer}>
            <Image
                style={{ width: 65, height: 65 }}
                source={require('../assets/images/company_logo/Logo.png')}
                resizeMode='contain'
            />
        </View>
    )


};

const styles = StyleSheet.create({
    headerBgContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLOR.primaryColor,
    }
});

export default CustomHeaderBackground;