import {View} from "react-native";

function ListMessages({ messages }) {
  return (
    <View>
      {messages.map((message) => (
        <View key={message.id}>{message.text}</View>
      ))}
    </View>
  );

}

export default ListMessages;