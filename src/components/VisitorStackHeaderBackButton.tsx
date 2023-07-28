import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import COLOR from '../constants/Theme/color';

const VistorStackHeaderBackButton = (props: any) => {

    return (
        <View style={styles.buttonContainer}>
            <MaterialIcons name='keyboard-backspace' color='black' size={22} style={{ width: 26 - 32 }} />
        </View>
    )
};

const styles = StyleSheet.create({
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: Platform.OS === 'ios' ? 15 : 0,
    },
});

export default VistorStackHeaderBackButton;