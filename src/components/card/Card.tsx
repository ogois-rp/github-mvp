import React, { useState } from "react";
import { MdStars } from "react-icons/md";
import { User } from "../../redux/githubApi/users/collection-slice";
import { FaUserAlt } from "react-icons/fa";
import styles from "../card/Card.module.scss";

type Props = {
	user: User;
} & React.HtmlHTMLAttributes<HTMLDivElement>;

const Card: React.FC<Props> = ({ user }) => {
	const [isHovering, setIsHovering] = useState(false);

	const handleMouseOver = () => {
		setIsHovering(true);
	};

	const handleMouseOut = () => {
		setIsHovering(false);
	};

	return (
		<div
			className={styles.card}
			style={{
				background: !isHovering
					? `linear-gradient(to bottom, rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 1) 20%), url(${user.avatar_url})`
					: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url(${user.avatar_url}) no-repeat`,
			}}
			onMouseOver={handleMouseOver}
			onMouseOut={handleMouseOut}
		>
			<img src={user.avatar_url} />
			<p>{user.login}</p>
			{user.email && <p>{user.email}</p>}
			{user.followers && (
				<div className={styles.cardFollowersInfo}>
					<FaUserAlt />
					<span>{user.followers} followers</span>
				</div>
			)}
			{user.mostStarredRepo && (
				<div className={styles.projectCard}>
					<p>{user.mostStarredRepo.full_name}</p>
					<div className={styles.projectCardStars}>
						<MdStars />
						<span>{user.mostStarredRepo.stargazers_count}</span>
					</div>
					<p>{user.mostStarredRepo.description}</p>
				</div>
			)}
			<a href={user.html_url}>
				<button>Open profile</button>
			</a>
		</div>
	);
};

export { Card };
