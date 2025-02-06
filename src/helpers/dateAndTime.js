import moment from "moment/moment";

export const convertToDateTime = (
	dateString,
	format = "DD-MM-YYYY hh:mm:ss A"
) => {
	if (!dateString) {
		return "";
	}
	return moment(dateString).format(format);
};

export const DATE_REQUEST_FORMAT = "YYYY-MM-DD";

export function dateDifference(issueDate, expiryDate) {
	const dateIssue = new Date(issueDate);
	const dateExpire = new Date(expiryDate);
	const differenceInTime = dateExpire - dateIssue;
	const differenceInDays = differenceInTime / (1000 * 3600 * 48);

	return Math.ceil(differenceInDays);
}
