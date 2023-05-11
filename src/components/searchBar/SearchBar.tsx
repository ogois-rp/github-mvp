import React, { useState } from "react";
import styles from "../searchBar/SearchBar.module.scss";
import { ReactComponent as Arrow } from "../../assets/arrow.svg";

interface SearchProps {
	onChange(arg :string): void
	onOptionClick(criteriaOn: string, criteriaOff:string): void
	hiddenCriteria: string
	selectedCriteria: string
}

const SearchBar: React.FC<SearchProps> = ({onChange, onOptionClick, hiddenCriteria, selectedCriteria}) => {
	const [isOpen, setIsOpen] = useState(false);
	const handleChange = (e: any) => {
		const text = e.target.value
		onChange(text)
	}

	return (
		<div className={styles.searchBar}>
			<div className={styles.select} onClick={() => setIsOpen(!isOpen)}>
				<p>{selectedCriteria}</p>
				<Arrow />
				<ul className={isOpen ? styles.isOpen : undefined}>
					<li
						onClick={() => {
							setIsOpen(false)
							onOptionClick(selectedCriteria, hiddenCriteria)
						}}
					>
						{hiddenCriteria}
					</li>
				</ul>
			</div>
			<input type="text" onChange={handleChange} placeholder={`Search in ${selectedCriteria}`} />
		</div>
	);
};

export { SearchBar };



