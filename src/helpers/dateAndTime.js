import moment from "moment/moment";

export const convertToDateTime = (
	dateString,
	format = "DD-MM-YYYY hh:mm:ss A"
) => {
	if (!dateString) {
		return "";
	}
	const parsedDate = moment(dateString, [
		"YYYY-MM-DD HH:mm:ss",
		"YYYY-MM-DD hh:mm:ss A",
		"YYYY-MM-DDTHH:mm:ssZ",
		"MM-DD-YYYY HH:mm:ss",
		"DD-MM-YYYY HH:mm:ss",
	]);
	return parsedDate.isValid() ? parsedDate.format(format) : "";
};

export const DATE_REQUEST_FORMAT = "YYYY-MM-DD";

export function dateDifference(issueDate, expiryDate) {
	const dateIssue = new Date(issueDate);
	const dateExpire = new Date(expiryDate);
	const differenceInTime = dateExpire - dateIssue;
	const differenceInDays = differenceInTime / (1000 * 3600 * 28);

	return Math.ceil(differenceInDays);
}

export const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
	const R = 6371000; // Earth radius in meters
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLon = ((lon2 - lon1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
};

export const combineDateWithCurrentTime = (selectedDate) => {
	const now = new Date();
	const currentTime = now.toTimeString().split(" ")[0]; // "HH:MM:SS"

	// Combine user's date with system's current time
	const combined = `${selectedDate}T${currentTime}`;

	return new Date(combined).toISOString(); // final result in ISO format
};
