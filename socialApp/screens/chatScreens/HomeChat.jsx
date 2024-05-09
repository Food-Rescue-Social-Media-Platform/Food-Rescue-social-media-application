import React, {  useState, useEffect, useContext } from 'react';
import { View, FlatList, StyleSheet, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import {ListItem, Avatar} from 'react-native-elements';
import {COLORS} from '../../styles/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {windowHeight, windowWidth} from '../../utils/Dimentions';
import { useSelector } from 'react-redux';
import { db } from '../../firebase';
import { ref  } from 'firebase/database';
import { onValue } from '@firebase/database';
import { AuthContext } from '../../navigation/AuthProvider';
import { getListChats } from '../../FirebaseFunctions/collections/chat';



const HomeChat = ({navigation}) => {
  const { userId , logout } = useContext(AuthContext);
  const [ listChats , setListChats] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(()=>{
    getListChats(userId, setListChats); 
  },[]);


    // const getChatList = async () => {
    //   try{
    //   const docRef = ref(db, "chatsList/" + userId);
    //   console.log('docRef: ', docRef);
    //   onValue(docRef, (snapshot) => {
    //       const data = snapshot.val();
    //       if(!data) return console.log('-No data found');
    //       console.log('chatList: ', Object.values(data));
    //       setListChats(Object.values(snapshot.val()));//todo
    //   });
    //   } catch (error){
    //     console.log('Error fetching document: ', error);
    //   }
    // };


    const renderItem = ({ item })=> (
      <ListItem
        bottomDivider
        containerStyle={{ paddingVertical: 7, marginVertical: 2 }}
        onPress={() => navigation.navigate('SingleChat', {chatData: item, receiverId:'', userName:item.receiver} )}
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

    const createChat = () => {
      const receiverId = '2YzEk9svzTNpvFlYKfSNAes5I1x1';
      navigation.navigate('SingleChat', {chatData:'', receiverId: receiverId});
    }

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
        <Button title='Create Chat' onPress={createChat}/>

        <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={listChats}
            renderItem={renderItem}
        />
        <View>
        </View>
        </View>
      );
    };

    export default HomeChat;

    const styles = StyleSheet.create({
      container:{
        backgroundColor: COLORS.white
      },  
      searchContainer : {
        width: windowWidth/1.1,
        rounded: 10,
        paddingHorizontal:10,
        flexDirection:'row',
        alignItems:'center',
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