import { View, Text, StyleSheet, TouchableOpacity} from "react-native";
import  {COLORS}  from "../../styles/colors";
import AntDesign from 'react-native-vector-icons/MaterialCommunityIcons';
import { windowHeight, windowWidth } from "../../utils/Dimentions";

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
                <View style={styles.windowSend} >
                    <Text>Send message...</Text>
                </View>
              
        </View>
    );
};


const styles = StyleSheet.create({
    container :{
        height: windowHeight / 12,
        width: '100%',
        flexDirection: 'row',
        // justifyContent: 'space-between',
        padding: 10,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.headerChat,
        position: 'absolute',
    },
    windowSend :{
        // flex: 1,
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        width: windowWidth / 1.4,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    send:{
         padding:5,
         backgroundColor: '#21231',
    },
});

// <TouchableOpacity onPress={handlePressSmiley} style={styles.send}>
//                     <AntDesign name='phone' size={23} color="#666" />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={handlePressAttach} style={styles.send}>
//                     <AntDesign name='phone' size={23} color="#666" />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={handlePressSendMsg} style={styles.send}>
//                 <AntDesign name='phone' size={23} color="#666" />
//             </TouchableOpacity>


export default FooterChat;