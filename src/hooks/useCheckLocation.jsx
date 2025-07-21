import { useCallback, useState } from "react";
import { getDistanceInMeters } from "../helpers/dateAndTime";
import toast from "react-hot-toast";
import {
	CAMPUS_LOCATION,
	LOCATION_DISTANCE_THRESHOLD,
} from "../constants/geoLocationParams";
import { getCachedCoords, saveCoordsToCache } from "../helpers/locationCache";

export default function useCheckLocation() {
	const [isChecking, setIsChecking] = useState(false);
	const [hasChecked, setHasChecked] = useState(false);
	const [error, setError] = useState(false);

	const checkLocation = useCallback(() => {
		return new Promise((resolve, reject) => {
			setIsChecking(true);
			setError(null);

			if (!navigator.geolocation) {
				const msg = "Geolocation is not supported by your browser";
				setError(msg);
				setIsChecking(false);
				toast.error(msg);

				return;
			}

			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					const currentCoords = { latitude, longitude };
					const cachedCoords = getCachedCoords();

					if (cachedCoords) {
						const movedDistance = getDistanceInMeters(
							latitude,
							longitude,
							cachedCoords.latitude,
							cachedCoords.longitude
						);

						if (movedDistance < LOCATION_DISTANCE_THRESHOLD) {
							setHasChecked(true);
							setIsChecking(false);
							return resolve(true);
						}
					}

					const distance = getDistanceInMeters(
						latitude,
						longitude,
						CAMPUS_LOCATION.latitude,
						CAMPUS_LOCATION.longitude
					);
					const isWithin = distance <= CAMPUS_LOCATION.radiusInMeters;

					if (isWithin) {
						saveCoordsToCache(currentCoords);
					}

					setHasChecked(true);
					setIsChecking(false);
					resolve(isWithin);
				},

				(err) => {
					switch (err.code) {
						case err.PERMISSION_DENIED:
							toast.error(
								"You denied location access. Please enable it and try again."
							);
							break;
						case err.POSITION_UNAVAILABLE:
							toast.error(
								"We couldn't determine your location. Please try again."
							);
							break;
						case err.TIMEOUT:
							toast.error(
								"Location request timed out. Please check your connection and try again."
							);
							break;
						default:
							toast.error("An unknown error occurred while fetching location.");
					}

					console.error("Geolocation error:", err.message);
					setError(err.message);
					setHasChecked(false);
					setIsChecking(false);
					reject(false);
				}
			);
		});
	}, []);

	return {
		hasChecked,
		isChecking,
		error,
		checkLocation,
	};
}
