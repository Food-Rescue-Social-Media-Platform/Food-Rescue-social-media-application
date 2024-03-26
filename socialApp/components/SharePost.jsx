import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import { Button } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome5';
import {COLORS} from '../styles/colors';
import {windowHeight} from '../utils/Dimentions';
import { Image } from 'react-native';

const SharePost = () => {
    return (
        <View style={styles.container}> 
            <Image style={styles.profileImage} source={require('../assets/users/user-1.jpg')} />
            <View>
            <TouchableOpacity style={styles.sharePostWrapper} onPress={()=>{console.log('move to sharePost screen')}}>
            <Text style={styles.mainText}>Share food...</Text>
            </TouchableOpacity>
            
            <View style={styles.iconsWrapper}>
                <TouchableOpacity>
                 <FontAwesome6 name="images" size={21} color="black" style={styles.icon}/>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Entypo name="location-pin" size={21} color="black" style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Fontisto name="clock" size={19.5} color="black" style={styles.icon}/>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Entypo name="phone" size={21} color="black" style={styles.icon}/>
                </TouchableOpacity>
                <TouchableOpacity>
                    <MaterialIcons name="category" size={21} color="black" style={styles.icon}/>
                </TouchableOpacity>
                </View>
            </View>
      </View>
    );
  
  }

  const styles = StyleSheet.create({
    container: {
       width: '100%',
       height: windowHeight/7,
       backgroundColor: COLORS.secondaryTheme,
       flexDirection: 'row',      
    },
    sharePostWrapper:{
        width: '100%', 
        backgroundColor: COLORS.secondaryBackground,
        borderWidth: 0.5,
        borderRadius: 20,
        borderColor: COLORS.black,
        paddingVertical: 10,
        paddingHorizontal: 15,
        paddingRight: 120,
        marginLeft: 3,
        marginTop: 14,
        marginBottom: 8,
        justifyContent: 'center',
    },
    mainText : {
        fontSize: 15,
    },
    iconsWrapper:{
        flexDirection: 'row',
        justifyContent: 'start',
        marginLeft: 15,
    },

    icon:{
        marginHorizontal: 4,
    },
    profileImage:{
        width: 70,
        height: 70,
        borderRadius: 50,
        margin: 12,
    }
  });

  export default SharePost;