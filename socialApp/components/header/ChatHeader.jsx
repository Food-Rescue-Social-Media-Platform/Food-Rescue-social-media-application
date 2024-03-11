import { View, Text, Image, StyleSheet, Button, StatusBar } from "react-native";
import { useState } from "react";
import {COLORS} from "../../styles/colors";
import { windowHeight } from "../../utils/Dimentions";
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

const ChatHeader = (props) => {
    const { data } = props;

    const [userName , setUserName] = useState(data);
    const [userImage , setUserImage] = useState('https://www.elitesingles.co.uk/wp-content/uploads/sites/59/2019/11/2b_en_articleslide_sm2-350x264.jpg');

    const handleClickOptions = () => {
       console.log('Options Clicked');
    }

    return(
        <View style={styled.container}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.theme} translucent={false} />
            { data !== 'Chat' ? (<Image style={styled.profileImg} src={userImage}/>): null}
            <Text style={[data === 'Chat'? (styled.chatHome):(styled.userName)]}>{userName}</Text>
            { data !== 'Chat' ? (<FontAwesome6 name="ellipsis-vertical" size={20} onPress={()=>{handleClickOptions}}/>): null}
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
        marginLeft: 10,
        width: "77%"
    },
    chatHome:{
      fontSize: 20,
      marginLeft: 20,
    }
});


export default ChatHeader;