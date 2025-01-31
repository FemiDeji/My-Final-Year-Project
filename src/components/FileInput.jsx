/* eslint-disable react/prop-types */
export default function FileInput({
	label,
	register,
	type = "file",
	name = "",
	required = true,
	readOnly = false,
	error = "",
	borderSize = "md",
	onChange,
}) {
	return (
		<div className="w-full">
			<fieldset
				className={`w-full border-2 p-2 py-1.5 rounded-${borderSize} ${
					error ? "border-red-400" : "border-gray-300"
				} ${!readOnly ? "bg-[transparent]" : "bg-gray-50"}`}>
				{label && (
					<legend className="text-gray-500 bg-transparent px-2 text-sm">
						{label} {required && <span className="text-red-500 pl-1">*</span>}
					</legend>
				)}
				{/* Spread the register function return value */}
				<input
					{...register}
					onChange={onChange}
					type={type}
					className="text-[0.8rem] xs:text-[0.65rem] rounded-sm file:font-medium file:px-4 file:py-1.5 file:rounded-md file:border-none file:cursor-pointer file:transition-colors file:duration-200 hover:file:bg-brand-700"
					name={name}
				/>
			</fieldset>
			{/* Display error message if any */}
			{error && <p className="text-red-500 text-xs mt-1">{error}</p>}
		</div>
	);
}
