import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import * as FontSize from '../../constants/fonts/font';
import { RootState } from '../../store/store';


const CustomReminderText = (props: any) => {

    const sizeSetting = useSelector((state: RootState) => state.user.fontSizeSetting);
    const [fontSize, setFontSize] = useState(getFontSize(sizeSetting));

    function getFontSize(setting: string) {
        return FontSize[setting]['text']
    };

    useEffect(() => {

        if (sizeSetting) {
            setFontSize(getFontSize(sizeSetting) * 0.7);
            return
        }

    }, [sizeSetting])


    return (
        <Text
            style={[{ ...props.style }, { fontSize: fontSize}]}
            numberOfLines={props.numberOfLines}
            ellipsizeMode="middle"
        >
            {props.children}
        </Text>
    )
};

const styles = StyleSheet.create({

});

export default CustomReminderText;