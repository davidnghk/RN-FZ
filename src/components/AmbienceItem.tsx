import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, Image } from 'react-native';
import ClickableItem from './Elements/ClickableItem';
import CustomText from './Text/CustomText';
import { productIcons } from '../assets/images/mapping';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';


const AmbienceItem = (props: any) => {

    const { t } = useTranslation();
    const iconInfo = useSelector((state: RootState) => state.icons.icons.find(icon => icon.id === props.iconId))

    return (

        <ClickableItem onPress={props.onPress} style={styles.item}>
            <View style={styles.content}>

                <View style={styles.leftCol}>
                    {/* <Image style={styles.image} source={productIcons[props.iconId]} /> */}
                    <Image style={styles.image} source={{uri: props.icon_url}} />
                </View>

                <View style={styles.rightCol}>
                    <CustomText style={{ fontWeight: 'bold' }}>{iconInfo?.name}</CustomText>
                    <CustomText >{props.code}</CustomText>
                </View>

            </View>

        </ClickableItem>
    );
};

const styles = StyleSheet.create({
    item: {
        marginHorizontal: 20,
        marginBottom: 10,
        width: 330,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        overflow: 'hidden',
        padding: 10,
        justifyContent: 'space-evenly',
        // backgroundColor: 'pink',
    },
    leftCol: {
        width: '30%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rightCol: {
        width: '60%',
        justifyContent: 'center',
        flexShrink: 1,
    },
    image: {
        width: '85%',
        height: 100,
        resizeMode: 'contain',
    }
});

export default AmbienceItem;