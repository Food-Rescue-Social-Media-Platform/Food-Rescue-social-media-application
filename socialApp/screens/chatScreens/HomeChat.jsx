import React, {  useState, useEffect, useContext } from 'react';
import { View, FlatList, StyleSheet, TextInput } from 'react-native';
import {ListItem, Avatar} from 'react-native-elements';
import {COLORS} from '../../styles/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {windowHeight, windowWidth} from '../../utils/Dimentions';
import { AuthContext } from '../../navigation/AuthProvider';
import { getListChats } from '../../FirebaseFunctions/collections/chat';
import { getDoc, doc } from 'firebase/firestore';
import { database } from '../../firebase';



const HomeChat = ({navigation}) => {
  const { user, logout } = useContext(AuthContext);
  const [ listChats , setListChats] = useState([]);
  const [search, setSearch] = useState('');
  const [ userConnected, setUserConnected ] = useState(false);

  useEffect(()=>{
    const fetchData = async () => {
      const user_data = await fetchUser(user.uid);
      user_data.id = user.uid;
      setUserConnected(user_data);
      getListChats(user.uid, setListChats);
    } 

    fetchData();
  },[]);


  const renderItem = ({ item })=> (
      <ListItem
          bottomDivider
          containerStyle={{ paddingVertical: 7, marginVertical: 2 }}
          onPress={() => navigation.navigate('SingleChat', {receiverData:item, userConnected:userConnected } )}
      >
      <Avatar
          source={{ uri: item.image }}
          rounded
          title={item.receiver}
          size="medium"
      />

      <ListItem.Content>
            <ListItem.Title style={{ fontSize: 14 }}>
              {item.receiver}
            </ListItem.Title>

            <ListItem.Subtitle numberOfLines={1} style={{ fontSize: 12 }}>
                {item.lastMsg}
            </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    );


    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>      
                <AntDesign name="search1" size={18} style={styles.searchIcon} />
                
                <TextInput style={styles.searchInput}
                    value={search}
                    onChangeText={(text)=> setSearch(text)}
                    placeholder='Search'
                    keyBoardType="string"
                />

            </View>

            <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={listChats}
                renderItem={renderItem}
            />
        </View>
      );
};

export default HomeChat;

const styles = StyleSheet.create({
      container:{
        backgroundColor: COLORS.white
      },  
      searchContainer : {
        width: windowWidth,
        rounded: 10,
        paddingHorizontal:10,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor: COLORS.lightGray,   
    }, 
      searchInput: {
        fontSize: 14,
        opacity: 1.7,
        height: windowHeight/18,
        width: windowWidth/1.8,
      },
      searchIcon:{
        marginRight: 10,
      } 
    });

  const fetchUser = async (id) => {
      try{
      const docRef = doc(database, "users", id);
      const docSnap = await getDoc(docRef);
      if(!docSnap.exists()) {
          return null;
      }
      return docSnap.data();
   } catch (error) {
      console.error("fetchUser, Error getting document:", error);
      return null;
   }
  }
  