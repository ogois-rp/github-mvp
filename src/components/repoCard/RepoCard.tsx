import React from "react";
import { MdStars } from "react-icons/md";
import { Repo } from "../../redux/githubApi/repos/collection-slice";
import styles from "../repoCard/RepoCard.module.scss";

type Props = {
	repo: Repo;
} & React.HtmlHTMLAttributes<HTMLDivElement>;

const RepoCard: React.FC<Props> = ({ repo }) => {

	return (
			<div className={styles.repoCard}>
				<p>{repo.full_name}</p>
				<div className={styles.repoCardFollowersInfo}>
					<MdStars />
					<span>{repo.stargazers_count}</span>
				</div>
				<p>{repo.description}</p>
			</div>
	);
};

export { RepoCard };
