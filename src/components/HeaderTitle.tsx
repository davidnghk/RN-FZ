import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HeaderTitle = (props: any) => {
    return (
        <View>
            <Text style={styles.headerTitle}>
                {props.children}
            </Text>
        </View>
    )
};

const styles = StyleSheet.create({ 
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    }
});

export default HeaderTitle;