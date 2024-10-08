import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MsgComponent from "../../components/chat/MsgComponent";
import { windowHeight, windowWidth } from "../../utils/Dimentions";
import { Message, addMessage, startListeningForMessages } from '../../FirebaseFunctions/collections/message';
import { openGalereAndSelectImages, openCameraAndTakePicture } from '../../hooks/OperationComponents/OpeningComponentsInPhone';
// import { AuthContext } from '../../navigation/AuthProvider';
import { useDarkMode } from '../../styles/DarkModeContext'; // Import the dark mode context
// import { COLORS, DARKCOLORS } from '../../styles/colors';
import { useTranslation } from 'react-i18next';

const SingleChat = ({ navigation }) => {
    const route = useRoute();
    // const { user } = useContext(AuthContext);
    const receiverData = route.params.receiverData;
    const userData = route.params.userConnected; 
    const [allMessages, setAllMessages] = useState([]);
    const [msg, setMsg] = useState('');
    const [images, setImages] = useState([]);
    const chatContainerRef = useRef(null);
    const { theme } = useDarkMode(); // Use full context
    const { t } = useTranslation();

  useEffect(() => {
    chatContainerRef.current?.scrollToEnd({ animated: true });
    let unsubscribe;

    const listener = async () => {
      unsubscribe = await startListeningForMessages(
        receiverData.roomID,
        setAllMessages,
      );
    };

    listener();

    return () => unsubscribe(); // Call the unsubscribe function if it exists
  }, [receiverData.roomID]);

  const sendMsg = async () => {
    if (msg === "" && images.length === 0) return;
    const message = new Message(msg, images, userData.id, receiverData.id);
    await addMessage(
      message,
      receiverData.roomID,
      userData,
      receiverData.id,
      setMsg,
      setImages 
    );

      setMsg("");
      setImages([]);
  };

  const onPressAttach = () => {
    openGalereAndSelectImages(setImages);
  };

  const handleOpenCamera = async () => {
    openCameraAndTakePicture(setImages);
  };

  return (
    <View style={{ ...styles.container, backgroundColor: theme.appBackGroundColor }}>
        <FlatList
            ref={chatContainerRef}
            onContentSizeChange={() => chatContainerRef.current?.scrollToEnd({ animated: true })}
            keyExtractor={(item, index) => index.toString()}
            data={allMessages}
            renderItem={({ item }) => <MsgComponent item={item} />}
            showsVerticalScrollIndicator={false}
        />

        <View style={{ ...styles.containerFooter, backgroundColor: theme.secondaryTheme }}>
            <TouchableOpacity style={styles.icon} onPress={onPressAttach}>
                <MaterialIcons name="attach-file" size={24} color={theme.iconColor} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon} onPress={handleOpenCamera}>
                <MaterialCommunityIcons name="camera" size={24} color={theme.iconColor} />
            </TouchableOpacity>

            <View style={{ ...styles.windowSend, backgroundColor: theme.white }}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                    <TextInput
                        autoFocus={true}
                        placeholder={t('Send message...')}
                        onChangeText={val => setMsg(val)}
                        multiline={true}
                        numberOfLines={10}
                        value={msg}
                        style={{
                            color: theme.primaryText,
                            fontSize: 16,
                            flex: 1,
                            aspectRatio: 10,
                            minHeight: Platform.OS === 'web' ? 50 : 200,
                        }}
                        placeholderTextColor={theme.primaryText} // Set placeholder color to theme.primaryText
                        returnKeyType="send"
                        blurOnSubmit={false}
                        onSubmitEditing={sendMsg}
                        maxLength={1000}
                        textAlignVertical="top"
                        autoCapitalize="sentences"
                        autoCorrect={true}
                        accessibilityLabel={t('Message input field')}
                        accessibilityHint={t('Enter your message here')}
                    />
                </ScrollView>
            </View>

            <MaterialCommunityIcons name="send" onPress={sendMsg} size={25} style={styles.send} color={theme.iconColor} />
        </View>
    </View>
);
};

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    width: "100%",
    height: "100%",
    ...Platform.select({
      web: {
        width: "60%",
        alignSelf: "center",
      },
    })
  },
  containerFooter: {
    height: windowHeight / 10,
    alignItems: "center",
    flexDirection: "row",
    marginTop: 5,
    padding: 5,
    bottom: 5,
  },
  windowSend: {
    flex: 1,
    height: windowHeight / 13,
    flexDirection: "row",
    alignItems: "center",
    bottom: 0,
    paddingHorizontal: 15,
    paddingVertical: 2,
    marginLeft: 5,
    marginVertical: 2,
    width: windowWidth / 1.45,
    borderRadius: 20,
  },
  icon: {
    margin: 4,
  },
  send: {
    marginLeft: 10,
    marginTop: 5,
  },
});

export default SingleChat;
