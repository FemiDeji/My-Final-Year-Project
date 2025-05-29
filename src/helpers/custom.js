import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import "/AU_logo.jpg";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const findBy = (value, data) => {
	if (value === null || value === undefined) {
		return "";
	}
	return data.find((d) => d["value"] == value).label;
};

export const roundOffTo2Dp = (num) => {
	return Math.round((num + Number.EPSILON) * 100) / 100;
};

export const getFullName = (firstName, lastName) => {
	return firstName + " " + lastName;
};

export const delayAction = (callback, delay = 2000) => {
	setTimeout(() => {
		callback();
	}, delay);
};

export const generateRandomString = () => {
	return uuidv4()?.replace(/-/g, "")?.substring(0, 20);
};

export const generateRandomNumber = () => {
	return Math.floor(Math.random(100));
};

// Helper function to format the input name to a more readable label
export const formatLabel = (label) => {
	// Replace camelCase or snake_case with spaces between words
	return label
		.replace(/([a-z0-9])([A-Z])/g, "$1 $2") // camelCase -> "transactionAmount" -> "Transaction Amount"
		.replace(/_/g, " ") // snake_case -> "transaction_amount" -> "Transaction Amount"
		.replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
};

// Function to determine the greeting based on the current time
export const getGreeting = () => {
	// Get the current hour
	const currentHour = new Date().getHours();
	if (currentHour < 12) {
		return "Good Morning!";
	} else if (currentHour < 18) {
		return "Good Afternoon!";
	} else {
		return "Good Evening!";
	}
};

export const downloadPDF = (pdf, setInfoDetails) => {
	if (pdf) {
		const linkSource = `data:application/pdf;base64,${pdf}`;
		const downloadLink = document.createElement("a");
		const fileName = "file.pdf";

		downloadLink.href = linkSource;
		downloadLink.download = fileName;
		downloadLink.click();
	} else {
		setInfoDetails({ message: "No file to download", isError: true });
	}
};

const getBase64 = (file) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
};

export const transformData = (data) => {
	if (!data) {
		console.error("Data is undefined.");
		return [];
	}

	const dataWithSerialNumber = data.map((d, index) => {
		return { sn: index + 1, ...d };
	});

	const newData = dataWithSerialNumber.map((d) => {
		const newObj = {};
		for (const el in d) {
			const key = el;
			if (
				el.toLowerCase().includes("date") ||
				el.toLowerCase().includes("created_on")
			) {
				if (d[el]) {
					newObj[key] = moment(d[el]).format("DD-MM-YYYY hh:mm A");
				}
			} else {
				newObj[key] = d[el];
			}
		}
		return newObj;
	});

	return newData;
};

export const exportPDF = (
	title,
	headers,
	dataKeys,
	data,
	filename,
	unit = "pt",
	size = "A2",
	orientation = "landscape",
	marginLeft = 40,
	fontSize = 18
) => {
	const doc = new jsPDF(orientation, unit, size);

	doc.setFontSize(fontSize);

	const transformedData = data?.map((elt) => {
		return [...dataKeys.map((key) => elt[key])];
	});

	if (transformedData) {
		let content = {
			startY: 50,
			head: headers,
			body: transformedData,
		};
		autoTable(doc, {
			...content,
		});

		doc.text(title, marginLeft, 40);
		doc.save(filename);
	}
};

export const downloadExcel = async (
	rawData,
	filename,
	heading = [[]],
	headerKeys
) => {
	let data = transformData(rawData);

	// Prepare the heading row(s)
	heading = heading.map((hd) => ["S/N", ...hd]);

	// Transform data to match headerKeys
	const transformedData = data?.map((elt) => {
		return [elt["sn"], ...headerKeys.map((key) => elt[key]?.toString() || "")];
	});

	const workbook = new ExcelJS.Workbook();
	const worksheet = workbook.addWorksheet("Sheet1");

	// Add header rows
	heading.forEach((row) => worksheet.addRow(row));

	// Add data rows
	transformedData.forEach((row) => worksheet.addRow(row));

	// Optional: Adjust column widths
	worksheet.columns = heading[0].map((header) => ({
		header,
		width: 20,
	}));

	// Export to Excel
	const buffer = await workbook.xlsx.writeBuffer();
	const blob = new Blob([buffer], {
		type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	});
	saveAs(blob, filename);
};

export const getTableDataForExport = (data, columns) => {
	// Verify we have data and columns
	if (!data || !Array.isArray(data) || data.length === 0) {
		console.error("No data to export");
		return [];
	}

	if (!columns || !Array.isArray(columns) || columns.length === 0) {
		console.error("No columns defined for export");
		return [];
	}

	// Debug information
	console.log("Export columns:", columns);
	console.log("Sample data:", data.length > 0 ? data[0] : "No data");

	// Create a new array of objects with the desired format
	return data.map((record) => {
		const exportRecord = {};

		columns.forEach((column) => {
			if (column.key && column.value) {
				// Use the column's value as the property name and the record's value as the property value
				exportRecord[column.value] =
					record[column.key] !== undefined ? record[column.key] : "";
			}
		});

		return exportRecord;
	});
};

export const makeCsv = async (rows, filename) => {
	// Default filename if not provided
	if (!filename) {
		filename = `export-${new Date().toISOString().split("T")[0]}.csv`;
	}

	// Add .csv extension if not present
	if (!filename.toLowerCase().endsWith(".csv")) {
		filename += ".csv";
	}

	// Check if rows is valid data
	if (!rows || !Array.isArray(rows) || rows.length < 1) {
		console.error("No data to export as CSV");
		return false;
	}

	try {
		const keys = Object.keys(rows[0]);

		// Check if keys are valid
		if (!keys || keys.length === 0) {
			console.error("No keys found in data for CSV export");
			return false;
		}

		// Use comma as standard CSV separator
		const separator = ",";

		// Create header row
		const headerRow = keys
			.map((key) => {
				// Format header for better readability
				return `"${key.replace(/"/g, '""')}"`;
			})
			.join(separator);

		// Create data rows
		const dataRows = rows
			.map((row) => {
				return keys
					.map((key) => {
						// Handle undefined or null values
						if (row[key] === null || row[key] === undefined) {
							return '""';
						}

						let cellValue = row[key];

						// Format dates
						if (cellValue instanceof Date) {
							cellValue = cellValue.toISOString().split("T")[0]; // YYYY-MM-DD format
						} else {
							// Convert to string if not already
							cellValue = String(cellValue);
						}

						// Escape quotes by doubling them and wrap in quotes
						return `"${cellValue.replace(/"/g, '""')}"`;
					})
					.join(separator);
			})
			.join("\n");

		// Combine header and data
		const csvContent = `${headerRow}\n${dataRows}`;

		// Create blob and download
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

		if (navigator.msSaveBlob) {
			// For IE
			navigator.msSaveBlob(blob, filename);
		} else {
			const link = document.createElement("a");
			if (link.download !== undefined) {
				// Modern browsers
				const url = URL.createObjectURL(blob);
				link.setAttribute("href", url);
				link.setAttribute("download", filename);
				link.style.visibility = "hidden";
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				URL.revokeObjectURL(url); // Clean up to avoid memory leaks
			} else {
				console.error("Browser doesn't support download attribute");
				return false;
			}
		}

		return true;
	} catch (error) {
		console.error("Error creating CSV:", error);
		return false;
	}
};
