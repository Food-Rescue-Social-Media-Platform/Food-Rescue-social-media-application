import { View, Image, Text, StyleSheet } from "react-native";

function CardMap(item) {
  
  return (
    <View>
        <Text style={styles.title}>{item.title}</Text>
        {item.image && <Image  
            source={{ uri: item.image }}
            style={styles.image}>
        </Image>}
    </View>
  );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    image: {
        width: 100,
        height: 100,
    },
});

export default CardMap;
