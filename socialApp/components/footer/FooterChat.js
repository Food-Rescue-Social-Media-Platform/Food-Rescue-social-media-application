import { View, Text, StyleSheet, TouchableOpacity} from "react-native";
import  {COLORS}  from "../../styles/colors";
import AntDesign from 'react-native-vector-icons/MaterialCommunityIcons';
import { windowHeight, windowWidth } from "../../utils/Dimentions";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const FooterChat = (props) => {

   const handlePressSendMsg = () => {
    console.log('Send message...');
   }

   const handlePressSmiley = () => { 
     console.log('Send smiley...');
   }

   const handlePressAttach = () => {
    console.log('Send attach...');
   }

    return(
        <View  style={styles.container}> 
        <Octicons name="smiley" size={24} style={styles.smiley}/> 
        <MaterialIcons name="attach-file" size={24} style={styles.attachment}/>            
            <View style={styles.windowSend} >
                <Text>Send message...</Text>
            </View>
            <MaterialCommunityIcons name="send" size={25} style={styles.send}/>          
        </View>
    );
};


const styles = StyleSheet.create({
    container :{
        height: windowHeight / 12,
        flexDirection: 'row',
        padding: 10,
        backgroundColor: COLORS.headerChat,
    },
    attachment:{
        padding: 5,
    },
    smiley:{
        padding: 5,
    },
    windowSend :{
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        width: windowWidth / 1.5,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    send:{
         marginLeft: 10,
         marginTop:5  
      },
});


export default FooterChat;