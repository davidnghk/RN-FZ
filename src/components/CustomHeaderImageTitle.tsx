import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import COLOR from '../constants/Theme/color';

const CustomHeaderImageTitle = (props: any) => {

    // Cannot set image as title cos it is not center
    if (props.platform === 'android') {
        return null
    }

        return (
            <Image
                style={{ width: 65, height: 65 }}
                source={require('../assets/images/company_logo/Logo.png')}
                resizeMode='contain'
            />
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

export default CustomHeaderImageTitle;