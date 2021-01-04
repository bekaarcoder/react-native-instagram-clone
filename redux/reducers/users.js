import {
  USERS_DATA_STATE_CHANGE,
  USERS_POSTS_STATE_CHANGE,
} from "../constants";

const initialState = {
  users: [],
  usersLoaded: 0,
};

export const users = (state = initialState, action) => {
  switch (action.type) {
    case USERS_DATA_STATE_CHANGE:
      return {
        ...state,
        users: [...state.users, action.payload],
      };
    case USERS_POSTS_STATE_CHANGE:
      return {
        ...state,
        usersLoaded: state.usersLoaded + 1,
        users: state.users.map((user) =>
          user.uid === action.payload.uid
            ? { ...user, posts: action.payload.posts }
            : user
        ),
      };
    default:
      return state;
  }
};
