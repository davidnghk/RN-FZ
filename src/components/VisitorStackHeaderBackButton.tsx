import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import COLOR from '../constants/Theme/color';

const VistorStackHeaderBackButton = (props: any) => {

    return (
        <View style={styles.buttonContainer}>
            <Ionicons name='ios-arrow-back-outline' color='black' size={22} style={{ width: 26 - 32 }} />
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