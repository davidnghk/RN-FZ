import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CustomText from "./Text/CustomText";
import COLOR from '../constants/Theme/color'

const CustomButton = (props: any) => {
    return (
        <TouchableOpacity style={[{ ...styles.button }, { ...props.style }]} onPress={props.onPress}>
            <CustomText style={styles.buttonText}>{props.children}</CustomText>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: COLOR.primaryColor,
        width: 180,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 3,
        marginVertical: 5,
        borderColor: 'white',
        borderWidth: 2,
    },
    buttonText: {
        color: COLOR.buttonColor,
    },
});

export default CustomButton;
