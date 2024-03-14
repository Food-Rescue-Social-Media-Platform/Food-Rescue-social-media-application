import React,{useContext, useState} from 'react';
import {View, StyleSheet,Text} from 'react-native';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import { Button } from 'react-native-elements';


const HomeScreen = ({navigation}) => {
    const {user,logout} = useContext(AuthContext);

    const [clickChat, setClickChat] = useState(false);

    const handleClickChat = () => {
       navigation.navigate('Chats');
    }

    const createChat = () => {
        const receiver = 'PKJjhLY5iYeRcnjuoJssnUF4eIh1'
        navigation.navigate('SingleChat', { receiver });
    }
   
    return (
        <View style={styles.container}>
        <Button title='Chat' onPress={handleClickChat}/>
        <Button title='Create Chat' onPress={createChat}/>
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

