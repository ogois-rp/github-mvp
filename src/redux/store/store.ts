import { configureStore } from "@reduxjs/toolkit";
import reposCollection from "../githubApi/repos/collection-slice";
import { usersReducer } from "../githubApi/users/collection-slice";
import { searchReducer } from '../githubApi/search/collection-slice'

export const store = configureStore({
	reducer: { reposCollection, usersReducer, searchReducer },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
