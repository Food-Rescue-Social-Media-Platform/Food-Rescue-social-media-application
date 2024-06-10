import { getPostsByCategory, getPostsByDistance } from "../../FirebaseFunctions/collections/post";

let maxDistance = 50000; // 50km

// 1. show posts close me (distance)
export function postsCloseMe(center, radiusInM, user) {
//   if (!center || !user || !radiusInM || radiusInM <= 0 || !user.id || radiusInM > maxDistance) {
//         return [];
//   }
//   const posts = getPostsByDistance(center, radiusInM, user.id);
//   return posts;
return [];
}

// 2. show posts from people I follow
export function postsMyFollowUsers(user) {
  const userFollowing = getAllFollowing(user);
  const posts = getPostsByIds(userFollowing);
  return posts;
}

// 3. show posts with filters of category (category[])).
export function postsByCategory(category) {
  const posts = getPostsByCategory(category);
  return posts;
}


// 4. show posts with filters of status







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
