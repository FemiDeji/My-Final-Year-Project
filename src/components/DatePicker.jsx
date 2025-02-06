import DatePicker from "react-datepicker";

/* eslint-disable react/prop-types */
export default function CustomDatePicker({
	label,
	register,
	type = "text",
	placeholder,
	name = "",
	required = true,
	readOnly = false,
	error = "",
	maxLength,
	onInput,
	borderSize = "md",
	autoFocus,
	disabled = false,
}) {
	return (
		<div className="w-full">
			<fieldset
				className={`w-full border-2 p-2 py-1.5 rounded-${borderSize} ${
					error ? "border-red-400" : "border-gray-300"
				} ${!readOnly && !disabled ? "bg-[transparent]" : "bg-gray-50"}`}>
				{label && (
					<legend className="text-gray-500 bg-transparent px-2 text-sm">
						{label} {required && <span className="text-red-500 pl-1">*</span>}
					</legend>
				)}
				{/* Spread the register function return value */}
				<DatePicker
					{...register}
					type={type}
					placeholder={placeholder}
					name={name}
					id={name}
					readOnly={readOnly}
					disabled={disabled}
					maxLength={maxLength}
					onInput={onInput}
					autoFocus={autoFocus}
					className={`w-full outline-none text-sm pl-2 bg-[transparent] ${
						readOnly ? "text-gray-700" : ""
					}`}
				/>
			</fieldset>
			{/* Display error message if any */}
			{error && <p className="text-red-500 text-xs mt-1">{error}</p>}
		</div>
	);
}
