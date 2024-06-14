
let maxDistance = 50000; // 50km



// 2. show posts from people I follow
export function postsMyFollowUsers(user) {
  const userFollowing = getAllFollowing(user);
  const posts = getPostsByIds(userFollowing);
  return posts;
}








////////////////////////// Helper functions //////////////////////////
function getAllFollowing(user) {
  const userFollowingIds = user.followingUsersId.map((userID) => get);
  return userFollowingIds;
}

function getPostsByIds(userFollowingIds) {
  const posts = [];
//   userFollowingIds.forEach((userId) => {
//     const posts = getUserPosts(userId);
//     posts.push(...userPosts);
//   });

  return posts;
}
