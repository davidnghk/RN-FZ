import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Image } from 'react-native';
import ClickableItem from './Elements/ClickableItem';
import CustomText from './Text/CustomText';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

interface Location {
    location_id: number,
    name: string | null,
    code: string | null,
    onPress: any,
};

const LocationItem = (props: Location) => {

    const { t } = useTranslation();
    const location = useSelector((state: RootState) => state.locations.locations.filter(location => props.location_id === location.id)[0])

    return (

        <ClickableItem onPress={props.onPress} style={styles.item}>
            <View style={styles.content}>
                <CustomText style={styles.title}>{location.name}</CustomText>
                <CustomText>{t("location:code")}: {location.code}</CustomText>
            </View>
        </ClickableItem>
    );
};

const styles = StyleSheet.create({
    item: {
        marginHorizontal: 12,
        marginVertical: 5,
        padding: 20,
        backgroundColor: 'white',
    },
    content: {
        flex: 1,
        flexDirection: 'column',
        overflow: 'hidden',
    },
    title: {
        fontWeight: 'bold',
    },
});

export default LocationItem;