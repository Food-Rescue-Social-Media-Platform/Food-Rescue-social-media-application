// import {Container} from 'native-base';
import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TextInput } from 'react-native';
import {ListItem, Avatar} from 'react-native-elements';
import {COLORS} from '../../styles/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {windowHeight, windowWidth} from '../../utils/Dimentions';
import { useSelector } from 'react-redux';
import { db } from '../../firebase';
import { ref  } from 'firebase/database';
import { onValue } from '@firebase/database';


const listData = [
  {
    name: 'Amy Farha',
    avatar_url:
      'https://images.pexels.com/photos/2811087/pexels-photo-2811087.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    subtitle: 'Hey there, how are you?',
  },
  {
    name: 'Chris Jackson',
    avatar_url:
      'https://images.pexels.com/photos/3748221/pexels-photo-3748221.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    subtitle: 'Where are you?',
  },
  {
    name: 'Jenifar Lawrence',
    avatar_url:
      'https://m.media-amazon.com/images/M/MV5BOTU3NDE5MDQ4MV5BMl5BanBnXkFtZTgwMzE5ODQ3MDI@._V1_.jpg',
    subtitle: 'I am good, how are you?',
  },
  {
    name: 'Tom Holland',
    avatar_url:
      'https://static.toiimg.com/thumb.cms?msid=80482429&height=600&width=600',
    subtitle: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
  },
  {
    name: 'Robert',
    avatar_url:
      'https://expertphotography.b-cdn.net/wp-content/uploads/2020/05/male-poses-squint.jpg',
    subtitle: 'Where does it come from?',
  },
  {
    name: 'downey junior',
    avatar_url:
      'https://www.apetogentleman.com/wp-content/uploads/2018/06/male-models-marlon.jpg',
    subtitle: 'Where can I get some?',
  },
  {
    name: 'Ema Watson',
    avatar_url:
      'https://images.unsplash.com/photo-1503104834685-7205e8607eb9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bW9kZWx8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80',
    subtitle: 'I am good, how are you?',
  },
  {
    name: 'Chris Jackson',
    avatar_url:
      'https://images.pexels.com/photos/3748221/pexels-photo-3748221.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
    subtitle: ' If you use this site regularly and would like to help keep the site',
  },
  {
    name: 'Jenifar Lawrence',
    avatar_url:
      'https://m.media-amazon.com/images/M/MV5BOTU3NDE5MDQ4MV5BMl5BanBnXkFtZTgwMzE5ODQ3MDI@._V1_.jpg',
    subtitle: 'Why do we use it?',
  },
  {
    name: 'Tom Holland',
    avatar_url:
      'https://static.toiimg.com/thumb.cms?msid=80482429&height=600&width=600',
    subtitle: ' If you use this site regularly and would like to help keep the site',
  },
  {
    name: 'BB',
    avatar_url:
    'https://m.media-amazon.com/images/M/MV5BOTU3NDE5MDQ4MV5BMl5BanBnXkFtZTgwMzE5ODQ3MDI@._V1_.jpg',
    subtitle: ' What is Lorem Ipsum?',
  },
];


const HomeChat = ({navigation}) => {

const  userData  = useSelector(state => state.user.userData);
console.log('userData: ', userData);  
const [ listChats , setListChats] = useState([]);

const [search, setSearch] = useState('');

useEffect(()=>{
   getChatList(); 
},[]);


const getChatList = async () => {
  try{
   const docRef = ref(db, "chatsList/" + userData.id);
   onValue(docRef, (snapshot) => {
      const data = snapshot.val();
      if(!data) return console.log('-No data found');
      console.log('data: ', Object.values(snapshot.val()));
      setListChats(Object.values(snapshot.val()));
   });
  } catch (error){
    console.log('Error fetching document: ', error);
  }
};


const renderItem = ({ item }) => (
  <ListItem
    bottomDivider
    containerStyle={{ paddingVertical: 7, marginVertical: 2 }}
    onPress={() => navigation.navigate('SingleChat', {chatData: item, receiverData:''} )}
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
        placeholder='Search User'
        keyBoardType="string"
    />
    </View>
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