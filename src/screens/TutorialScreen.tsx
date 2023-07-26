import React from 'react';
import { StatusBar } from 'react-native';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import CustomButton from '../components/CustomButton';
import { setTutorialSeen } from '../store/actions/auth';

const TutorialScreen = (props: any) => {

    const dispatch = useDispatch();

    return (
        <SafeAreaView style={styles.screen}>
            <StatusBar
                animated={true}
                backgroundColor='white'
            />
            <Text> This is Tutorial Screen </Text>
            <CustomButton onPress={() => { dispatch(setTutorialSeen(true)); }}>Back to Home</CustomButton>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    }
});

export default TutorialScreen;
