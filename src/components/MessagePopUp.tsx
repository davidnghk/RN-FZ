import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import CustomButton from './CustomButton';
import CustomTitle from './Text/CustomTitle';
import CustomText from './Text/CustomText';

const MessagePopUp = (props: any) => {

    const { t } = useTranslation();

    return (

        <Modal
            animationType="fade"
            transparent={true}
            visible={props.visible}
        >
            <View style={styles.modalScreen}>
                <View style={styles.modalContainer}>

                    <View style={{ marginVertical: 10 }}>
                        <CustomText style={{ fontWeight: 'bold' }}>{props.title}</CustomText>
                    </View>

                    <View style={{ marginVertical: 10, alignItems: 'center' }}>
                        <CustomText>{props.text}</CustomText>
                    </View>


                    {props.buttonNumber == 1 &&
                        <View style={{ marginVertical: 10 }}>
                            <CustomButton style={{ width: 120 }} onPress={props.onPress}>{props.buttonText}</CustomButton>
                        </View>
                    }

                    {props.buttonNumber == 2 &&
                        <View style={styles.buttonsContainer}>
                            <CustomButton style={styles.cancelButton} onPress={props.onPressCancel}><Text style={{ color: 'gray' }}>{t('alert:cancel')}</Text></CustomButton>
                            <CustomButton style={styles.button} onPress={props.onPress}>{props.buttonText}</CustomButton>
                        </View>
                    }

                </View>
            </View>
        </Modal>

    )
}

const styles = StyleSheet.create({
    modalScreen: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#00000065',
    },
    modalContainer: {
        margin: 10,
        backgroundColor: "#ffffff",
        borderRadius: 8,
        padding: 20,
        alignItems: "center",
        width: 350,
    },
    buttonsContainer: {
        flexDirection: 'row',
    },
    button: {
        width: 120,
        marginHorizontal: 10,
    },
    cancelButton: {
        width: 120,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'gray'
    }

});

export default MessagePopUp;

