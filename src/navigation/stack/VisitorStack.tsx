import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import ErrorBoundary from 'react-native-error-boundary';

// Screens
import LoginScreen from '../../screens/visitor/LoginScreen';
import LandingScreen from '../../screens/visitor/LandingScreen';
import SignUpScreen from '../../screens/visitor/SignUpScreen';
import SignUpConfirmScreen from '../../screens/visitor/SignUpConfirmScreen';
import ForgotPasswordScreen from '../../screens/visitor/ForgotPasswordScreen';
import ForgotPasswordConfirmationScreen from '../../screens/visitor/ForgotPasswordConfirmationScreen';
import NetworkErrorScreen from '../../screens/NetworkErrorScreen';
import ErrorScreen from '../../screens/ErrorScreen';
import ErrorFallBackScreen from '../../screens/ErrorFallBackScreen';
import VistorStackHeaderBackButton from '../../components/VisitorStackHeaderBackButton';


const VisitorStack = createStackNavigator();

export const VisitorStackScreen = () => {

    const { t } = useTranslation();

    return (
        <ErrorBoundary FallbackComponent={ErrorFallBackScreen}>
            <VisitorStack.Navigator screenOptions={({ navigation }) => ({
                headerBackImage: () => <VistorStackHeaderBackButton color='red' />,
                headerBackTitleVisible: false,
            })}>
                <VisitorStack.Screen name="LandingScreen" component={LandingScreen} options={{
                    headerTitle: t('navigate:hello'),
                }} />
                <VisitorStack.Screen name="LoginScreen" component={LoginScreen} options={{
                    headerTitle: t('navigate:login'),
                }} />
                <VisitorStack.Screen name="SignUpScreen" component={SignUpScreen} options={{
                    headerTitle: t('navigate:signup'),
                }} />
                <VisitorStack.Screen name="SignUpConfirmScreen" component={SignUpConfirmScreen} options={{
                    headerTitle: t('navigate:confirmEmail'),
                }} />
                <VisitorStack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{
                    headerTitle: '',
                }} />
                <VisitorStack.Screen name="ForgotPasswordConfirmationScreen" component={ForgotPasswordConfirmationScreen} options={{
                    headerTitle: '',
                }} />
                <VisitorStack.Screen name="ErrorScreen" component={ErrorScreen} options={{
                    headerTitle: t('navigate:error'),
                }} />
                <VisitorStack.Screen name="NetworkErrorScreen" component={NetworkErrorScreen} options={{
                    headerTitle: t('navigate:error'),
                }} />
            </VisitorStack.Navigator>
        </ErrorBoundary>
    )
};