import { useCallback, useState } from "react";

import * as turf from "@turf/turf";
import { adelekeUniversityPolygon } from "../constants/geoPolygon";

export default function useCheckLocation() {
	const [isChecking, setIsChecking] = useState(false);
	const [hasChecked, setHasChecked] = useState(false);
	const [geoError, setGeoError] = useState(null);
	const [showGeoErrorModal, setShowGeoErrorModal] = useState(false);

	const checkLocation = useCallback(() => {
		return new Promise((resolve, reject) => {
			setIsChecking(true);
			setGeoError(null);
			setShowGeoErrorModal(false);

			if (!navigator.geolocation) {
				const msg = "Geolocation is not supported by your browser";
				setGeoError(msg);
				setIsChecking(false);
				setShowGeoErrorModal(true);
				return reject(false);
			}

			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					const userPoint = turf.point([longitude, latitude]);

					const universityPolygon = turf.polygon([adelekeUniversityPolygon]);

					const isWithin = turf.booleanPointInPolygon(
						userPoint,
						universityPolygon
					);

					if (!isWithin) {
						const msg = "You are currently outside the campus zone.";
						setGeoError(msg);
						setShowGeoErrorModal(true);
					}

					setHasChecked(true);
					setIsChecking(false);
					resolve(isWithin);
				},

				(err) => {
					let msg = "An unknown error occured while fetching location.";
					switch (err.code) {
						case err.PERMISSION_DENIED:
							msg =
								"You denied location access. Please enable it and try again to gain full access.";
							break;
						case err.POSITION_UNAVAILABLE:
							msg =
								"We couldn't determine your location. Please try again to gain full access.";
							break;
						case err.TIMEOUT:
							msg =
								"Location request timed out. Please check your connection and try again to gain full access.";
							break;
					}

					console.error("Geolocation error:", err.message);
					setGeoError(msg);
					setShowGeoErrorModal(true);
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
		geoError,
		checkLocation,
		showGeoErrorModal,
		setShowGeoErrorModal,
	};
}
