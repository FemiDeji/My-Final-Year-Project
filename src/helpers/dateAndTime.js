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


export const DATE_REQUEST_FORMAT = "YYYY-MM-DD"