import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Loader from '../components/Loader';

const LoadingScreen = () => {
    return (
        <View style={styles.screen}>
            <Loader />
        </View>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default LoadingScreen;