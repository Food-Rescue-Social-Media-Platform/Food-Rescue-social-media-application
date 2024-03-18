import React,{useContext} from 'react';
import {View, StyleSheet,Text,TouchableOpacity} from 'react-native';
import FormButton from '../components/FormButton';
import { AuthContext } from '../navigation/AuthProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { Container,Card, UserInfo, UserImg, UserName, PostTime, UserInfoText, PostText, PostImg, InteractionWrapper, Divider} from '../styles/feedStyles';

const HomeScreen = () => {
    const {user,logout} = useContext(AuthContext);
    return (
        <Container>
            <Card>
                <View style={{
                        
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}>
                            <UserInfo>
                        <UserImg source={require('../assets/users/user-1.jpg')}/>
                        <UserInfoText>
                            <UserName>mohammad salah</UserName>
                            <PostTime>4 hours ago</PostTime>
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

                <PostImg source={require('../assets/posts/post-img-7.jpg')}/>
                <InteractionWrapper>
                    
                    <View style={styles.iconsWrapper}>
                        <MaterialCommunityIcons
                        name="cupcake"
                        size={22}
                        />  
                        <Text style={styles.text}>milky</Text>                  
                    </View>
                    <View style={styles.iconsWrapper}>
                        <MaterialCommunityIcons
                        name="clock"
                        size={22}
                        />  
                        <Text style={styles.text}>Today - 13:50 AM</Text>                  
                    </View>
                    <View style={styles.iconsWrapper}>
                        <MaterialCommunityIcons
                        name="map-marker"
                        size={22}
                        />  
                        <Text style={styles.text}>0.8 KM </Text>                  
                    </View>
                </InteractionWrapper>
                <PostText>a pancakes 3 boxes. after a big party. we have these pancakes left,
                          delicious pancakes that we made by pancakes lovers hands.
                </PostText>
            </Card>
            <Card>
                <View style={{
                        
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}>
                            <UserInfo>
                        <UserImg source={require('../assets/users/user-1.jpg')}/>
                        <UserInfoText>
                            <UserName>mohammad salah</UserName>
                            <PostTime>4 hours ago</PostTime>
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
                <Divider></Divider>
                {/* <PostImg source={require('../assets/posts/post-img-7.jpg')}/> */}
                <InteractionWrapper>
                    
                    <View style={styles.iconsWrapper}>
                        <MaterialCommunityIcons
                        name="cupcake"
                        size={22}
                        />  
                        <Text style={styles.text}>milky</Text>                  
                    </View>
                    <View style={styles.iconsWrapper}>
                        <MaterialCommunityIcons
                        name="clock"
                        size={22}
                        />  
                        <Text style={styles.text}>Today - 13:50 AM</Text>                  
                    </View>
                    <View style={styles.iconsWrapper}>
                        <MaterialCommunityIcons
                        name="map-marker"
                        size={22}
                        />  
                        <Text style={styles.text}>0.8 KM</Text>                  
                    </View>
                </InteractionWrapper>
                <PostText>a pancakes 3 boxes. after a big party. we have these pancakes left,
                          delicious pancakes that we made by pancakes lovers hands.
                </PostText>
            </Card>
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

