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
			className={`w-full flex px-2 py-2.5 xs:py-2 gap-2 items-center justify-center ${
				bordered ? `border rounded-${borderSize}` : ""
			} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
			{children && <div className="xs:text-sm">{children}</div>}
			<div className="font-semibold text-[13px] xs:text-[11px]">{label}</div>
		</button>
	);
}

export default CustomButton;
