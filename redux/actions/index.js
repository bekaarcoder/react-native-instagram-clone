import firebase from "firebase";
import {
  CLEAR_USER_DATA,
  USERS_DATA_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  USER_POSTS_STATE_CHANGE,
  USER_STATE_CHANGE,
} from "../constants/index";

export const fetchUser = () => (dispatch) => {
  firebase
    .firestore()
    .collection("users")
    .doc(firebase.auth().currentUser.uid)
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log(doc.data());
        dispatch({
          type: USER_STATE_CHANGE,
          payload: doc.data(),
        });
      } else {
        console.log("User does not exist");
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const fetchUserPosts = () => (dispatch) => {
  firebase
    .firestore()
    .collection("posts")
    .doc(firebase.auth().currentUser.uid)
    .collection("userPosts")
    .orderBy("date_created", "asc")
    .get()
    .then((snapshot) => {
      let posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(posts);
      dispatch({
        type: USER_POSTS_STATE_CHANGE,
        payload: posts,
      });
    });
};

export const fetchUserFollowing = () => (dispatch) => {
  firebase
    .firestore()
    .collection("following")
    .doc(firebase.auth().currentUser.uid)
    .collection("userFollowing")
    .onSnapshot((snapshot) => {
      let following = snapshot.docs.map((doc) => doc.id);
      dispatch({
        type: USER_FOLLOWING_STATE_CHANGE,
        payload: following,
      });

      // fetch each of the following user's data
      following.forEach((id) => dispatch(fetchUsersData(id)));
    });
};

export const fetchUsersData = (uid) => (dispatch, getState) => {
  const found = getState().usersState.users.some((user) => user.uid === uid);

  if (!found) {
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          let user = doc.data();
          user.uid = doc.id;

          dispatch({
            type: USERS_DATA_STATE_CHANGE,
            payload: user,
          });
          dispatch(fetchUsersFollowingPosts(user.uid));
        } else {
          console.log("User does not exists.");
        }
      });
  }
};

export const fetchUsersFollowingPosts = (uid) => (dispatch, getState) => {
  firebase
    .firestore()
    .collection("posts")
    .doc(uid)
    .collection("userPosts")
    .orderBy("date_created", "asc")
    .get()
    .then((snapshot) => {
      const uid = snapshot.query.EP.path.segments[1];
      const user = getState().usersState.users.find((el) => el.uid === uid);

      let posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        user: user,
      }));

      dispatch({
        type: USERS_POSTS_STATE_CHANGE,
        payload: { uid, posts },
      });
      console.log(getState());
    });
};

export const clearUserData = () => (dispatch) => {
  dispatch({
    type: CLEAR_USER_DATA,
  });
};
