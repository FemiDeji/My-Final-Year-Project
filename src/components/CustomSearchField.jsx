/* eslint-disable react/prop-types */
function CustomSearchField({
	label,
	type = "text",
	name,
	placeholder,
	disabled = false,
	readOnly = false,
	borderRadius,
	singleLine = false,
	required = true,
	onChange,
	value,
}) {
	return (
		<div
			className={`text-left w-full flex ${
				singleLine ? "flex-row items-center" : "flex-col"
			}`}>
			{label && (
				<div
					className={`mb-2 text-[14px] font-[500] ${
						singleLine ? "w-[30%]" : "w-full"
					}`}>
					{label} {required && <span className="text-red-300 ml-1">*</span>}
				</div>
			)}
			<div className={`${singleLine ? "w-[70%]" : "w-full"}`}>
				<div className="flex items-center w-full">
					<input
						className={`border-2 p-2.5 pl-5 w-full text-sm outline-none border-gray-300 bg-[whitesmoke] rounded-${borderRadius}`}
						type={type}
						name={name}
						placeholder={placeholder}
						disabled={disabled}
						readOnly={readOnly}
						onChange={onChange}
						value={value}
					/>
				</div>
			</div>
		</div>
	);
}

export default CustomSearchField;
