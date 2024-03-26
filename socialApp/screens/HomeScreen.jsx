import React,{useContext} from 'react';
import {View, StyleSheet,Text} from 'react-native';
import FormButton from '../components/FormButton';
import Chat from './chat/Chat';
import { AuthContext } from '../navigation/AuthProvider';

const Posts = [
  {
    id: '1',
    userName: 'Mohammad Salah',
    userImg: require('../assets/users/user-1.jpg'),
    postTime: '4 mins ago',
    postText:
      'a pancakes 3 boxes. after a big party. we have these pancakes left, delicious pancakes that we made by pancakes lovers hands.',
    postImg: require('../assets/posts/post-img-7.jpg'),
    category: 'milky',
    postDate: 'Today - 13:50 AM',
    postDistance: '0.8 KM',
  },
  {
    id: '2',
    userName: 'John Doe',
    userImg: require('../assets/users/user-2.jpg'),
    postTime: '2 hours ago',
    postText:
      'a large plate of pizza.',
    postImg: require('../assets/posts/post-img-1.jpg'),
    category: 'milky',
    postDate: 'Today - 12:55 AM',
    postDistance: '14 KM',
  },
  {
    id: '3',
    userName: 'Ken William',
    userImg: require('../assets/users/user-4.jpg'),
    postTime: '1 hours ago',
    postText:
      'a four delicious sweets tupperware boxes. after a big party. we have these sweets left that no one has touched, clean and tasty.',
    postImg: require('../assets/posts/post-img-3.jpg'),
    category: 'milky',
    postDate: 'Today - 11:00 PM',
    postDistance: '5.4 KM',
  },
  {
    id: '4',
    userName: 'Selina Paul',
    userImg: require('../assets/users/user-6.jpg'),
    postTime: '1 day ago',
    postText:
      'a delicious salat tupperware boxes. after a big party. we have these salats left that no one has touched, clean and tasty.',
    postImg: require('../assets/posts/post-img-2.jpg'),
    category: 'vegetables',
    postDate: 'yesterday - 08:45 AM',
    postDistance: '3 KM',
  },
  {
    id: '5',
    userName: 'Christy Alex',
    userImg: require('../assets/users/user-7.jpg'),
    postTime: '1 day ago',
    postText:
    'a pancakes 1 boxe. after a big party.',
    postImg: require('../assets/posts/post-img-5.jpg'),
    category: 'milky',
    postDate: 'yesterday - 17:30 AM',
    postDistance: '1 KM',
  },
  {
      id: '6',
      userName: 'Christy Alex',
      userImg: require('../assets/users/user-7.jpg'),
      postTime: '1 day ago',
      postText:
      'a large plate of stackes and meats on BBQ.',
      postImg: require('../assets/posts/post-img-4.jpg'),
      category: 'meat',
      postDate: 'yesterday - 17:30 AM',
      postDistance: '1 KM',
    },
    {
      id: '7',
      userName: 'Ken William',
      userImg: require('../assets/users/user-4.jpg'),
      postTime: '1 hours ago',
      postText:
        'box of sushi',
      postImg: 'none',
      category: 'fish',
      postDate: 'Today - 11:00 PM',
      postDistance: '5.4 KM',
    },
];


const HomeScreen = () => {
    const {user,logout} = useContext(AuthContext);
    
    return (
      <Container>
      <FlatList 
          data={Posts}
          renderItem={({item}) => <PostCard item={item}/>}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
              
      />
     <FormButton buttonTitle='Logout' onPress={() => logout()} />
  </Container>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    text: {
        fontSize: 12,
        color: "black"
    },

    iconsWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }
});

