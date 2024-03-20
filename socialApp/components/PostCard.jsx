import React,{useContext} from 'react';
import {View, StyleSheet,Text,TouchableOpacity} from 'react-native';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { Container,Card, UserInfo, UserImg, UserName, PostTime, UserInfoText, PostText, PostImg, InteractionWrapper, Divider} from '../styles/feedStyles';

const PostCard = ({item}) => {
    return (
        <Card>
        <View style={{
                
                flexDirection: "row",
                justifyContent: "space-between",
            }}>
                    <UserInfo>
                <UserImg source={item.userImg}/>
                <UserInfoText>
                    <UserName>{item.userName}</UserName>
                    <PostTime>{item.postTime}</PostTime>
                </UserInfoText>
                </UserInfo>
                <TouchableOpacity style={{
                    paddingTop:25,
                    paddingRight:20}}>
                    <SimpleLineIcons
                    name="options"
                    size={24}
                    />
                </TouchableOpacity>
                
                                 
        </View>

        {item.postImg != 'none' ? <PostImg source={item.postImg}/> : <Divider/>}
        <InteractionWrapper>
            
            <View style={styles.iconsWrapper}>
                <MaterialCommunityIcons
                name="cupcake"
                size={22}
                />  
                <Text style={styles.text}>{item.postCategories}</Text>                  
            </View>
            <View style={styles.iconsWrapper}>
                <MaterialCommunityIcons
                name="clock"
                size={22}
                />  
                <Text style={styles.text}>{item.postDate}</Text>                  
            </View>
            <View style={styles.iconsWrapper}>
                <MaterialCommunityIcons
                name="map-marker"
                size={22}
                />  
                <Text style={styles.text}>{item.postDistance}</Text>                  
            </View>
        </InteractionWrapper>
        <PostText>{item.postText}
        </PostText>
    </Card>
    );
}

export default PostCard;

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