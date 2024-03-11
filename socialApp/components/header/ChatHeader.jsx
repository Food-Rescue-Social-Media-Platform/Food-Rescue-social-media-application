import { View, Text, Image, StyleSheet, Button, StatusBar } from "react-native";
import { useState } from "react";
import {COLORS} from "../../styles/colors";
import { windowHeight } from "../../utils/Dimentions";
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Fontisto from 'react-native-vector-icons/Fontisto';

const ChatHeader = ({isSingleChatPage, user ,showOptionsIcon = true ,onOptionsClick, onReturnClick}) => {
    const [userName , setUserName] = useState(user?.userName || 'eliyahu');
    const [userImage , setUserImage] = useState('https://www.elitesingles.co.uk/wp-content/uploads/sites/59/2019/11/2b_en_articleslide_sm2-350x264.jpg');

    return(
        <View style={styled.container}>
            <Fontisto name="angle-left" size={20} onPress={()=>{onReturnClick}}/>   
            <StatusBar barStyle="light-content" backgroundColor={COLORS.theme} translucent={false} />
            { isSingleChatPage ? (<Image style={styled.profileImg} src={userImage}/>): null}
            <Text style={[isSingleChatPage? (styled.userName):(styled.chatHome)]}>{userName}</Text>
            { showOptionsIcon? (<FontAwesome6 name="ellipsis-vertical" size={20} onPress={()=>{onOptionsClick}}/>): null}
         </View>
    );
};


const styled = StyleSheet.create({
    container:{
      height: windowHeight/12,
      backgroundColor: COLORS.headerChat,
      flexDirection: 'row',
      alignItems: 'center',  
    },
    profileImg:{
        width: 45,
        height: 45,
        borderRadius: 50,
        margin: 10
    },
    userName:{
        fontSize: 20,
        marginLeft: 7,
        width: "70%"
    },
    chatHome:{
        fontSize: 20,
        marginLeft: 20,
        width: "75%"
    }
});


export default ChatHeader;