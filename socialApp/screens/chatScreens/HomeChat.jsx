import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, StyleSheet, Text, Platform, RefreshControl } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import { windowHeight, windowWidth } from '../../utils/Dimentions';
import { AuthContext } from '../../navigation/AuthProvider';
import { getListChats } from '../../FirebaseFunctions/collections/chat';
import { getDoc, doc } from 'firebase/firestore';
import { database } from '../../firebase';
import { useDarkMode } from '../../styles/DarkModeContext';
import { useTranslation } from 'react-i18next';
// import { COLORS, DARKCOLORS } from '../../styles/colors';

const HomeChat = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [listChats, setListChats] = useState([]);
  // const [search, setSearch] = useState('');
  const [userConnected, setUserConnected] = useState(null);
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useDarkMode();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const user_data = await fetchUser(user.uid);
    user_data.id = user.uid;
    setUserConnected(user_data);
    getListChats(user.uid, setListChats);
    setIsLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <ListItem
      bottomDivider
      containerStyle={{ ...styles.listItem, backgroundColor: theme.listItemBackground }}
      onPress={() => navigation.navigate('SingleChat', { receiverData: item, userConnected })}
    >
      {item.image ? (
        <Avatar source={{ uri: item.image }} rounded title={item.receiver} size="medium" />
      ) : (
        <Avatar source={require('../../assets/Images/emptyUserProfieImage.jpeg')} title={item.receiver} size="medium" rounded />
      )}

      <ListItem.Content>
        <ListItem.Title style={{ ...styles.listItemTitle, color: theme.primaryText }}>
          {item.receiver}
        </ListItem.Title>

        <ListItem.Subtitle numberOfLines={1} style={{ ...styles.listItemSubtitle, color: theme.primaryText }}>
          {item.lastMsg}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );

  const ListEmptyComponent = () => {
    if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: '50%' }}>
        <Entypo name="chat" size={80} color={theme.primaryText} />
        <Text style={[styles.boldText, { color: theme.primaryText }]}>{t('Nothing to see here')}</Text>
        <Text style={[styles.normalText, { color: theme.primaryText }]}>
          {t('Start a conversation with any of the users.\nYour chats will show here')}
        </Text>
      </View>
    );
    }
  };

  return (
    <View style={{ ...styles.container, backgroundColor: theme.appBackGroundColor }}>
      <FlatList 
        keyExtractor={(item, index) => index.toString()} 
        data={listChats} 
        renderItem={renderItem} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primaryText}
          />
        }
        ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );
};

export default HomeChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      web: {
        width: '70%',
        maxWidth: 500,
        alignSelf: 'left',
      }
    })
  },
  searchContainer: {
    width: windowWidth,
    borderRadius: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    fontSize: 14,
    opacity: 1.7,
    height: windowHeight / 18,
    width: windowWidth / 1.8,
  },
  searchIcon: {
    marginRight: 10,
  },
  listItem: {
    paddingVertical: 7,
    marginVertical: 2,
  },
  listItemTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  listItemSubtitle: {
    fontSize: 12,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 20,
    padding: 10,
    marginTop: 7,
  },
  normalText: {
    fontSize: 15,
  },
});

const fetchUser = async (id) => {
  try {
    const docRef = doc(database, "users", id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }
    return docSnap.data();
  } catch (error) {
    console.error("fetchUser, Error getting document:", error);
    return null;
  }
};
