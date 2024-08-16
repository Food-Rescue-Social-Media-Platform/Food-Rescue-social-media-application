import { StyleSheet, FlatList, ActivityIndicator, RefreshControl, View, Text } from 'react-native';
import PostCard from '../postCard/PostCard';


const PostsList = ({posts, loadMore, loadingMore, position, refreshing, onRefresh, isProfilePage, isMapPostCard, theme}) => (
    <FlatList
        data={posts}
        style={{ width: '100%' }}
        renderItem={({ item, index }) => {
            if (item && item.id) 
                return <PostCard 
                            key={item.id} 
                            item={item} 
                            postUserId={item.userId} 
                            isProfilePage={isProfilePage}
                            isMapPostCard={false}
                            userLocation={position} 
                        />;
             else 
                return null;
    
        }}
        keyExtractor={(item, index) => item.id ? item.id : index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.primaryText}
            />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={loadingMore && <ActivityIndicator size="large" color={theme.primaryText} />}
        ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
            { position &&
                <Text style={{ color: theme.primaryText }}>No posts available. Pull down to refresh.</Text>
                }
            </View>
        )}
    /> 
)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyContainer:{
        flex: 1,
        marginTop: '50%',
        alignItems: 'center',
        justifyContent: 'center',
    }
});


export default PostsList;