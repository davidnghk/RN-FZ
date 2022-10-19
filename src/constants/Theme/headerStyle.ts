import COLOR from './color';

const HeaderStyles = {
    headerTitleStyle: {
        color: COLOR.headerTitle,
        fontSize: 20,
    },
    headerStyle: {
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
        borderBottomWidth: 0, // Just in case.
        backgroundColor: COLOR.primaryColor,
    },

};

export default HeaderStyles;