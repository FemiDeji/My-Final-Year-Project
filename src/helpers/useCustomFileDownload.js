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
		formatter = {},
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

	const applyFormatters = (data, formatters = {}) => {
		return data.map((row) => {
			const formattedRow = { ...row };
			for (const key in formatters) {
				if (row[key]) {
					formattedRow[key] = formatters[key](row[key]);
				}
			}
			return formattedRow;
		});
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
						const formattedData = applyFormatters(downloadableData, formatter);
						exportPDF(
							getPDFTitle(),
							getRequiredHeaders(),
							getPDFDataKeys(),
							formattedData,
							getFileName(".pdf")
						);
					} else if (type == "EXCEL") {
						// const formattedData = applyFormatters(downloadableData, formatter);
						downloadExcel(
							downloadableData,
							getFileName(".xlsx"),
							getRequiredHeaders(),
							getPDFDataKeys()
						);
					} else if (type == "CSV") {
						const formattedData = applyFormatters(downloadableData, formatter);
						makeCsv(
							getTableDataForExport(formattedData, getRequiredHeaders()),
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

			const formattedData = applyFormatters(toBeDownloaded, formatter);

			setTimeout(() => {
				if (type == "PDF") {
					exportPDF(
						getPDFTitle(),
						getRequiredHeaders(),
						getPDFDataKeys(),
						formattedData,
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
						getTableDataForExport(formattedData, getRequiredHeaders()),
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
