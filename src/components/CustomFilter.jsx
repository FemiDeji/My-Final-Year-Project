/* eslint-disable react/prop-types */
import FilterButton from "./FilterButton";

export default function CustomFilter({
	filters,
	activeFilter,
	onFilterChange,
}) {
	return (
		<div className="flex flex-row justify-center items-center gap-2 ml-auto w-auto whitespace-nowrap mr-4">
			{filters.map(({ key, label }) => (
				<FilterButton
					key={key}
					label={label}
					bgColor={activeFilter === key ? { General_Blue } : { General_Grey }}
					textColor={activeFilter === key ? { General_White } : "black"}
					bordered
					onClick={() => onFilterChange(key)}
					disabled={activeFilter === key}
				/>
			))}
		</div>
	);
}
