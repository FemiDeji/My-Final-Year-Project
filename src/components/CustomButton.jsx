/* eslint-disable react/prop-types */

function CustomButton({
	disabled,
	children,
	label,
	type = "button",
	bordered,
	textColor = "",
	bgColor = "",
	onClick = () => {},
	borderSize = "lg",
}) {
	return (
		<button
			disabled={disabled}
			type={type}
			onClick={onClick}
			style={{
				backgroundColor: bgColor,
				color: textColor,
			}}
			className={`w-full flex px-2 py-3 gap-2 items-center justify-center ${
				bordered ? `border rounded-${borderSize}` : ""
			} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
			{children && <div>{children}</div>}
			<div className="font-semibold text-[13px]">{label}</div>
		</button>
	);
}

export default CustomButton;
