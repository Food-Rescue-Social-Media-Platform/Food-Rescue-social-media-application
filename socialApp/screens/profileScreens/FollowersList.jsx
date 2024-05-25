import React from 'react';
import { StyleSheet, View } from 'react-native';
import UsersList from '../../components/usersLists/UsersList';
import { useDarkMode } from '../../styles/DarkModeContext';
import { COLORS, DARKCOLORS } from '../../styles/colors';

const FollowersList = ({ route }) => {
    const { userData } = route.params;
    const { isDarkMode } = useDarkMode();

    const themeColors = isDarkMode ? DARKCOLORS : COLORS;

    return (
        <View style={[styles.container, { backgroundColor: themeColors.appBackGroundColor }]}>
            <UsersList usersIds={userData.followersUsersId} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center', // Align items to the center
    },
});

export default FollowersList;
