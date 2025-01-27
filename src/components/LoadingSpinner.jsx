/* eslint-disable react/prop-types */

import { Vortex } from "react-loader-spinner";

export default function LoadingSpinner({
	visible = false,
	height = "",
	width = "",
	colors = [],
	ariaLabel = "vortex-loading",
	wrapperClass = "vortex-wrapper",
	wrapperStyle = {},
}) {
	return (
		<Vortex
			ariaLabel={ariaLabel}
			visible={visible}
			height={height}
			width={width}
			colors={colors}
			wrapperClass={wrapperClass}
			wrapperStyle={wrapperStyle}
		/>
	);
}
