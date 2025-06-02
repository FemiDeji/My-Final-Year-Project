import { useCallback, useEffect, useState } from "react";
import { getDistanceInMeters } from "../helpers/dateAndTime";
import toast from "react-hot-toast";
import { CAMPUS_LOCATION } from "../constants/geoLocationParams";
import GeneralModal from "../components/GeneralModal";
import CustomButton from "../components/CustomButton";
import { General_Blue, General_Yellow } from "../constants/colors";

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
				height="23vh"
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
						bgColor={General_Yellow}
						textColor={General_Blue}
						bordered
						borderSize="lg"
						onClick={checkLocation}
					/>
				</div>
			</GeneralModal>
		),
	};
}
