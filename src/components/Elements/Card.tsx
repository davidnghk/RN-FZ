import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import CommonStyles from '../../constants/Theme/commonStyle';

const Card = (props: any) => {

    return (
        <View style={[{ ...styles.card }, { ...props.style },]} >
            {props.children}
        </View>
    )
};

const styles = StyleSheet.create({
    card: CommonStyles.shawdowComponentStyle,
});

export default Card;