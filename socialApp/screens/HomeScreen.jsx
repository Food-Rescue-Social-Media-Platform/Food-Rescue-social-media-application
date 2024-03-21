import React,{useContext, useState} from 'react';
import {View, StyleSheet,Text} from 'react-native';
import FormButton from '../components/FormButton';
import Chat from './chat/Chat';
import { AuthContext } from '../navigation/AuthProvider';
import { useSelector } from 'react-redux';
import { ref  } from 'firebase/database';
import { db } from '../firebase';
import { getDoc, doc } from 'firebase/firestore';
import { database } from '../firebase';
import { onValue } from '@firebase/database';


const HomeScreen = () => {
    const {user,logout} = useContext(AuthContext);
    
    return (
        <View style={styles.container}>
        <Chat/>
        <Text style={styles.text}>Welcome {user.uid}</Text>
            <FormButton buttonTitle='Logout' onPress={() => logout()} />
        </View>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f9fafd',
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 20,
        color: '#333333'
    }
});

