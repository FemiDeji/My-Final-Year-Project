/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "./css/select.css";

function CustomSelectField({
	singleLine = false,
	options,
	onChange,
	label,
	htmlFor,
	name,
	required = true,
	readOnly = false,
	placeholder = "Select",
	disabled = false,
	optionKey = "value",
	optionLabel = "label",
	initialValue = "",
	error = "",
	enableFocusHandler = false,
	onFocus = () => {},
	borderSize = "md",
}) {
	const [selectedValue, setSelectedValue] = useState(initialValue ?? "");

	const handleSelectChange = (e) => {
		const newValue = e.target.value;
		setSelectedValue(newValue);
		if (onChange) {
			onChange(newValue);
		}
	};

	useEffect(() => {
		setSelectedValue(initialValue);
	}, [initialValue]);

	return (
		<div className={`mb-5 w-full`}>
			<div
				className={`mb-1 text-left w-full flex ${
					singleLine ? "flex-row items-center" : "flex-col"
				} relative`}>
				<label
					className={`text-sm font-[500] mb-2 ${
						singleLine ? "w-[30%]" : "w-full"
					}`}
					htmlFor={htmlFor}>
					{label}
				</label>
				<select
					disabled={readOnly}
					defaultValue={selectedValue}
					value={selectedValue}
					className={`${singleLine ? "w-[70%]" : "w-full"} ${
						readOnly || disabled ? "bg-gray-100" : ""
					} h-12 border rounded-${borderSize} px-5  outline-none`}
					name={name}
					id={name}
					onChange={handleSelectChange}>
					{placeholder && <option value="">-- {placeholder} --</option>}
					{options?.map((option) => (
						<option key={option[optionKey]} value={option[optionKey]}>
							{option[optionLabel]}
						</option>
					))}
				</select>
			</div>
			{error && (
				<div className="text-[11px] text-red-300 flex">
					<div className="w-[30%]"></div>
					<div>{error}</div>
				</div>
			)}
		</div>
	);
}

export default CustomSelectField;
