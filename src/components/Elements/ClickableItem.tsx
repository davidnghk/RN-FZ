import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import CommonStyles from '../../constants/Theme/commonStyle';

const ClickableItem = (props: any) => {

    return (
        <TouchableOpacity style={[{ ...styles.item }, { ...props.style },]} onPress={props.onPress}>
            {props.children}
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    item: CommonStyles.shawdowComponentStyle,
});

export default ClickableItem;