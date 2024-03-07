import { View, Text, StyleSheet, TouchableOpacity} from "react-native";
import  {COLORS}  from "../../styles/colors";
import AntDesign from 'react-native-vector-icons/MaterialCommunityIcons';

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
                <TouchableOpacity onPress={handlePressSmiley} style={styles.send}>
                    <AntDesign name='phone' size={23} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePressAttach} style={styles.send}>
                    <AntDesign name='phone' size={23} color="#666" />
                </TouchableOpacity>
                <View style={styles.windowSend} >
                    <Text>Send message...</Text>
                </View>
                <TouchableOpacity onPress={handlePressSendMsg} style={styles.send}>
                    <AntDesign name='phone' size={23} color="#666" />
                </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    container :{
        height: 60,
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.headerChat,
    },
    windowSend :{
        // flex: 1,
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        width: 300,
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




export default FooterChat;