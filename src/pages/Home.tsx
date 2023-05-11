import styles from "./Home.module.scss";
import { SearchBar } from "../components/searchBar/SearchBar";
import { useAppDispatch } from "../hooks";
import {
	fetchRepos,
	reposCollectionSelector,
} from "../redux/githubApi/repos/collection-slice";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RepoCard } from "../components/repoCard/RepoCard";
import { RootState } from "../redux/store/store";
import {
	fetchMostFollowedUsers,
	fetchUsersWithMostRepos,
} from "../redux/githubApi/users/collection-slice";
import {
	searchRepos,
	clearSearchRepoCollection,
	searchReposCollectionSelector,
	clearSearchUserCollection,
	searchUsersCollectionSelector,
	searchUsers,
} from "../redux/githubApi/search/collection-slice";
import { Card } from "../components/card/Card";
import UphillLogo from "../assets/logo_uphill.png";

const Home: React.FC = () => {
	const dispatch = useAppDispatch();

	const [hiddenCriteria, setHiddenCriteria] = useState("Repositories");
	const [selectedCriteria, setSelectedCriteria] = useState("Users");
	const [currentText, setCurrentText] = useState("");

	const repositories = useSelector(reposCollectionSelector);
	const searchReposResults = useSelector(searchReposCollectionSelector);
	const searchUsersResults = useSelector(searchUsersCollectionSelector);

	const mostFollowedUsers = useSelector(
		(state: RootState) => state.usersReducer.mostFollowedUsers
	);
	const usersWithMostRepos = useSelector(
		(state: RootState) => state.usersReducer.usersWithMostRepos
	);

	const onChange = (text: string) => {
		setCurrentText(text);
		if (!text.length) {
			selectedCriteria === "Repositories"
				? dispatch(clearSearchRepoCollection())
				: dispatch(clearSearchUserCollection());
			return true;
		}
		if (selectedCriteria === "Repositories") {
			dispatch(searchRepos({ search: text }));
		} else if (selectedCriteria === "Users") {
			dispatch(searchUsers({ search: text }));
		}
	};

	const onOptionClick = (current: string, hidden: string) => {
		if (current === "Repositories" && currentText.length) {
			dispatch(clearSearchRepoCollection());
			dispatch(searchUsers({ search: currentText }));
		} else if (current === "Users" && currentText.length) {
			dispatch(clearSearchUserCollection());
			dispatch(searchRepos({ search: currentText }));
		}
		setHiddenCriteria(current);
		setSelectedCriteria(hidden);
	};

	useEffect(() => {
		dispatch(fetchUsersWithMostRepos({ perPage: 3 }));
		dispatch(fetchMostFollowedUsers({ perPage: 3 }));
	}, [dispatch]);

	useEffect(() => {
		if (!repositories) {
			dispatch(
				fetchRepos({
					dateStr: "2023-01-01",
					sort: "stars",
					order: "desc",
					perPage: 4,
				})
			);
		}
	}, [dispatch, repositories]);

	return (
		<>
			<header className={styles.backGroundHeader}>
				<section className={styles.headerContainer}>
					<img src={UphillLogo} width="150px" />
					<SearchBar
						onOptionClick={onOptionClick}
						onChange={onChange}
						hiddenCriteria={hiddenCriteria}
						selectedCriteria={selectedCriteria}
					/>
				</section>
			</header>
			<main>
				<section className={styles.mainContainer}>
					{!searchReposResults && !searchUsersResults ? (
						<>
							<h2>Trending Users</h2>
							<section className={styles.cardHolder}>
								{mostFollowedUsers.items?.map((mostFollowedUser) => {
									return (
										<Card key={mostFollowedUser.id} user={mostFollowedUser} />
									);
								})}
							</section>
							<h2>Most active users</h2>
							<section className={styles.cardHolder}>
								{usersWithMostRepos.items?.map((usersWithMostRepos) => {
									return (
										<Card
											key={usersWithMostRepos.id}
											user={usersWithMostRepos}
										/>
									);
								})}
							</section>
							<h2>Top Repositories</h2>
							<section className={styles.cardRepoHolder}>
								{repositories &&
									repositories.map((repo) => {
										return <RepoCard key={repo.id} repo={repo} />;
									})}
							</section>
						</>
					) : searchReposResults ? (
						<>
							<h2>Found Repos</h2>
							<section className={styles.cardRepoHolder}>
								{searchReposResults &&
									searchReposResults.map((repo) => {
										return <RepoCard key={repo.id} repo={repo} />;
									})}
							</section>
						</>
					) : (
						<>
							<h2>Found Users</h2>
							<section className={styles.cardRepoHolder}>
								{searchUsersResults &&
									searchUsersResults.map((user) => {
										return <Card key={user.id} user={user} />;
									})}
							</section>
						</>
					)}
				</section>
			</main>
		</>
	);
};

export { Home };
