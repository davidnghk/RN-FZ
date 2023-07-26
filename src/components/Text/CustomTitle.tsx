import React, { useEffect, useState }from 'react';
import { Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import * as FontSize from '../../constants/fonts/font';
import { RootState } from '../../store/store';


const CustomTitle = (props: any) => {

    const sizeSetting = useSelector((state: RootState) => state.user.fontSizeSetting);
    const [fontSize, setFontSize] = useState(16);

    function getFontSize(setting: string) {
        return FontSize[setting]['title']
    };

    useEffect(() => {

        if (sizeSetting) {
            setFontSize(getFontSize(sizeSetting));
            return
        }
        
    }, [sizeSetting])

    return (
        <Text style={[
            { ...props.style },
            { fontSize: fontSize }]
        }
        >{props.children}</Text>
    )
};

const styles = StyleSheet.create({

});

export default CustomTitle;