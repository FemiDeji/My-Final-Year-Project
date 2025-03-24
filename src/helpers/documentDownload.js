import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export const generatePDF = (data, fileName, title, headers) => {
	const doc = new jsPDF({ orientation: "landscape" });

	// Title
	doc.text(`${title} from ${data.startDate} to ${data.endDate}`, 14, 10);

	// Convert headers to an array
	const tableHeaders = [headers.map((header) => header.value)];

	// Convert data into an array of arrays
	const tableData = data.map((item) =>
		headers.map((header) => item[header.key] || "")
	);

	// Generate table using autoTable
	autoTable(doc, {
		head: tableHeaders,
		body: tableData,
		startY: 20,
		styles: { fontSize: 10, cellPadding: 3 },
		headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
	});

	// Save the PDF file
	doc.save(fileName);
};

export const generateExcel = (data, fileName, headers, title) => {
	//Convert header to an array of keys
	const headerKeys = headers.map((header) => header.key);
	const headerValue = headers.map((header) => header.value);

	// Convert data into an array of arrays
	const excelData = data.map((item) =>
		headerKeys.map((key) => item[key] || "")
	);

	// Add headers as the first row
	excelData.unShift(headerValue);

	//Create a new worksheet
	const worksheet = XLSX.utils.aoa_to_sheet(excelData);

	//Create a new workbook and append the new worksheet
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, title);

	//Write the file and trigger download
	XLSX.writeFile(workbook, fileName);
};
