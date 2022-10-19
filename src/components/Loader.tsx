import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import COLOR from '../constants/Theme/color';

const Loader = () => {
    return (
        <ActivityIndicator color={COLOR.loader} size="large" />
    )
};

const styles = StyleSheet.create({
})

export default Loader;