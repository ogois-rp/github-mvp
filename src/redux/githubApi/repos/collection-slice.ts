import {
	createSelector,
	createSlice,
	createAsyncThunk,
} from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../store/store";

export type Status = "idle" | "pending" | "fulfilled" | "rejected";

export interface Repo {
	id?: number;
	name?: string;
	full_name: string;
	description: string;
	stargazers_count: number;
  html_url?: string;
}

interface ReposCollectionState {
	items?: Repo[];
	status: Status;
	error?: string;
}

const initialState: ReposCollectionState = {
	items: undefined,
	status: "idle",
	error: undefined
};

export const fetchRepos = createAsyncThunk(
	"repos/list",
	async (params?: {
		dateStr?: string;
		sort?: string;
		order?: string;
		perPage?: number;
	}) => {
		const res = await axios.get(
			`https://api.github.com/search/repositories?q=created:>=${params?.dateStr}&sort:${params?.sort}&order:${params?.order}&per_page=${params?.perPage}`
		);
		return res;
	}
);

const reposSlice = createSlice({
	name: "reposCollection",
	initialState,
	reducers: {
		clearRepoCollection(state: ReposCollectionState) {
			Object.assign(state, initialState);
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchRepos.pending, (state: ReposCollectionState) => {
			state.status = "pending";
		});
		builder.addCase(
			fetchRepos.fulfilled,
			(state: ReposCollectionState, action) => {
				state.items = action.payload.data.items;
				state.status = "fulfilled";
			}
		);
		builder.addCase(fetchRepos.rejected, (state, { error }) => {
			state.status = "rejected";
			state.error = error.message;
		});
	},
});

export const reposCollectionSelector = createSelector(
	(state: RootState) => state.reposCollection,
	(state) => state.items
);

export const reposCollectionLoading = createSelector(
	(state: RootState) => state.reposCollection.status,
	(status) => status !== "fulfilled"
);

export const reposErrorSelector = createSelector(
	(state: RootState) => state.reposCollection,
	(status) => status.error
);

export const { clearRepoCollection } = reposSlice.actions;
export default reposSlice.reducer;
