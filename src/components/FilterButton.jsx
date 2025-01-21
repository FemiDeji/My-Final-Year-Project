/* eslint-disable react/prop-types */

export default function FilterButton({
	disabled,
	children,
	label,
	type = "button",
	bordered = false,
	textColor = "",
	bgColor = "",
	onClick = () => {},
}) {
	return (
		<button
			disabled={disabled}
			type={type}
			onClick={onClick}
			style={{ backgroundColor: bgColor, color: textColor }}
			className={`w-full flex px-4 py-2 items-center justify-between ${
				bordered ? "border rounded-full" : ""
			} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
			<div className="font-[500] text-[12px] mx-auto">{label}</div>
			{children && <div>{children}</div>}
		</button>
	);
}
