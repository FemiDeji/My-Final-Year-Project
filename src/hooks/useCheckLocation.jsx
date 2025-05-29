// import { useCallback, useEffect, useState } from "react";
// import { getDistanceInMeters } from "../helpers/dateAndTime";
// import toast from "react-hot-toast";
// import { CAMPUS_LOCATION } from "../constants/geoLocationParams";
// import GeneralModal from "../components/GeneralModal";
// import CustomButton from "../components/CustomButton";

// export const getCurrentPosition = () => {
// 	return new Promise((resolve, reject) => {
// 		navigator.geolocation.getCurrentPosition(resolve, reject);
// 	});
// };

// export default function useCheckLocation() {
// 	const [withinLocation, setWithinLocation] = useState(false);
// 	const [locationChecked, setLocationChecked] = useState(false);
// 	const [showRetryModal, setShowRetryModal] = useState(false);
// 	const [locationCheckLoading, setLocationCheckLoading] = useState(true);

// 	const checkLocation = useCallback(async () => {
// 		setLocationCheckLoading(true);

// 			if (!navigator.geolocation) {
// 				toast.error("Geolocation is not supported by your browser");
// 				setLocationChecked(true);
// 				setShowRetryModal(true);
// 				setLocationCheckLoading(false);

// 				return;
// 			}

// 		navigator.geolocation.getCurrentPosition(
// 			(position) => {
// 				const { latitude, longitude } = position.coords;

// 				const allowedLatitude = CAMPUS_LOCATION.latitude;
// 				const allowedLongitude = CAMPUS_LOCATION.longitude;
// 				const allowedRadius = CAMPUS_LOCATION.radiusInMeters;
// 				const distanceAllowed = getDistanceInMeters(
// 					latitude,
// 					longitude,
// 					allowedLatitude,
// 					allowedLongitude
// 				);

// 				const isWithinLocation = distanceAllowed <= allowedRadius;

// 				if (!isWithinLocation) {
// 					toast.error("You must be on campus to book a pass.");
// 					setShowRetryModal(true);
// 					setLocationCheckLoading(false);
// 					return;
// 				}
// 				setWithinLocation(isWithinLocation);
// 				setLocationChecked(true);
// 				setLocationCheckLoading(false);
// 				setShowRetryModal(false);
// 			},
// 			(error) => {
// 				switch (error.code) {
// 					case error.PERMISSION_DENIED:
// 						toast.error(
// 							"You denied location access. Please enable this and try again."
// 						);
// 						break;
// 					case error.POSITION_UNAVAILABLE:
// 						toast.error(
// 							"We coudn't determine your location. Please try again."
// 						);
// 						break;
// 					case error.TIMEOUT:
// 						toast.error(
// 							"Location request timed out. Please check your connection and try again."
// 						);
// 						break;
// 					default:
// 						toast.error("An unknown error occured while fetching location.");
// 				}

// 				console.error("Geolocation error:", error.message);
// 				setLocationChecked(true);
// 				setShowRetryModal(true);
// 				setLocationCheckLoading(false);
// 			}
// 		);
// 	}, []);

// 	useEffect(() => {
// 		if (!locationChecked && locationCheckLoading) {
// 			checkLocation();
// 		}
// 	}, [checkLocation, locationChecked, locationCheckLoading]);

// 	return {
// 		withinLocation,
// 		locationChecked,
// 		locationCheckLoading,

// 		RetryModal: (
// 			<GeneralModal
// 				isOpen={showRetryModal}
// 				showCloseButton
// 				onClose={() => setShowRetryModal(false)}
// 				height="lg:40vh xs:50vh"
// 				classname="xs:w-full">
// 				<div className="flex flex-col justify-center items-center gap-2">
// 					<p className="text-base xs:text-sm">
// 						<span className=" font-medium">Location required.</span>
// 						<br />
// 						We could not access your location. Please make sure location
// 						services are enabled and try again.
// 					</p>
// 					<CustomButton
// 						label={"Retry"}
// 						bgColor="#f2c008"
// 						textColor="#002855"
// 						bordered
// 						borderSize="lg"
// 						onClick={checkLocation}
// 					/>
// 				</div>
// 			</GeneralModal>
// 		),
// 	};
// }

import { useCallback, useEffect, useState } from "react";
import { getDistanceInMeters } from "../helpers/dateAndTime";
import toast from "react-hot-toast";
import { CAMPUS_LOCATION } from "../constants/geoLocationParams";
import GeneralModal from "../components/GeneralModal";
import CustomButton from "../components/CustomButton";

// Promisify the geolocation API
const getCurrentPosition = () => {
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(resolve, reject);
	});
};

export default function useCheckLocation() {
	const [withinLocation, setWithinLocation] = useState(false);
	const [locationChecked, setLocationChecked] = useState(false);
	const [showRetryModal, setShowRetryModal] = useState(false);
	const [locationCheckLoading, setLocationCheckLoading] = useState(false);

	const checkLocation = useCallback(async () => {
		setLocationCheckLoading(true);
		setShowRetryModal(false);
		try {
			if (!navigator.geolocation) {
				toast.error("Geolocation is not supported by your browser");
				setShowRetryModal(true);
				setLocationChecked(true);
				return;
			}

			const position = await getCurrentPosition();
			const { latitude, longitude } = position.coords;

			const distance = getDistanceInMeters(
				latitude,
				longitude,
				CAMPUS_LOCATION.latitude,
				CAMPUS_LOCATION.longitude
			);

			const isWithin = distance <= CAMPUS_LOCATION.radiusInMeters;

			if (!isWithin) {
				toast.error("You must be on campus to book a pass.");
				setShowRetryModal(true);
			}

			setWithinLocation(isWithin);
		} catch (error) {
			switch (error.code) {
				case error.PERMISSION_DENIED:
					toast.error(
						"You denied location access. Please enable it and try again."
					);
					break;
				case error.POSITION_UNAVAILABLE:
					toast.error("We couldn't determine your location. Please try again.");
					break;
				case error.TIMEOUT:
					toast.error(
						"Location request timed out. Please check your connection and try again."
					);
					break;
				default:
					toast.error("An unknown error occurred while fetching location.");
			}
			console.error("Geolocation error:", error.message);
			setShowRetryModal(true);
		} finally {
			setLocationCheckLoading(false);
			setLocationChecked(true);
		}
	}, []);

	useEffect(() => {
		checkLocation();
	}, [checkLocation]);

	return {
		withinLocation,
		locationChecked,
		locationCheckLoading,
		RetryModal: (
			<GeneralModal
				isOpen={showRetryModal}
				showCloseButton
				onClose={() => setShowRetryModal(false)}
				height="18vh"
				classname="xs:w-full lg:w-[30%]">
				<div className="flex flex-col justify-center items-center gap-2">
					<p className="text-base xs:text-[12px] text-center">
						<span className="font-medium">Location required.</span>
						<br />
						We could not access your location. Please make sure location
						services are enabled and try again.
					</p>
					<CustomButton
						label={"Retry"}
						bgColor="#f2c008"
						textColor="#002855"
						bordered
						borderSize="lg"
						onClick={checkLocation}
					/>
				</div>
			</GeneralModal>
		),
	};
}
