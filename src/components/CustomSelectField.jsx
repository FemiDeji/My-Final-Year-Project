/* eslint-disable no-unused-vars */
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
	register,
	classname,
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
		<div className={`w-full `}>
			<fieldset
				// className={`mb-1 text-left w-full flex ${
				// 	singleLine ? "flex-row items-center" : "flex-col"
				// } relative`}
				className={`${singleLine ? "w-[70%]" : "w-full"} ${
					!readOnly && !disabled ? "bg-transparent" : "bg-gray-50"
				} h-[3.6rem] border-2 rounded-${borderSize} px-3  outline-none ${
					error ? "border-red-400" : "border-gray-300"
				}`}>
				<legend
					className={`text-sm text-gray-500 font-[500] text-left px-2 ${
						singleLine ? "w-[30%]" : ""
					}`}
					htmlFor={htmlFor}>
					{label} {required && <span className="text-red-500 pl-1">*</span>}
				</legend>
				<select
					{...register}
					disabled={readOnly}
					defaultValue={selectedValue}
					className={`bg-transparent w-full h-[2.3rem] outline-none pl-2 `}
					value={selectedValue}
					name={name}
					id={name}
					onChange={handleSelectChange}>
					{placeholder && <option value="">-- {placeholder} --</option>}

					{options?.map((option) => (
						<option
							key={option[optionKey]}
							value={option[optionKey]}
							className={`${classname}`}>
							{option[optionLabel]}
						</option>
					))}
				</select>
			</fieldset>
			{error && (
				<div className="text-[11px] text-red-500 flex text-left">
					<div>{error}</div>
				</div>
			)}
		</div>
	);
}

export default CustomSelectField;
