/* eslint-disable react/prop-types */
import { Backdrop } from "@mui/material";
import LoadingSpinner from "./LoadingSpinner";

function CustomBackdrop({ open, text }) {
	return (
		<div className="" style={{ zIndex: "3000" }}>
			<Backdrop
				sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 300000 }}
				open={open}>
				<div className="flex flex-col gap-4 justify-center items-center">
					{/* <CircularProgress color="inherit" /> */}
					<LoadingSpinner
						visible={true}
						height="80"
						width="80"
						colors={["red", "blue", "yellow", "green", "purple"]}
					/>
					<p className="mt-5">{text}</p>
				</div>
			</Backdrop>
		</div>
	);
}

export default CustomBackdrop;
