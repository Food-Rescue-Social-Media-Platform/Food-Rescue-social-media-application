import SingleChat from "./SingleChat";
import { View } from "react-native";
import ListChats from "./ListChats";


const index = ()=>  {
  return(
    <View>
        <ListChats/>
        <SingleChat/>
    </View>
  );
}

export default index;