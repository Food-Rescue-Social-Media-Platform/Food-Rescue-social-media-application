import React, { Component } from 'react';
import { View, Text, StyleSheet, ImageBackground, TextInput, SectionList, TouchableOpacity, FlatList } from 'react-native';
import { useState } from 'react';
import ChatHeader from '../../components/header/ChatHeader';
import FooterChat from '../../components/footer/FooterChat';
import ListMessages from '../../components/chat/ListMessages';



const SingleChat = (props) => {
    // const data = props.route.params;
    const dataProps = '';

    const [msg , setMsg] = useState('');
    const [update , setUpdate] = useState(false);
    const [disable , setDisable] = useState(false);
    const [allChats , setAllChats] = useState([]);
    const [loading , setLoading] = useState(true);

    return (
        <View>
        <ChatHeader data = {dataProps}/>
        <ListMessages />
        </View>
    )
}

export default SingleChat;