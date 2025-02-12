/* eslint-disable react/prop-types */
export default function CustomTextarea({
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
	row = 3,
}) {
	return (
		<div className="w-full">
			<fieldset
				className={`w-full border-2 p-2 py-1.5 rounded-${borderSize} ${
					error ? "border-red-400" : "border-gray-300"
				} ${!readOnly && !disabled ? "bg-[transparent]" : "bg-gray-50"}`}>
				{label && (
					<legend className="text-gray-500 bg-transparent px-2 text-sm xs:text-[12px]">
						{label} {required && <span className="text-red-500 pl-1">*</span>}
					</legend>
				)}
				{/* Spread the register function return value */}
				<textarea
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
					rows={row}
					className={`w-full outline-none text-sm xs:text-[11px] pl-2 bg-[transparent] ${
						readOnly ? "text-gray-700" : ""
					}`}
				/>
			</fieldset>
			{/* Display error message if any */}
			{error && (
				<p className="text-red-500 xs:text-[10px] text-xs mt-1">{error}</p>
			)}
		</div>
	);
}
