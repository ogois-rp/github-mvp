import {
	createSlice,
	createAsyncThunk,
	combineReducers,
} from "@reduxjs/toolkit";
import axios from "axios";
import { Repo, Status } from "../repos/collection-slice";

export interface User {
	login: string;
	id: number;
	avatar_url: string;
	html_url?: string;
	url: string;
	followers?: number;
	email?: string;
	mostStarredRepo?: Repo;
}

interface MostFollowedUsersState {
	items: User[];
	status: Status;
	error?: string | null;
}

interface UsersWithMostReposState {
	items: User[];
	status: Status;
	error?: string | null;
}

interface FetchUsersPayload {
	perPage: number;
}

export const fetchMostFollowedUsers = createAsyncThunk<
	User[],
	FetchUsersPayload
>("mostFollowedUsers/fetchMostFollowedUsers", async ({ perPage }) => {
	const today = new Date();
	const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
	const formattedDate = lastMonth.toISOString().split("T")[0];

	const response = await axios.get(
		`https://api.github.com/search/users?q=followers:%3E1+created:${formattedDate}&sort:followers&order:desc&per_page=${perPage}`
	);

	const users = response.data.items as User[];
	const usersWithFollowers = await Promise.all(
		users.map(async (user) => {
			const followersResponse = await fetch(user.url);
			const followersData = await followersResponse.json();
			return {
				...user,
				followers: followersData.followers,
				email: followersData.email,
			};
		})
	);

	const usersWithFollowersAndMostStarredRepo = await Promise.all(
		usersWithFollowers.map(async (user) => {
			const mostStarredRepo = await axios.get(
				`https://api.github.com/users/${user.login}/repos?sort:stars&order:desc&per_page=1`
			);
			const { stargazers_count, description, full_name } =
				mostStarredRepo.data[0];
			return {
				...user,
				mostStarredRepo: {
					stargazers_count: stargazers_count,
					description: description,
					full_name: full_name,
				},
			};
		})
	);

	return usersWithFollowersAndMostStarredRepo;
});

export const fetchUsersWithMostRepos = createAsyncThunk<
	User[],
	FetchUsersPayload
>("usersWithMostRepos/fetchUsersWithMostRepos", async ({ perPage }) => {
	const response = await axios.get(
		`https://api.github.com/search/users?q=created:>=2023-05-01+repos:>0+followers:>0&sort:repositories&order:desc&per_page=${perPage}`
	);
	const users = response.data.items as User[];
	const usersWithFollowers = await Promise.all(
		users.map(async (user) => {
			const followersResponse = await fetch(user.url);
			const followersData = await followersResponse.json();
			return {
				...user,
				followers: followersData.followers,
				email: followersData.email,
			};
		})
	);

	const usersWithFollowersAndMostStarredRepo = await Promise.all(
		usersWithFollowers.map(async (user) => {
			const mostStarredRepo = await axios.get(
				`https://api.github.com/users/${user.login}/repos?sort:stars&order:desc&per_page=1`
			);
			const { stargazers_count, description, full_name } =
				mostStarredRepo.data[0];
			return {
				...user,
				mostStarredRepo: {
					stargazers_count: stargazers_count,
					description: description,
					full_name: full_name,
				},
			};
		})
	);

	return usersWithFollowersAndMostStarredRepo;
});

const mostFollowedUsersSlice = createSlice({
	name: "mostFollowedUsers",
	initialState: {
		items: [],
		status: 'idle',
		error: null
	} as MostFollowedUsersState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchMostFollowedUsers.pending, (state) => {
			state.status = "pending";
			state.error = null;
		});
		builder.addCase(fetchMostFollowedUsers.fulfilled, (state, action) => {
			state.status = "fulfilled";
			state.error = null;
			state.items = action.payload;
		});
		builder.addCase(fetchMostFollowedUsers.rejected, (state, action) => {
			state.status = "rejected";
			state.error = action.error.message ?? "An error occurred";
		});
	},
});

const usersWithMostReposSlice = createSlice({
	name: "usersWithMostRepos",
	initialState: {
		items: [],
		status: 'idle',
		error: null,
	} as UsersWithMostReposState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchUsersWithMostRepos.pending, (state) => {
			state.status = "pending";
			state.error = null;
		});
		builder.addCase(fetchUsersWithMostRepos.fulfilled, (state, action) => {
			state.status = "fulfilled";
			state.error = null;
			state.items = action.payload;
		});
		builder.addCase(fetchUsersWithMostRepos.rejected, (state, action) => {
			state.status = "rejected";
			state.error = action.error.message ?? "An error occurred";
		});
	},
});

export const mostFollowedUsersActions = mostFollowedUsersSlice.actions;
export const usersWithMostReposActions = usersWithMostReposSlice.actions;

export const usersReducer = combineReducers({
	mostFollowedUsers: mostFollowedUsersSlice.reducer,
	usersWithMostRepos: usersWithMostReposSlice.reducer,
});
