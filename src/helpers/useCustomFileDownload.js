// import { downloadExcel, exportPDF, getTableDataForExport, makeCsv } from "../helpers/custom_functions";

import {
	downloadExcel,
	exportPDF,
	getTableDataForExport,
	makeCsv,
} from "../helpers/custom";

function useCustomFileDownload(data) {
	const {
		actualData,
		reportTitle,
		filename,
		dataHeaders,
		dataKey,
		preEvent = null,
		getData,
		startDate,
		endDate,
		downloadType = "PDF",
	} = data;

	const getFileName = (extension) => {
		let title = filename ?? "Report";
		if (startDate != null && startDate != "") {
			title += "_" + startDate;
		}
		if (endDate != null && endDate != "") {
			title += "_" + endDate;
		}
		title += extension;

		return title;
	};

	const getPDFTitle = () => {
		let title = reportTitle ?? "Report";
		if (startDate != null && startDate != "") {
			title += " From " + startDate;
		}
		if (endDate != null && endDate != "") {
			title += " To " + endDate;
		}

		return title;
	};

	const getRequiredHeaders = () => {
		let headers = dataHeaders.map((header) => {
			return header.value;
		});
		return [headers];
	};

	const getPDFDataKeys = () => {
		let dataKeys = dataHeaders.map((header) => {
			return header.key;
		});
		return dataKeys;
	};

	const downloadAs = (type = "PDF", data) => {
		if (preEvent) {
			getData()
				.then((response) => {
					let downloadableData = [];
					if (response) {
						downloadableData = response[dataKey];
					}
					if (type == "PDF") {
						exportPDF(
							getPDFTitle(),
							getRequiredHeaders(),
							getPDFDataKeys(),
							downloadableData,
							getFileName(".pdf")
						);
					} else if (type == "EXCEL") {
						downloadExcel(
							downloadableData,
							getFileName(".xlsx"),
							getRequiredHeaders(),
							getPDFDataKeys()
						);
					} else if (type == "CSV") {
						makeCsv(
							getTableDataForExport(downloadableData, getRequiredHeaders()),
							getFileName(".csv")
						);
					}
				})
				.catch((err) => {
					console.error("error from downloading data", err);
				})
				.finally(() => {});
		} else {
			let toBeDownloaded = actualData;
			if (data) {
				toBeDownloaded = data;
			}
			setTimeout(() => {
				if (type == "PDF") {
					exportPDF(
						getPDFTitle(),
						getRequiredHeaders(),
						getPDFDataKeys(),
						toBeDownloaded,
						getFileName(".pdf")
					);
				} else if (type == "EXCEL") {
					downloadExcel(
						toBeDownloaded,
						getFileName(".xlsx"),
						getRequiredHeaders(),
						getPDFDataKeys()
					);
				} else if (type == "CSV") {
					makeCsv(
						getTableDataForExport(toBeDownloaded, getRequiredHeaders()),
						getFileName(".csv")
					);
				}
			}, 1000);
		}
	};
	return {
		downloadAs,
	};
}

export default useCustomFileDownload;
