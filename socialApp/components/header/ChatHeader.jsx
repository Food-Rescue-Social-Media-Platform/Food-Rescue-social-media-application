import { View, Text, Image, StyleSheet, StatusBar } from "react-native";
import { useState } from "react";
import {COLORS} from "../../styles/colors";
import FontAwesomeIcon from 'react-native-vector-icons/MaterialCommunityIcons';


// import dotsThreeVertical from 'react-native-vector-icons/AntDesign';
const ChatHeader = (props) => {
    const { data } = props;

    const [userName , setUserName] = useState('Eliyahu');
    const [userImage , setUserImage] = useState('https://www.elitesingles.co.uk/wp-content/uploads/sites/59/2019/11/2b_en_articleslide_sm2-350x264.jpg');

    return(
        <View style={styled.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.theme} translucent={false} />
         <Image style={styled.profileImg} src={userImage}/>
         <Text style={styled.userName}>{userName}</Text>
        </View>
    );
};

const styled = StyleSheet.create({
    container:{
      height: 70,
      backgroundColor: COLORS.headerChat,
      elevation: 5,
      flexDirection: 'row',
      alignItems: 'center',  
    },
    profileImg:{
        width: 50,
        height: 50,
        borderRadius: 50,
        margin: 10
    },
    userName:{
        fontSize: 20,
        marginLeft: 10,
    }
});


export default ChatHeader;