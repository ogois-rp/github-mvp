import {
	createSelector,
	createSlice,
	createAsyncThunk,
  combineReducers,
} from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../store/store";
import { Repo, Status } from "../repos/collection-slice";
import { User } from "../users/collection-slice";

interface SearchReposState {
	items?: Repo[];
	status: Status;
	error?: string;
}

const initialStateRepos: SearchReposState = {
	items: undefined,
	status: "idle",
};

interface SearchUsersState {
	items?: User[];
	status: Status;
	error?: string;
}

const initialStateUsers: SearchUsersState = {
	items: undefined,
	status: "idle",
};

export const searchRepos = createAsyncThunk(
	"search/repos",
	async (params?: { search: string }) => {
		//
		const res = await axios.get(
			`https://api.github.com/search/repositories?q=${params?.search}&per_page=3`
		);
		return res;
	}
);

export const searchUsers = createAsyncThunk(
	"search/users",
	async (params?: { search: string }) => {
		//
		const res = await axios.get(
			`https://api.github.com/search/users?q=${params?.search}&per_page=3`
		);
		return res;
	}
);

const searchReposSlice = createSlice({
	name: "searchReposCollection",
	initialState: initialStateRepos,
	reducers: {
    clearSearchRepoCollection(state: SearchReposState) {
			Object.assign(state, initialStateRepos);
		},
  },
	extraReducers: (builder) => {
		builder.addCase(searchRepos.pending, (state: SearchReposState) => {
			state.status = "pending";
		});
		builder.addCase(
			searchRepos.fulfilled,
			(state: SearchReposState, action) => {
				state.items = action.payload.data.items;
				state.status = "fulfilled";
			}
		);
		builder.addCase(searchRepos.rejected, (state, { error }) => {
			state.status = "rejected";
			state.error = error.message;
		});
	},
});

const searchUsersSlice = createSlice({
	name: "searchUsersCollection",
	initialState: initialStateUsers,
	reducers: {
    clearSearchUserCollection(state: SearchUsersState) {
			Object.assign(state, initialStateUsers);
		},
  },
	extraReducers: (builder) => {
		builder.addCase(searchUsers.pending, (state: SearchUsersState) => {
			state.status = "pending";
		});
		builder.addCase(
			searchUsers.fulfilled,
			(state: SearchUsersState, action) => {
				state.items = action.payload.data.items;
				state.status = "fulfilled";
			}
		);
		builder.addCase(searchUsers.rejected, (state, { error }) => {
			state.status = "rejected";
			state.error = error.message;
		});
	},
});

export const searchReposCollectionSelector = createSelector(
	(state: RootState) => state.searchReducer.searchReposCollection,
	(state) => state.items
);

export const searchReposCollectionLoading = createSelector(
	(state: RootState) => state.searchReducer.searchReposCollection.status,
	(status) => status !== "fulfilled"
);

export const searchReposErrorSelector = createSelector(
	(state: RootState) => state.searchReducer.searchReposCollection,
	(status) => status.error
);

export const searchUsersCollectionSelector = createSelector(
	(state: RootState) => state.searchReducer.searchUsersCollection,
	(state) => state.items
);

export const searchUsersCollectionLoading = createSelector(
	(state: RootState) => state.searchReducer.searchUsersCollection.status,
	(status) => status !== "fulfilled"
);

export const searchUsersErrorSelector = createSelector(
	(state: RootState) => state.searchReducer.searchUsersCollection,
	(status) => status.error
);

export const { clearSearchRepoCollection } = searchReposSlice.actions;
export const { clearSearchUserCollection } = searchUsersSlice.actions;

export const searchReducer = combineReducers({
  searchReposCollection: searchReposSlice.reducer,
  searchUsersCollection: searchUsersSlice.reducer,
}) 
